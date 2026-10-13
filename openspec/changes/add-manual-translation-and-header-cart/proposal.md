# Change: English manual and a header cart

## Why
The manual is synced from a Ukrainian Notion page, so English visitors saw Ukrainian text. The cart could only be reached through a "Замовити" button and forgot its contents when the visitor left the page.

## What Changes
- `/manual`: English text comes from `src/data/manual.en.json`, a dictionary keyed by the Ukrainian source text. Text without a translation falls back to Ukrainian, and the Notion sync lists it in its log.
- Header: a cart icon next to the language switcher opens `/cart` and shows the number of added items.
- `/cart`: opened from the header it has no preselected product; quantities are kept in `sessionStorage` across pages and cleared when the tab is closed or the order is sent. "Замовити" adds the product to the existing cart instead of replacing it.
- Spare antenna photos were swapped between the two cards.

## Impact
- Affected specs: `manual-page`, `cart-page`
- Affected code: `src/components/ManualPage.jsx`, `src/components/CartPage.jsx`, `src/components/Header.jsx`, `src/lib/manualText.js`, `src/lib/cartStore.js`, `src/data/manual.en.json`, `src/data/content.js`, `src/styles.css`, `scripts/sync-notion-manual.mjs`
