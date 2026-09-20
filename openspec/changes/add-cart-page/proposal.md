# Change: Add /cart ordering flow

## Why
"Замовити" buttons on /order opened the external Google Form. Visitors need to pick quantities and add accessories in one place before leaving a request.

## What Changes
- New `/cart` page ("Ваше замовлення"): chosen item on top with quantity (1-300) and "Далі"; "Виберіть супутнє обладнання" list of all other /order items with quantity (0-300), preview modal with full product details, and "Далі"; name + phone; "Залишити заявку" shows the success message.
- Every "Замовити" CTA on /order links to `/cart?item=<id>`.
- Vercel rewrite for `/cart`.
- No payment. Submission posts to a Google Apps Script web app (`crm/Code.gs`, `src/lib/submitOrder.js`) that appends a row to the orders spreadsheet.

## Impact
- Affected specs: `cart-page` (new), `order-page` (CTA destination)
- Affected code: `src/App.jsx`, `src/components/OrderPage.jsx`, `src/components/CartPage.jsx`, `src/data/content.js`, `src/lib/submitOrder.js`, `src/styles.css`, `vercel.json`
