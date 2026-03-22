import { s as sanitize_props, m as rest_props, o as fallback, p as attributes, q as clsx, e as ensure_array_like, t as element, b as slot, v as bind_props } from "./root.js";
import { e as derived, w as writable } from "./index.js";
/**
 * @license lucide-svelte v0.475.0 - ISC
 *
 * ISC License
 * 
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
 * 
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 * 
 */
const defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};
function Icon($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "name",
    "color",
    "size",
    "strokeWidth",
    "absoluteStrokeWidth",
    "iconNode"
  ]);
  $$renderer.component(($$renderer2) => {
    let name = fallback($$props["name"], void 0);
    let color = fallback($$props["color"], "currentColor");
    let size = fallback($$props["size"], 24);
    let strokeWidth = fallback($$props["strokeWidth"], 2);
    let absoluteStrokeWidth = fallback($$props["absoluteStrokeWidth"], false);
    let iconNode = fallback($$props["iconNode"], () => [], true);
    const mergeClasses = (...classes) => classes.filter((className, index, array) => {
      return Boolean(className) && array.indexOf(className) === index;
    }).join(" ");
    $$renderer2.push(`<svg${attributes(
      {
        ...defaultAttributes,
        ...$$restProps,
        width: size,
        height: size,
        stroke: color,
        "stroke-width": absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
        class: clsx(mergeClasses("lucide-icon", "lucide", name ? `lucide-${name}` : "", $$sanitized_props.class))
      },
      void 0,
      void 0,
      void 0,
      3
    )}><!--[-->`);
    const each_array = ensure_array_like(iconNode);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let [tag, attrs] = each_array[$$index];
      element($$renderer2, tag, () => {
        $$renderer2.push(`${attributes({ ...attrs }, void 0, void 0, void 0, 3)}`);
      });
    }
    $$renderer2.push(`<!--]--><!--[-->`);
    slot($$renderer2, $$props, "default", {});
    $$renderer2.push(`<!--]--></svg>`);
    bind_props($$props, {
      name,
      color,
      size,
      strokeWidth,
      absoluteStrokeWidth,
      iconNode
    });
  });
}
const products = writable([]);
const currentCategory = writable("All");
const filteredProducts = derived(
  [products, currentCategory],
  ([$products, $category]) => $products.filter((p) => {
    const categoryMatch = $category === "All" || p.category === $category;
    return categoryMatch;
  })
);
function createCartStore() {
  const stored = typeof localStorage !== "undefined" ? JSON.parse(localStorage.getItem("cart") || "[]") : [];
  const { subscribe, set, update } = writable(stored);
  function save(items) {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }
  return {
    subscribe,
    add(item) {
      update((cart2) => {
        const existing = cart2.find(
          (c) => c.ebay_id === item.ebay_id
        );
        if (existing) {
          existing.quantity++;
          save([...cart2]);
          return [...cart2];
        }
        const updated = [...cart2, item];
        save(updated);
        return updated;
      });
    },
    remove(index) {
      update((cart2) => {
        cart2.splice(index, 1);
        const updated = [...cart2];
        save(updated);
        return updated;
      });
    },
    updateQuantity(index, delta) {
      update((cart2) => {
        cart2[index].quantity += delta;
        if (cart2[index].quantity <= 0) {
          cart2.splice(index, 1);
        }
        const updated = [...cart2];
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
const cart = createCartStore();
const cartTotal = derived(
  cart,
  ($cart) => $cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
);
const cartCount = derived(
  cart,
  ($cart) => $cart.reduce((sum, item) => sum + item.quantity, 0)
);
const currentPage = writable("home");
const cartOpen = writable(false);
const searchOpen = writable(false);
const toastMessage = writable("");
const toastVisible = writable(false);
const selectedProduct = writable(null);
const selectedSize = writable("");
const selectedColor = writable("");
const selectedTexture = writable("");
function createUserStore() {
  const stored = typeof localStorage !== "undefined" ? JSON.parse(localStorage.getItem("user") || "null") : null;
  const { subscribe, set } = writable(stored);
  return {
    subscribe,
    login(user) {
      set(user);
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("userRole", user.role);
      }
      isWholesale.set(user.role === "wholesale");
    },
    logout() {
      set(null);
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem("user");
        localStorage.removeItem("userRole");
      }
      isWholesale.set(false);
    }
  };
}
const currentUser = createUserStore();
const isWholesale = writable(
  typeof localStorage !== "undefined" ? localStorage.getItem("userRole") === "wholesale" : false
);
export {
  Icon as I,
  currentUser as a,
  cartOpen as b,
  cartCount as c,
  cart as d,
  cartTotal as e,
  toastMessage as f,
  currentCategory as g,
  filteredProducts as h,
  selectedColor as i,
  selectedSize as j,
  selectedTexture as k,
  selectedProduct as l,
  currentPage as m,
  products as p,
  searchOpen as s,
  toastVisible as t
};
