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
const FALLBACK_PRODUCTS = [
  { id: 1, name: "Heritage Leather Tool Belt", price: 189.99, wholesalePrice: 149.99, category: "Tool Belts", type: "Leather", image: "/images/toolbelt-1.jpg", images: ["/images/toolbelt-1.jpg", "/images/toolbelt-3.jpg", "/images/rig-1.jpg"], description: "Handcrafted from full-grain leather, this tool belt features 7 pockets, hammer loop, and tape measure clip. Built to last a lifetime.", sizes: ["S", "M", "L", "XL", "2XL"], colors: [{ name: "Dark Brown", hex: "#3d2817", image: "/images/toolbelt-1.jpg" }, { name: "Tan", hex: "#8b6914", image: "/images/toolbelt-3.jpg" }, { name: "Black", hex: "#1a1a1a", image: "/images/suspenders-1.jpg" }], stock: 25 },
  { id: 2, name: "Pro Canvas Tool Belt", price: 129.99, wholesalePrice: 99.99, category: "Tool Belts", type: "Canvas", image: "/images/toolbelt-2.jpg", images: ["/images/toolbelt-2.jpg"], description: "Heavy-duty canvas construction with leather reinforcements. Perfect for electricians and HVAC technicians.", sizes: ["M", "L", "XL"], colors: [{ name: "Black", hex: "#1a1a1a", image: "/images/toolbelt-2.jpg" }], stock: 40 },
  { id: 3, name: "Master Craftsman Apron", price: 159.99, wholesalePrice: 124.99, category: "Aprons", type: "Leather", image: "/images/apron-1.jpg", images: ["/images/apron-1.jpg"], description: "Full-coverage leather apron with cross-back straps for all-day comfort. 5 pockets plus towel loop.", sizes: ["S/M", "L/XL"], colors: [{ name: "Dark Brown", hex: "#3d2817", image: "/images/apron-1.jpg" }], stock: 18 },
  { id: 4, name: "Quick-Clip Tool Pouch", price: 49.99, wholesalePrice: 39.99, category: "Pouches", type: "Leather", image: "/images/pouch-1.jpg", images: ["/images/pouch-1.jpg", "/images/pouch-3.jpg"], description: "Compact single-pocket pouch with metal clip. Perfect for tape measure, knife, or small tools.", sizes: ["One Size"], colors: [{ name: "Dark Brown", hex: "#3d2817", image: "/images/pouch-1.jpg" }, { name: "Tan", hex: "#8b6914", image: "/images/pouch-3.jpg" }], stock: 60 },
  { id: 5, name: "Multi-Pocket Pro Pouch", price: 79.99, wholesalePrice: 64.99, category: "Pouches", type: "Nylon", image: "/images/pouch-2.jpg", images: ["/images/pouch-2.jpg"], description: "Nylon pouch with 4 compartments and belt loop. Water-resistant and lightweight.", sizes: ["One Size"], colors: [{ name: "Black", hex: "#1a1a1a", image: "/images/pouch-2.jpg" }], stock: 45 },
  { id: 6, name: "Heavy-Duty Suspenders", price: 89.99, wholesalePrice: 69.99, category: "Accessories", type: "Leather", image: "/images/suspenders-1.jpg", images: ["/images/suspenders-1.jpg"], description: "Leather suspenders with tool loops to distribute weight evenly. Compatible with all our tool belts.", sizes: ["M", "L", "XL"], colors: [{ name: "Black", hex: "#1a1a1a", image: "/images/suspenders-1.jpg" }], stock: 30 },
  { id: 7, name: "Magna-Fix Wristband", price: 24.99, wholesalePrice: 19.99, category: "Accessories", type: "Nylon", image: "/images/wristband-1.jpg", images: ["/images/wristband-1.jpg"], description: "Magnetic wristband holds screws, nails, and small metal parts. Adjustable fit.", sizes: ["One Size"], colors: [{ name: "Black/Orange", hex: "#1a1a1a", image: "/images/wristband-1.jpg" }], stock: 100 },
  { id: 8, name: "Gel-Pro Knee Pads", price: 59.99, wholesalePrice: 47.99, category: "Accessories", type: "Nylon", image: "/images/kneepads-1.jpg", images: ["/images/kneepads-1.jpg"], description: "Professional knee pads with gel cushioning and hard caps. All-day comfort protection.", sizes: ["S/M", "L/XL"], colors: [{ name: "Black", hex: "#1a1a1a", image: "/images/kneepads-1.jpg" }], stock: 35 },
  { id: 9, name: "Heritage Tool Roll", price: 69.99, wholesalePrice: 54.99, category: "Accessories", type: "Leather", image: "/images/toolroll-1.jpg", images: ["/images/toolroll-1.jpg"], description: "Leather roll-up tool organizer with 8 slots. Perfect for wrenches, screwdrivers, and hand tools.", sizes: ["One Size"], colors: [{ name: "Tan", hex: "#8b6914", image: "/images/toolroll-1.jpg" }], stock: 28 },
  { id: 10, name: "Pro Tool Tote", price: 149.99, wholesalePrice: 119.99, category: "Accessories", type: "Leather", image: "/images/toolbag-1.jpg", images: ["/images/toolbag-1.jpg"], description: "Leather tool tote with brass hardware, shoulder strap, and multiple pockets.", sizes: ["One Size"], colors: [{ name: "Brown", hex: "#5c4033", image: "/images/toolbag-1.jpg" }], stock: 20 },
  { id: 11, name: "Iron Hand Work Gloves", price: 34.99, wholesalePrice: 27.99, category: "Accessories", type: "Leather", image: "/images/gloves-1.jpg", images: ["/images/gloves-1.jpg"], description: "Heavy-duty leather work gloves with reinforced palms and adjustable wrist strap.", sizes: ["S", "M", "L", "XL"], colors: [{ name: "Brown/Tan", hex: "#8b7355", image: "/images/gloves-1.jpg" }], stock: 50 },
  { id: 12, name: "Complete Tool Rig", price: 299.99, wholesalePrice: 239.99, category: "Tool Belts", type: "Leather", image: "/images/rig-1.jpg", images: ["/images/rig-1.jpg", "/images/toolbelt-1.jpg"], description: "Complete tool belt system with suspenders, 10+ pockets, hammer holder, and tape clip.", sizes: ["M", "L", "XL", "2XL"], colors: [{ name: "Dark Brown", hex: "#3d2817", image: "/images/rig-1.jpg" }], stock: 15 }
];
const products = writable([...FALLBACK_PRODUCTS]);
const currentType = writable("All");
const currentCategory = writable("All");
const filteredProducts = derived(
  [products, currentType, currentCategory],
  ([$products, $type, $category]) => $products.filter((p) => {
    const typeMatch = $type === "All" || p.type === $type;
    const categoryMatch = $category === "All" || p.category === $category;
    return typeMatch && categoryMatch;
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
          (c) => c.id === item.id && c.color === item.color && c.size === item.size
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
const selectedColor = writable(null);
const selectedImageIndex = writable(0);
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
  currentType as g,
  currentCategory as h,
  isWholesale as i,
  filteredProducts as j,
  selectedColor as k,
  selectedImageIndex as l,
  selectedSize as m,
  selectedProduct as n,
  currentPage as o,
  products as p,
  searchOpen as s,
  toastVisible as t
};
