# Change: Website presentation groups
## Why
Owner requested and authorized release of a CRM-managed Main/Additional presentation type, independent of inventory COMPONENT kind.
## What Changes
- Preserve displayGroup from the public API.
- Show MAIN items first and ADDITIONAL below the buyer-facing heading Комплектуючі / Accessories.
- Preserve API ordering within groups, existing cards, prices and checkout.
## Impact
Catalog display only. Missing group during rolling deployment defaults to MAIN.
