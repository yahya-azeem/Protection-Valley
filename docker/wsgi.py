import os

# Change working directory to sites directory so relative paths resolve correctly
os.chdir('/home/frappe/bench-dir/sites')

base_application = None

def get_base_application():
    global base_application
    if base_application is None:
        import frappe.app
        frappe.app._sites_path = '.'
        from frappe.app import application_with_statics
        base_application = application_with_statics()
    return base_application

def application(environ, start_response):
    environ['HTTP_X_FRAPPE_SITE_NAME'] = 'site1.local'
    return get_base_application()(environ, start_response)
