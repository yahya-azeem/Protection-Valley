import { writable, derived, get } from 'svelte/store';
import type { Product, GroupedProduct, CartItem, UserData, SortOption } from './types';

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

// ─── Cart ────────────────────────────────────────────────────
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
        const existing = cart.find(
          (c) => c.ebay_id === item.ebay_id
        );
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
        cart[index].quantity += delta;
        if (cart[index].quantity <= 0) {
          cart.splice(index, 1);
        }
        const updated = [...cart];
        save(updated);
        return updated;
      });
    },
    clear() {
      set([]);
      save([]);
    },
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

// ─── Selected Product & Variants ─────────────────────────────
export const selectedProduct = writable<GroupedProduct | null>(null);
export const selectedVariant = writable<Product | null>(null);
export const selectedSize = writable<string>('');
export const selectedColor = writable<string>('');
export const selectedTexture = writable<string>('');

// ─── Auth ────────────────────────────────────────────────────
function createUserStore() {
  const stored: UserData | null = typeof localStorage !== 'undefined'
    ? JSON.parse(localStorage.getItem('user') || 'null')
    : null;
  const { subscribe, set } = writable<UserData | null>(stored);

  return {
    subscribe,
    login(user: UserData) {
      set(user);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('userRole', user.role);
      }
      isWholesale.set(user.role === 'wholesale');
    },
    logout() {
      set(null);
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
      }
      isWholesale.set(false);
    },
  };
}

export const currentUser = createUserStore();
export const isWholesale = writable<boolean>(
  typeof localStorage !== 'undefined'
    ? localStorage.getItem('userRole') === 'wholesale'
    : false
);

// ─── API Load ────────────────────────────────────────────────
export async function loadProducts() {
  try {
    const res = await fetch('/api/v1/ebay/products');
    if (res.ok) {
      const data = await res.json();
      products.set(data);
    }
  } catch (e) {
    console.warn('Failed to load products from API, staying with fallback');
  }
}
