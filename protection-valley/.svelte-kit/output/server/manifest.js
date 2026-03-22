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
		client: {start:"_app/immutable/entry/start.IwaCgpku.js",app:"_app/immutable/entry/app.DBpJmjCZ.js",imports:["_app/immutable/entry/start.IwaCgpku.js","_app/immutable/chunks/RzmqFZ4W.js","_app/immutable/chunks/VPzpKRe-.js","_app/immutable/chunks/QS-usFVH.js","_app/immutable/entry/app.DBpJmjCZ.js","_app/immutable/chunks/VPzpKRe-.js","_app/immutable/chunks/BgWwApVi.js","_app/immutable/chunks/D7wQFuke.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js'))
		],
		remotes: {
			
		},
		routes: [
			
		],
		prerendered_routes: new Set(["/Protection-Valley/"]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
