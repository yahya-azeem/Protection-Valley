import { writable, derived, get } from 'svelte/store';
import { base } from '$app/paths';
import type { Product, ProductVariant, CartItem, UserData } from './types';
import { API_CONFIG } from './config';
import { WHOLESALE_DISCOUNT } from './constants';

// ─── Guard for API spam ─────────────────────────────────────
let productsLoaded = false;

// ─── Products ────────────────────────────────────────────────
export const products = writable<Product[]>([]);
export const currentCategory = writable<string>('All');
export const priceRange = writable<{ min: number; max: number }>({ min: 0, max: Infinity });
export const sizeFilter = writable<string>('');

export const filteredProducts = derived(
  [products, currentCategory, priceRange, sizeFilter],
  ([$products, $category, $priceRange, $sizeFilter]) =>
    $products.filter((p) => {
      const categoryMatch = $category === 'All' || p.category === $category;
      // Use the lowest variant price for filtering
      const minPrice = Math.min(...(p.variants?.map(v => v.price) || [0]));
      const priceMatch = minPrice >= $priceRange.min && minPrice < $priceRange.max;
      const sizeMatch = !$sizeFilter || p.variants?.some(v => v.size === $sizeFilter);
      return categoryMatch && priceMatch && sizeMatch;
    })
);

// ─── Cart Store Logic ────────────────────────────────────────
function createCartStore() {
  const stored: CartItem[] = typeof localStorage !== 'undefined'
    ? JSON.parse(localStorage.getItem('cart') || '[]')
    : [];
  const { subscribe, set, update } = writable<CartItem[]>(stored);

  function save(items: CartItem[]) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }

  return {
    subscribe,
    add(item: CartItem) {
      update((cart) => {
        const existing = cart.find(c => c.id === item.id);
        if (existing) {
          existing.quantity += item.quantity;
          save([...cart]);
          return [...cart];
        }
        const updated = [...cart, item];
        save(updated);
        return updated;
      });
    },
    remove(index: number) {
      update((cart) => {
        cart.splice(index, 1);
        const updated = [...cart];
        save(updated);
        return updated;
      });
    },
    updateQuantity(index: number, delta: number) {
      update((cart) => {
        if (!cart[index]) return cart;
        cart[index].quantity += delta;
        if (cart[index].quantity <= 0) cart.splice(index, 1);
        const updated = [...cart];
        save(updated);
        return updated;
      });
    },
    clear() { set([]); save([]); },
  };
}

export const cart = createCartStore();
export const cartTotal = derived(cart, ($cart) =>
  $cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
);
export const cartCount = derived(cart, ($cart) =>
  $cart.reduce((sum, item) => sum + item.quantity, 0)
);

// ─── UI State ────────────────────────────────────────────────
export const currentPage = writable<string>('home');
export const previousPage = writable<string>('home');
export const cartOpen = writable<boolean>(false);
export const searchOpen = writable<boolean>(false);
export const toastMessage = writable<string>('');
export const toastVisible = writable<boolean>(false);

export function showPage(page: string) {
  currentPage.update((prev) => {
    if (page !== 'product-detail') previousPage.set(prev);
    return page;
  });
}

export function goBack() {
  currentPage.set(get(previousPage));
}

let toastTimeout: ReturnType<typeof setTimeout>;
export function showToast(message: string) {
  toastMessage.set(message);
  toastVisible.set(true);
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toastVisible.set(false), 3000);
}

// ─── Selected State ──────────────────────────────────────────
export const selectedProduct = writable<Product | null>(null);
export const selectedVariant = writable<ProductVariant | null>(null);
export const selectedSize = writable<string>('');
export const selectedColor = writable<string>('');
export const selectedTexture = writable<string>('');

// ─── Authentication ──────────────────────────────────────────
function createUserStore() {
  const stored: UserData | null = typeof localStorage !== 'undefined'
    ? JSON.parse(localStorage.getItem('user') || 'null')
    : null;
  const { subscribe, set } = writable<UserData | null>(stored);
  return {
    subscribe,
    logout() {
      set(null);
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
        localStorage.removeItem('authToken');
      }
      isWholesale.set(false);
      showToast('Session Terminated');
    },
  };
}

export const currentUser = createUserStore();
export const isWholesale = writable<boolean>(
  typeof localStorage !== 'undefined'
    ? localStorage.getItem('userRole') === 'wholesale'
    : false
);

// ─── API Initialization ──────────────────────────────────────
export async function loadProducts() {
  if (productsLoaded) return;
  productsLoaded = true;
  try {
    const res = await fetch(API_CONFIG.baseUrl + API_CONFIG.endpoints.products).catch(() => null);
    if (res && res.ok) {
      const data = await res.json();
      products.set(data);
    } else {
      console.error('Failed to load products from API');
      products.set([]);
    }
  } catch (err) {
    console.error('Error loading products:', err);
    products.set([]);
  }
}
