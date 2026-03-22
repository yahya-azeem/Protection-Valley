export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "Protection-Valley/_app",
	assets: new Set(["images/apron-1.jpg","images/gloves-1.jpg","images/hero-bg.jpg","images/kneepads-1.jpg","images/logo.png","images/pouch-1.jpg","images/pouch-2.jpg","images/pouch-3.jpg","images/rig-1.jpg","images/suspenders-1.jpg","images/toolbag-1.jpg","images/toolbelt-1.jpg","images/toolbelt-2.jpg","images/toolbelt-3.jpg","images/toolroll-1.jpg","images/wristband-1.jpg"]),
	mimeTypes: {".jpg":"image/jpeg",".png":"image/png"},
	_: {
		client: {start:"_app/immutable/entry/start.CIZ13HfC.js",app:"_app/immutable/entry/app.DBlISjW9.js",imports:["_app/immutable/entry/start.CIZ13HfC.js","_app/immutable/chunks/Dd8vim5A.js","_app/immutable/chunks/VPzpKRe-.js","_app/immutable/chunks/DTKzK2Ez.js","_app/immutable/entry/app.DBlISjW9.js","_app/immutable/chunks/VPzpKRe-.js","_app/immutable/chunks/BgWwApVi.js","_app/immutable/chunks/D7wQFuke.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
