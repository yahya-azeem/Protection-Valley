import os

base_application = None

def get_base_application():
    global base_application
    if base_application is None:
        from frappe.app import application as frappe_app, application_with_statics
        base_application = application_with_statics()
    return base_application

def application(environ, start_response):
    print(f"[WSGI DEBUG] SITES_PATH in os.environ: {os.environ.get('SITES_PATH')}", flush=True)
    print(f"[WSGI DEBUG] Current working directory: {os.getcwd()}", flush=True)
    status_file = "/tmp/erpnext_status.txt"
    status = "initializing"
    if os.path.exists(status_file):
        try:
            with open(status_file, "r") as f:
                status = f.read().strip()
        except Exception:
            pass
    else:
        # If status file doesn't exist, assume ready to avoid locking user out
        status = "ready"

    if status == "initializing":
        # Return 503 Service Unavailable with a loading page
        status_line = "503 Service Unavailable"
        response_headers = [
            ("Content-Type", "text/html"),
            ("Retry-After", "5")
        ]
        start_response(status_line, response_headers)
        html = """
        <!DOCTYPE html>
        <html>
        <head>
            <meta http-equiv="refresh" content="5">
            <title>Protection Valley ERPNext Setup</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    background-color: #111;
                    color: #fff;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    text-align: center;
                }
                .container {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 40px;
                    border-radius: 12px;
                    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
                    backdrop-filter: blur(4px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    max-width: 500px;
                }
                h1 {
                    font-size: 24px;
                    margin-bottom: 16px;
                    color: #FF8800;
                }
                p {
                    font-size: 16px;
                    color: #ccc;
                    margin-bottom: 24px;
                }
                .spinner {
                    border: 4px solid rgba(255, 255, 255, 0.1);
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    border-left-color: #FF8800;
                    animation: spin 1s linear infinite;
                    margin: 0 auto;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="spinner"></div>
                <h1>System Initializing</h1>
                <p>Protection Valley ERPNext is initializing or running database migrations in the background. Please wait, this page will refresh automatically...</p>
            </div>
        </body>
        </html>
        """
        return [html.encode("utf-8")]

    elif status == "error":
        # Return 500 Internal Server Error
        status_line = "500 Internal Server Error"
        response_headers = [("Content-Type", "text/html")]
        start_response(status_line, response_headers)
        html = """
        <!DOCTYPE html>
        <html>
        <head>
            <title>Initialization Error</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    background-color: #111;
                    color: #fff;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    text-align: center;
                }
                .container {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 40px;
                    border-radius: 12px;
                    border: 1px solid rgba(255, 0, 0, 0.2);
                    max-width: 500px;
                }
                h1 {
                    font-size: 24px;
                    margin-bottom: 16px;
                    color: #FF3333;
                }
                p {
                    font-size: 16px;
                    color: #ccc;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Initialization Failed</h1>
                <p>An error occurred during ERPNext setup. Please check the logs for details.</p>
            </div>
        </body>
        </html>
        """
        return [html.encode("utf-8")]

    environ['HTTP_X_FRAPPE_SITE_NAME'] = 'site1.local'
    return get_base_application()(environ, start_response)
