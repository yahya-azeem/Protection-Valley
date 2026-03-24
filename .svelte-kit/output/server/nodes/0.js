

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const universal = {
  "prerender": true,
  "ssr": false
};
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.T1rYzpfK.js","_app/immutable/chunks/fwhjoy1e.js","_app/immutable/chunks/CIvPZafU.js","_app/immutable/chunks/9DarDDCZ.js","_app/immutable/chunks/BUhENwcF.js","_app/immutable/chunks/BRP4nv6B.js","_app/immutable/chunks/C5UI2bJ6.js","_app/immutable/chunks/D-D7fj7C.js"];
export const stylesheets = ["_app/immutable/assets/0.CRFo6Adq.css"];
export const fonts = [];
