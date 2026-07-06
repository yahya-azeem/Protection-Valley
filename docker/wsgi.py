from frappe.app import application as frappe_app, application_with_statics

# Wrap the application with static asset serving middleware (SharedDataMiddleware & StaticDataMiddleware)
base_application = application_with_statics()

def application(environ, start_response):
    environ['HTTP_X_FRAPPE_SITE_NAME'] = 'site1.local'
    return base_application(environ, start_response)
