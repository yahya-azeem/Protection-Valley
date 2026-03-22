

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const universal = {
  "prerender": true,
  "ssr": false
};
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.C4Rkilv0.js","_app/immutable/chunks/BgWwApVi.js","_app/immutable/chunks/VPzpKRe-.js","_app/immutable/chunks/D7wQFuke.js","_app/immutable/chunks/ByusSept.js","_app/immutable/chunks/wf1HbDDX.js","_app/immutable/chunks/DTKzK2Ez.js"];
export const stylesheets = ["_app/immutable/assets/0.Dl_yhhO7.css"];
export const fonts = [];
