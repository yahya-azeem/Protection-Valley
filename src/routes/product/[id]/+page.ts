export const prerender = false;

import { API_CONFIG } from '$lib/config';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
    const res = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.products}/${params.id}`);
    if (res.ok) {
        const product = await res.json();
        return {
            product
        };
    }
    
    return {
        product: null
    };
}
