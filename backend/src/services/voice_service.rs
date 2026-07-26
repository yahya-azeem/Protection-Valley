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

    pub async fn identify_caller(&self, args: IdentifyCallerArgs) -> Result<Value, String> {
        let url = format!(
            "{}/rest/v1/phone_identities?select=*,wholesale_users!inner(*)&phone=eq.{}&limit=1",
            self.supabase_url, args.phone
        );
        let resp = self.client.get(&url).headers(self.service_headers()).send().await
            .map_err(|e| format!("Request failed: {}", e))?;

        let identities: Vec<PhoneIdentityWithUser> = match resp.json().await {
            Ok(v) => v,
            Err(_) => return Ok(json!({"ok": true, "identified": false, "message": "No account found for this number."})),
        };

        if identities.is_empty() {
            return Ok(json!({"ok": true, "identified": false, "message": "No account found for this number."}));
        }

        let user = &identities[0].wholesale_users;
        let mut custom_prices: Vec<Value> = Vec::new();

        if user.role == UserRole::Wholesale || user.role == UserRole::Admin {
            let cp_url = format!(
                "{}/rest/v1/customer_specific_prices?select=variant_id,custom_price&user_id=eq.{}&limit=50",
                self.supabase_url, user.id
            );
            if let Ok(resp) = self.client.get(&cp_url).headers(self.service_headers()).send().await {
                if let Ok(prices) = resp.json::<Vec<Value>>().await {
                    custom_prices = prices;
                }
            }
        }

        Ok(json!({
            "ok": true, "identified": true,
            "user": {
                "id": user.id, "name": user.name, "email": user.email,
                "role": user.role, "company": user.company,
                "is_wholesale_approved": user.is_wholesale_approved,
                "wholesale_discount": user.wholesale_discount,
                "custom_prices": custom_prices,
            }
        }))
    }

    pub async fn product_lookup(&self, args: ProductLookupArgs) -> Result<Value, String> {
        let words: Vec<&str> = args.query.split_whitespace().filter(|w| !w.is_empty()).collect();
        let fields = ["name", "description", "category"];
        let filter = if words.is_empty() {
            return Ok(json!({"ok": true, "caller_identified": false, "caller_name": null, "caller_role": null, "discount_applied": null, "products": [], "message": "Please provide a search term."}));
        } else if words.len() == 1 {
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
        let mut caller_name: Option<String> = None;
        let mut caller_role: Option<String> = None;

        if let Some(ref phone) = args.caller_phone {
            let identity_url = format!(
                "{}/rest/v1/phone_identities?select=*,wholesale_users!inner(*)&phone=eq.{}&limit=1",
                self.supabase_url, phone
            );
            if let Ok(resp) = self.client.get(&identity_url).headers(self.service_headers()).send().await {
                if let Ok(identities) = resp.json::<Vec<PhoneIdentityWithUser>>().await {
                    if let Some(identity) = identities.first() {
                        let user = &identity.wholesale_users;
                        caller_name = Some(user.name.clone());
                        caller_role = Some(format!("{:?}", user.role));
                        if user.role == UserRole::Wholesale || user.role == UserRole::Admin {
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

        for product in &mut products {
            let pid = product.get("id").and_then(|v| v.as_i64()).unwrap_or(0);
            let vars_url = format!(
                "{}/rest/v1/product_variants?select=id,sku,price,stock,size,color,original_name,pack_quantity&product_id=eq.{}&limit=20",
                self.supabase_url, pid
            );
            if let Ok(resp) = self.client.get(&vars_url).headers(self.anon_headers()).send().await {
                if let Ok(variants) = resp.json::<Vec<Value>>().await {
                    let mapped: Vec<Value> = variants.into_iter().map(|v| {
                        let vid = v.get("id").and_then(|x| x.as_i64()).unwrap_or(0);
                        let price = v.get("price").and_then(|x| x.as_f64()).unwrap_or(0.0);
                        let wholesale = cp_map.get(&vid).copied().unwrap_or(price * (1.0 - discount));
                        json!({
                            "sku": v.get("sku"),
                            "size": v.get("size"),
                            "color": v.get("color"),
                            "pack_quantity": v.get("pack_quantity"),
                            "original_name": v.get("original_name"),
                            "stock": v.get("stock"),
                            "retail_price": format!("{:.2}", price),
                            "wholesale_price": format!("{:.2}", wholesale),
                        })
                    }).collect();
                    if let Some(obj) = product.as_object_mut() {
                        obj.insert("variants".to_string(), json!(mapped));
                    }
                }
            }
        }

        Ok(json!({
            "ok": true,
            "caller_identified": caller_name.is_some(),
            "caller_name": caller_name,
            "caller_role": caller_role,
            "discount_applied": if discount > 0.0 { Some(format!("{}%", (discount * 100.0) as i32)) } else { None },
            "products": products,
        }))
    }

    pub async fn get_deals(&self, args: GetDealsArgs) -> Result<Value, String> {
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

        Ok(json!({
            "ok": true,
            "deals": deals,
            "caller_role": role,
        }))
    }

    pub async fn check_order_status(&self, args: CheckOrderStatusArgs) -> Result<Value, String> {
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
            None => return Ok(json!({"ok": true, "orders": [], "message": "No orders found for this caller."})),
        };

        let orders_url = format!(
            "{}/rest/v1/orders?select=id,total,status,items,created_at,carrier,tracking_number&customer_email=eq.{}&order=created_at.desc&limit=5",
            self.supabase_url, email
        );
        let resp = self.client.get(&orders_url).headers(self.service_headers()).send().await
            .map_err(|e| format!("Orders request failed: {}", e))?;
        let orders: Vec<Value> = resp.json().await.map_err(|e| format!("Parse error: {}", e))?;

        Ok(json!({"ok": true, "orders": orders}))
    }

    pub async fn book_meeting(&self, args: BookMeetingArgs) -> Result<Value, String> {
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

        Ok(json!({
            "ok": true,
            "appointment_id": appointment_id,
            "summary": format!("Confirmed {} for {} at {}.", args.caller_name, args.date, args.time),
        }))
    }
}
