use vercel_runtime::{Response, Error};
use http::StatusCode;
use crate::services::voice_service::VoiceService;
use crate::models::{IdentifyCallerArgs, ProductLookupArgs, GetDealsArgs, CheckOrderStatusArgs, BookMeetingArgs};

async fn handle_identify_caller(service: &VoiceService, args: serde_json::Value) -> Result<serde_json::Value, String> {
    let parsed: IdentifyCallerArgs = serde_json::from_value(args)
        .map_err(|e| format!("Invalid identify_caller args: {}", e))?;
    service.identify_caller(parsed).await
}

async fn handle_product_lookup(service: &VoiceService, args: serde_json::Value) -> Result<serde_json::Value, String> {
    let parsed: ProductLookupArgs = serde_json::from_value(args)
        .map_err(|e| format!("Invalid product_lookup args: {}", e))?;
    service.product_lookup(parsed).await
}

async fn handle_get_deals(service: &VoiceService, args: serde_json::Value) -> Result<serde_json::Value, String> {
    let parsed: GetDealsArgs = serde_json::from_value(args)
        .map_err(|e| format!("Invalid get_deals args: {}", e))?;
    service.get_deals(parsed).await
}

async fn handle_check_order_status(service: &VoiceService, args: serde_json::Value) -> Result<serde_json::Value, String> {
    let parsed: CheckOrderStatusArgs = serde_json::from_value(args)
        .map_err(|e| format!("Invalid check_order_status args: {}", e))?;
    service.check_order_status(parsed).await
}

async fn handle_book_meeting(service: &VoiceService, args: serde_json::Value) -> Result<serde_json::Value, String> {
    let parsed: BookMeetingArgs = serde_json::from_value(args)
        .map_err(|e| format!("Invalid book_meeting args: {}", e))?;
    service.book_meeting(parsed).await
}

pub async fn handle_voice_request(body: serde_json::Value) -> Result<Response<String>, Error> {
    let service = VoiceService::new();

    let message = match body.get("message") {
        Some(m) => m,
        None => return Ok(Response::builder()
            .status(StatusCode::BAD_REQUEST)
            .header("Content-Type", "application/json")
            .body(serde_json::json!({"error": "Missing message field"}).to_string())?),
    };

    let msg_type = message.get("type").and_then(|v| v.as_str()).unwrap_or("");
    if msg_type != "tool-calls" {
        return Ok(Response::builder()
            .status(StatusCode::OK)
            .header("Content-Type", "application/json")
            .body(serde_json::json!({"ok": true}).to_string())?);
    }

    let tool_calls = message.get("toolCallList").and_then(|v| v.as_array()).cloned().unwrap_or_default();
    let mut results = Vec::new();

    for call in tool_calls {
        let tool_call_id = call.get("id").and_then(|v| v.as_str()).unwrap_or("").to_string();
        let name = call.get("name").and_then(|v| v.as_str()).unwrap_or("");
        let args = call.get("arguments").unwrap_or(&serde_json::Value::Null).clone();

        let result = match name {
            "identify_caller" => handle_identify_caller(&service, args).await,
            "product_lookup" => handle_product_lookup(&service, args).await,
            "get_deals" => handle_get_deals(&service, args).await,
            "check_order_status" => handle_check_order_status(&service, args).await,
            "book_meeting" => handle_book_meeting(&service, args).await,
            _ => Err(format!("Unknown tool: {}", name)),
        };

        let result_val = match result {
            Ok(val) => val,
            Err(e) => serde_json::json!({"error": e}),
        };

        results.push(serde_json::json!({
            "toolCallId": tool_call_id,
            "result": result_val,
        }));
    }

    Ok(Response::builder()
        .status(StatusCode::OK)
        .header("Content-Type", "application/json")
        .body(serde_json::to_string(&serde_json::json!({"results": results}))?)?)
}
