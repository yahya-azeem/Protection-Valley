import "clsx";
import "@sveltejs/kit/internal";
import "../../chunks/index.js";
import "../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import { s as sanitize_props, a as spread_props, b as slot, e as ensure_array_like, c as attr_class, d as stringify, f as store_get, g as escape_html, h as attr, u as unsubscribe_stores, i as derived } from "../../chunks/root.js";
import "../../chunks/exports.js";
import "../../chunks/state.svelte.js";
import { I as Icon, N as NAV_ITEMS, c as currentPage, a as cart, b as cartOpen, d as cartTotal, s as searchOpen, p as products, t as toastVisible, e as toastMessage, M as Map_pin, P as Phone, f as Mail, C as CATEGORIES, B as BUSINESS } from "../../chunks/phone.js";
import { b as base } from "../../chunks/server.js";
function html(value) {
  var html2 = String(value ?? "");
  var open = "<!---->";
  return open + html2 + "<!---->";
}
function Chevron_down($$renderer, $$props) {
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
  const iconNode = [["path", { "d": "m6 9 6 6 6-6" }]];
  Icon($$renderer, spread_props([
    { name: "chevron-down" },
    $$sanitized_props,
    {
      /**
       * @component @name ChevronDown
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtNiA5IDYgNiA2LTYiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/chevron-down
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
    let openDropdown = null;
    $$renderer2.push(`<nav class="bg-black border-b border-white/5 sticky top-0 z-[100] h-16 transition-lux"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full"><div class="flex items-center justify-between h-full relative"><div class="hidden lg:flex items-center gap-8 w-1/3"><!--[-->`);
    const each_array = ensure_array_like(NAV_ITEMS.slice(0, 2));
    for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
      let item = each_array[$$index_1];
      $$renderer2.push(`<div class="relative" role="navigation"><button${attr_class(`text-xs font-semibold uppercase tracking-[0.15em] py-4 flex items-center gap-1.5 transition-lux hover:text-primary ${stringify(store_get($$store_subs ??= {}, "$currentPage", currentPage) === item.id ? "text-primary" : "text-zinc-400")}`)}>${escape_html(item.name)}
              </button> `);
      if ("children" in item && item.children) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<button class="absolute -right-4 top-1/2 -translate-y-1/2 text-zinc-600">`);
        Chevron_down($$renderer2, { class: "w-3 h-3" });
        $$renderer2.push(`<!----></button>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if ("children" in item && item.children && openDropdown === item.id) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="absolute top-full left-0 mt-0 pt-2 z-50" role="menu"><div class="bg-[#0A0A0A] border border-white/10 rounded shadow-2xl min-w-[200px] py-2"><!--[-->`);
        const each_array_1 = ensure_array_like(item.children);
        for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
          let child = each_array_1[$$index];
          $$renderer2.push(`<button class="w-full text-left px-5 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-lux" role="menuitem">${escape_html(child.name)}</button>`);
        }
        $$renderer2.push(`<!--]--></div></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="absolute left-1/2 -translate-x-1/2 h-full flex items-center"><button class="hover:scale-105 transition-lux"><img${attr("src", `${stringify(base)}/images/logo-v3.png`)} alt="Protection Valley" class="h-14 w-auto"/></button></div> <div class="hidden lg:flex items-center justify-end gap-8 w-1/3"><div class="flex items-center gap-8"><!--[-->`);
    const each_array_2 = ensure_array_like(NAV_ITEMS.slice(2));
    for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
      let item = each_array_2[$$index_2];
      $$renderer2.push(`<button${attr_class(`text-xs font-semibold uppercase tracking-[0.15em] transition-lux hover:text-primary ${stringify(store_get($$store_subs ??= {}, "$currentPage", currentPage) === item.id ? "text-primary" : "text-zinc-400")}`)}>${escape_html(item.name)}</button>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="flex items-center gap-5 border-l border-white/10 pl-8"><button class="text-zinc-400 hover:text-primary transition-lux" aria-label="Search">`);
    Search($$renderer2, { class: "w-[18px] h-[18px]" });
    $$renderer2.push(`<!----></button> <button class="text-zinc-400 hover:text-primary transition-lux" aria-label="Account">`);
    User($$renderer2, { class: "w-[18px] h-[18px]" });
    $$renderer2.push(`<!----></button> <button class="relative flex items-center gap-2 text-zinc-400 hover:text-primary transition-lux" aria-label="Cart"><span class="text-xs font-semibold uppercase tracking-[0.1em]">Cart</span> <div class="relative">`);
    Shopping_bag($$renderer2, { class: "w-[18px] h-[18px]" });
    $$renderer2.push(`<!----> `);
    if (store_get($$store_subs ??= {}, "$cart", cart).length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="absolute -top-1.5 -right-1.5 bg-primary text-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">${escape_html(store_get($$store_subs ??= {}, "$cart", cart).length)}</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></button></div></div> <div class="lg:hidden flex items-center justify-between w-full"><button class="text-white" aria-label="Menu">`);
    Menu($$renderer2, { class: "w-6 h-6" });
    $$renderer2.push(`<!----></button> <button class="absolute left-1/2 -translate-x-1/2 h-full flex items-center"><img${attr("src", `${stringify(base)}/images/logo-v3.png`)} alt="Logo" class="h-12 w-auto"/></button> <button class="text-white relative flex items-center gap-2"><div class="relative">`);
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
      $$renderer2.push(`<div class="fixed inset-0 z-[100]"><div class="absolute inset-0 bg-black/80 backdrop-blur-sm" role="button" tabindex="0"></div> <div class="absolute right-0 top-0 h-full w-full max-w-md bg-[#0A0A0A] shadow-2xl flex flex-col border-l border-white/10 animate-slide-in-right svelte-1ob2s9q"><div class="flex items-center justify-between p-6 bg-black border-b border-white/10"><div class="flex items-center gap-4"><div class="w-10 h-10 bg-primary/10 flex items-center justify-center rounded">`);
      Shopping_bag($$renderer2, { class: "w-5 h-5 text-primary" });
      $$renderer2.push(`<!----></div> <div><h2 class="text-xl font-serif text-white">Cart</h2> <p class="text-xs text-zinc-500">${escape_html(store_get($$store_subs ??= {}, "$cart", cart).length)} item${escape_html(store_get($$store_subs ??= {}, "$cart", cart).length !== 1 ? "s" : "")}</p></div></div> <button class="p-1 text-zinc-500 hover:text-white transition-lux">`);
      X($$renderer2, { class: "w-6 h-6" });
      $$renderer2.push(`<!----></button></div> <div class="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">`);
      if (store_get($$store_subs ??= {}, "$cart", cart).length === 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="h-full flex flex-col items-center justify-center text-center"><div class="w-16 h-16 bg-[#111] rounded-full flex items-center justify-center mb-6 border border-white/5">`);
        Shopping_bag($$renderer2, { class: "w-7 h-7 text-zinc-700" });
        $$renderer2.push(`<!----></div> <p class="text-sm text-zinc-500 mb-4">Your cart is empty</p> <button class="text-sm font-semibold text-primary hover:text-white transition-lux">Continue Shopping</button></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<!--[-->`);
        const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$cart", cart));
        for (let i = 0, $$length = each_array.length; i < $$length; i++) {
          let item = each_array[i];
          $$renderer2.push(`<div class="group flex gap-4 bg-black border border-white/10 p-4 hover:border-primary/20 transition-lux rounded"><div class="w-20 h-20 bg-[#0A0A0A] p-1 border border-white/5 flex-shrink-0 rounded"><img${attr("src", item.image)}${attr("alt", item.name)} class="w-full h-full object-contain"/></div> <div class="flex-1 min-w-0 flex flex-col justify-between"><div class="flex justify-between items-start"><h3 class="text-sm font-medium text-white leading-tight pr-2">${escape_html(item.name)}</h3> <button class="text-zinc-600 hover:text-primary transition-lux flex-shrink-0">`);
          Trash_2($$renderer2, { class: "w-4 h-4" });
          $$renderer2.push(`<!----></button></div> <div class="space-y-2">`);
          if (item.size || item.color) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<p class="text-xs text-zinc-500">${escape_html([item.size, item.color].filter(Boolean).join(" / "))}</p>`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--> <div class="flex items-center justify-between"><div class="flex items-center bg-[#111] border border-white/5 rounded overflow-hidden"><button class="px-3 py-1 text-xs text-zinc-400 hover:text-primary transition-lux">−</button> <span class="px-2 text-xs font-semibold text-white w-6 text-center">${escape_html(item.quantity)}</span> <button class="px-3 py-1 text-xs text-zinc-400 hover:text-primary transition-lux">+</button></div> <span class="text-base font-serif text-primary">$${escape_html((item.price * item.quantity).toFixed(2))}</span></div></div></div></div>`);
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></div> `);
      if (store_get($$store_subs ??= {}, "$cart", cart).length > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="bg-black p-6 border-t border-white/10 space-y-4"><div class="flex justify-between items-center"><span class="text-sm text-zinc-500">Total</span> <span class="text-2xl font-serif text-primary">$${escape_html(store_get($$store_subs ??= {}, "$cartTotal", cartTotal).toFixed(2))}</span></div> <button class="btn-primary w-full py-4 text-sm tracking-[0.15em]">CHECKOUT</button></div>`);
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
      $$renderer2.push(`<!----> <input type="text"${attr("value", query)} placeholder="SEARCH BY MODEL, SKU, OR NOMENCLATURE..." class="w-full pl-20 pr-8 py-6 bg-black border border-(--color-dark-border) focus:border-(--color-primary) text-3xl font-black uppercase tracking-tighter text-white outline-none placeholder:text-(--color-dark-muted)"/></div> `);
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
    $$renderer2.push(`<footer class="bg-black border-t border-white/5 pt-20 pb-12 text-white antialiased"><div class="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-16"><div class="md:col-span-5 space-y-6"><button class="flex items-center gap-4 hover:scale-105 transition-lux group"><div class="w-16 h-16 bg-[#0A0A0A] border border-white/10 rounded group-hover:border-primary/40 transition-lux flex items-center justify-center overflow-hidden"><img${attr("src", `${stringify(base)}/images/logo-v3.png`)} alt="Protection Valley" class="w-full h-full object-contain"/></div> <div class="flex flex-col text-left"><span class="text-xl font-serif text-white">${escape_html(BUSINESS.name)}</span> <span class="text-[11px] font-semibold uppercase tracking-[0.15em] text-primary">Est. ${escape_html(BUSINESS.established)}</span></div></button> <p class="text-sm text-zinc-500 leading-relaxed max-w-sm">Professional grade load-bearing equipment engineered for uncompromising durability. Handcrafted for the modern trade professional.</p></div> <div class="md:col-span-2 space-y-4"><h3 class="text-xs font-bold uppercase tracking-[0.15em] text-primary">Catalog</h3> <ul class="space-y-2"><!--[-->`);
    const each_array = ensure_array_like(CATEGORIES.filter((c) => c !== "All"));
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let cat = each_array[$$index];
      $$renderer2.push(`<li><button class="text-sm text-zinc-500 hover:text-white transition-lux">${escape_html(cat)}</button></li>`);
    }
    $$renderer2.push(`<!--]--></ul></div> <div class="md:col-span-2 space-y-4"><h3 class="text-xs font-bold uppercase tracking-[0.15em] text-primary">Company</h3> <ul class="space-y-2 text-sm text-zinc-500"><li><button class="hover:text-white transition-lux">Support</button></li> <li><button class="hover:text-white transition-lux">Logistics</button></li> <li><button class="hover:text-white transition-lux">Warranty</button></li> <li><button class="hover:text-white transition-lux">Heritage</button></li></ul></div> <div class="md:col-span-3 space-y-4"><h3 class="text-xs font-bold uppercase tracking-[0.15em] text-primary">Contact</h3> <div class="space-y-4"><div class="flex items-start gap-3 group">`);
    Map_pin($$renderer2, {
      class: "w-4 h-4 text-zinc-600 group-hover:text-primary transition-lux mt-0.5 flex-shrink-0"
    });
    $$renderer2.push(`<!----> <span class="text-sm text-zinc-500 leading-relaxed">${escape_html(BUSINESS.address.full)}</span></div> <div class="flex items-center gap-3 group">`);
    Phone($$renderer2, {
      class: "w-4 h-4 text-zinc-600 group-hover:text-primary transition-lux flex-shrink-0"
    });
    $$renderer2.push(`<!----> <span class="text-sm text-zinc-500">${escape_html(BUSINESS.phone)}</span></div> <div class="flex items-center gap-3 group">`);
    Mail($$renderer2, {
      class: "w-4 h-4 text-zinc-600 group-hover:text-primary transition-lux flex-shrink-0"
    });
    $$renderer2.push(`<!----> <span class="text-sm text-zinc-500">${escape_html(BUSINESS.email)}</span></div></div></div></div> <div class="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4"><p class="text-xs text-zinc-600">© ${escape_html(BUSINESS.established)} ${escape_html(BUSINESS.name.toUpperCase())} — ALL RIGHTS RESERVED</p> <div class="flex gap-6 text-xs text-zinc-600"><button class="hover:text-white transition-lux">Privacy</button> <button class="hover:text-white transition-lux">Terms</button> <button class="hover:text-white transition-lux">Accessibility</button></div></div></footer>`);
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
