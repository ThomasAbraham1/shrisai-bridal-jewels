# Shrisai Bridal Jewels — Codebase Guide
> **Who is this for?** Anyone (human or AI agent) making their first edit to this project. Read this before touching any file.

---

## 🗺️ What is this project?

A **React + TypeScript** e-commerce storefront for Shrisai Bridal Jewels, built with **Vite**. It connects to **Wix** as the backend for products, cart, checkout, payments (Razorpay via Wix), and member authentication.

The site is **not** a Wix website — it is a fully custom frontend (called "Headless" mode) that just uses Wix's APIs.

---

## 🏗️ Project Structure at a Glance

```
src/
├── main.tsx                  ← Entry point — renders the app
├── App.tsx                   ← Root component — just renders AppRouter
├── wixClient.ts              ← 🔑 Wix SDK setup. ALL API calls go through this.
├── entities/index.ts         ← 📦 TypeScript types for all data (Products, RentalProducts, etc.)
│
├── integrations/             ← The bridge between Wix data and the UI
│   ├── BaseCrudService.ts    ← 🔑 Fetches products/categories from Wix, maps raw data to our types
│   ├── categoryMap.json      ← Maps product SKUs → category name (used for filtering)
│   ├── index.ts              ← Re-exports everything for easy import
│   ├── cms/                  ← Cart state, currency, pricing hooks
│   └── members/              ← Login/logout, member session
│
├── components/
│   ├── Router.tsx            ← 🔑 All URL routes defined here
│   ├── Header.tsx            ← Top navigation bar (all pages share this)
│   ├── Footer.tsx            ← Footer (all pages share this)
│   ├── Cart.tsx              ← Slide-out cart drawer
│   ├── SearchOverlay.tsx     ← Full-screen search
│   ├── ProductCarousel.tsx   ← Reusable horizontal scrolling product carousel
│   ├── ProductImageGallery.tsx ← Image thumbnails on product detail page
│   ├── ProductBadges.tsx     ← "Low Stock" / "Out of Stock" badges
│   └── pages/                ← One file per page
│       ├── HomePage.tsx
│       ├── ShopPage.tsx
│       ├── ProductDetailPage.tsx
│       ├── RentalPage.tsx
│       ├── RentalBookingPage.tsx
│       ├── CheckoutPage.tsx
│       ├── ThankYouPage.tsx
│       └── ... (more pages)
│
└── lib/                      ← Pure utility functions (no UI)
    ├── pricing.ts            ← Discount calculations, display price logic
    ├── inventory.ts          ← Stock status (in-stock / low-stock / out-of-stock)
    ├── seo.ts                ← Page titles, meta descriptions for each route
    ├── wixMedia.ts           ← Converts Wix image URLs to usable https:// URLs
    └── performance.ts        ← Throttle/debounce helpers
```

---

## 🔑 The 3 Most Important Files

### 1. `src/wixClient.ts`

This file creates the connection to Wix. It imports Wix SDK modules (products, cart, checkout, members, etc.) and exports a single `wixClient` object. **Every API call in the app uses this object.**

```ts
// Example of how it's used in other files:
import wixClient from '@/wixClient';
const result = await wixClient.products.queryProducts().find();
```

> ⚠️ **If you ever change this file**, make sure you don't accidentally remove any modules — that will break whichever feature depended on it (cart, checkout, members, etc.)

---

### 2. `src/integrations/BaseCrudService.ts`

This is the **data adapter**. Pages don't call `wixClient` directly — they call `BaseCrudService`, which:
1. Calls the Wix API
2. Transforms the raw Wix data into our own `Products` / `RentalProducts` types
3. Returns clean, predictable objects to the UI

```ts
// How pages fetch products:
const result = await BaseCrudService.getAll('jewelleryproducts', {}, { limit: 100 });
const products = result.items; // Already typed, cleaned, image URLs fixed
```

**Key mapping logic inside `mapWixProduct()`:**

| Wix field | Our field | Notes |
|---|---|---|
| `p.name` | `itemName` | Product display name |
| `p.media.items[0].image.url` | `itemImage` | Main product image |
| `p.price.price` | `mrp` | Original price |
| `p.price.discountedPrice` | `ourPrice` | Sale price |
| `p.ribbons[].text` | `isBestSeller`, `newArrival` | Parsed from ribbon text |
| `p.stock.inStock` | `isAvailable` | Stock availability |

---

### 3. `src/entities/index.ts`

TypeScript interfaces that define the **shape of your data**. Everything the UI renders comes from these types.

```ts
// Products - jewellery items for sale
interface Products {
  _id: string;
  itemName: string;
  itemImage: string;
  ourPrice: number;   // discounted price shown to customer
  mrp: number;        // original/crossed-out price
  isBestSeller: boolean;
  newArrival: boolean;
  isAvailable: boolean;
  stockQuantity: number;
  // ... gallery images, category, etc.
}

// RentalProducts - jewellery for renting
interface RentalProducts {
  _id: string;
  name: string;
  image: string;
  price: number;
  availabilityStatus: boolean; // false = cannot be booked
}
```

---

## 🧭 How Routing Works

Routes are all defined in `src/components/Router.tsx`. Every URL maps to a page component:

| URL | Component |
|---|---|
| `/` | `HomePage.tsx` |
| `/shop` | `ShopPage.tsx` |
| `/product/:id` | `ProductDetailPage.tsx` |
| `/rental` | `RentalPage.tsx` |
| `/rental-booking/:id` | `RentalBookingPage.tsx` |
| `/checkout` | `CheckoutPage.tsx` |
| `/checkout/thank-you` | `ThankYouPage.tsx` |
| `/collections` | `CollectionsPage.tsx` (New Arrivals) |

**To add a new page:**
1. Create `src/components/pages/MyNewPage.tsx`
2. Import it in `Router.tsx`
3. Add a `{ path: 'my-url', element: <MyNewPage /> }` entry in the router config

---

## 🛒 How the Cart & Checkout Works

```
User clicks "Add to Cart"
        ↓
useCart() hook (in src/integrations/cms/)
        ↓
Items stored in localStorage (cart persists on browser refresh)
        ↓
User clicks "Checkout" → CheckoutPage.tsx
        ↓
Sends items to Wix currentCart API
        ↓
Creates a Wix Checkout session
        ↓
Redirects to Wix-hosted Razorpay payment page
        ↓
On completion, Wix redirects back to /checkout/thank-you?orderId=xxx
        ↓
ThankYouPage.tsx checks order status via wixClient.orders.getOrder()
   ✅ PAID → "Payment Successful", clears cart
   ❌ FAILED → "Payment Incomplete", keeps cart items intact
```

---

## 🖼️ How Images Work

Wix stores images using internal URLs like:
```
wix:image://v1/b9ec8c_57d59d.../filename.png#originWidth=1254
```

These **cannot be used directly** in img tags. They must be converted to:
```
https://static.wixstatic.com/media/b9ec8c_57d59d.../filename.png
```

**Two helpers handle this:**
- `src/lib/wixMedia.ts` — `getWixImageUrl()` for resizing/transforming (used in Header, SearchOverlay)
- `parseWixImageUrl()` inside `BaseCrudService.ts` — strips the `wix:image://` prefix for product images

> 💡 If images are broken, check whether `parseWixImageUrl()` is being called on the raw URL.

---

## 🎀 How Best Sellers & New Arrivals Work

In the **Wix dashboard**, each product has a "Ribbon" text field. The app reads this and sets:

- `isBestSeller = true` if the ribbon text contains **"best seller"** or **"bestseller"**
- `newArrival = true` if the ribbon text contains **"new"**

**To show a product in BOTH carousels on the homepage**, set its ribbon to:
```
Best Seller, New Arrival
```

This is parsed in `BaseCrudService.ts` inside the `mapWixProduct()` function.

---

## 🏷️ How Rental Availability Works

Each rental product in Wix CMS has an `availabilityStatus` boolean (checkbox).

| CMS value | What happens on site |
|---|---|
| ✅ Checked (true) | Product is bookable, "View & Book" button is active |
| ❌ Unchecked (false) | Shows "Out of Stock" badge, disables clicks, hides booking form |

This logic lives in:
- `src/components/pages/RentalPage.tsx` — controls card clickability and button state
- `src/components/pages/RentalBookingPage.tsx` — hides the form if `availabilityStatus === false`

---

## 🎨 Design System

Styling uses **Tailwind CSS**. Brand color tokens are in `tailwind.config.js`:

| Token | Color | Used for |
|---|---|---|
| `primary` | Gold/amber | Buttons, badges, price accents |
| `secondary` | Dark green | Navbar, headings |
| `background` | Cream/off-white | Page backgrounds |
| `primary-foreground` | White/cream | Text on dark backgrounds |
| `light-gold` | Lighter gold | Hover states |

**Typography classes:**
- `font-heading` — decorative serif font for titles (e.g., "Legacy of Gold")
- `font-paragraph` — clean sans-serif for body text and UI labels

---

## 🔧 Common Tasks

### Change announcement bar text
Edit the `announcements` array in `src/components/Header.tsx` around line 30.

### Add a new product category filter on the Shop page
The categories come from the `jewellerycategories` collection in Wix CMS (currently hard-coded in `BaseCrudService.ts` for reliability). Add a new entry there to make it appear in the UI.

### Change a page's SEO title or description
Edit `src/lib/seo.ts`. Each page has a key in the `SEO_PAGES` object.

### Fix a broken product image
Check if `parseWixImageUrl()` is applied to the URL in `BaseCrudService.ts`. URLs starting with `wix:image://` need this transformation.

### Change how prices are displayed
Look at `src/lib/pricing.ts`. The functions `getDisplayPrice()` and `hasValidDiscount()` control what gets shown.

---

## ⚠️ Known Gotchas

1. **Wix V1 vs V3 API** — The app uses the **V1 `products` SDK**. Do NOT switch to `productsV3` — the V3 API has a completely different data structure that breaks image URLs, pricing, gallery images, and the full checkout flow.

2. **`wixClient` is a singleton** — It is initialized once and shared across the entire app. Never re-initialize it inside a component.

3. **Category filtering uses `categoryMap.json`** — Products are mapped to categories via a SKU→category JSON file, NOT by Wix collections. If a new product doesn't appear under the right category filter, check whether its SKU exists in `src/integrations/categoryMap.json`.

4. **Ribbon limits** — Wix V1 returns only one ribbon string per product. Multiple carousels (Best Sellers + New Arrivals) are supported by setting comma-separated values in that one ribbon field (e.g. `"Best Seller, New Arrival"`).

5. **Stock quantity fallback** — `stockQuantity` defaults to `999` when `p.stock.inStock === true` but no specific quantity is tracked in Wix. This prevents items from incorrectly showing "Out of Stock" when inventory tracking is disabled.

---

## 🚀 Running the Project

```bash
# Install dependencies (first time only)
npm install

# Start local development server
npm run dev

# Build for production deployment
npm run build
```

The app runs at **http://localhost:5173** by default.

---

## 📁 Environment Variables

Check `.env` or `.env.local` for:
```
VITE_WIX_CLIENT_ID=your-wix-client-id
```
This is required for **all** Wix API calls to work. Get it from your Wix project's Headless settings panel.
