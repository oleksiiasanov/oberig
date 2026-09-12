## 1. Content
- [x] 1.1 Add bilingual (uk/en) `order` content block to `src/data/content.js`: page meta, item entries (detector, car holder, car antenna, bunker antenna) with name, short/long description, characteristics, functionality, extras, and (where known) price, sourced from the shared doc.
- [x] 1.2 Add `/order` nav entry to both language `nav` arrays.

## 2. Order page
- [x] 2.1 Create `src/components/OrderPage.jsx`: page hero, and an item list where each item shows a photo (or icon placeholder), name, expandable description, characteristics tables, functionality tiles, extras, price, and an "Order" button linking to `content.orderUrl`.
- [x] 2.2 Add order-page styles to `src/styles.css` (mobile-first, reusing existing tokens/`.btn`/`.section` patterns), including a `prefers-reduced-motion`-safe entrance.
- [x] 2.3 Support a real per-item photo (`item.photo`) with graceful fallback to an icon placeholder for items without one yet.

## 3. Routing and navigation
- [x] 3.1 Extend `getPageFromLocation`/`handleNavigate` in `src/App.jsx` to support `/order` the same way `/manual` is handled, and render `OrderPage` for that route.
- [x] 3.2 Update the document title effect in `App.jsx` to cover the order page.
- [x] 3.3 Add a `/order` rewrite to `vercel.json`.

## 4. Home CTA change
- [x] 4.1 Update `src/components/CTAButtons.jsx` primary action to link to `/order` instead of `content.orderUrl` directly (internal link, same tab, matching the existing tertiary manual-link pattern).

## 5. Header navigation simplification
- [x] 5.1 Trim the header `nav` arrays down to `/order` ("Продукти"/"Products") and `/manual` ("Інструкція"/"Manual"), removing the in-page anchor links.
- [x] 5.2 Remove the manual link's distinct accent color in `Header.jsx`/`styles.css` so all nav tabs share the same color.

## 6. Service page
- [x] 6.1 Add bilingual `service` content block to `src/data/content.js` (title, lead, warranty/exclusions/support sections), sourced from the shared doc.
- [x] 6.2 Create `src/components/ServicePage.jsx` and `service-*` styles in `src/styles.css`.
- [x] 6.3 Wire `/service` into `App.jsx` routing/title effect, `vercel.json` rewrite, and add it as a third header nav tab.

## 7. Verification
- [x] 7.1 Run `npm run check` (content/design checks + production build) after each round of edits.
- [ ] 7.2 Manually click through in a browser: home primary CTA -> `/order` -> each item's Order button opens the Google Form; header nav `/order`, `/manual`, `/service` links; direct load of each route and browser back/forward.
