# Protection Valley [SvelteKit Edition]

Premium workgear e-commerce platform — tool belts, pouches, aprons, and professional accessories.

## 🛠 Tech Stack
- **Frontend**: SvelteKit 5 (Runes), Tailwind CSS 4
- **Backend**: Rust (Vercel Serverless Functions)
- **Inventory**: eBay Browse API Sync (with grouping integration)
- **Design System**: OLED Native (Pure Black) + Klein Tools Industrial Aesthetic
- **Agent Skill**: Integrated with [Impeccable](https://github.com/pbakaus/impeccable)

## 📁 Project Structure
```
protection-valley/      # SvelteKit Application Root
├── src/
│   ├── lib/
│   │   ├── components/ # Atomic UI components (Navbar, ProductCard, etc.)
│   │   ├── config.ts   # Centralized Design Tokens & API Config
│   │   ├── stores.ts   # Svelte Stores (Auth, Cart, Products)
│   │   └── types.ts    # TypeScript definitions
│   └── routes/         # SvelteKit App Router
api/                    # Rust serverless backend (Vercel)
├── main.rs             # Vercel Function Entry & Routing
├── handlers/           # Endpoint handlers (Auth, eBay, Products)
└── services/           # Business logic (eBay Sync, Auth Service)
```

## 🚀 Key Features
- **OLED Native Design**: Optimized for high-contrast visibility with absolute black surfaces.
- **eBay Multi-Variant Grouping**: Automatically groups individual eBay listings into coherent product models.
- **Industrial UX**: Design language inspired by Klein Tools, prioritizing SKU/Model numbers for professionals.
- **Wholesale Portal**: Dedicated pricing and bulk management for verified contractors.
- **Vercel native**: Seamless deployment as serverless Rust functions.

## 💻 Development

### Backend (Rust)
Set environment variables in `.env`:
```sh
EBAY_APP_ID=...
EBAY_CERT_ID=...
EBAY_SELLER_NAME=protectionvalley
```

### Frontend (SvelteKit)
```bash
cd protection-valley
npm install
npm run dev
```

## ⚖️ License
© 2024-2025 Protection Valley. Professional Grade Workgear.
