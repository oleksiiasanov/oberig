# Change: Manage website catalog in CRM

## Why
Hardcoded website data and cached gateway prices drift and reject legitimate checkout.

## What Changes
- Owner-approved implementation and immediate release (2026-10-22): migrate the current public Ukrainian/English product content, images and sellable variants to CRM; manage publishing, availability and ordering there.
- Public allowlisted catalog and fresh cart verification; final authoritative validation within the order transaction. Preserve buyer confirmation, contacts and retry identity.
- Assigning an occupied positive display position clears the former owner; null positions sort last.
- Reconcile finished products against the current website with an audited backup-backed operation; retain historical references and component recipes. Current inspection finds no extra finished products, nine matches and one missing variant.
- Preserve temporary Google Sheets copy.

## Impact
- CRM schema, product editor, intake, public gateway, landing catalog/cart, deployment and product-data import.
- No credentials exposed publicly; existing Access, challenge and write permissions remain.
