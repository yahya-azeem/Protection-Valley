export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["images/apron-1.jpg","images/gloves-1.jpg","images/hero-bg.jpg","images/kneepads-1.jpg","images/logo-v3.png","images/logo.png","images/pouch-1.jpg","images/pouch-2.jpg","images/pouch-3.jpg","images/rig-1.jpg","images/suspenders-1.jpg","images/toolbag-1.jpg","images/toolbelt-1.jpg","images/toolbelt-2.jpg","images/toolbelt-3.jpg","images/toolroll-1.jpg","images/wristband-1.jpg"]),
	mimeTypes: {".jpg":"image/jpeg",".png":"image/png"},
	_: {
		client: {start:"_app/immutable/entry/start.BTVkbjpA.js",app:"_app/immutable/entry/app.B52i4rRp.js",imports:["_app/immutable/entry/start.BTVkbjpA.js","_app/immutable/chunks/BUhENwcF.js","_app/immutable/chunks/CIvPZafU.js","_app/immutable/chunks/BRP4nv6B.js","_app/immutable/entry/app.B52i4rRp.js","_app/immutable/chunks/CIvPZafU.js","_app/immutable/chunks/fwhjoy1e.js","_app/immutable/chunks/9DarDDCZ.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js'))
		],
		remotes: {
			
		},
		routes: [
			
		],
		prerendered_routes: new Set(["/"]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
