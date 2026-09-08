# auramobiles

> **AURA Luxe Mobile Boutique** — Central Africa's premier technology storefront for luxury smartphones, certified phone trade-ins, and bespoke concierge device servicing.

![Next.js](https://img.shields.io/badge/Next.js-16.3.4-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Deploy](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)

---

## 🌟 Visual Showcase & Aesthetic Direction

AURA Luxe Mobile is built with a sophisticated **Luxury Dark & Warm Gold** aesthetic inspired by high-end technology retailers:
- **Palette**: Deep noir (`#09090B`, `#0D0D12`), subtle border contrasts, and warm metallic gold (`#D4AF37`, `#F3E5AB`).
- **Typography**: Clean, spacious sans-serif typography with high contrast and readable monospace data callouts.
- **Mobile First**: Built for thumb-zone navigation, sticky action bars, slide-out filter drawers, and bottom action docks.
- **Currencies & Payments**: Localized in Central African Francs (`FCFA`) with support for MTN Mobile Money, Orange Money, Cash on Delivery, and Visa/Mastercard.

---

## 🚀 Live Customer Storefront Features

### 1. Luxury Homepage (`/`)
- **Hero Showcase**: Desert Titanium iPhone 16 Pro Max hero with quick-action CTAs, feature pills, and price badges.
- **Authenticity Pillars**: 100% Genuine Sealed Devices, Official Boutique Warranty, 7-Day Replacement Guarantee, and Express VIP Delivery.
- **Curated Brand Matrix**: Instant category filtering for Apple, Samsung, Xiaomi, Tecno, Infinix, and Google.
- **Best Sellers Row**: 5-card horizontal row showcasing flagship models with live rating stars, storage specs, and instant cart actions.
- **Certified Phone Swap Banner**: Direct trade-in entry point with appraisal callouts.

### 2. Full Smartphone Catalog (`/phones`)
- **Fast 1-Tap Brand Filtering**: Instant horizontal brand selector (*Apple, Samsung, Xiaomi, Tecno, Infinix, Google Pixel*).
- **Condition Chips**: Toggle between All, Brand New, and Certified Pre-Owned.
- **Clean Phone Cards**: High-res imagery, model title, clear FCFA pricing, condition badge, and direct "Add to Cart" action with tactile feedback.
- **Search & Sort**: Instant search filtering, sort by Price (Low to High, High to Low), and Rating.
- **Real-Time Stock Badges**: Instant inventory indicators for Buea Molyko hub and nationwide delivery.

### 3. Product Detail Experience (`/phones/[slug]`)
- **Interactive Variant Switchers**: Multi-color swatches with active ring highlights, interactive storage selector (`128GB`, `256GB`, `512GB`, `1TB`) with live FCFA price calculation.
- **Live Inventory Bar**: Express same-day hub status.
- **Detailed Specifications**: Screen size, chipset, camera array, battery capacity, fast charging, and water resistance ratings.
- **VIP Actions**: Add to Cart, Buy Now, Trade-In Toward This Device, and Wishlist toggling.

### 4. Certified Trade-In & Phone Swap (`/trade-in`)
- **4-Step Appraisal Wizard**:
  1. Brand Selection (Apple, Samsung, Tecno, Google, etc.).
  2. Model & Storage Selection.
  3. Condition Audit (Flawless, Good, Minor Scratches, Cracked).
  4. Instant Trade-In Valuation Certificate with voucher code.
- **Fulfillment**: Doorstep courier inspection nationwide or Buea showroom drop-off.

### 5. Client Checkout (`/checkout`)
- **Client & Delivery Logistics**: Contact phone (WhatsApp), delivery address, and selection between Buea Same-Day Express, Nationwide Courier, or Showroom Pickup.
- **Local Payment Channels**: MTN MoMo (`*126#`), Orange Money (`#150#`), Cash on Delivery, and Credit Card.
- **Live Cart Summary**: Transparent breakdown of hardware subtotal, delivery fee, and total FCFA.

### 6. Order Tracking & Dispatch Concierge (`/orders`)
- **Real-Time Milestone Timeline**:
  - `Order Placed` → `Confirmed & IMEI Allocated` → `Quality Check & Sealed` → `VIP Courier En Route` → `Handover & Signature`.
- **Order Lookup**: Search by Order ID (`AUR-89412`, etc.) with demo order presets.
- **VIP WhatsApp Direct Action**: One-tap connection to dispatch managers.

### 7. Wishlist & Customer Support (`/wishlist`, `/support`)
- **Wishlist**: Saved flagship hardware with one-click "Move to Cart".
- **Boutique Support**: Physical showroom location (Molyko, Buea), nationwide delivery dispatch, business hours, and interactive FAQ accordion.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **UI Library**: React 19, Lucide Icons, Shadcn UI primitives
- **Styling**: Tailwind CSS v4, Vanilla CSS design tokens
- **State Management**: React Context (`CartContext`, `WishlistContext`, `AiContext`) with persistent client `localStorage`

---

## 💻 Local Development

```bash
# Clone the repository
git clone https://github.com/Wisdom614/auramobiles.git
cd auramobiles

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the storefront in your browser.

---

## 🚢 Vercel Deployment Guide

This project is fully optimized for one-click deployment on [Vercel](https://vercel.com).

### Option 1: Vercel Dashboard (Recommended)
1. Push this repository to GitHub:
   ```bash
   git push -u origin main
   ```
2. Log in to [Vercel](https://vercel.com) and click **"Add New..." → "Project"**.
3. Import the `auramobiles` repository from your GitHub account.
4. **Build and Output Settings** will automatically detect:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `./`
   - **Build Command**: `next build` (or `npm run build`)
   - **Output Directory**: `.next`
5. Click **Deploy**.

### Option 2: Vercel CLI
```bash
npm i -g vercel
vercel
```

---

## 📄 License
© 2026 AURA Luxe Mobile Boutique Ltd. All rights reserved.
