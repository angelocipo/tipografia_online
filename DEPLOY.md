# Deploy — Vercel + Stripe

This site is now a static front-end (`index.html`) plus one serverless function
(`api/create-checkout-session.js`) that talks to Stripe. No WordPress/WooCommerce needed.

## 1. Deploy to Vercel

1. Push this folder to a GitHub repo (or drag-and-drop deploy at vercel.com/new).
2. Import the repo in Vercel. Framework preset: "Other" (no build step needed).
3. In Vercel Project → Settings → Environment Variables, add:
   - `STRIPE_SECRET_KEY` = your Stripe secret key (`sk_test_...` while testing, `sk_live_...` when live)
4. Deploy. Vercel automatically turns `api/create-checkout-session.js` into a live endpoint
   at `/api/create-checkout-session`.

## 2. Point your domain

- While testing: use the `*.vercel.app` URL Vercel gives you, or attach `printeurope.pro`
  in Vercel → Settings → Domains.
- When ready: attach `tipografia.online` the same way (just add the domain + update DNS —
  Vercel gives you the exact records to add at your registrar).

## 3. Go live with Stripe

- Test first with the `sk_test_...` key (use Stripe's test card `4242 4242 4242 4242`, any future date/CVC).
- When ready, swap `STRIPE_SECRET_KEY` to your `sk_live_...` key in Vercel env vars and redeploy.
- Every order appears in your Stripe Dashboard; enable Settings → Notifications so you get
  an email for each payment (Stripe does this by default for the account owner).

## 4. PayPal (next step)

`index.html` already renders PayPal Smart Buttons client-side once you replace
`YOUR_PAYPAL_CLIENT_ID` in the `<script src="https://www.paypal.com/sdk/js...">` tag with your
real PayPal app Client ID (developer.paypal.com → My Apps & Credentials → Live).

## How pricing stays trustworthy

The browser only sends *which* product + which tier/size the customer picked — never a price.
`api/create-checkout-session.js` looks up the real price server-side from `api/_pricing-data.js`
before creating the Stripe Checkout Session, so a customer can't tamper with the amount from
devtools. If you change a price in `index.html`, mirror the same number in
`api/_pricing-data.js`.
