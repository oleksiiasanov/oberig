# Change: Add dedicated /order page for the product catalog

## Why
The site currently sends every "Order" CTA straight to the external Google Form, with no place to show what is actually for sale. The product line has grown beyond the single detector (car holder, car antenna, bunker/dugout antenna), so visitors need a page that presents each item with a description before they commit to filling out the form.

## What Changes
- Add a new `/order` page listing orderable items: the D·Vision SDR detector, the car holder, the external car antenna, and the external bunker/dugout antenna, each with name, description, key specs, and an order action.
- Add `/order` to the main header navigation (Ukrainian and English).
- **BREAKING (behavior change, not API):** The primary "Order" CTA on the landing page now navigates to `/order` first, instead of opening the Google Form directly. Each item on `/order` still opens the existing Google Form (`https://forms.gle/xFcMaTWR1G5pR4qW6`) to submit an order - the intake process itself is unchanged.
- Add a Vercel rewrite for `/order` so direct links and refreshes work, matching the existing `/manual` pattern.
- Update the site-wide frequency claim from 500-8000 MHz to 500-8700 MHz (hero, comparison table, meta descriptions, content checks) to match the confirmed current spec.
- Simplify the header navigation down to two tabs, "Продукти" (`/order`) and "Інструкція" (`/manual`), removing the in-page anchor links (Advantages, Specs, Compare, FAQ) and the manual link's distinct accent color so all tabs read the same.
- Add a new `/service` page ("Сервіс та гарантія" / "Service & Warranty") covering warranty terms, exclusions, and lifetime support, sourced from a shared doc, and add it as a third header tab.

## Impact
- Affected specs: `order-page` (new capability), `service-page` (new capability), `fpv-detector-landing` (CTA Destinations requirement)
- Affected code: `src/App.jsx`, `src/components/Header.jsx`, `src/components/CTAButtons.jsx`, `src/data/content.js`, `src/components/OrderPage.jsx`, new `src/components/ServicePage.jsx`, `vercel.json`, `src/styles.css`
- Content source: product copy for the order-page items comes from `https://docs.google.com/document/d/1eZIGild6AknHlU5e6N_2mmzgsj_qOisa1X4Yqtb0xLs`; service-page copy comes from `https://docs.google.com/document/d/1joaha-nCylk24Xl0jPzGgPOPdG9CPNFPVP3LsNfpPIY`. Product photos were not included in the order-page doc; only the detector has a real photo so far (icon placeholders remain for the other three items until photos are supplied).
