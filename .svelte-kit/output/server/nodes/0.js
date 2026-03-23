

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const universal = {
  "prerender": true,
  "ssr": false
};
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.D6S1KdEA.js","_app/immutable/chunks/BTRUUr8z.js","_app/immutable/chunks/BXqGYRSe.js","_app/immutable/chunks/BYEQ8kT0.js","_app/immutable/chunks/B2FsOWcg.js","_app/immutable/chunks/DsX-oX58.js","_app/immutable/chunks/CMKml599.js","_app/immutable/chunks/DsaU69u6.js"];
export const stylesheets = ["_app/immutable/assets/0.N4AmaHF6.css"];
export const fonts = [];
