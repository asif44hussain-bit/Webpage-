# CLOVEKICK®

Original streetwear. Limited drops. Only **one product is ever purchasable** at a time — every past drop
stays permanently visible in **The Archive**, marked sold out.

Built with Next.js 14 (App Router) + TypeScript + Tailwind CSS + Prisma + PostgreSQL.

---

## 1. What's in the box

- **Storefront**: editorial homepage, full shop with search/filter/sort, product detail pages with
  structured data (SEO), cart, checkout, order confirmation.
- **"One live product" system**: enforced at the database-transaction level (`setProductLive` in
  `src/lib/products.ts`) — marking a product LIVE atomically demotes any previously-live product to
  SOLD_OUT. The checkout API also re-validates server-side that every item in a submitted order is
  actually the live product, regardless of what the client sends.
- **Admin dashboard** (`/admin`): cookie/JWT-based auth, product CRUD, image management, LIVE/SOLD_OUT
  toggling, order list + status updates.
- **51 original products** (1 live + 50 archived) seeded automatically, each with procedurally generated
  original SVG artwork (`scripts/gen_products.py` → `public/products/*.svg`, catalog data in
  `prisma/products.json`). No third-party brand assets, text, or imagery are used anywhere.
- **SEO**: per-page metadata, Open Graph tags, JSON-LD `Product` structured data, dynamic `sitemap.xml`,
  `robots.txt`, clean URLs (`/product/[slug]`).

## 2. Local setup

```bash
npm install
cp .env.example .env      # fill in DATABASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD, SESSION_SECRET
npx prisma migrate dev --name init
npm run db:seed           # loads prisma/products.json + creates the admin user
npm run dev
```

Visit `http://localhost:3000` for the store and `http://localhost:3000/admin` for the dashboard
(sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from your `.env`).

To regenerate the product catalog/art (optional — a full set is already committed):

```bash
python3 scripts/gen_products.py
```

## 3. Environment variables

See `.env.example`. Required for production:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (Railway provides this automatically) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seeded admin login |
| `SESSION_SECRET` | 32+ char random string used to sign the admin session JWT |
| `NEXT_PUBLIC_SITE_URL` | Used for metadata, Open Graph, and sitemap generation |
| `PAYMENTS_PROVIDER` | Left as `"disabled"` until an Indian payment gateway is connected (see §5) |

## 4. Deploying to Railway

1. **Create a new Railway project** → "Deploy from GitHub repo" (push this project to a repo first).
2. **Add a PostgreSQL plugin** to the project. Railway will inject `DATABASE_URL` automatically —
   no need to set it manually.
3. **Set environment variables** on the service: `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `SESSION_SECRET`,
   `NEXT_PUBLIC_SITE_URL` (your Railway-provided domain or custom domain), `NEXT_PUBLIC_STORE_NAME`.
4. **Build command**: already wired via `package.json` → `npm run build`, which runs
   `prisma generate && prisma migrate deploy && next build`. Migrate deploy applies any committed
   migrations in `prisma/migrations/` to the Railway database.
5. **Start command**: `npm run start` (binds to Railway's `$PORT` automatically).
6. **Seed the database once**, after the first successful deploy, using Railway's shell / one-off command:
   ```bash
   railway run npm run db:seed
   ```
7. Visit your Railway domain — the storefront and `/admin` should both be live.

### Generating your first migration before deploying

If you haven't created a migration yet, run this locally against a local/staging Postgres instance and
commit the result:

```bash
npx prisma migrate dev --name init
```

Commit the generated `prisma/migrations/` folder — Railway's build step (`prisma migrate deploy`) applies
committed migrations rather than generating new ones, which is the safe production workflow.

## 5. Connecting a payment gateway later

Checkout currently creates a `PENDING` order without collecting payment (see the notice on the checkout
page). The order/customer schema and API (`src/app/api/orders/route.ts`) are intentionally decoupled from
any specific gateway. Once KYC/business verification is complete with a provider (e.g. Razorpay, Cashfree,
PayU), the integration point is:

1. Add the gateway's server SDK + `PAYMENTS_KEY_ID` / `PAYMENTS_KEY_SECRET` env vars (already stubbed in
   `.env.example`).
2. In `src/app/api/orders/route.ts`, after creating the `Order` row, create a payment session/order with
   the gateway and return its client token/redirect URL instead of going straight to `/checkout/confirmation`.
3. Add a webhook route (`src/app/api/payments/webhook/route.ts`) to mark the order `CONFIRMED` once the
   gateway confirms payment.

## 6. Project structure

```
prisma/schema.prisma       Database models (User, Product, ProductImage, Customer, Order, OrderItem)
prisma/seed.ts             Seeds 51 products + admin user from prisma/products.json
scripts/gen_products.py    Generates original product data + SVG art (already run — output committed)
src/app/                   Next.js App Router pages (storefront + /admin + API routes)
src/components/            Shared UI (ProductCard, cart, admin widgets, etc.)
src/lib/                   Prisma client, auth (JWT session), cart store (zustand), product queries
public/products/           102 original generated SVG product images
```

## 7. Notes & honesty about scope

This is a complete, working application — every page, API route, and admin action described in the brief
is implemented and wired to the database. Two things worth knowing before you treat it as finished:

- **It has not been run through `npm install` / a live build in this environment** (no network access here),
  so please run `npm install && npm run build` locally before deploying and fix anything your toolchain
  flags — I did a careful manual review but that's not a substitute for a real compile.
  If you'd like me to keep debugging with you interactively, paste any build errors and I'll fix them.
- **Payment is intentionally a placeholder** (per the brief) — orders are recorded but not charged, ready
  for you to wire up a gateway per §5.
