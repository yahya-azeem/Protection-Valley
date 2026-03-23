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
		client: {start:"_app/immutable/entry/start.CChgjdFF.js",app:"_app/immutable/entry/app.BbH71fGL.js",imports:["_app/immutable/entry/start.CChgjdFF.js","_app/immutable/chunks/B2FsOWcg.js","_app/immutable/chunks/BXqGYRSe.js","_app/immutable/chunks/DsX-oX58.js","_app/immutable/entry/app.BbH71fGL.js","_app/immutable/chunks/BXqGYRSe.js","_app/immutable/chunks/BTRUUr8z.js","_app/immutable/chunks/BYEQ8kT0.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
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
