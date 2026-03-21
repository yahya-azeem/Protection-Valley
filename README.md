# Protection Valley

Premium workgear e-commerce site — tool belts, pouches, aprons, and protective accessories for tradespeople.

## Project Structure

```
protection-valley/     # Static frontend (HTML + CSS + JS)
├── index.html         # Main page
├── css/styles.css     # Custom styles
├── js/                # Modular JavaScript
│   ├── app.js         # Entry point
│   ├── products.js    # Product data + eBay API fetch
│   ├── cart.js        # Cart state (localStorage)
│   ├── ui.js          # Rendering, filters, auth
│   └── search.js      # Search overlay
└── images/            # Product images

api/                   # Rust serverless backend (Vercel)
├── main.rs            # Router
├── handlers/          # Request handlers
├── models/            # Data models
├── services/          # Business logic + eBay integration
└── auth/              # JWT utilities

Cargo.toml             # Rust workspace config
vercel.json            # Vercel routing config
```

## Features

- **Static Frontend** — Tailwind CSS dark theme, fast load, no build step
- **eBay Inventory Sync** — Real eBay Browse API integration with mock data fallback
- **Wholesale Pricing** — Log in as wholesale for discounted prices
- **Search** — Full-text product search with highlighting
- **Cart** — Client-side cart with localStorage persistence
- **GitHub Pages** — Auto-deployed on push via GitHub Actions

## Development

Open `protection-valley/index.html` in your browser — no build tools needed.

### Environment Variables (for eBay API)

```sh
EBAY_APP_ID=your-app-id
EBAY_OAUTH_TOKEN=your-oauth-token
EBAY_SELLER_NAME=your-seller-name   # defaults to "protectionvalley"
```

## Deploy

- **Frontend**: Automatically deployed to GitHub Pages on push to `main`
- **Backend**: Deploy to Vercel with `vercel --prod`

## License

All rights reserved © 2025 Protection Valley
