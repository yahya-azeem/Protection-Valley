use vercel_runtime::{Response, Error};
use http::StatusCode;
use crate::services::voice_service::VoiceService;
use crate::models::{IdentifyCallerArgs, ProductLookupArgs, GetDealsArgs, CheckOrderStatusArgs, BookMeetingArgs};

async fn handle_identify_caller(service: &VoiceService, args: serde_json::Value) -> Result<String, String> {
    let parsed: IdentifyCallerArgs = serde_json::from_value(args)
        .map_err(|e| format!("Invalid identify_caller args: {}", e))?;
    service.identify_caller(parsed).await
}

async fn handle_product_lookup(service: &VoiceService, args: serde_json::Value) -> Result<String, String> {
    let parsed: ProductLookupArgs = serde_json::from_value(args)
        .map_err(|e| format!("Invalid product_lookup args: {}", e))?;
    service.product_lookup(parsed).await
}

async fn handle_get_deals(service: &VoiceService, args: serde_json::Value) -> Result<String, String> {
    let parsed: GetDealsArgs = serde_json::from_value(args)
        .map_err(|e| format!("Invalid get_deals args: {}", e))?;
    service.get_deals(parsed).await
}

async fn handle_check_order_status(service: &VoiceService, args: serde_json::Value) -> Result<String, String> {
    let parsed: CheckOrderStatusArgs = serde_json::from_value(args)
        .map_err(|e| format!("Invalid check_order_status args: {}", e))?;
    service.check_order_status(parsed).await
}

async fn handle_book_meeting(service: &VoiceService, args: serde_json::Value) -> Result<String, String> {
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
        let tool_call_id = call.get("toolCallId").or_else(|| call.get("id"))
            .and_then(|v| v.as_str()).unwrap_or("").to_string();
        let name = {
            let fn_val = call.get("function");
            fn_val.and_then(|v| v.as_str())  // OpenAI string
                .or_else(|| fn_val.and_then(|v| v.get("name")).and_then(|n| n.as_str()))  // OpenAI object {name, arguments}
                .or_else(|| call.get("toolName").and_then(|v| v.as_str()))  // Vapi format
                .or_else(|| call.get("name").and_then(|v| v.as_str()))  // legacy
                .unwrap_or("")
        };
        let args = {
            let fn_val = call.get("function");
            // Try function.arguments (OpenAI JSON string), then function (as object with args), then top-level fields
            fn_val.and_then(|v| v.get("arguments"))
                .or_else(|| call.get("arguments"))
                .or_else(|| call.get("parameters"))
                .or_else(|| call.get("args"))
                .map(|v| {
                    if let Some(s) = v.as_str() {
                        serde_json::from_str(s).unwrap_or(v.clone())
                    } else {
                        v.clone()
                    }
                })
                .unwrap_or(serde_json::Value::Null)
        };

        let result = match name {
            "identify_caller" => handle_identify_caller(&service, args).await,
            "product_lookup" => handle_product_lookup(&service, args).await,
            "get_deals" => handle_get_deals(&service, args).await,
            "check_order_status" => handle_check_order_status(&service, args).await,
            "book_meeting" => handle_book_meeting(&service, args).await,
            _ => Err(format!("Unknown tool: {}", name)),
        };

        let result_val = match result {
            Ok(val) => serde_json::json!(val),
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
