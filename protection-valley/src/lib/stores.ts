import { writable, derived, get } from 'svelte/store';
import { base } from '$app/paths';
import type { Product, GroupedProduct, CartItem, UserData } from './types';
import { API_CONFIG } from './config';

// ─── Guard for API spam / Violent reloads ───────────────────
let productsLoaded = false;

// ─── Products ────────────────────────────────────────────────
export const products = writable<GroupedProduct[]>([]);
export const currentCategory = writable<string>('All');

export const filteredProducts = derived(
  [products, currentCategory],
  ([$products, $category]) =>
    $products.filter((p) => {
      const categoryMatch = $category === 'All' || p.category === $category;
      return categoryMatch;
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
        const existing = cart.find(c => c.ebay_id === item.ebay_id);
        if (existing) {
          existing.quantity++;
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
export const selectedProduct = writable<GroupedProduct | null>(null);
export const selectedVariant = writable<Product | null>(null);
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
const MOCK_PRODUCTS: GroupedProduct[] = [
  {
    model_number: "PV-BELT-01",
    name: "Heritage Leather Tool Belt",
    category: "Tool Belts",
    description: "Our signature full-grain leather tool belt. Forged for durability. Built for legacy.",
    variants: [
      { id: "v1", ebay_id: "1234567890", name: "Heritage Belt - Black / Large", price: 289.00, quantity: 5, image_url: `${base}/images/toolbelt-1.jpg`, color: "Black", size: "Large", texture: "Smooth", model_number: "PV-BELT-01" },
      { id: "v2", ebay_id: "1234567891", name: "Heritage Belt - Brown / Medium", price: 289.00, quantity: 12, image_url: `${base}/images/toolbelt-2.jpg`, color: "Brown", size: "Medium", texture: "Grainy", model_number: "PV-BELT-01" }
    ]
  },
  {
    model_number: "PV-APRON-02",
    name: "Master Craftsman Apron",
    category: "Aprons",
    description: "Premium split-leg leather apron providing maximum coverage and mobility.",
    variants: [{ id: "v3", ebay_id: "1234567892", name: "Master Apron - Tobacco", price: 145.00, quantity: 8, image_url: `${base}/images/apron-1.jpg`, color: "Tobacco", size: "One Size", texture: "Rough-out", model_number: "PV-APRON-02" }]
  },
  {
    model_number: "PV-POUCH-03",
    name: "Quick-Clip Tool Pouch",
    category: "Pouches",
    description: "Versatile tool pouch with quick-release system for rapid deployment.",
    variants: [{ id: "v4", ebay_id: "1234567893", name: "Quick-Clip Pouch - Midnight", price: 65.00, quantity: 15, image_url: `${base}/images/pouch-1.jpg`, color: "Midnight", size: "Standard", texture: "Ballistic", model_number: "PV-POUCH-03" }]
  }
];

export async function loadProducts() {
  if (productsLoaded) return;
  productsLoaded = true;
  try {
    const res = await fetch(API_CONFIG.baseUrl + API_CONFIG.endpoints.products).catch(() => null);
    if (res && res.ok) {
      const data = await res.json();
      products.set(data);
    } else {
      products.set(MOCK_PRODUCTS);
    }
  } catch (e) {
    products.set(MOCK_PRODUCTS);
  }
}
