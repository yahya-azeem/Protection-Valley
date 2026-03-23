import "clsx";
import "@sveltejs/kit/internal";
import "../../chunks/index.js";
import "../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import { s as sanitize_props, a as spread_props, b as slot, e as ensure_array_like, c as attr_class, d as stringify, f as store_get, g as escape_html, h as attr, u as unsubscribe_stores, i as derived } from "../../chunks/root.js";
import "../../chunks/exports.js";
import "../../chunks/state.svelte.js";
import { I as Icon, U as User, c as currentPage, a as cart, b as cartOpen, d as cartTotal, s as searchOpen, p as products, t as toastVisible, e as toastMessage, M as Map_pin, P as Phone, f as Mail } from "../../chunks/user.js";
import { b as base } from "../../chunks/server.js";
function html(value) {
  var html2 = String(value ?? "");
  var open = "<!---->";
  return open + html2 + "<!---->";
}
function Menu($$renderer, $$props) {
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
    ["line", { "x1": "4", "x2": "20", "y1": "12", "y2": "12" }],
    ["line", { "x1": "4", "x2": "20", "y1": "6", "y2": "6" }],
    ["line", { "x1": "4", "x2": "20", "y1": "18", "y2": "18" }]
  ];
  Icon($$renderer, spread_props([
    { name: "menu" },
    $$sanitized_props,
    {
      /**
       * @component @name Menu
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8bGluZSB4MT0iNCIgeDI9IjIwIiB5MT0iMTIiIHkyPSIxMiIgLz4KICA8bGluZSB4MT0iNCIgeDI9IjIwIiB5MT0iNiIgeTI9IjYiIC8+CiAgPGxpbmUgeDE9IjQiIHgyPSIyMCIgeTE9IjE4IiB5Mj0iMTgiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/menu
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
function Shield($$renderer, $$props) {
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
      {
        "d": "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
      }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "shield" },
    $$sanitized_props,
    {
      /**
       * @component @name Shield
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjAgMTNjMCA1LTMuNSA3LjUtNy42NiA4Ljk1YTEgMSAwIDAgMS0uNjctLjAxQzcuNSAyMC41IDQgMTggNCAxM1Y2YTEgMSAwIDAgMSAxLTFjMiAwIDQuNS0xLjIgNi4yNC0yLjcyYTEuMTcgMS4xNyAwIDAgMSAxLjUyIDBDMTQuNTEgMy44MSAxNyA1IDE5IDVhMSAxIDAgMCAxIDEgMXoiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/shield
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
    const navItems = [
      { name: "Home", id: "home" },
      { name: "Collection", id: "catalog" },
      { name: "About", id: "about" },
      { name: "Contact", id: "contact" }
    ];
    $$renderer2.push(`<nav class="bg-black border-b border-white/5 sticky top-0 z-[100] h-20 transition-lux"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full"><div class="flex items-center justify-between h-full relative"><div class="hidden lg:flex items-center space-x-12 w-1/3"><!--[-->`);
    const each_array = ensure_array_like(navItems.slice(0, 2));
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let item = each_array[$$index];
      $$renderer2.push(`<button${attr_class(`text-[0.6rem] font-bold uppercase tracking-[0.5em] transition-lux hover:text-primary ${stringify(store_get($$store_subs ??= {}, "$currentPage", currentPage) === item.id ? "text-primary" : "text-zinc-500")}`)}>${escape_html(item.name)}</button>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="absolute left-1/2 -translate-x-1/2 h-full flex items-center"><button class="hover:scale-105 transition-lux"><img${attr("src", `${stringify(base)}/images/logo-v3.png`)} alt="Protection Valley" class="h-10 w-auto"/></button></div> <div class="hidden lg:flex items-center justify-end space-x-12 w-1/3"><div class="flex items-center space-x-12"><!--[-->`);
    const each_array_1 = ensure_array_like(navItems.slice(2));
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let item = each_array_1[$$index_1];
      $$renderer2.push(`<button${attr_class(`text-[0.6rem] font-bold uppercase tracking-[0.5em] transition-lux hover:text-primary ${stringify(store_get($$store_subs ??= {}, "$currentPage", currentPage) === item.id ? "text-primary" : "text-zinc-500")}`)}>${escape_html(item.name)}</button>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="flex items-center space-x-8 border-l border-white/10 pl-12"><button class="text-zinc-500 hover:text-primary transition-lux">`);
    Search($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----></button> <button class="text-zinc-500 hover:text-primary transition-lux">`);
    User($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----></button> <button class="relative flex items-center gap-3 text-zinc-500 hover:text-primary transition-lux"><span class="text-[0.6rem] font-bold uppercase tracking-[0.3em]">Cart</span> <div class="relative">`);
    Shopping_bag($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----> `);
    if (store_get($$store_subs ??= {}, "$cart", cart).length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="absolute -top-1.5 -right-1.5 bg-primary text-black text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">${escape_html(store_get($$store_subs ??= {}, "$cart", cart).length)}</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></button></div></div> <div class="lg:hidden flex items-center justify-between w-full"><button class="text-white">`);
    Menu($$renderer2, { class: "w-6 h-6" });
    $$renderer2.push(`<!----></button> <button class="absolute left-1/2 -translate-x-1/2 h-full flex items-center"><img${attr("src", `${stringify(base)}/images/logo-v3.png`)} alt="Logo" class="h-10 w-auto"/></button> <button class="text-white relative flex items-center gap-2"><div class="relative">`);
    Shopping_bag($$renderer2, { class: "w-5 h-5" });
    $$renderer2.push(`<!----> `);
    if (store_get($$store_subs ??= {}, "$cart", cart).length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="absolute -top-1.5 -right-1.5 bg-primary text-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">${escape_html(store_get($$store_subs ??= {}, "$cart", cart).length)}</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></button></div></div></div> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></nav>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function CartSidebar($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    if (store_get($$store_subs ??= {}, "$cartOpen", cartOpen)) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="fixed inset-0 z-[100]"><div class="absolute inset-0 bg-black/80 backdrop-blur-md" role="button" tabindex="0"></div> <div class="absolute right-0 top-0 h-full w-full max-w-md bg-dark-surface shadow-2xl flex flex-col border-l border-white/5 animate-slide-in-right svelte-1ob2s9q"><div class="flex items-center justify-between p-10 bg-black border-b border-white/5"><div class="flex items-center space-x-6"><div class="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-sm">`);
      Shopping_bag($$renderer2, { class: "w-6 h-6 text-primary" });
      $$renderer2.push(`<!----></div> <div><h2 class="text-3xl font-serif text-white tracking-tight">Cart</h2> <p class="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-zinc-500">${escape_html(store_get($$store_subs ??= {}, "$cart", cart).length)} Items</p></div></div> <button class="p-2 text-zinc-600 hover:text-white transition-lux">`);
      X($$renderer2, { class: "w-8 h-8" });
      $$renderer2.push(`<!----></button></div> <div class="flex-1 overflow-y-auto p-10 space-y-8 scrollbar-hide">`);
      if (store_get($$store_subs ??= {}, "$cart", cart).length === 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="h-full flex flex-col items-center justify-center text-center"><div class="w-24 h-24 bg-dark-elevated rounded-full flex items-center justify-center mb-10 border border-white/5">`);
        Shopping_bag($$renderer2, { class: "w-10 h-10 text-zinc-800" });
        $$renderer2.push(`<!----></div> <p class="text-[0.7rem] font-bold uppercase tracking-[0.4em] text-zinc-600">Your cart is empty</p> <button class="mt-12 text-[0.7rem] font-bold uppercase tracking-[0.6em] text-primary hover:text-white transition-lux">CONTINUE SHOPPING</button></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<!--[-->`);
        const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$cart", cart));
        for (let i = 0, $$length = each_array.length; i < $$length; i++) {
          let item = each_array[i];
          $$renderer2.push(`<div class="group flex gap-8 bg-black border border-white/5 p-6 hover:border-primary/20 transition-lux rounded-sm"><div class="w-28 h-28 bg-dark-surface p-2 border border-white/5 flex-shrink-0"><img${attr("src", item.image)}${attr("alt", item.name)} class="w-full h-full object-contain"/></div> <div class="flex-1 min-w-0 flex flex-col justify-between"><div class="flex justify-between items-start"><h3 class="text-sm font-serif text-white leading-tight group-hover:text-primary transition-lux pr-4">${escape_html(item.name)}</h3> <button class="text-zinc-600 hover:text-primary transition-lux">`);
          Trash_2($$renderer2, { class: "w-4 h-4" });
          $$renderer2.push(`<!----></button></div> <div class="space-y-4"><p class="text-[0.6rem] font-bold uppercase tracking-[0.3em] text-zinc-500">${escape_html(item.size)} / ${escape_html(item.color)}</p> <div class="flex items-center justify-between"><div class="flex items-center bg-dark-elevated border border-white/5 rounded-sm overflow-hidden"><button class="px-4 py-1 text-xs font-bold text-zinc-400 hover:text-primary transition-lux">-</button> <span class="px-3 text-[0.65rem] font-bold text-white w-8 text-center">${escape_html(item.quantity)}</span> <button class="px-4 py-1 text-xs font-bold text-zinc-400 hover:text-primary transition-lux">+</button></div> <span class="text-lg font-serif text-primary">$${escape_html((item.price * item.quantity).toFixed(2))}</span></div></div></div></div>`);
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></div> `);
      if (store_get($$store_subs ??= {}, "$cart", cart).length > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="bg-black p-10 border-t border-white/5 space-y-8"><div class="flex justify-between items-center"><span class="text-[0.7rem] font-bold uppercase tracking-[0.4em] text-zinc-600">Total</span> <span class="text-4xl font-serif text-primary">$${escape_html(store_get($$store_subs ??= {}, "$cartTotal", cartTotal).toFixed(2))}</span></div> <button class="btn-primary w-full py-6 flex items-center justify-center tracking-[0.6em] text-[0.7rem]">CHECKOUT</button></div>`);
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
      return store_get($$store_subs ??= {}, "$products", products).filter((p) => p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term) || p.model_number.toLowerCase().includes(term));
    });
    function highlight(text) {
      if (!query.trim()) return text;
      const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return text.replace(new RegExp(`(${escaped})`, "gi"), '<span class="text-(--color-primary)">$1</span>');
    }
    if (store_get($$store_subs ??= {}, "$searchOpen", searchOpen)) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="fixed inset-0 z-[110] flex flex-col items-center"><div class="absolute inset-0 bg-black/95 backdrop-blur-md" role="button" tabindex="0" aria-label="Close search"></div> <div class="relative w-full max-w-4xl px-4 pt-24 z-10"><div class="bg-(--color-dark-bg) border-8 border-(--color-primary) p-8 shadow-[0_0_100px_rgba(255,102,0,0.2)]"><div class="flex flex-col space-y-8"><div class="flex items-center justify-between border-b-2 border-(--color-dark-border) pb-4"><div class="flex items-center space-x-3">`);
      Shield($$renderer2, { class: "w-6 h-6 text-(--color-primary)" });
      $$renderer2.push(`<!----> <h2 class="text-xs font-black uppercase tracking-[0.4em] text-white">Inventory Intelligence</h2></div> <button class="text-(--color-dark-muted) hover:text-white transition-colors">`);
      X($$renderer2, { class: "w-8 h-8" });
      $$renderer2.push(`<!----></button></div> <div class="relative">`);
      Search($$renderer2, {
        class: "absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 text-(--color-primary)"
      });
      $$renderer2.push(`<!----> <input type="text"${attr("value", query)} placeholder="SEARCH BY MODEL, SKU, OR NOMENCLATURE..." class="w-full pl-20 pr-8 py-6 bg-black border border-(--color-dark-border) focus:border-(--color-primary) text-3xl font-black uppercase tracking-tighter text-white outline-none placeholder:text-(--color-dark-muted)" autofocus=""/></div> `);
      if (query.trim()) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="max-h-[60vh] overflow-y-auto scrollbar-hide space-y-4">`);
        if (results().length === 0) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="py-20 text-center flex flex-col items-center">`);
          Search_x($$renderer2, { class: "w-16 h-16 text-(--color-dark-border) mb-6" });
          $$renderer2.push(`<!----> <p class="text-sm font-black uppercase tracking-widest text-(--color-dark-muted)">Negative Identification for Search Parameters</p></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<div class="grid grid-cols-1 gap-4"><!--[-->`);
          const each_array = ensure_array_like(results());
          for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
            let product = each_array[$$index];
            $$renderer2.push(`<button class="flex items-center gap-6 p-6 bg-black border border-(--color-dark-border) hover:border-(--color-primary) transition-all text-left group"><div class="w-24 h-24 bg-white p-2 flex-shrink-0"><img${attr("src", product.variants[0]?.image_url || "/images/placeholder.png")}${attr("alt", product.name)} class="w-full h-full object-contain"/></div> <div class="flex-1"><span class="text-[0.65rem] font-black uppercase tracking-widest text-(--color-secondary)">Cat. No. ${escape_html(product.model_number)}</span> <h4 class="text-2xl font-black uppercase tracking-tighter text-white group-hover:text-(--color-primary) transition-colors">${html(highlight(product.name))}</h4> <p class="text-[0.6rem] font-bold uppercase tracking-widest text-(--color-dark-muted) mt-1">${escape_html(product.category)}</p></div> <div class="text-right"><div class="text-xl font-black text-(--color-primary)">$${escape_html((product.variants[0]?.price || 0).toFixed(2))}</div> <span class="text-[0.5rem] font-black uppercase tracking-widest text-(--color-dark-muted)">MSRP</span></div></button>`);
          }
          $$renderer2.push(`<!--]--></div>`);
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div></div></div></div>`);
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
    const categories = ["Tool Belts", "Pouches", "Aprons", "Accessories"];
    $$renderer2.push(`<footer class="bg-black border-t border-white/5 pt-32 pb-16 text-white antialiased"><div class="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-20"><div class="md:col-span-5 space-y-10"><button class="flex items-center space-x-6 hover:scale-105 transition-lux group"><div class="w-20 h-20 bg-dark-surface border border-white/5 p-0 rounded-sm group-hover:border-primary/40 transition-lux flex items-center justify-center overflow-hidden"><img${attr("src", `${stringify(base)}/images/logo-v3.png`)} alt="Protection Valley" class="w-full h-full object-contain"/></div> <div class="flex flex-col text-left"><span class="text-3xl font-serif text-white tracking-tight">Protection Valley</span> <span class="text-[0.6rem] font-bold uppercase tracking-[0.4em] text-primary">Est. 2025</span></div></button> <p class="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-zinc-500 leading-loose max-w-sm">Professional grade load-bearing equipment engineered for uncompromising durability. Handcrafted for the modern trade professional.</p> <div class="flex space-x-6 pt-4"><!--[-->`);
    const each_array = ensure_array_like([1, 2, 3]);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      each_array[$$index];
      $$renderer2.push(`<div class="w-10 h-10 bg-dark-surface border border-white/5 hover:border-primary/40 transition-lux cursor-pointer rounded-sm"></div>`);
    }
    $$renderer2.push(`<!--]--></div></div> <div class="md:col-span-2 space-y-8"><h3 class="text-[0.65rem] font-bold uppercase tracking-[0.4em] text-primary">Collection</h3> <ul class="space-y-4"><!--[-->`);
    const each_array_1 = ensure_array_like(categories);
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let cat = each_array_1[$$index_1];
      $$renderer2.push(`<li><button class="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-lux">${escape_html(cat)}</button></li>`);
    }
    $$renderer2.push(`<!--]--></ul></div> <div class="md:col-span-2 space-y-8"><h3 class="text-[0.65rem] font-bold uppercase tracking-[0.4em] text-primary">Company</h3> <ul class="space-y-4 text-[0.7rem] font-bold uppercase tracking-[0.3em] text-zinc-500"><li><button class="hover:text-white transition-lux">Support</button></li> <li><button class="hover:text-white transition-lux">Logistics</button></li> <li><button class="hover:text-white transition-lux">Warranty</button></li> <li><button class="hover:text-white transition-lux">Heritage</button></li></ul></div> <div class="md:col-span-3 space-y-8"><h3 class="text-[0.65rem] font-bold uppercase tracking-[0.4em] text-primary">Contact</h3> <div class="space-y-6"><div class="flex items-start space-x-4 group">`);
    Map_pin($$renderer2, {
      class: "w-4 h-4 text-zinc-600 group-hover:text-primary transition-lux mt-1"
    });
    $$renderer2.push(`<!----> <span class="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-zinc-500 leading-relaxed">1234 Industrial Way<br/>Los Angeles, CA 90001</span></div> <div class="flex items-center space-x-4 group">`);
    Phone($$renderer2, {
      class: "w-4 h-4 text-zinc-600 group-hover:text-primary transition-lux"
    });
    $$renderer2.push(`<!----> <span class="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-zinc-500">800-PRO-GEAR</span></div> <div class="flex items-center space-x-4 group">`);
    Mail($$renderer2, {
      class: "w-4 h-4 text-zinc-600 group-hover:text-primary transition-lux"
    });
    $$renderer2.push(`<!----> <span class="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-zinc-500">HQ@PROTECTIONVALLEY.COM</span></div></div></div></div> <div class="max-w-7xl mx-auto px-4 mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8"><p class="text-[0.6rem] font-bold uppercase tracking-[0.4em] text-zinc-700">© 2025 PROTECTION VALLEY // ALL RIGHTS RESERVED</p> <div class="flex space-x-8 text-[0.6rem] font-bold uppercase tracking-[0.4em] text-zinc-700"><button class="hover:text-white transition-lux">Privacy</button> <button class="hover:text-white transition-lux">Terms</button> <button class="hover:text-white transition-lux">Accessibility</button></div></div></footer>`);
  });
}
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { children } = $$props;
    Navbar($$renderer2);
    $$renderer2.push(`<!----> `);
    SearchOverlay($$renderer2);
    $$renderer2.push(`<!----> `);
    children($$renderer2);
    $$renderer2.push(`<!----> `);
    CartSidebar($$renderer2);
    $$renderer2.push(`<!----> `);
    Toast($$renderer2);
    $$renderer2.push(`<!----> `);
    Footer($$renderer2);
    $$renderer2.push(`<!---->`);
  });
}
export {
  _layout as default
};
