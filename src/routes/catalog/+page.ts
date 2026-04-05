export const prerender = false;

import { API_CONFIG } from '$lib/config';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
    const res = await fetch(API_CONFIG.baseUrl + API_CONFIG.endpoints.products);
    if (res.ok) {
        const prodData = await res.json();
        return {
            products: prodData
        };
    }
    
    return {
        products: []
    };
}
