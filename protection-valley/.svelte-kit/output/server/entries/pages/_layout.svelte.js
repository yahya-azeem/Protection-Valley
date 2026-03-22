import "clsx";
import { s as sanitize_props, a as spread_props, b as slot, c as attr, e as ensure_array_like, d as escape_html, f as store_get, u as unsubscribe_stores, g as stringify, h as derived, i as attr_class } from "../../chunks/root.js";
import { b as base } from "../../chunks/server.js";
import "../../chunks/index.js";
import "@sveltejs/kit/internal/server";
import { I as Icon, c as cartCount, a as currentUser, b as cartOpen, d as cart, e as cartTotal, s as searchOpen, i as isWholesale, p as products, t as toastVisible, f as toastMessage } from "../../chunks/stores.js";
function html(value) {
  var html2 = String(value ?? "");
  var open = "<!---->";
  return open + html2 + "<!---->";
}
function Search_x($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
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
  const iconNode = [
    ["path", { "d": "m13.5 8.5-5 5" }],
    ["path", { "d": "m8.5 8.5 5 5" }],
    ["circle", { "cx": "11", "cy": "11", "r": "8" }],
    ["path", { "d": "m21 21-4.3-4.3" }]
  ];
  Icon($$renderer, spread_props([
    { name: "search-x" },
    $$sanitized_props,
    {
      /**
       * @component @name SearchX
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTMuNSA4LjUtNSA1IiAvPgogIDxwYXRoIGQ9Im04LjUgOC41IDUgNSIgLz4KICA8Y2lyY2xlIGN4PSIxMSIgY3k9IjExIiByPSI4IiAvPgogIDxwYXRoIGQ9Im0yMSAyMS00LjMtNC4zIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/search-x
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Search($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
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
  const iconNode = [
    ["circle", { "cx": "11", "cy": "11", "r": "8" }],
    ["path", { "d": "m21 21-4.3-4.3" }]
  ];
  Icon($$renderer, spread_props([
    { name: "search" },
    $$sanitized_props,
    {
      /**
       * @component @name Search
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMSIgY3k9IjExIiByPSI4IiAvPgogIDxwYXRoIGQ9Im0yMSAyMS00LjMtNC4zIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/search
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Shopping_bag($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
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
  const iconNode = [
    [
      "path",
      { "d": "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" }
    ],
    ["path", { "d": "M3 6h18" }],
    ["path", { "d": "M16 10a4 4 0 0 1-8 0" }]
  ];
  Icon($$renderer, spread_props([
    { name: "shopping-bag" },
    $$sanitized_props,
    {
      /**
       * @component @name ShoppingBag
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNiAyIDMgNnYxNGEyIDIgMCAwIDAgMiAyaDE0YTIgMiAwIDAgMCAyLTJWNmwtMy00WiIgLz4KICA8cGF0aCBkPSJNMyA2aDE4IiAvPgogIDxwYXRoIGQ9Ik0xNiAxMGE0IDQgMCAwIDEtOCAwIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/shopping-bag
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Shopping_cart($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
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
  const iconNode = [
    ["circle", { "cx": "8", "cy": "21", "r": "1" }],
    ["circle", { "cx": "19", "cy": "21", "r": "1" }],
    [
      "path",
      {
        "d": "M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"
      }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "shopping-cart" },
    $$sanitized_props,
    {
      /**
       * @component @name ShoppingCart
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSI4IiBjeT0iMjEiIHI9IjEiIC8+CiAgPGNpcmNsZSBjeD0iMTkiIGN5PSIyMSIgcj0iMSIgLz4KICA8cGF0aCBkPSJNMi4wNSAyLjA1aDJsMi42NiAxMi40MmEyIDIgMCAwIDAgMiAxLjU4aDkuNzhhMiAyIDAgMCAwIDEuOTUtMS41N2wxLjY1LTcuNDNINS4xMiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/shopping-cart
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Trash_2($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
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
  const iconNode = [
    ["path", { "d": "M3 6h18" }],
    ["path", { "d": "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" }],
    ["path", { "d": "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" }],
    ["line", { "x1": "10", "x2": "10", "y1": "11", "y2": "17" }],
    ["line", { "x1": "14", "x2": "14", "y1": "11", "y2": "17" }]
  ];
  Icon($$renderer, spread_props([
    { name: "trash-2" },
    $$sanitized_props,
    {
      /**
       * @component @name Trash2
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMyA2aDE4IiAvPgogIDxwYXRoIGQ9Ik0xOSA2djE0YzAgMS0xIDItMiAySDdjLTEgMC0yLTEtMi0yVjYiIC8+CiAgPHBhdGggZD0iTTggNlY0YzAtMSAxLTIgMi0yaDRjMSAwIDIgMSAyIDJ2MiIgLz4KICA8bGluZSB4MT0iMTAiIHgyPSIxMCIgeTE9IjExIiB5Mj0iMTciIC8+CiAgPGxpbmUgeDE9IjE0IiB4Mj0iMTQiIHkxPSIxMSIgeTI9IjE3IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/trash-2
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function User($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
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
  const iconNode = [
    ["path", { "d": "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" }],
    ["circle", { "cx": "12", "cy": "7", "r": "4" }]
  ];
  Icon($$renderer, spread_props([
    { name: "user" },
    $$sanitized_props,
    {
      /**
       * @component @name User
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTkgMjF2LTJhNCA0IDAgMCAwLTQtNEg5YTQgNCAwIDAgMC00IDR2MiIgLz4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/user
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function X($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
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
  const iconNode = [
    ["path", { "d": "M18 6 6 18" }],
    ["path", { "d": "m6 6 12 12" }]
  ];
  Icon($$renderer, spread_props([
    { name: "x" },
    $$sanitized_props,
    {
      /**
       * @component @name X
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTggNiA2IDE4IiAvPgogIDxwYXRoIGQ9Im02IDYgMTIgMTIiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/x
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Navbar($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    $$renderer2.push(`<nav class="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-dark-border"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex items-center justify-between h-20"><button class="flex items-center space-x-3"><img${attr("src", `${stringify(base)}/images/logo.png`)} alt="Protection Valley" class="h-12 w-auto"/></button> <div class="hidden md:flex items-center space-x-8"><!--[-->`);
    const each_array = ensure_array_like(["Home", "Catalog", "About", "Contact"]);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let label = each_array[$$index];
      $$renderer2.push(`<button class="text-sm font-medium text-dark-text hover:text-primary transition-colors">${escape_html(label)}</button>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="flex items-center space-x-4"><button class="p-2 text-dark-text hover:text-primary transition-colors">`);
    Search($$renderer2, { class: "w-5 h-5" });
    $$renderer2.push(`<!----></button> <button class="relative p-2 text-dark-text hover:text-primary transition-colors">`);
    Shopping_cart($$renderer2, { class: "w-5 h-5" });
    $$renderer2.push(`<!----> `);
    if (store_get($$store_subs ??= {}, "$cartCount", cartCount) > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="absolute -top-1 -right-1 w-5 h-5 bg-primary text-[#0a0a0a] text-xs rounded-full flex items-center justify-center">${escape_html(store_get($$store_subs ??= {}, "$cartCount", cartCount))}</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></button> <button class="p-2 text-dark-text hover:text-primary transition-colors">`);
    if (store_get($$store_subs ??= {}, "$currentUser", currentUser)) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="text-sm">${escape_html(store_get($$store_subs ??= {}, "$currentUser", currentUser).name)}</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      User($$renderer2, { class: "w-5 h-5" });
    }
    $$renderer2.push(`<!--]--></button></div></div></div></nav>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function CartSidebar($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    if (store_get($$store_subs ??= {}, "$cartOpen", cartOpen)) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="fixed inset-0 z-50"><div class="absolute inset-0 bg-black/70"></div> <div class="absolute right-0 top-0 h-full w-full max-w-md bg-dark-card shadow-2xl flex flex-col border-l border-dark-border"><div class="flex items-center justify-between p-6 border-b border-dark-border"><div class="flex items-center space-x-3">`);
      Shopping_bag($$renderer2, { class: "w-6 h-6 text-primary" });
      $$renderer2.push(`<!----> <h2 class="text-xl font-serif">Your Cart</h2></div> <button class="p-2 text-dark-muted hover:text-dark-text">`);
      X($$renderer2, { class: "w-6 h-6" });
      $$renderer2.push(`<!----></button></div> <div class="flex-1 overflow-y-auto p-6">`);
      if (store_get($$store_subs ??= {}, "$cart", cart).length === 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="text-center py-8">`);
        Shopping_bag($$renderer2, { class: "w-16 h-16 text-dark-border mx-auto mb-4" });
        $$renderer2.push(`<!----> <p class="text-dark-muted">Your cart is empty</p></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<!--[-->`);
        const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$cart", cart));
        for (let i = 0, $$length = each_array.length; i < $$length; i++) {
          let item = each_array[i];
          $$renderer2.push(`<div class="flex gap-4 mb-4"><div class="w-20 h-20 bg-dark-bg rounded-lg overflow-hidden flex-shrink-0 border border-dark-border"><img${attr("src", item.image)}${attr("alt", item.name)} class="w-full h-full object-cover"/></div> <div class="flex-1"><h3 class="font-medium text-sm">${escape_html(item.name)}</h3> <p class="text-xs text-dark-muted">${escape_html(item.color)}, ${escape_html(item.size)}</p> <div class="flex items-center justify-between mt-2"><div class="flex items-center border border-dark-border rounded"><button class="px-2 py-1 hover:bg-dark-bg text-dark-muted">-</button> <span class="px-3 text-sm">${escape_html(item.quantity)}</span> <button class="px-2 py-1 hover:bg-dark-bg text-dark-muted">+</button></div> <span class="font-medium text-primary">$${escape_html((item.price * item.quantity).toFixed(2))}</span></div></div> <button class="text-dark-muted hover:text-red-500">`);
          Trash_2($$renderer2, { class: "w-4 h-4" });
          $$renderer2.push(`<!----></button></div>`);
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></div> `);
      if (store_get($$store_subs ??= {}, "$cart", cart).length > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="border-t border-dark-border p-6"><div class="flex justify-between items-center mb-4"><span class="font-medium">Total</span> <span class="text-2xl font-serif text-primary">$${escape_html(store_get($$store_subs ??= {}, "$cartTotal", cartTotal).toFixed(2))}</span></div> <button class="w-full btn-primary py-4">Proceed to Checkout</button></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function SearchOverlay($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let query = "";
    let results = derived(() => {
      if (!query.trim()) return [];
      const term = query.toLowerCase();
      return store_get($$store_subs ??= {}, "$products", products).filter((p) => p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term) || p.type.toLowerCase().includes(term) || p.description.toLowerCase().includes(term));
    });
    function highlight(text) {
      if (!query.trim()) return text;
      const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return text.replace(new RegExp(`(${escaped})`, "gi"), '<span class="text-primary">$1</span>');
    }
    if (store_get($$store_subs ??= {}, "$searchOpen", searchOpen)) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="fixed inset-0 z-50"><div class="absolute inset-0 bg-black/80"></div> <div class="absolute top-0 left-0 right-0 bg-dark-card border-b border-dark-border p-6"><div class="max-w-3xl mx-auto"><div class="relative">`);
      Search($$renderer2, {
        class: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-muted"
      });
      $$renderer2.push(`<!----> <input type="text"${attr("value", query)} placeholder="Search products..." class="w-full pl-12 pr-4 py-4 bg-dark-card border border-dark-border rounded-lg text-lg text-dark-text focus:border-primary focus:outline-none"/> <button class="absolute right-4 top-1/2 -translate-y-1/2 text-dark-muted hover:text-dark-text">`);
      X($$renderer2, { class: "w-5 h-5" });
      $$renderer2.push(`<!----></button></div> `);
      if (query.trim()) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="mt-4 max-h-96 overflow-y-auto scrollbar-hide">`);
        if (results().length === 0) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="text-center py-8 text-dark-muted">`);
          Search_x($$renderer2, { class: "w-12 h-12 mx-auto mb-2" });
          $$renderer2.push(`<!----> <p>No products found</p></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<!--[-->`);
          const each_array = ensure_array_like(results());
          for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
            let product = each_array[$$index];
            $$renderer2.push(`<button class="flex items-center gap-4 p-3 hover:bg-dark-bg rounded-lg cursor-pointer transition-colors w-full text-left"><img${attr("src", product.image)}${attr("alt", product.name)} class="w-16 h-16 object-cover rounded-lg"/> <div class="flex-1"><h4 class="font-medium">${html(highlight(product.name))}</h4> <p class="text-sm text-dark-muted">${escape_html(product.category)} • ${escape_html(product.type)}</p></div> <span class="text-primary font-medium">$${escape_html((store_get($$store_subs ??= {}, "$isWholesale", isWholesale) ? product.wholesalePrice : product.price).toFixed(2))}</span></button>`);
          }
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function Toast($$renderer) {
  var $$store_subs;
  $$renderer.push(`<div${attr_class("fixed bottom-4 right-4 bg-primary text-[#0a0a0a] px-6 py-3 rounded-lg shadow-lg transition-all duration-300 z-50", void 0, {
    "translate-y-20": !store_get($$store_subs ??= {}, "$toastVisible", toastVisible),
    "opacity-0": !store_get($$store_subs ??= {}, "$toastVisible", toastVisible)
  })}>${escape_html(store_get($$store_subs ??= {}, "$toastMessage", toastMessage))}</div>`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
}
function Footer($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const categories = [
      { name: "Tool Belts", page: "catalog" },
      { name: "Pouches", page: "catalog" },
      { name: "Aprons", page: "catalog" },
      { name: "Accessories", page: "catalog" }
    ];
    $$renderer2.push(`<footer class="bg-dark-card border-t border-dark-border"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"><div class="grid grid-cols-1 md:grid-cols-4 gap-8"><div class="md:col-span-2"><img${attr("src", `${stringify(base)}/images/logo.png`)} alt="Protection Valley" class="h-12 w-auto mb-4"/> <p class="text-dark-muted max-w-sm">Premium workgear for the tradespeople who build our world. Crafted with care, built to last.</p></div> <div><h3 class="font-medium mb-4">Shop</h3> <ul class="space-y-2 text-dark-muted"><!--[-->`);
    const each_array = ensure_array_like(categories);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let cat = each_array[$$index];
      $$renderer2.push(`<li><button class="hover:text-primary transition-colors">${escape_html(cat.name)}</button></li>`);
    }
    $$renderer2.push(`<!--]--></ul></div> <div><h3 class="font-medium mb-4">Support</h3> <ul class="space-y-2 text-dark-muted"><li><button class="hover:text-primary transition-colors">Contact Us</button></li> <li><span class="hover:text-primary transition-colors cursor-pointer">Shipping</span></li> <li><span class="hover:text-primary transition-colors cursor-pointer">Returns</span></li> <li><span class="hover:text-primary transition-colors cursor-pointer">Warranty</span></li></ul></div></div> <div class="mt-12 pt-8 border-t border-dark-border text-center text-dark-muted text-sm"><p>© 2025 Protection Valley. All rights reserved.</p></div></div></footer>`);
  });
}
function _layout($$renderer, $$props) {
  let { children } = $$props;
  Navbar($$renderer);
  $$renderer.push(`<!----> `);
  SearchOverlay($$renderer);
  $$renderer.push(`<!----> `);
  children($$renderer);
  $$renderer.push(`<!----> `);
  CartSidebar($$renderer);
  $$renderer.push(`<!----> `);
  Toast($$renderer);
  $$renderer.push(`<!----> `);
  Footer($$renderer);
  $$renderer.push(`<!---->`);
}
export {
  _layout as default
};
