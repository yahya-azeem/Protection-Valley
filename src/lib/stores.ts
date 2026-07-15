import { writable, derived, get } from 'svelte/store';
import type { Product, ProductVariant, CartItem, UserData } from './types';
import { API_CONFIG } from './config';

// Guard for duplicate product fetches.
let productsLoaded = false;

// Products and filters.
export const products = writable<Product[]>([]);
export const currentCategory = writable<string>('All');
export const priceRange = writable<{ min: number; max: number }>({ min: 0, max: Infinity });
export const sizeFilter = writable<string>('');
export const colorFilter = writable<string>('');
export const textureFilter = writable<string>('');

export const brandFilter = writable<string>('');

export const filteredProducts = derived(
  [products, currentCategory, priceRange, sizeFilter, colorFilter, textureFilter, brandFilter],
  ([$products, $category, $priceRange, $sizeFilter, $colorFilter, $textureFilter, $brandFilter]) =>
    $products.filter((p) => {
      const categoryMatch = $category === 'All' || p.category === $category;
      const minPrice = Math.min(...(p.variants?.map((v) => v.price) || [0]));
      const priceMatch = minPrice >= $priceRange.min && minPrice < $priceRange.max;
      const sizeMatch = !$sizeFilter || p.variants?.some((v) => v.size === $sizeFilter);
      const colorMatch = !$colorFilter || p.variants?.some((v) => v.color === $colorFilter);
      const textureMatch = !$textureFilter || p.variants?.some((v) => v.texture === $textureFilter);
      const brandMatch = !$brandFilter || 
        p.name.toLowerCase().includes($brandFilter.toLowerCase()) || 
        p.category.toLowerCase().includes($brandFilter.toLowerCase());
      return categoryMatch && priceMatch && sizeMatch && colorMatch && textureMatch && brandMatch;
    })
);

// Cart store logic.
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
    set,
    update,
    add(item: CartItem) {
      update((cartItems) => {
        const wholesale = get(isWholesale);
        const existingIndex = cartItems.findIndex((c) => c.id === item.id && c.variant_id === item.variant_id);
        
        if (existingIndex !== -1) {
          const newQty = cartItems[existingIndex].quantity + item.quantity;
          if (!wholesale && newQty > 10) {
            cartItems[existingIndex].quantity = 10;
            showToast('Retail limit reached (10). Log in for wholesale.');
          } else {
            cartItems[existingIndex].quantity = newQty;
          }
          save([...cartItems]);
          return [...cartItems];
        }

        if (!wholesale && item.quantity > 10) {
          item.quantity = 10;
          showToast('Retail limit reached (10). Log in for wholesale.');
        }

        const updated = [...cartItems, item];
        save(updated);
        return updated;
      });
    },
    remove(index: number) {
      update((cartItems) => {
        cartItems.splice(index, 1);
        const updated = [...cartItems];
        save(updated);
        return updated;
      });
    },
    updateQuantity(index: number, delta: number) {
      update((cartItems) => {
        if (!cartItems[index]) return cartItems;
        const wholesale = get(isWholesale);
        const newQty = cartItems[index].quantity + delta;
        
        if (!wholesale && newQty > 10) {
          showToast('Retail limit reached (10). Log in for wholesale.');
          return cartItems;
        }

        cartItems[index].quantity = newQty;
        if (cartItems[index].quantity <= 0) cartItems.splice(index, 1);
        const updated = [...cartItems];
        save(updated);
        return updated;
      });
    },
    clear() {
      set([]);
      save([]);
    }
  };
}

export const cart = createCartStore();
export const cartTotal = derived(cart, ($cart) =>
  $cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
);
export const cartCount = derived(cart, ($cart) =>
  $cart.reduce((sum, item) => sum + item.quantity, 0)
);

// UI state.
export const currentPage = writable<string>('home');
export const previousPage = writable<string>('home');
export const cartOpen = writable<boolean>(false);
export const searchOpen = writable<boolean>(false);
export const checkoutOpen = writable<boolean>(false);
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

// Selected state.
export const selectedProduct = writable<Product | null>(null);
export const selectedVariant = writable<ProductVariant | null>(null);
export const selectedSize = writable<string>('');
export const selectedColor = writable<string>('');
export const selectedTexture = writable<string>('');

// Authentication.
function createUserStore() {
  const stored: UserData | null = typeof localStorage !== 'undefined'
    ? JSON.parse(localStorage.getItem('user') || 'null')
    : null;
  const { subscribe, set: baseSet, update } = writable<UserData | null>(stored);

  return {
    subscribe,
    set(user: UserData | null) {
      baseSet(user);
      if (typeof localStorage !== 'undefined') {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('userRole', (user.role || '').toLowerCase());
          localStorage.setItem('authToken', (user as any).token || '');
          isWholesale.set((user.role || '').toLowerCase() === 'wholesale' || (user.role || '').toLowerCase() === 'admin');
          if (typeof document !== 'undefined') {
            const isAdminUser = (user.role || '').toLowerCase() === 'admin';
            document.cookie = `isAdmin=${isAdminUser}; path=/; max-age=31536000; SameSite=Lax`;
            const token = (user as any).token || '';
            document.cookie = `authToken=${token}; path=/; max-age=31536000; SameSite=Lax`;
          }
        } else {
          localStorage.removeItem('user');
          localStorage.removeItem('userRole');
          localStorage.removeItem('authToken');
          isWholesale.set(false);
          if (typeof document !== 'undefined') {
            document.cookie = `isAdmin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax`;
            document.cookie = `authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax`;
          }
        }
        productsLoaded = false;
        loadProducts();
      }
    },
    logout() {
      this.set(null);
      showToast('Session terminated');
    },
    async refreshSession() {
      if (typeof localStorage === 'undefined') return;
      const token = localStorage.getItem('authToken');
      if (!token) return;

      try {
        const res = await fetch(`${API_CONFIG.baseUrl}/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const user = await res.json();
          this.set({
            id: user.id,
            email: user.email,
            name: user.name,
            picture: user.picture,
            role: user.role,
            token: token
          });
        }
      } catch (e) {
        console.error('Failed to refresh user session:', e);
      }
    }
  };
}

export const currentUser = createUserStore();
export const isWholesale = writable<boolean>(
  typeof localStorage !== 'undefined'
    ? localStorage.getItem('userRole') === 'wholesale'
    : false
);

// API initialization.
export async function loadProducts() {
  if (productsLoaded) return;
  productsLoaded = true;

  try {
    const headers: Record<string, string> = {};
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    const res = await fetch(API_CONFIG.baseUrl + API_CONFIG.endpoints.products, { headers }).catch(() => null);
    if (res && res.ok) {
      const data = await res.json();
      products.set(data);
      return;
    }

    console.error('Failed to load products from API');
    products.set([]);
  } catch (err) {
    console.error('Error loading products:', err);
    products.set([]);
  }
}

// Keep cart item prices in sync with wholesale status and products database prices
if (typeof window !== 'undefined') {
  derived([isWholesale, products], ([$isWholesale, $products]) => {
    if (!$products || $products.length === 0) return;
    
    // Read current cart items and check if any need update
    const currentCart = get(cart);
    let changed = false;
    
    const updated = currentCart.map(item => {
      const product = $products.find(p => p.id.toString() === item.id.toString());
      const variant = product?.variants?.find(v => v.id.toString() === item.variant_id?.toString());
      if (variant) {
        const wholesalePrice = (variant.wholesale_price && variant.wholesale_price > 0)
          ? variant.wholesale_price
          : variant.price * (1 - 0.30);
        const targetPrice = $isWholesale ? wholesalePrice : variant.price;
        if (item.price !== targetPrice) {
          changed = true;
          return { ...item, price: targetPrice };
        }
      }
      return item;
    });
    
    if (changed) {
      cart.update(() => {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('cart', JSON.stringify(updated));
        }
        return updated;
      });
    }
  }).subscribe(() => {});
}
