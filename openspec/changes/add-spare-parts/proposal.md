# Change: Add spare parts ("Комплектуючі") to /order and /cart

## Why
Customers need to order replacement detector antennas. They are spare parts, not regular products, so they should sit apart from the product cards.

## What Changes
- `/order`: a "Комплектуючі" section below all product cards with compact cards for "Антена 2800 – 12000 МГц" (DV-A 2.8-12, 250 грн) and "Антена 500 – 3000 МГц" (DV-A 0.5-3, 200 грн), plus a "Комплектуючі" quick-navigation tab.
- `/cart`: spare parts are listed in their own "Комплектуючі" section and are ordered like any other item.
- CRM script: quantities go to the "Антена 2.8 – 12 (більша)" and "Антена 0.5 – 3 (менша)" columns of the orders spreadsheet and are listed in "Додаткове обладнання" of the tracking spreadsheet.

## Impact
- Affected specs: `order-page`, `cart-page`, `order-tracking-sync`
- Affected code: `src/data/content.js`, `src/components/OrderPage.jsx`, `src/components/CartPage.jsx`, `src/styles.css`, `crm/Code.gs`
- Manual step: add the two columns to the orders spreadsheet if missing and redeploy the Apps Script.
