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
    environ['HTTP_X_FRAPPE_SITE_NAME'] = 'site1.local'
    return get_base_application()(environ, start_response)
