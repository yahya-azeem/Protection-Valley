import { s as sanitize_props, a as spread_props, b as slot, h as attr, g as escape_html, f as store_get, u as unsubscribe_stores, i as derived, e as ensure_array_like, d as stringify, c as attr_class, k as head } from "../../chunks/root.js";
import "../../chunks/index.js";
import "@sveltejs/kit/internal/server";
import { I as Icon, W as WHOLESALE_DISCOUNT, i as isWholesale, p as products, C as CATEGORIES, g as currentCategory, h as PRICE_RANGES, j as priceRange, S as SIZES, k as sizeFilter, l as filteredProducts, m as selectedColor, n as selectedSize, o as selectedProduct, q as selectedTexture, M as Map_pin, P as Phone, f as Mail, B as BUSINESS, c as currentPage } from "../../chunks/phone.js";
import { b as base } from "../../chunks/server.js";
import "clsx";
function Award($$renderer, $$props) {
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
        "d": "m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"
      }
    ],
    ["circle", { "cx": "12", "cy": "8", "r": "6" }]
  ];
  Icon($$renderer, spread_props([
    { name: "award" },
    $$sanitized_props,
    {
      /**
       * @component @name Award
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTUuNDc3IDEyLjg5IDEuNTE1IDguNTI2YS41LjUgMCAwIDEtLjgxLjQ3bC0zLjU4LTIuNjg3YTEgMSAwIDAgMC0xLjE5NyAwbC0zLjU4NiAyLjY4NmEuNS41IDAgMCAxLS44MS0uNDY5bDEuNTE0LTguNTI2IiAvPgogIDxjaXJjbGUgY3g9IjEyIiBjeT0iOCIgcj0iNiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/award
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
function Boxes($$renderer, $$props) {
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
        "d": "M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z"
      }
    ],
    ["path", { "d": "m7 16.5-4.74-2.85" }],
    ["path", { "d": "m7 16.5 5-3" }],
    ["path", { "d": "M7 16.5v5.17" }],
    [
      "path",
      {
        "d": "M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z"
      }
    ],
    ["path", { "d": "m17 16.5-5-3" }],
    ["path", { "d": "m17 16.5 4.74-2.85" }],
    ["path", { "d": "M17 16.5v5.17" }],
    [
      "path",
      {
        "d": "M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z"
      }
    ],
    ["path", { "d": "M12 8 7.26 5.15" }],
    ["path", { "d": "m12 8 4.74-2.85" }],
    ["path", { "d": "M12 13.5V8" }]
  ];
  Icon($$renderer, spread_props([
    { name: "boxes" },
    $$sanitized_props,
    {
      /**
       * @component @name Boxes
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMi45NyAxMi45MkEyIDIgMCAwIDAgMiAxNC42M3YzLjI0YTIgMiAwIDAgMCAuOTcgMS43MWwzIDEuOGEyIDIgMCAwIDAgMi4wNiAwTDEyIDE5di01LjVsLTUtMy00LjAzIDIuNDJaIiAvPgogIDxwYXRoIGQ9Im03IDE2LjUtNC43NC0yLjg1IiAvPgogIDxwYXRoIGQ9Im03IDE2LjUgNS0zIiAvPgogIDxwYXRoIGQ9Ik03IDE2LjV2NS4xNyIgLz4KICA8cGF0aCBkPSJNMTIgMTMuNVYxOWwzLjk3IDIuMzhhMiAyIDAgMCAwIDIuMDYgMGwzLTEuOGEyIDIgMCAwIDAgLjk3LTEuNzF2LTMuMjRhMiAyIDAgMCAwLS45Ny0xLjcxTDE3IDEwLjVsLTUgM1oiIC8+CiAgPHBhdGggZD0ibTE3IDE2LjUtNS0zIiAvPgogIDxwYXRoIGQ9Im0xNyAxNi41IDQuNzQtMi44NSIgLz4KICA8cGF0aCBkPSJNMTcgMTYuNXY1LjE3IiAvPgogIDxwYXRoIGQ9Ik03Ljk3IDQuNDJBMiAyIDAgMCAwIDcgNi4xM3Y0LjM3bDUgMyA1LTNWNi4xM2EyIDIgMCAwIDAtLjk3LTEuNzFsLTMtMS44YTIgMiAwIDAgMC0yLjA2IDBsLTMgMS44WiIgLz4KICA8cGF0aCBkPSJNMTIgOCA3LjI2IDUuMTUiIC8+CiAgPHBhdGggZD0ibTEyIDggNC43NC0yLjg1IiAvPgogIDxwYXRoIGQ9Ik0xMiAxMy41VjgiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/boxes
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
function Chevron_right($$renderer, $$props) {
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
  const iconNode = [["path", { "d": "m9 18 6-6-6-6" }]];
  Icon($$renderer, spread_props([
    { name: "chevron-right" },
    $$sanitized_props,
    {
      /**
       * @component @name ChevronRight
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtOSAxOCA2LTYtNi02IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/chevron-right
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
function Filter($$renderer, $$props) {
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
      "polygon",
      { "points": "22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "filter" },
    $$sanitized_props,
    {
      /**
       * @component @name Filter
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cG9seWdvbiBwb2ludHM9IjIyIDMgMiAzIDEwIDEyLjQ2IDEwIDE5IDE0IDIxIDE0IDEyLjQ2IDIyIDMiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/filter
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
function Globe($$renderer, $$props) {
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
    ["circle", { "cx": "12", "cy": "12", "r": "10" }],
    [
      "path",
      { "d": "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" }
    ],
    ["path", { "d": "M2 12h20" }]
  ];
  Icon($$renderer, spread_props([
    { name: "globe" },
    $$sanitized_props,
    {
      /**
       * @component @name Globe
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8cGF0aCBkPSJNMTIgMmExNC41IDE0LjUgMCAwIDAgMCAyMCAxNC41IDE0LjUgMCAwIDAgMC0yMCIgLz4KICA8cGF0aCBkPSJNMiAxMmgyMCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/globe
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
function Package_x($$renderer, $$props) {
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
        "d": "M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"
      }
    ],
    ["path", { "d": "m7.5 4.27 9 5.15" }],
    ["polyline", { "points": "3.29 7 12 12 20.71 7" }],
    ["line", { "x1": "12", "x2": "12", "y1": "22", "y2": "12" }],
    ["path", { "d": "m17 13 5 5m-5 0 5-5" }]
  ];
  Icon($$renderer, spread_props([
    { name: "package-x" },
    $$sanitized_props,
    {
      /**
       * @component @name PackageX
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjEgMTBWOGEyIDIgMCAwIDAtMS0xLjczbC03LTRhMiAyIDAgMCAwLTIgMGwtNyA0QTIgMiAwIDAgMCAzIDh2OGEyIDIgMCAwIDAgMSAxLjczbDcgNGEyIDIgMCAwIDAgMiAwbDItMS4xNCIgLz4KICA8cGF0aCBkPSJtNy41IDQuMjcgOSA1LjE1IiAvPgogIDxwb2x5bGluZSBwb2ludHM9IjMuMjkgNyAxMiAxMiAyMC43MSA3IiAvPgogIDxsaW5lIHgxPSIxMiIgeDI9IjEyIiB5MT0iMjIiIHkyPSIxMiIgLz4KICA8cGF0aCBkPSJtMTcgMTMgNSA1bS01IDAgNS01IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/package-x
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
function Package($$renderer, $$props) {
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
        "d": "M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"
      }
    ],
    ["path", { "d": "M12 22V12" }],
    ["polyline", { "points": "3.29 7 12 12 20.71 7" }],
    ["path", { "d": "m7.5 4.27 9 5.15" }]
  ];
  Icon($$renderer, spread_props([
    { name: "package" },
    $$sanitized_props,
    {
      /**
       * @component @name Package
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTEgMjEuNzNhMiAyIDAgMCAwIDIgMGw3LTRBMiAyIDAgMCAwIDIxIDE2VjhhMiAyIDAgMCAwLTEtMS43M2wtNy00YTIgMiAwIDAgMC0yIDBsLTcgNEEyIDIgMCAwIDAgMyA4djhhMiAyIDAgMCAwIDEgMS43M3oiIC8+CiAgPHBhdGggZD0iTTEyIDIyVjEyIiAvPgogIDxwb2x5bGluZSBwb2ludHM9IjMuMjkgNyAxMiAxMiAyMC43MSA3IiAvPgogIDxwYXRoIGQ9Im03LjUgNC4yNyA5IDUuMTUiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/package
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
function Rotate_ccw($$renderer, $$props) {
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
      { "d": "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }
    ],
    ["path", { "d": "M3 3v5h5" }]
  ];
  Icon($$renderer, spread_props([
    { name: "rotate-ccw" },
    $$sanitized_props,
    {
      /**
       * @component @name RotateCcw
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMyAxMmE5IDkgMCAxIDAgOS05IDkuNzUgOS43NSAwIDAgMC02Ljc0IDIuNzRMMyA4IiAvPgogIDxwYXRoIGQ9Ik0zIDN2NWg1IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/rotate-ccw
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
function Shield_check($$renderer, $$props) {
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
    ],
    ["path", { "d": "m9 12 2 2 4-4" }]
  ];
  Icon($$renderer, spread_props([
    { name: "shield-check" },
    $$sanitized_props,
    {
      /**
       * @component @name ShieldCheck
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjAgMTNjMCA1LTMuNSA3LjUtNy42NiA4Ljk1YTEgMSAwIDAgMS0uNjctLjAxQzcuNSAyMC41IDQgMTggNCAxM1Y2YTEgMSAwIDAgMSAxLTFjMiAwIDQuNS0xLjIgNi4yNC0yLjcyYTEuMTcgMS4xNyAwIDAgMSAxLjUyIDBDMTQuNTEgMy44MSAxNyA1IDE5IDVhMSAxIDAgMCAxIDEgMXoiIC8+CiAgPHBhdGggZD0ibTkgMTIgMiAyIDQtNCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/shield-check
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
function Truck($$renderer, $$props) {
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
        "d": "M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"
      }
    ],
    ["path", { "d": "M15 18H9" }],
    [
      "path",
      {
        "d": "M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"
      }
    ],
    ["circle", { "cx": "17", "cy": "18", "r": "2" }],
    ["circle", { "cx": "7", "cy": "18", "r": "2" }]
  ];
  Icon($$renderer, spread_props([
    { name: "truck" },
    $$sanitized_props,
    {
      /**
       * @component @name Truck
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTQgMThWNmEyIDIgMCAwIDAtMi0ySDRhMiAyIDAgMCAwLTIgMnYxMWExIDEgMCAwIDAgMSAxaDIiIC8+CiAgPHBhdGggZD0iTTE1IDE4SDkiIC8+CiAgPHBhdGggZD0iTTE5IDE4aDJhMSAxIDAgMCAwIDEtMXYtMy42NWExIDEgMCAwIDAtLjIyLS42MjRsLTMuNDgtNC4zNUExIDEgMCAwIDAgMTcuNTIgOEgxNCIgLz4KICA8Y2lyY2xlIGN4PSIxNyIgY3k9IjE4IiByPSIyIiAvPgogIDxjaXJjbGUgY3g9IjciIGN5PSIxOCIgcj0iMiIgLz4KPC9zdmc+) - https://lucide.dev/icons/truck
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
function Users($$renderer, $$props) {
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
    ["path", { "d": "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }],
    ["circle", { "cx": "9", "cy": "7", "r": "4" }],
    ["path", { "d": "M22 21v-2a4 4 0 0 0-3-3.87" }],
    ["path", { "d": "M16 3.13a4 4 0 0 1 0 7.75" }]
  ];
  Icon($$renderer, spread_props([
    { name: "users" },
    $$sanitized_props,
    {
      /**
       * @component @name Users
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTYgMjF2LTJhNCA0IDAgMCAwLTQtNEg2YTQgNCAwIDAgMC00IDR2MiIgLz4KICA8Y2lyY2xlIGN4PSI5IiBjeT0iNyIgcj0iNCIgLz4KICA8cGF0aCBkPSJNMjIgMjF2LTJhNCA0IDAgMCAwLTMtMy44NyIgLz4KICA8cGF0aCBkPSJNMTYgMy4xM2E0IDQgMCAwIDEgMCA3Ljc1IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/users
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
function ProductCard($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { product } = $$props;
    let displayVariant = derived(() => product.variants?.[0]);
    let price = derived(() => displayVariant()?.price || 0);
    let image = derived(() => displayVariant()?.image_url || `${base}/images/placeholder.png`);
    $$renderer2.push(`<button class="group flex flex-col w-full text-left transition-lux rounded overflow-hidden border-2 border-white/20 bg-[#0A0A0A] hover:border-primary/60 hover:shadow-gold"><div class="relative aspect-square overflow-hidden bg-black flex items-center justify-center"><img${attr("src", image())}${attr("alt", product.name)} class="w-full h-full object-cover transition-lux duration-700 group-hover:scale-105"/> <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60"></div></div> <div class="p-5 flex flex-col gap-2 border-t-2 border-white/10"><span class="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">${escape_html(product.category)}</span> <h3 class="text-base font-serif text-white group-hover:text-primary transition-lux leading-snug">${escape_html(product.name)}</h3> `);
    if (displayVariant()?.texture) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="text-[11px] text-zinc-500">${escape_html(displayVariant().texture)}</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="pt-1 flex items-center justify-between"><div class="flex items-baseline gap-2"><span class="text-lg font-serif text-white">$${escape_html(store_get($$store_subs ??= {}, "$isWholesale", isWholesale) ? (price() * (1 - WHOLESALE_DISCOUNT)).toFixed(2) : price().toFixed(2))}</span> `);
    if (store_get($$store_subs ??= {}, "$isWholesale", isWholesale)) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="text-xs text-zinc-600 line-through">$${escape_html(price().toFixed(2))}</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-primary transition-lux group-hover:border-primary"><span class="text-primary group-hover:text-black text-sm">→</span></div></div></div></button>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function Home($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let featured = derived(() => store_get($$store_subs ??= {}, "$products", products).slice(0, 4));
    $$renderer2.push(`<div class="bg-black min-h-screen text-white antialiased"><section class="relative h-screen flex items-center justify-center overflow-hidden"><div class="absolute inset-0 z-0"><img${attr("src", `${stringify(base)}/images/hero-bg.jpg`)} alt="Protection Valley" class="w-full h-full object-cover opacity-60 grayscale-[10%]"/> <div class="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60"></div></div> <div class="relative z-10 max-w-5xl mx-auto px-4 text-center"><span class="text-primary text-xs font-semibold uppercase tracking-[0.3em] mb-8 block animate-fade-in">HANDCRAFTED IN USA</span> <h1 class="text-6xl md:text-8xl font-serif text-white mb-10 animate-fade-in leading-[0.9] tracking-tighter" style="animation-delay: 0.2s">Built for the<br/><span class="italic text-primary">Generation.</span></h1> <p class="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-12 animate-fade-in font-serif italic leading-relaxed" style="animation-delay: 0.4s">Premium leather and canvas workgear engineered to outlast the most demanding environments.</p> <div class="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style="animation-delay: 0.6s"><button class="btn-primary text-sm tracking-[0.2em]">VIEW CATALOG</button> <button class="btn-secondary text-sm tracking-[0.2em]">OUR HERITAGE</button></div></div> <div class="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-20"><div class="w-[1px] h-24 bg-gradient-to-b from-primary to-transparent"></div></div></section> <section class="py-24 bg-[#0A0A0A] border-y border-white/5"><div class="max-w-7xl mx-auto px-4"><div class="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"><div class="space-y-3"><span class="text-primary text-xs font-semibold uppercase tracking-[0.2em]">ESTABLISHED QUALITY</span> <h2 class="text-5xl font-serif tracking-tight">Best Sellers</h2></div> <button class="text-sm font-semibold text-zinc-500 hover:text-white transition-lux border-b border-white/10 pb-2">Explore All →</button></div> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"><!--[-->`);
    const each_array = ensure_array_like(featured());
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let product = each_array[$$index];
      ProductCard($$renderer2, { product });
    }
    $$renderer2.push(`<!--]--></div></div></section></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function Catalog($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let sortBy = "featured";
    let sortedProducts = derived(() => {
      const list = [
        ...store_get($$store_subs ??= {}, "$filteredProducts", filteredProducts)
      ];
      switch (sortBy) {
        case "price-low":
          return list.sort((a, b) => (a.variants[0]?.price || 0) - (b.variants[0]?.price || 0));
        case "price-high":
          return list.sort((a, b) => (b.variants[0]?.price || 0) - (a.variants[0]?.price || 0));
        case "name":
          return list.sort((a, b) => a.name.localeCompare(b.name));
        default:
          return list;
      }
    });
    $$renderer2.push(`<div class="bg-black min-h-screen"><div class="lg:hidden sticky top-16 z-30 bg-black border-b border-white/10 px-4 py-3 flex items-center justify-between"><span class="text-sm font-semibold text-white">${escape_html(sortedProducts().length)} Products</span> <button class="flex items-center gap-2 text-sm font-semibold text-primary">`);
    Filter($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----> Filters</button></div> <div class="max-w-7xl mx-auto px-4 py-8 lg:py-12"><div class="flex gap-8"><aside class="hidden lg:block w-64 flex-shrink-0 space-y-8 sticky top-28 self-start"><div><h3 class="text-xs font-bold uppercase tracking-[0.15em] text-zinc-400 mb-4">Category</h3> <div class="space-y-1"><!--[-->`);
    const each_array = ensure_array_like(CATEGORIES);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let cat = each_array[$$index];
      $$renderer2.push(`<button${attr_class(`block w-full text-left px-3 py-2 rounded text-sm transition-lux ${stringify(store_get($$store_subs ??= {}, "$currentCategory", currentCategory) === cat ? "bg-primary/10 text-primary font-semibold border-l-2 border-primary" : "text-zinc-400 hover:text-white hover:bg-white/5")}`)}>${escape_html(cat)}</button>`);
    }
    $$renderer2.push(`<!--]--></div></div> <div><h3 class="text-xs font-bold uppercase tracking-[0.15em] text-zinc-400 mb-4">Price Range</h3> <div class="space-y-1"><!--[-->`);
    const each_array_1 = ensure_array_like(PRICE_RANGES);
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let range = each_array_1[$$index_1];
      $$renderer2.push(`<button${attr_class(`block w-full text-left px-3 py-2 rounded text-sm transition-lux ${stringify(store_get($$store_subs ??= {}, "$priceRange", priceRange).min === range.min && store_get($$store_subs ??= {}, "$priceRange", priceRange).max === range.max ? "bg-primary/10 text-primary font-semibold border-l-2 border-primary" : "text-zinc-400 hover:text-white hover:bg-white/5")}`)}>${escape_html(range.label)}</button>`);
    }
    $$renderer2.push(`<!--]--></div></div> <div><h3 class="text-xs font-bold uppercase tracking-[0.15em] text-zinc-400 mb-4">Size</h3> <div class="flex flex-wrap gap-2"><!--[-->`);
    const each_array_2 = ensure_array_like(SIZES);
    for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
      let size = each_array_2[$$index_2];
      $$renderer2.push(`<button${attr_class(`px-3 py-1.5 text-xs font-semibold rounded border transition-lux ${stringify(store_get($$store_subs ??= {}, "$sizeFilter", sizeFilter) === size ? "bg-primary text-black border-primary" : "border-white/10 text-zinc-400 hover:border-white/30 hover:text-white")}`)}>${escape_html(size)}</button>`);
    }
    $$renderer2.push(`<!--]--></div></div></aside> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="flex-1 min-w-0"><div class="hidden lg:flex items-center justify-between mb-8"><p class="text-sm text-zinc-500">${escape_html(sortedProducts().length)} product${escape_html(sortedProducts().length !== 1 ? "s" : "")}</p> `);
    $$renderer2.select(
      {
        value: sortBy,
        class: "bg-transparent border border-white/10 text-sm text-white py-2 px-4 rounded focus:border-primary outline-none cursor-pointer transition-lux"
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "featured" }, ($$renderer4) => {
          $$renderer4.push(`Featured`);
        });
        $$renderer3.option({ value: "price-low" }, ($$renderer4) => {
          $$renderer4.push(`Price: Low → High`);
        });
        $$renderer3.option({ value: "price-high" }, ($$renderer4) => {
          $$renderer4.push(`Price: High → Low`);
        });
        $$renderer3.option({ value: "name" }, ($$renderer4) => {
          $$renderer4.push(`Name A–Z`);
        });
      }
    );
    $$renderer2.push(`</div> `);
    if (sortedProducts().length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"><!--[-->`);
      const each_array_6 = ensure_array_like(sortedProducts());
      for (let $$index_6 = 0, $$length = each_array_6.length; $$index_6 < $$length; $$index_6++) {
        let product = each_array_6[$$index_6];
        ProductCard($$renderer2, { product });
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="flex flex-col items-center justify-center py-32 bg-[#0A0A0A] border border-white/10 rounded">`);
      Package_x($$renderer2, { class: "w-12 h-12 text-zinc-700 mb-6" });
      $$renderer2.push(`<!----> <h3 class="text-lg font-serif text-zinc-500">No products match your filters</h3> <button class="mt-6 text-sm font-semibold text-primary hover:text-white transition-lux">Reset All Filters</button></div>`);
    }
    $$renderer2.push(`<!--]--></div></div></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function ProductDetail($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let sp = derived(() => store_get($$store_subs ??= {}, "$selectedProduct", selectedProduct));
    let colors = derived(() => Array.from(new Set(sp()?.variants.map((v) => v.color).filter(Boolean))));
    let sizes = derived(() => Array.from(new Set(sp()?.variants.map((v) => v.size).filter(Boolean))));
    let currentVariant = derived(() => {
      if (!sp()) return null;
      return sp().variants.find((v) => (!store_get($$store_subs ??= {}, "$selectedColor", selectedColor) || v.color === store_get($$store_subs ??= {}, "$selectedColor", selectedColor)) && (!store_get($$store_subs ??= {}, "$selectedSize", selectedSize) || v.size === store_get($$store_subs ??= {}, "$selectedSize", selectedSize)) && (!store_get($$store_subs ??= {}, "$selectedTexture", selectedTexture) || v.texture === store_get($$store_subs ??= {}, "$selectedTexture", selectedTexture))) || sp().variants[0];
    });
    if (sp()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="bg-black min-h-screen"><div class="bg-[#0A0A0A] border-b border-white/5 py-3"><div class="max-w-7xl mx-auto px-4 flex items-center gap-3 text-sm text-zinc-500"><button class="hover:text-primary transition-lux">Catalog</button> `);
      Chevron_right($$renderer2, { class: "w-3 h-3 opacity-30" });
      $$renderer2.push(`<!----> <span>${escape_html(store_get($$store_subs ??= {}, "$currentCategory", currentCategory))}</span> `);
      Chevron_right($$renderer2, { class: "w-3 h-3 opacity-30" });
      $$renderer2.push(`<!----> <span class="text-white">${escape_html(sp().name)}</span></div></div> <div class="max-w-7xl mx-auto px-4 py-12 lg:py-16"><div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start"><div class="space-y-4 lg:sticky lg:top-24"><div class="aspect-square bg-[#0A0A0A] border border-white/10 rounded overflow-hidden group"><img${attr("src", currentVariant()?.image_url || "/images/placeholder.png")}${attr("alt", sp().name)} class="w-full h-full object-cover transition-lux duration-700 group-hover:scale-105"/></div> <div class="grid grid-cols-4 gap-3"><!--[-->`);
      const each_array = ensure_array_like(sp().variants.slice(0, 4));
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let variant = each_array[$$index];
        $$renderer2.push(`<button${attr_class(`aspect-square bg-[#0A0A0A] border-2 transition-lux rounded ${stringify(currentVariant()?.id === variant.id ? "border-primary" : "border-white/10 opacity-50 hover:opacity-100")}`)}><img${attr("src", variant.image_url)} alt="Variant" class="w-full h-full object-cover rounded"/></button>`);
      }
      $$renderer2.push(`<!--]--></div></div> <div class="flex flex-col"><span class="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-3">${escape_html(sp().category)}</span> <h1 class="text-4xl lg:text-5xl font-serif text-white mb-4 leading-tight">${escape_html(sp().name)}</h1> <p class="text-base text-zinc-400 leading-relaxed mb-8 border-l-2 border-primary/20 pl-5">${escape_html(sp().description || "Premium handcrafted workgear built for the modern professional.")}</p> <div class="flex items-baseline gap-4 mb-2"><span class="text-4xl font-serif text-primary">$${escape_html((store_get($$store_subs ??= {}, "$isWholesale", isWholesale) ? (currentVariant()?.price || 0) * (1 - WHOLESALE_DISCOUNT) : currentVariant()?.price || 0).toFixed(2))}</span> `);
      if (store_get($$store_subs ??= {}, "$isWholesale", isWholesale)) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<span class="text-lg text-zinc-600 line-through">$${escape_html((currentVariant()?.price || 0).toFixed(2))}</span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div> <p class="text-xs text-zinc-500 mb-8">${escape_html(store_get($$store_subs ??= {}, "$isWholesale", isWholesale) ? "Wholesale rate" : "Retail price")} · ${escape_html(currentVariant()?.texture || "")}</p> <div class="space-y-6 mb-8">`);
      if (colors().length > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div><span class="block text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400 mb-3">Color</span> <div class="flex flex-wrap gap-2"><!--[-->`);
        const each_array_1 = ensure_array_like(colors());
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let color = each_array_1[$$index_1];
          $$renderer2.push(`<button${attr_class(`px-5 py-2.5 text-sm font-medium border rounded transition-lux ${stringify(store_get($$store_subs ??= {}, "$selectedColor", selectedColor) === color ? "bg-primary text-black border-primary" : "bg-[#0A0A0A] border-white/10 text-zinc-400 hover:border-white/30 hover:text-white")}`)}>${escape_html(color)}</button>`);
        }
        $$renderer2.push(`<!--]--></div></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (sizes().length > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div><span class="block text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400 mb-3">Size</span> <div class="flex flex-wrap gap-2"><!--[-->`);
        const each_array_2 = ensure_array_like(sizes());
        for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
          let size = each_array_2[$$index_2];
          $$renderer2.push(`<button${attr_class(`px-5 py-2.5 text-sm font-medium border rounded transition-lux ${stringify(store_get($$store_subs ??= {}, "$selectedSize", selectedSize) === size ? "bg-primary text-black border-primary" : "bg-[#0A0A0A] border-white/10 text-zinc-400 hover:border-white/30 hover:text-white")}`)}>${escape_html(size)}</button>`);
        }
        $$renderer2.push(`<!--]--></div></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div> <div class="flex flex-col sm:flex-row gap-3 mb-10"><button${attr("disabled", !currentVariant(), true)} class="btn-primary py-4 px-8 flex items-center justify-center gap-3 text-sm font-bold tracking-[0.1em]">`);
      Shopping_cart($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----> ADD TO CART</button> `);
      if (store_get($$store_subs ??= {}, "$isWholesale", isWholesale)) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<button class="bg-white text-black py-4 px-8 flex items-center justify-center gap-3 text-sm font-bold tracking-[0.1em] hover:bg-zinc-200 transition-lux rounded-sm">`);
        Boxes($$renderer2, { class: "w-4 h-4" });
        $$renderer2.push(`<!----> BULK ORDER (10)</button>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div> <div class="grid grid-cols-2 gap-6 pt-8 border-t border-white/10"><div class="flex items-start gap-3 group"><div class="bg-[#0A0A0A] p-2.5 border border-white/5 rounded">`);
      Truck($$renderer2, {
        class: "w-4 h-4 text-primary opacity-70 group-hover:opacity-100 transition-lux"
      });
      $$renderer2.push(`<!----></div> <div><h4 class="text-xs font-semibold text-white mb-0.5">Free Shipping</h4> <p class="text-xs text-zinc-500">UPS Ground</p></div></div> <div class="flex items-start gap-3 group"><div class="bg-[#0A0A0A] p-2.5 border border-white/5 rounded">`);
      Shield_check($$renderer2, {
        class: "w-4 h-4 text-primary opacity-70 group-hover:opacity-100 transition-lux"
      });
      $$renderer2.push(`<!----></div> <div><h4 class="text-xs font-semibold text-white mb-0.5">Warranty</h4> <p class="text-xs text-zinc-500">Lifetime guarantee</p></div></div> <div class="flex items-start gap-3 group"><div class="bg-[#0A0A0A] p-2.5 border border-white/5 rounded">`);
      Rotate_ccw($$renderer2, {
        class: "w-4 h-4 text-primary opacity-70 group-hover:opacity-100 transition-lux"
      });
      $$renderer2.push(`<!----></div> <div><h4 class="text-xs font-semibold text-white mb-0.5">Returns</h4> <p class="text-xs text-zinc-500">30-day evaluation</p></div></div> <div class="flex items-start gap-3 group"><div class="bg-[#0A0A0A] p-2.5 border border-white/5 rounded">`);
      Package($$renderer2, {
        class: "w-4 h-4 text-primary opacity-70 group-hover:opacity-100 transition-lux"
      });
      $$renderer2.push(`<!----></div> <div><h4 class="text-xs font-semibold text-white mb-0.5">In Stock</h4> <p class="text-xs text-zinc-500">${escape_html(currentVariant()?.quantity || 0)} units</p></div></div></div></div></div></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function About($$renderer) {
  $$renderer.push(`<div class="bg-black min-h-screen text-white antialiased"><section class="relative py-48 overflow-hidden"><div class="absolute inset-0 opacity-10"><div class="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div> <img${attr("src", `${stringify(base)}/images/hero-bg.jpg`)} alt="Background" class="w-full h-full object-cover grayscale"/></div> <div class="relative max-w-5xl mx-auto px-6 text-center space-y-12"><span class="text-[0.65rem] font-bold uppercase tracking-[0.5em] text-primary">Established 2025</span> <h1 class="text-6xl md:text-8xl font-serif text-white tracking-tight leading-[0.9]">Defined by <br/><span class="italic text-primary">Craftsmanship.</span></h1> <p class="text-[0.7rem] font-bold uppercase tracking-[0.4em] text-zinc-500 max-w-2xl mx-auto leading-loose border-y border-white/5 py-12">We create the load-bearing systems that define the modern professional. Built for longevity. Designed for excellence.</p></div></section> <section class="py-32 bg-black border-t border-white/5"><div class="max-w-7xl mx-auto px-6"><div class="grid grid-cols-1 md:grid-cols-3 gap-16"><div class="space-y-8 group"><div class="w-14 h-14 bg-dark-surface border border-white/10 flex items-center justify-center group-hover:border-primary/40 transition-lux">`);
  Award($$renderer, { class: "w-6 h-6 text-primary" });
  $$renderer.push(`<!----></div> <h3 class="text-2xl font-serif tracking-tight">Pure Materials</h3> <p class="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-zinc-500 leading-relaxed">Every hide and fiber is selected for purity and performance. We source only the finest full-grain leathers and premium synthetics.</p></div> <div class="space-y-8 group"><div class="w-14 h-14 bg-dark-surface border border-white/10 flex items-center justify-center group-hover:border-primary/40 transition-lux">`);
  Users($$renderer, { class: "w-6 h-6 text-primary" });
  $$renderer.push(`<!----></div> <h3 class="text-2xl font-serif tracking-tight">Master Guild</h3> <p class="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-zinc-500 leading-relaxed">Our designs are forged through generations of trade expertise. We don't just build gear; we support the legacy of your craft.</p></div> <div class="space-y-8 group"><div class="w-14 h-14 bg-dark-surface border border-white/10 flex items-center justify-center group-hover:border-primary/40 transition-lux">`);
  Shield_check($$renderer, { class: "w-6 h-6 text-primary" });
  $$renderer.push(`<!----></div> <h3 class="text-2xl font-serif tracking-tight">Lifetime Integrity</h3> <p class="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-zinc-500 leading-relaxed">Every stitch is a promise. Our commitment to your performance is absolute. If our gear fails your standard, we replace the unit.</p></div></div></div></section> <section class="py-32 bg-dark-surface"><div class="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center"><div class="space-y-12"><h2 class="text-4xl md:text-5xl font-serif tracking-tight leading-tight">Authentic Heritage,<br/><span class="text-primary italic">Modern Utility.</span></h2> <div class="space-y-10"><div class="flex items-start space-x-6"><div class="text-primary font-serif italic text-2xl">01.</div> <div><h4 class="text-[0.65rem] font-bold uppercase tracking-[0.4em] mb-2">Artisanal Sourcing</h4> <p class="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-zinc-500 leading-relaxed">Only materials that meet our threshold for aesthetic and durability are permitted for construction.</p></div></div> <div class="flex items-start space-x-6"><div class="text-primary font-serif italic text-2xl">02.</div> <div><h4 class="text-[0.65rem] font-bold uppercase tracking-[0.4em] mb-2">Heritage Assembly</h4> <p class="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-zinc-500 leading-relaxed">Hand-bonded stress points and triple-stitching patterns ensure a structural integrity that outlives the user.</p></div></div> <div class="flex items-start space-x-6"><div class="text-primary font-serif italic text-2xl">03.</div> <div><h4 class="text-[0.65rem] font-bold uppercase tracking-[0.4em] mb-2">Field Performance</h4> <p class="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-zinc-500 leading-relaxed">Rigorous operational validation ensures every piece of equipment excels in the professional landscape.</p></div></div></div></div> <div class="relative group"><div class="absolute -inset-4 border border-primary/20 scale-95 group-hover:scale-105 transition-lux duration-1000"></div> <div class="relative aspect-[4/5] bg-black overflow-hidden shadow-2xl"><img${attr("src", `${stringify(base)}/images/about-detail.jpg`)} alt="Craftsmanship" class="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"/></div></div></div></section></div>`);
}
function Contact($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    $$renderer2.push(`<div class="bg-black min-h-screen text-white antialiased"><section class="pt-32 pb-12"><div class="max-w-7xl mx-auto px-6"><div class="space-y-4 mb-8"><span class="text-xs font-semibold uppercase tracking-[0.15em] text-primary">Get In Touch</span> <h1 class="text-5xl md:text-6xl font-serif text-white tracking-tight leading-none">Visit Our <span class="italic text-primary">Store</span></h1></div></div></section> <div class="max-w-7xl mx-auto px-6 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-16"><div class="lg:col-span-4 space-y-12"><div class="space-y-8"><div class="flex items-start gap-5 group"><div class="w-12 h-12 bg-[#0A0A0A] border border-white/10 group-hover:border-primary/40 flex items-center justify-center transition-lux flex-shrink-0">`);
    Map_pin($$renderer2, { class: "w-5 h-5 text-primary" });
    $$renderer2.push(`<!----></div> <div class="space-y-1"><h3 class="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400">Location</h3> <p class="text-lg font-serif">${escape_html(BUSINESS.address.city)}</p> <p class="text-sm text-zinc-500">${escape_html(BUSINESS.address.street)}</p> <p class="text-sm text-zinc-500">${escape_html(BUSINESS.address.city)}, ${escape_html(BUSINESS.address.state)} ${escape_html(BUSINESS.address.zip)}</p></div></div> <div class="flex items-start gap-5 group"><div class="w-12 h-12 bg-[#0A0A0A] border border-white/10 group-hover:border-primary/40 flex items-center justify-center transition-lux flex-shrink-0">`);
    Phone($$renderer2, { class: "w-5 h-5 text-primary" });
    $$renderer2.push(`<!----></div> <div class="space-y-1"><h3 class="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400">Phone</h3> <p class="text-lg font-serif">${escape_html(BUSINESS.phone)}</p> <p class="text-sm text-zinc-500">${escape_html(BUSINESS.hours)}</p></div></div> <div class="flex items-start gap-5 group"><div class="w-12 h-12 bg-[#0A0A0A] border border-white/10 group-hover:border-primary/40 flex items-center justify-center transition-lux flex-shrink-0">`);
    Mail($$renderer2, { class: "w-5 h-5 text-primary" });
    $$renderer2.push(`<!----></div> <div class="space-y-1"><h3 class="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400">Email</h3> <p class="text-lg font-serif break-all">${escape_html(BUSINESS.email)}</p></div></div></div> <div class="p-6 bg-[#0A0A0A] border border-white/10 rounded"><h4 class="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-3">Global Presence</h4> <div class="flex items-center gap-4 text-zinc-500">`);
    Globe($$renderer2, { class: "w-8 h-8 opacity-30 flex-shrink-0" });
    $$renderer2.push(`<!----> <p class="text-sm leading-relaxed">Supporting trade professionals across North America, Europe, and Asia-Pacific.</p></div></div></div> <div class="lg:col-span-8"><div class="bg-[#0A0A0A] border border-white/10 rounded overflow-hidden shadow-2xl"><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3352.05!2d-96.8903!3d32.869!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864e9f06fad9cfcf%3A0xa64addf43e8f7a4f!2s11456%20Harry%20Hines%20Blvd%20%23103%2C%20Dallas%2C%20TX%2075229!5e0!3m2!1sen!2sus!4v1711234567890!5m2!1sen!2sus" width="100%" height="500" style="border:0; filter: invert(90%) hue-rotate(180deg) saturate(0.3) brightness(0.6);" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Protection Valley Store Location" class="w-full"></iframe> <div class="p-4 text-center"><a href="https://www.google.com/maps/place/11456+Harry+Hines+Blvd+%23103,+Dallas,+TX+75229" target="_blank" rel="noopener noreferrer" class="text-sm font-semibold text-primary hover:text-white transition-lux">Open in Google Maps →</a></div></div></div></div></div>`);
  });
}
function Login($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    $$renderer2.push(`<div class="min-h-[80vh] bg-black flex flex-col items-center justify-center p-6 antialiased"><div class="max-w-sm w-full bg-[#0A0A0A] border border-white/10 p-10 space-y-8 rounded shadow-2xl relative overflow-hidden"><div class="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div> <div class="flex flex-col items-center gap-4 text-center"><div class="w-16 h-16 bg-black border border-white/10 rounded-full p-0 flex items-center justify-center overflow-hidden"><img${attr("src", `${stringify(base)}/images/logo-v3.png`)} alt="Protection Valley" class="w-full h-full object-contain"/></div> <div><h2 class="text-2xl font-serif text-white">Sign In</h2> <p class="text-sm text-zinc-500 mt-1">Access your wholesale account</p></div></div> <div class="space-y-3"><button class="w-full h-11 bg-white rounded flex items-center justify-center gap-3 hover:bg-gray-50 active:bg-gray-100 transition-colors border border-gray-300 shadow-sm"><svg class="w-[18px] h-[18px]" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"></path><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path></svg> <span class="text-sm font-medium text-gray-700">Sign in with Google</span></button> <button class="w-full h-11 bg-black rounded flex items-center justify-center gap-3 hover:bg-gray-900 active:bg-gray-800 transition-colors border border-gray-600"><svg class="w-[15px] h-[18px]" viewBox="0 0 15 18" fill="white"><path d="M14.94 13.34c-.35.81-.52 1.17-.97 1.89-.63.99-1.52 2.23-2.62 2.24-1.0.01-1.26-.65-2.62-.64-1.36.01-1.65.65-2.65.64-1.1-.01-1.93-1.12-2.56-2.11C1.78 12.76.98 9.21 2.81 6.84c.64-.83 1.78-1.39 3-1.4 1.07-.02 2.08.72 2.73.72.65 0 1.87-.89 3.15-.76.54.02 2.04.22 3.0 1.63-2.65 1.62-2.2 4.85.25 6.31zM10.1 3.55c.49-.63.87-1.52.73-2.43-.82.06-1.78.57-2.34 1.24-.5.6-.93 1.52-.77 2.4.9.03 1.84-.5 2.38-1.21z"></path></svg> <span class="text-sm font-medium text-white">Sign in with Apple</span></button></div> <div class="pt-4 border-t border-white/10 text-center"><p class="text-xs text-zinc-500">Wholesale access requires authorized credentials</p></div></div></div>`);
  });
}
function _page($$renderer) {
  var $$store_subs;
  head("1uha8ag", $$renderer, ($$renderer2) => {
    $$renderer2.title(($$renderer3) => {
      $$renderer3.push(`<title>Protection Valley - Premium Workgear</title>`);
    });
  });
  if (store_get($$store_subs ??= {}, "$currentPage", currentPage) === "home") {
    $$renderer.push("<!--[0-->");
    Home($$renderer);
  } else if (store_get($$store_subs ??= {}, "$currentPage", currentPage) === "catalog") {
    $$renderer.push("<!--[1-->");
    Catalog($$renderer);
  } else if (store_get($$store_subs ??= {}, "$currentPage", currentPage) === "product-detail") {
    $$renderer.push("<!--[2-->");
    ProductDetail($$renderer);
  } else if (store_get($$store_subs ??= {}, "$currentPage", currentPage) === "about") {
    $$renderer.push("<!--[3-->");
    About($$renderer);
  } else if (store_get($$store_subs ??= {}, "$currentPage", currentPage) === "contact") {
    $$renderer.push("<!--[4-->");
    Contact($$renderer);
  } else if (store_get($$store_subs ??= {}, "$currentPage", currentPage) === "login") {
    $$renderer.push("<!--[5-->");
    Login($$renderer);
  } else {
    $$renderer.push("<!--[-1-->");
  }
  $$renderer.push(`<!--]-->`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
}
export {
  _page as default
};
