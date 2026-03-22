import { s as sanitize_props, a as spread_props, b as slot, c as attr, d as escape_html, h as derived, f as store_get, u as unsubscribe_stores, k as attr_style, e as ensure_array_like, g as stringify, i as attr_class, l as head } from "../../chunks/root.js";
import "../../chunks/index.js";
import "@sveltejs/kit/internal/server";
import { I as Icon, i as isWholesale, p as products, g as currentType, h as currentCategory, j as filteredProducts, k as selectedColor, l as selectedImageIndex, m as selectedSize, n as selectedProduct, o as currentPage } from "../../chunks/stores.js";
import { b as base } from "../../chunks/server.js";
import "clsx";
function Arrow_left($$renderer, $$props) {
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
    ["path", { "d": "m12 19-7-7 7-7" }],
    ["path", { "d": "M19 12H5" }]
  ];
  Icon($$renderer, spread_props([
    { name: "arrow-left" },
    $$sanitized_props,
    {
      /**
       * @component @name ArrowLeft
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTIgMTktNy03IDctNyIgLz4KICA8cGF0aCBkPSJNMTkgMTJINSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/arrow-left
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
function Arrow_right($$renderer, $$props) {
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
    ["path", { "d": "M5 12h14" }],
    ["path", { "d": "m12 5 7 7-7 7" }]
  ];
  Icon($$renderer, spread_props([
    { name: "arrow-right" },
    $$sanitized_props,
    {
      /**
       * @component @name ArrowRight
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNSAxMmgxNCIgLz4KICA8cGF0aCBkPSJtMTIgNSA3IDctNyA3IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/arrow-right
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
function Mail($$renderer, $$props) {
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
      "rect",
      { "width": "20", "height": "16", "x": "2", "y": "4", "rx": "2" }
    ],
    ["path", { "d": "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" }]
  ];
  Icon($$renderer, spread_props([
    { name: "mail" },
    $$sanitized_props,
    {
      /**
       * @component @name Mail
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTYiIHg9IjIiIHk9IjQiIHJ4PSIyIiAvPgogIDxwYXRoIGQ9Im0yMiA3LTguOTcgNS43YTEuOTQgMS45NCAwIDAgMS0yLjA2IDBMMiA3IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/mail
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
function Map_pin($$renderer, $$props) {
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
        "d": "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
      }
    ],
    ["circle", { "cx": "12", "cy": "10", "r": "3" }]
  ];
  Icon($$renderer, spread_props([
    { name: "map-pin" },
    $$sanitized_props,
    {
      /**
       * @component @name MapPin
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjAgMTBjMCA0Ljk5My01LjUzOSAxMC4xOTMtNy4zOTkgMTEuNzk5YTEgMSAwIDAgMS0xLjIwMiAwQzkuNTM5IDIwLjE5MyA0IDE0Ljk5MyA0IDEwYTggOCAwIDAgMSAxNiAwIiAvPgogIDxjaXJjbGUgY3g9IjEyIiBjeT0iMTAiIHI9IjMiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/map-pin
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
function Phone($$renderer, $$props) {
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
        "d": "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
      }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "phone" },
    $$sanitized_props,
    {
      /**
       * @component @name Phone
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjIgMTYuOTJ2M2EyIDIgMCAwIDEtMi4xOCAyIDE5Ljc5IDE5Ljc5IDAgMCAxLTguNjMtMy4wNyAxOS41IDE5LjUgMCAwIDEtNi02IDE5Ljc5IDE5Ljc5IDAgMCAxLTMuMDctOC42N0EyIDIgMCAwIDEgNC4xMSAyaDNhMiAyIDAgMCAxIDIgMS43MiAxMi44NCAxMi44NCAwIDAgMCAuNyAyLjgxIDIgMiAwIDAgMS0uNDUgMi4xMUw4LjA5IDkuOTFhMTYgMTYgMCAwIDAgNiA2bDEuMjctMS4yN2EyIDIgMCAwIDEgMi4xMS0uNDUgMTIuODQgMTIuODQgMCAwIDAgMi44MS43QTIgMiAwIDAgMSAyMiAxNi45MnoiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/phone
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
    let price = derived(() => store_get($$store_subs ??= {}, "$isWholesale", isWholesale) ? product.wholesalePrice : product.price);
    let originalPrice = derived(() => store_get($$store_subs ??= {}, "$isWholesale", isWholesale) ? product.price : null);
    $$renderer2.push(`<button class="bg-dark-card rounded-lg overflow-hidden border border-dark-border hover:border-primary transition-colors group cursor-pointer text-left w-full"><div class="aspect-square overflow-hidden bg-dark-bg"><img${attr("src", product.image)}${attr("alt", product.name)} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/></div> <div class="p-4"><div class="flex items-center gap-2 mb-2"><span class="text-xs text-primary">${escape_html(product.type)}</span> <span class="text-xs text-dark-muted">•</span> <span class="text-xs text-dark-muted">${escape_html(product.category)}</span></div> <h3 class="font-medium text-lg mb-2 group-hover:text-primary transition-colors">${escape_html(product.name)}</h3> <div class="flex items-center gap-2"><span class="text-xl font-serif text-primary">$${escape_html(price().toFixed(2))}</span> `);
    if (originalPrice()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="text-sm text-dark-muted line-through">$${escape_html(originalPrice().toFixed(2))}</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div></button>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function Home($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const categories = [
      { name: "Tool Belts", image: "/images/toolbelt-1.jpg" },
      { name: "Pouches", image: "/images/pouch-1.jpg" },
      { name: "Aprons", image: "/images/apron-1.jpg" },
      { name: "Accessories", image: "/images/wristband-1.jpg" }
    ];
    let featured = derived(() => store_get($$store_subs ??= {}, "$products", products).slice(0, 4));
    $$renderer2.push(`<section class="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden"><div class="absolute inset-0 bg-cover bg-center"${attr_style(`background-image: url('${stringify(base)}/images/hero-bg.jpg');`)}></div> <div class="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent"></div> <div class="relative z-10 text-center px-4 max-w-4xl mx-auto"><p class="text-primary font-medium tracking-widest uppercase mb-4 animate-fade-in">Protection Valley</p> <h1 class="text-5xl md:text-7xl font-serif mb-6 animate-fade-in" style="animation-delay: 0.2s">Gear That Protects<br/>Your Craft</h1> <p class="text-xl text-dark-muted mb-8 max-w-2xl mx-auto animate-fade-in" style="animation-delay: 0.4s">Premium workgear crafted for professionals who demand durability and comfort.
      Tool belts, pouches, aprons, and protective equipment.</p> <div class="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style="animation-delay: 0.6s"><button class="btn-primary text-lg">Browse Catalog</button> <button class="btn-secondary text-lg">Our Story</button></div></div></section> <section class="py-20 bg-[#0a0a0a]"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="text-center mb-12"><p class="text-primary font-medium tracking-widest uppercase mb-2">Browse by Category</p> <h2 class="text-4xl font-serif">Find Your Gear</h2></div> <div class="grid grid-cols-2 md:grid-cols-4 gap-4"><!--[-->`);
    const each_array = ensure_array_like(categories);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let cat = each_array[$$index];
      $$renderer2.push(`<button class="group relative aspect-square overflow-hidden rounded-lg bg-dark-card border border-dark-border hover:border-primary transition-colors"><img${attr("src", `${stringify(base)}${stringify(cat.image)}`)}${attr("alt", cat.name)} class="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"/> <div class="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-[#0a0a0a]/80 to-transparent"><span class="text-lg font-medium">${escape_html(cat.name)}</span></div></button>`);
    }
    $$renderer2.push(`<!--]--></div></div></section> <section class="py-20 bg-dark-card"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex items-center justify-between mb-12"><div><p class="text-primary font-medium tracking-widest uppercase mb-2">Featured</p> <h2 class="text-4xl font-serif">Best Sellers</h2></div> <button class="text-primary hover:text-primary-light flex items-center gap-2">View All `);
    Arrow_right($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----></button></div> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"><!--[-->`);
    const each_array_1 = ensure_array_like(featured());
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let product = each_array_1[$$index_1];
      ProductCard($$renderer2, { product });
    }
    $$renderer2.push(`<!--]--></div></div></section>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function Catalog($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let sortBy = "featured";
    const types = ["All", "Leather", "Canvas", "Nylon"];
    const categories = ["All", "Tool Belts", "Pouches", "Aprons", "Accessories"];
    let sorted = derived(() => {
      let items = [
        ...store_get($$store_subs ??= {}, "$filteredProducts", filteredProducts)
      ];
      return items;
    });
    $$renderer2.push(`<div class="bg-[#0a0a0a] min-h-screen"><div class="bg-dark-card border-b border-dark-border"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"><div><h1 class="text-4xl font-serif mb-2">Full Catalog</h1> <p class="text-dark-muted">Browse our complete collection of premium workgear</p></div> <div class="flex items-center gap-2 text-sm text-dark-muted"><span>${escape_html(sorted().length)}</span> products</div></div></div></div> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><div class="bg-dark-card rounded-lg p-6 mb-8 border border-dark-border"><div class="flex flex-col lg:flex-row gap-6"><div class="flex-1"><label class="block text-sm font-medium mb-3 text-dark-muted">Material Type</label> <div class="flex flex-wrap gap-2"><!--[-->`);
    const each_array = ensure_array_like(types);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let type = each_array[$$index];
      $$renderer2.push(`<button${attr_class(`px-4 py-2 rounded-full text-sm font-medium transition-colors ${stringify(store_get($$store_subs ??= {}, "$currentType", currentType) === type ? "bg-primary text-[#0a0a0a]" : "bg-[#0a0a0a] border border-dark-border text-dark-text hover:border-primary")}`)}>${escape_html(type)}</button>`);
    }
    $$renderer2.push(`<!--]--></div></div> <div class="flex-1"><label class="block text-sm font-medium mb-3 text-dark-muted">Category</label> <div class="flex flex-wrap gap-2"><!--[-->`);
    const each_array_1 = ensure_array_like(categories);
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let cat = each_array_1[$$index_1];
      $$renderer2.push(`<button${attr_class(`px-4 py-2 rounded-full text-sm font-medium transition-colors ${stringify(store_get($$store_subs ??= {}, "$currentCategory", currentCategory) === cat ? "bg-primary text-[#0a0a0a]" : "bg-[#0a0a0a] border border-dark-border text-dark-text hover:border-primary")}`)}>${escape_html(cat)}</button>`);
    }
    $$renderer2.push(`<!--]--></div></div> <div><label class="block text-sm font-medium mb-3 text-dark-muted">Sort By</label> `);
    $$renderer2.select(
      {
        value: sortBy,
        class: "px-4 py-2 bg-[#0a0a0a] border border-dark-border rounded-lg text-dark-text focus:border-primary focus:outline-none"
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "featured" }, ($$renderer4) => {
          $$renderer4.push(`Featured`);
        });
        $$renderer3.option({ value: "price-low" }, ($$renderer4) => {
          $$renderer4.push(`Price: Low to High`);
        });
        $$renderer3.option({ value: "price-high" }, ($$renderer4) => {
          $$renderer4.push(`Price: High to Low`);
        });
        $$renderer3.option({ value: "name" }, ($$renderer4) => {
          $$renderer4.push(`Name: A-Z`);
        });
      }
    );
    $$renderer2.push(`</div></div></div> `);
    if (store_get($$store_subs ??= {}, "$currentType", currentType) !== "All" || store_get($$store_subs ??= {}, "$currentCategory", currentCategory) !== "All") {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="flex flex-wrap gap-2 mb-6"><span class="text-sm text-dark-muted">Active filters:</span> <button class="text-sm text-primary hover:underline">Clear all</button></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (sorted().length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="text-center py-16">`);
      Package_x($$renderer2, { class: "w-16 h-16 text-dark-border mx-auto mb-4" });
      $$renderer2.push(`<!----> <h3 class="text-xl font-medium mb-2">No products found</h3> <p class="text-dark-muted mb-4">Try adjusting your filters</p> <button class="btn-primary">Clear Filters</button></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"><!--[-->`);
      const each_array_2 = ensure_array_like(sorted());
      for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
        let product = each_array_2[$$index_2];
        ProductCard($$renderer2, { product });
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function ProductDetail($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let sp = derived(() => store_get($$store_subs ??= {}, "$selectedProduct", selectedProduct));
    let price = derived(() => sp() ? store_get($$store_subs ??= {}, "$isWholesale", isWholesale) ? sp().wholesalePrice : sp().price : 0);
    let originalPrice = derived(() => sp() && store_get($$store_subs ??= {}, "$isWholesale", isWholesale) ? sp().price : null);
    if (sp()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="bg-[#0a0a0a] min-h-screen"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><button class="flex items-center text-dark-muted hover:text-primary mb-6">`);
      Arrow_left($$renderer2, { class: "w-4 h-4 mr-2" });
      $$renderer2.push(`<!----> Back</button> <div class="grid grid-cols-1 lg:grid-cols-2 gap-12"><div><div class="aspect-square bg-dark-card rounded-lg overflow-hidden mb-4 border border-dark-border"><img${attr("src", store_get($$store_subs ??= {}, "$selectedColor", selectedColor)?.image || sp().images[store_get($$store_subs ??= {}, "$selectedImageIndex", selectedImageIndex)])}${attr("alt", sp().name)} class="w-full h-full object-cover"/></div> `);
      if (sp().images.length > 1) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="flex gap-2"><!--[-->`);
        const each_array = ensure_array_like(sp().images);
        for (let i = 0, $$length = each_array.length; i < $$length; i++) {
          let img = each_array[i];
          $$renderer2.push(`<button${attr_class(`w-20 h-20 rounded-lg overflow-hidden border-2 ${stringify(i === store_get($$store_subs ??= {}, "$selectedImageIndex", selectedImageIndex) ? "border-primary" : "border-dark-border")} hover:border-primary transition-colors`)}><img${attr("src", img)} class="w-full h-full object-cover" alt=""/></button>`);
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div> <div><div class="flex items-center gap-2 mb-2"><span class="text-sm text-primary">${escape_html(sp().type)}</span> <span class="text-sm text-dark-muted">•</span> <span class="text-sm text-dark-muted">${escape_html(sp().category)}</span></div> <h1 class="text-3xl font-serif mb-4">${escape_html(sp().name)}</h1> <div class="flex items-center gap-3 mb-6"><span class="text-3xl font-serif text-primary">$${escape_html(price().toFixed(2))}</span> `);
      if (originalPrice()) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<span class="text-lg text-dark-muted line-through">$${escape_html(originalPrice().toFixed(2))}</span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div> <p class="text-dark-muted mb-8">${escape_html(sp().description)}</p> `);
      if (sp().colors.length > 1) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="mb-6"><label class="block text-sm font-medium mb-3">Color: <span class="text-dark-muted">${escape_html(store_get($$store_subs ??= {}, "$selectedColor", selectedColor)?.name)}</span></label> <div class="flex gap-3"><!--[-->`);
        const each_array_1 = ensure_array_like(sp().colors);
        for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
          let color = each_array_1[i];
          $$renderer2.push(`<button${attr_class(`color-option ${stringify(store_get($$store_subs ??= {}, "$selectedColor", selectedColor)?.name === color.name ? "active" : "")}`)}${attr_style(`background-color: ${stringify(color.hex)};`)}${attr("title", color.name)}></button>`);
        }
        $$renderer2.push(`<!--]--></div></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <div class="mb-6"><label class="block text-sm font-medium mb-3">Size: <span class="text-dark-muted">${escape_html(store_get($$store_subs ??= {}, "$selectedSize", selectedSize))}</span></label> <div class="flex flex-wrap gap-2"><!--[-->`);
      const each_array_2 = ensure_array_like(sp().sizes);
      for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
        let size = each_array_2[$$index_2];
        $$renderer2.push(`<button${attr_class(`size-option ${stringify(store_get($$store_subs ??= {}, "$selectedSize", selectedSize) === size ? "active" : "")}`)}>${escape_html(size)}</button>`);
      }
      $$renderer2.push(`<!--]--></div></div> <div class="flex gap-4"><button class="flex-1 btn-primary py-4 text-lg">Add to Cart</button></div> <div class="mt-8 pt-8 border-t border-dark-border"><div class="grid grid-cols-2 gap-4"><div class="flex items-center gap-2 text-dark-muted">`);
      Truck($$renderer2, { class: "w-5 h-5 text-primary" });
      $$renderer2.push(`<!----><span class="text-sm">Free shipping over $100</span></div> <div class="flex items-center gap-2 text-dark-muted">`);
      Shield_check($$renderer2, { class: "w-5 h-5 text-primary" });
      $$renderer2.push(`<!----><span class="text-sm">Lifetime warranty</span></div> <div class="flex items-center gap-2 text-dark-muted">`);
      Rotate_ccw($$renderer2, { class: "w-5 h-5 text-primary" });
      $$renderer2.push(`<!----><span class="text-sm">30-day returns</span></div> <div class="flex items-center gap-2 text-dark-muted">`);
      Package($$renderer2, { class: "w-5 h-5 text-primary" });
      $$renderer2.push(`<!----><span class="text-sm">${escape_html(sp().stock)} in stock</span></div></div></div></div></div></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function About($$renderer) {
  $$renderer.push(`<div class="bg-[#0a0a0a] min-h-screen"><section class="relative py-24"><div class="absolute inset-0 bg-gradient-to-b from-dark-card to-[#0a0a0a]"></div> <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"><img${attr("src", `${stringify(base)}/images/logo.png`)} alt="Protection Valley" class="h-24 w-auto mx-auto mb-8"/> <h1 class="text-5xl md:text-6xl font-serif mb-6">Our Story</h1> <p class="text-xl text-dark-muted max-w-3xl mx-auto">At Protection Valley, we believe that quality workgear is essential for every tradesperson.
        Our mission is to protect your craft with gear that's built to last.</p></div></section> <section class="py-20"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="grid grid-cols-1 md:grid-cols-3 gap-8"><div class="bg-dark-card p-8 rounded-lg text-center border border-dark-border"><div class="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">`);
  Award($$renderer, { class: "w-8 h-8 text-primary" });
  $$renderer.push(`<!----></div> <h3 class="text-xl font-medium mb-2">Premium Materials</h3> <p class="text-dark-muted">Full-grain leather and heavy-duty canvas built to last a lifetime.</p></div> <div class="bg-dark-card p-8 rounded-lg text-center border border-dark-border"><div class="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">`);
  Users($$renderer, { class: "w-8 h-8 text-primary" });
  $$renderer.push(`<!----></div> <h3 class="text-xl font-medium mb-2">Tradesperson Designed</h3> <p class="text-dark-muted">Designed with input from real tradespeople who use our gear daily.</p></div> <div class="bg-dark-card p-8 rounded-lg text-center border border-dark-border"><div class="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">`);
  Shield_check($$renderer, { class: "w-8 h-8 text-primary" });
  $$renderer.push(`<!----></div> <h3 class="text-xl font-medium mb-2">Lifetime Warranty</h3> <p class="text-dark-muted">We stand behind our products with a lifetime craftsmanship guarantee.</p></div></div></div></section></div>`);
}
function Contact($$renderer) {
  $$renderer.push(`<div class="bg-[#0a0a0a] min-h-screen"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"><div class="text-center mb-12"><h1 class="text-4xl font-serif mb-4">Get in Touch</h1> <p class="text-dark-muted">Have questions? We're here to help.</p></div> <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"><div class="bg-dark-card p-6 rounded-lg text-center border border-dark-border">`);
  Phone($$renderer, { class: "w-8 h-8 text-primary mx-auto mb-4" });
  $$renderer.push(`<!----> <h3 class="font-medium mb-1">Phone</h3> <p class="text-dark-muted">1-800-PROTECT</p></div> <div class="bg-dark-card p-6 rounded-lg text-center border border-dark-border">`);
  Mail($$renderer, { class: "w-8 h-8 text-primary mx-auto mb-4" });
  $$renderer.push(`<!----> <h3 class="font-medium mb-1">Email</h3> <p class="text-dark-muted">support@protectionvalley.com</p></div> <div class="bg-dark-card p-6 rounded-lg text-center border border-dark-border">`);
  Map_pin($$renderer, { class: "w-8 h-8 text-primary mx-auto mb-4" });
  $$renderer.push(`<!----> <h3 class="font-medium mb-1">Location</h3> <p class="text-dark-muted">Portland, Oregon</p></div></div></div></div>`);
}
function Login($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let email = "";
    let password = "";
    $$renderer2.push(`<div class="bg-[#0a0a0a] min-h-screen flex items-center justify-center py-12 px-4"><div class="w-full max-w-md"><div class="text-center mb-8"><img${attr("src", `${stringify(base)}/images/logo.png`)} alt="Protection Valley" class="h-16 w-auto mx-auto mb-4"/> <h1 class="text-3xl font-serif mb-2">Welcome Back</h1> <p class="text-dark-muted">Sign in to access your account</p></div> <div class="bg-dark-card rounded-lg p-8 border border-dark-border"><div class="space-y-3 mb-6"><button class="w-full flex items-center justify-center gap-3 bg-white text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"><svg class="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"></path><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path></svg> Continue with Google</button> <button class="w-full flex items-center justify-center gap-3 bg-white text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"><svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.22 7.13-.57 1.5-1.31 2.99-2.27 4.08zm-5.85-15.1c.07-1.74 1.54-3.25 3.28-3.39.29 2.32-2.13 4.5-3.28 3.39z"></path></svg> Continue with Apple</button></div> <div class="relative mb-6"><div class="absolute inset-0 flex items-center"><div class="w-full border-t border-dark-border"></div></div> <div class="relative flex justify-center"><span class="bg-dark-card px-4 text-sm text-dark-muted">Or continue with email</span></div></div> <form><div class="space-y-4"><div><label class="block text-sm font-medium mb-2">Email Address</label> <input type="email"${attr("value", email)} required="" class="w-full px-4 py-3 bg-[#0a0a0a] border border-dark-border rounded-lg focus:outline-none focus:border-primary text-dark-text" placeholder="you@example.com"/></div> <div><label class="block text-sm font-medium mb-2">Password</label> <input type="password"${attr("value", password)} required="" class="w-full px-4 py-3 bg-[#0a0a0a] border border-dark-border rounded-lg focus:outline-none focus:border-primary text-dark-text" placeholder="••••••••"/></div> <button type="submit" class="w-full btn-primary py-3">Sign In</button></div></form> <p class="mt-4 text-center text-sm text-dark-muted">Don't have an account? <span class="text-primary hover:underline cursor-pointer">Sign up</span></p></div></div></div>`);
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
