import os

base_application = None

def get_base_application():
    global base_application
    if base_application is None:
        import frappe.app
        frappe.app._sites_path = os.environ.get("SITES_PATH", "sites")
        from frappe.app import application_with_statics
        base_application = application_with_statics()
    return base_application

def application(environ, start_response):
    print(f"[WSGI DEBUG] SITES_PATH in os.environ: {os.environ.get('SITES_PATH')}", flush=True)
    print(f"[WSGI DEBUG] Current working directory: {os.getcwd()}", flush=True)
    environ['HTTP_X_FRAPPE_SITE_NAME'] = 'site1.local'
    return get_base_application()(environ, start_response)
