use std::env;
use serde::{Deserialize, Serialize};
use reqwest::header::{HeaderMap, HeaderValue, AUTHORIZATION};
use crate::models::Address;
use anyhow::Result;

#[derive(Debug, Serialize, Deserialize)]
pub struct ShippingLabel {
    pub carrier: String,
    pub tracking_number: String,
    pub label_url: String,
    pub rate: f64,
}

#[derive(Debug, Serialize, Deserialize)]
struct EasyPostAddress {
    pub name: String,
    pub street1: String,
    pub street2: Option<String>,
    pub city: String,
    pub state: String,
    pub zip: String,
    pub country: String,
    pub phone: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
struct EasyPostParcel {
    pub weight: f64, // In ounces
}

#[derive(Debug, Serialize, Deserialize)]
struct EasyPostShipmentRequest {
    pub to_address: EasyPostAddress,
    pub from_address: EasyPostAddress,
    pub parcel: EasyPostParcel,
}

#[derive(Debug, Serialize, Deserialize)]
struct EasyPostRate {
    pub id: String,
    pub carrier: String,
    pub rate: String,
    pub service: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct EasyPostShipmentResponse {
    pub id: String,
    pub rates: Vec<EasyPostRate>,
    pub postage_label: Option<EasyPostPostageLabel>,
    pub tracking_code: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
struct EasyPostPostageLabel {
    pub label_url: String,
}

pub struct ShippingService {
    client: reqwest::Client,
    api_key: String,
}

impl ShippingService {
    pub fn new() -> Self {
        let api_key = env::var("EASYPOST_API_KEY").unwrap_or_default();
        Self {
            client: reqwest::Client::new(),
            api_key,
        }
    }

    fn headers(&self) -> HeaderMap {
        let mut headers = HeaderMap::new();
        let auth = format!("Bearer {}", self.api_key);
        if let Ok(val) = HeaderValue::from_str(&auth) {
            headers.insert(AUTHORIZATION, val);
        }
        headers
    }

    pub async fn create_cheapest_label(&self, to_address: Address, weight_oz: f64) -> Result<ShippingLabel> {
        if self.api_key.is_empty() {
            return Err(anyhow!("EASYPOST_API_KEY not configured"));
        }

        // 1. Define From Address (Your Warehouse)
        let from_address = EasyPostAddress {
            name: "Protection Valley Warehouse".to_string(),
            street1: "123 Safety Way".to_string(),
            street2: None,
            city: "Los Angeles".to_string(),
            state: "CA".to_string(),
            zip: "90001".to_string(),
            country: "US".to_string(),
            phone: Some("555-0199".to_string()),
        };

        let ep_to_address = EasyPostAddress {
            name: format!("{} {}", to_address.first_name, to_address.last_name),
            street1: to_address.address_line1,
            street2: to_address.address_line2,
            city: to_address.city,
            state: to_address.state,
            zip: to_address.zip,
            country: to_address.country,
            phone: to_address.phone,
        };

        // 2. Create Shipment to get Rates
        let shipment_req = serde_json::json!({
            "shipment": {
                "to_address": ep_to_address,
                "from_address": from_address,
                "parcel": { "weight": weight_oz }
            }
        });

        let response = self.client
            .post("https://api.easypost.com/v2/shipments")
            .headers(self.headers())
            .json(&shipment_req)
            .send()
            .await?;

        if !response.status().is_success() {
            let err = response.text().await?;
            return Err(anyhow!("EasyPost Shipment Error: {}", err));
        }

        let shipment: EasyPostShipmentResponse = response.json().await?;

        // 3. Find cheapest rate
        let cheapest_rate = shipment.rates.iter()
            .min_by(|a, b| {
                let a_price: f64 = a.rate.parse().unwrap_or(f64::MAX);
                let b_price: f64 = b.rate.parse().unwrap_or(f64::MAX);
                a_price.partial_cmp(&b_price).unwrap()
            })
            .ok_or_else(|| anyhow!("No shipping rates available for this destination"))?;

        let rate_id = cheapest_rate.id.clone();
        let carrier = cheapest_rate.carrier.clone();
        let rate_value: f64 = cheapest_rate.rate.parse().unwrap_or(0.0);

        // 4. Buy the label
        let buy_req = serde_json::json!({
            "rate": { "id": rate_id }
        });

        let buy_response = self.client
            .post(format!("https://api.easypost.com/v2/shipments/{}/buy", shipment.id))
            .headers(self.headers())
            .json(&buy_req)
            .send()
            .await?;

        if !buy_response.status().is_success() {
            let err = buy_response.text().await?;
            return Err(anyhow!("EasyPost Buy Error: {}", err));
        }

        let final_shipment: EasyPostShipmentResponse = buy_response.json().await?;
        
        let label_url = final_shipment.postage_label
            .ok_or_else(|| anyhow!("Failed to generate postage label"))?
            .label_url;
            
        let tracking_number = final_shipment.tracking_code
            .ok_or_else(|| anyhow!("No tracking code returned"))?;

        Ok(ShippingLabel {
            carrier,
            tracking_number,
            label_url,
            rate: rate_value,
        })
    }
}
