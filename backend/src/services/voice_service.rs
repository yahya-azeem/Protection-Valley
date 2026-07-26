use crate::models::{
    CreateAppointmentRequest, CreateVoiceSessionRequest,
    IdentifyCallerArgs, PhoneIdentityWithUser, ProductLookupArgs, GetDealsArgs,
    CheckOrderStatusArgs, BookMeetingArgs, UserRole,
};
use std::env;
use reqwest::header::{HeaderMap, HeaderValue, AUTHORIZATION};
use serde_json::{json, Value};

pub struct VoiceService {
    client: reqwest::Client,
    supabase_url: String,
    service_key: String,
    anon_key: String,
}

impl Default for VoiceService {
    fn default() -> Self {
        Self::new()
    }
}

impl VoiceService {
    pub fn new() -> Self {
        let supabase_url = env::var("SUPABASE_URL").unwrap_or_else(|_| "https://fnirqccmtjzibjhgzyay.supabase.co".to_string());
        let service_key = env::var("SUPABASE_SERVICE_ROLE_KEY").unwrap_or_default();
        let anon_key = env::var("SUPABASE_ANON_KEY").unwrap_or_default();
        Self {
            client: reqwest::Client::new(),
            supabase_url,
            service_key,
            anon_key,
        }
    }

    fn headers(&self, key: &str) -> HeaderMap {
        let mut headers = HeaderMap::new();
        if let Ok(val) = HeaderValue::from_str(key) {
            headers.insert("apikey", val);
            if let Ok(auth) = HeaderValue::from_str(&format!("Bearer {}", key)) {
                headers.insert(AUTHORIZATION, auth);
            }
        }
        headers
    }

    fn service_headers(&self) -> HeaderMap {
        self.headers(&self.service_key)
    }

    fn anon_headers(&self) -> HeaderMap {
        self.headers(&self.anon_key)
    }

    pub async fn identify_caller(&self, args: IdentifyCallerArgs) -> Result<String, String> {
        let url = format!(
            "{}/rest/v1/phone_identities?select=*,wholesale_users!inner(*)&phone=eq.{}&limit=1",
            self.supabase_url, args.phone
        );
        let resp = self.client.get(&url).headers(self.service_headers()).send().await
            .map_err(|e| format!("Request failed: {}", e))?;

        let identities: Vec<PhoneIdentityWithUser> = match resp.json().await {
            Ok(v) => v,
            Err(_) => return Ok("No account found for that number.".to_string()),
        };

        if identities.is_empty() {
            return Ok("No account found for that number.".to_string());
        }

        let user = &identities[0].wholesale_users;

        if user.role == UserRole::Wholesale || user.role == UserRole::Admin {
            let discount_pct = user.wholesale_discount.unwrap_or(0.0) * 100.0;
            return Ok(format!(
                "I found your account. You are {}, role: {:?}, company: {}. Your wholesale discount is {}%. Ask me about products and I will show wholesale pricing.",
                user.name, user.role, user.company.as_deref().unwrap_or("N/A"), discount_pct as i32
            ));
        }

        Ok(format!(
            "I found your account. You are {}, role: {:?}. You are a retail customer. Let me know what you are looking for.",
            user.name, user.role,
        ))
    }

    pub async fn product_lookup(&self, args: ProductLookupArgs) -> Result<String, String> {
        let query = args.query.trim();
        if query.is_empty() {
            return Ok("Please provide a search term.".to_string());
        }

        let words: Vec<&str> = query.split_whitespace().filter(|w| !w.is_empty()).collect();
        let fields = ["name", "description", "category"];
        let filter = if words.len() == 1 {
            let encoded = urlencoding::encode(words[0]);
            let ors: Vec<String> = fields.iter().map(|f| format!("{}.ilike.*{}*", f, encoded)).collect();
            format!("or=({})", ors.join(","))
        } else {
            let word_ors: Vec<String> = words.iter().map(|w| {
                let encoded = urlencoding::encode(w);
                let ors: Vec<String> = fields.iter().map(|f| format!("{}.ilike.*{}*", f, encoded)).collect();
                format!("or({})", ors.join(","))
            }).collect();
            format!("and=({})", word_ors.join(","))
        };
        let url = format!(
            "{}/rest/v1/products?select=id,name,description,category,model_number&{}&limit=5",
            self.supabase_url, filter
        );

        let resp = self.client.get(&url).headers(self.anon_headers()).send().await
            .map_err(|e| format!("Products request failed: {}", e))?;
        let mut products: Vec<Value> = resp.json().await.map_err(|e| format!("Parse error: {}", e))?;

        let mut discount = 0.0f64;
        let mut cp_map: std::collections::HashMap<i64, f64> = std::collections::HashMap::new();
        let mut is_wholesale = false;

        if let Some(ref phone) = args.caller_phone {
            let identity_url = format!(
                "{}/rest/v1/phone_identities?select=*,wholesale_users!inner(*)&phone=eq.{}&limit=1",
                self.supabase_url, phone
            );
            if let Ok(resp) = self.client.get(&identity_url).headers(self.service_headers()).send().await {
                if let Ok(identities) = resp.json::<Vec<PhoneIdentityWithUser>>().await {
                    if let Some(identity) = identities.first() {
                        let user = &identity.wholesale_users;
                        if user.role == UserRole::Wholesale || user.role == UserRole::Admin {
                            is_wholesale = true;
                            discount = user.wholesale_discount.unwrap_or(0.3);
                            let cp_url = format!(
                                "{}/rest/v1/customer_specific_prices?select=variant_id,custom_price&user_id=eq.{}&limit=50",
                                self.supabase_url, user.id
                            );
                            if let Ok(resp) = self.client.get(&cp_url).headers(self.service_headers()).send().await {
                                if let Ok(prices) = resp.json::<Vec<Value>>().await {
                                    for p in prices {
                                        if let (Some(vid), Some(cp)) = (
                                            p.get("variant_id").and_then(|v| v.as_i64()),
                                            p.get("custom_price").and_then(|v| v.as_f64())
                                        ) {
                                            cp_map.insert(vid, cp);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        if products.is_empty() {
            return Ok(format!("I could not find any products matching '{}'. Try a different search term or let me know what you need.", query));
        }

        let mut lines: Vec<String> = Vec::new();
        lines.push(format!("I found {} product(s) matching '{}':", products.len(), query));

        for product in &products {
            let name = product.get("name").and_then(|v| v.as_str()).unwrap_or("Unknown");
            let category = product.get("category").and_then(|v| v.as_str()).unwrap_or("");
            let pid = product.get("id").and_then(|v| v.as_i64()).unwrap_or(0);

            let vars_url = format!(
                "{}/rest/v1/product_variants?select=id,sku,price,stock,size,color,original_name,pack_quantity&product_id=eq.{}&limit=10",
                self.supabase_url, pid
            );
            let mut variants_str = String::new();
            if let Ok(resp) = self.client.get(&vars_url).headers(self.anon_headers()).send().await {
                if let Ok(variants) = resp.json::<Vec<Value>>().await {
                    for v in &variants {
                        let vid = v.get("id").and_then(|x| x.as_i64()).unwrap_or(0);
                        let price = v.get("price").and_then(|x| x.as_f64()).unwrap_or(0.0);
                        let retail_str = format!("${:.2}", price);
                        let price_str = if is_wholesale {
                            let wp = cp_map.get(&vid).copied().unwrap_or(price * (1.0 - discount));
                            format!("{} retail / ${:.2} wholesale", retail_str, wp)
                        } else {
                            retail_str
                        };
                        let size = v.get("size").and_then(|x| x.as_str()).unwrap_or("");
                        let color = v.get("color").and_then(|x| x.as_str()).unwrap_or("");
                        let pack = v.get("pack_quantity").and_then(|x| x.as_str()).unwrap_or("");
                        let stock = v.get("stock").and_then(|x| x.as_i64()).unwrap_or(0);
                        let info = format!("{}", price_str);
                        let extras = vec![
                            if !size.is_empty() { Some(format!("size: {}", size)) } else { None },
                            if !color.is_empty() { Some(format!("color: {}", color)) } else { None },
                            if !pack.is_empty() { Some(format!("pack: {}", pack)) } else { None },
                            if stock > 0 { Some(format!("stock: {}", stock)) } else { Some("out of stock".to_string()) },
                        ];
                        let extras: Vec<&str> = extras.iter().filter_map(|x| x.as_deref()).collect();
                        variants_str.push_str(&format!("      - {} ({})", info, extras.join(", ")));
                        variants_str.push('\n');
                    }
                }
            }

            lines.push(format!("  {} (category: {})", name, category));
            if !variants_str.is_empty() {
                lines.push(variants_str.trim_end().to_string());
            }
        }

        Ok(lines.join("\n"))
    }

    pub async fn get_deals(&self, args: GetDealsArgs) -> Result<String, String> {
        let url = format!(
            "{}/rest/v1/deals?select=title,description,discount_percent,flat_discount,min_purchase,applies_to,category_slug&active=eq.true&and=(starts_at.lte.now(),or(ends_at.is.null,ends_at.gte.now()))&limit=20",
            self.supabase_url
        );
        let resp = self.client.get(&url).headers(self.anon_headers()).send().await
            .map_err(|e| format!("Deals request failed: {}", e))?;
        let mut deals: Vec<Value> = resp.json().await.map_err(|e| format!("Parse error: {}", e))?;

        let mut role = "retail".to_string();
        if let Some(ref phone) = args.caller_phone {
            let identity_url = format!(
                "{}/rest/v1/phone_identities?select=*,wholesale_users!inner(role)&phone=eq.{}&limit=1",
                self.supabase_url, phone
            );
            if let Ok(resp) = self.client.get(&identity_url).headers(self.service_headers()).send().await {
                if let Ok(identities) = resp.json::<Vec<Value>>().await {
                    if let Some(identity) = identities.first() {
                        if let Some(user) = identity.get("wholesale_users") {
                            if let Some(r) = user.get("role").and_then(|v| v.as_str()) {
                                role = r.to_string();
                            }
                        }
                    }
                }
            }
        }

        deals.retain(|d| {
            let applies = d.get("applies_to").and_then(|v| v.as_str()).unwrap_or("retail");
            applies == "all" || applies == role
        });

        if deals.is_empty() {
            return Ok("There are no active deals right now.".to_string());
        }

        let mut lines: Vec<String> = Vec::new();
        lines.push("Here are the current deals:".to_string());
        for d in &deals {
            let title = d.get("title").and_then(|v| v.as_str()).unwrap_or("Deal");
            let desc = d.get("description").and_then(|v| v.as_str()).unwrap_or("");
            let pct = d.get("discount_percent").and_then(|v| v.as_f64()).unwrap_or(0.0);
            let flat = d.get("flat_discount").and_then(|v| v.as_f64()).unwrap_or(0.0);
            let min = d.get("min_purchase").and_then(|v| v.as_f64()).unwrap_or(0.0);
            let mut deal_str = format!("  {}: {}", title, desc);
            if pct > 0.0 {
                deal_str.push_str(&format!(" ({}% off)", pct as i32));
            }
            if flat > 0.0 {
                deal_str.push_str(&format!(" (${:.2} off)", flat));
            }
            if min > 0.0 {
                deal_str.push_str(&format!(", minimum purchase ${:.2}", min));
            }
            lines.push(deal_str);
        }

        Ok(lines.join("\n"))
    }

    pub async fn check_order_status(&self, args: CheckOrderStatusArgs) -> Result<String, String> {
        let mut resolved_email = args.email.clone();

        if resolved_email.is_none() {
            if let Some(ref phone) = args.caller_phone {
                let identity_url = format!(
                    "{}/rest/v1/phone_identities?select=*,wholesale_users!inner(email)&phone=eq.{}&limit=1",
                    self.supabase_url, phone
                );
                if let Ok(resp) = self.client.get(&identity_url).headers(self.service_headers()).send().await {
                    if let Ok(identities) = resp.json::<Vec<Value>>().await {
                        if let Some(identity) = identities.first() {
                            if let Some(user) = identity.get("wholesale_users") {
                                resolved_email = user.get("email").and_then(|v| v.as_str()).map(|s| s.to_string());
                            }
                        }
                    }
                }
            }
        }

        let email = match resolved_email {
            Some(e) => e,
            None => return Ok("No orders found for this caller.".to_string()),
        };

        let orders_url = format!(
            "{}/rest/v1/orders?select=id,total,status,items,created_at,carrier,tracking_number&customer_email=eq.{}&order=created_at.desc&limit=5",
            self.supabase_url, email
        );
        let resp = self.client.get(&orders_url).headers(self.service_headers()).send().await
            .map_err(|e| format!("Orders request failed: {}", e))?;
        let orders: Vec<Value> = resp.json().await.map_err(|e| format!("Parse error: {}", e))?;

        if orders.is_empty() {
            return Ok("No orders found for this caller.".to_string());
        }

        let mut lines: Vec<String> = Vec::new();
        lines.push(format!("I found {} order(s):", orders.len()));
        for o in &orders {
            let id = o.get("id").and_then(|v| v.as_i64()).unwrap_or(0);
            let total = o.get("total").and_then(|v| v.as_f64()).unwrap_or(0.0);
            let status = o.get("status").and_then(|v| v.as_str()).unwrap_or("unknown");
            let created = o.get("created_at").and_then(|v| v.as_str()).unwrap_or("");
            let carrier = o.get("carrier").and_then(|v| v.as_str()).unwrap_or("");
            let tracking = o.get("tracking_number").and_then(|v| v.as_str()).unwrap_or("");
            let items = o.get("items").and_then(|v| v.as_str()).unwrap_or("");
            let item_summary = if items.len() > 60 {
                format!("{}...", &items[..60])
            } else {
                items.to_string()
            };
            let mut order = format!("  Order #{}: ${:.2}, status: {}, date: {}", id, total, status, created);
            if !item_summary.is_empty() {
                order.push_str(&format!(", items: {}", item_summary));
            }
            if !tracking.is_empty() {
                order.push_str(&format!(", tracking: {} ({})", tracking, carrier));
            }
            lines.push(order);
        }

        Ok(lines.join("\n"))
    }

    pub async fn book_meeting(&self, args: BookMeetingArgs) -> Result<String, String> {
        let appt = CreateAppointmentRequest {
            caller_name: args.caller_name.clone(),
            caller_phone: args.caller_phone.clone(),
            caller_email: args.caller_email.clone(),
            reason: args.reason.clone(),
            preferred_date: args.date.clone(),
            preferred_time: args.time.clone(),
            duration_min: args.duration_min.unwrap_or(30),
            status: "confirmed".to_string(),
        };

        let appt_url = format!("{}/rest/v1/appointments", self.supabase_url);
        let resp = self.client.post(&appt_url)
            .headers(self.service_headers())
            .header("Prefer", "return=representation")
            .json(&appt)
            .send().await
            .map_err(|e| format!("Appointment creation failed: {}", e))?;

        let records: Vec<Value> = resp.json().await.map_err(|e| format!("Parse error: {}", e))?;
        let appointment_id = records.first().and_then(|r| {
            r.get("id").and_then(|v| {
                v.as_str().map(|s| s.to_string())
                    .or_else(|| v.as_i64().map(|n| n.to_string()))
                    .or_else(|| v.as_u64().map(|n| n.to_string()))
            })
        });

        if let Some(ref phone) = args.caller_phone {
            let session = CreateVoiceSessionRequest {
                caller_phone: phone.clone(),
                caller_name: Some(args.caller_name.clone()),
                session_data: json!({"last_action": "booked_appointment", "appointment_id": appointment_id}),
            };
            let session_url = format!("{}/rest/v1/voice_sessions", self.supabase_url);
            let _ = self.client.post(&session_url)
                .headers(self.service_headers())
                .header("Prefer", "return=representation")
                .json(&session)
                .send().await;
        }

        Ok(format!(
            "Your appointment is confirmed for {} at {} (duration: {} minutes). Appointment ID: {}.",
            args.date, args.time, args.duration_min.unwrap_or(30), appointment_id.as_deref().unwrap_or("N/A")
        ))
    }
}
