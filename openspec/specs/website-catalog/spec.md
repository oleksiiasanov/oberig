# website-catalog Specification

## Purpose
Maintain one CRM-managed public catalog for the website, with current prices, explicit buyer consent for changes, protected administration and safe order retries.
## Requirements
### Requirement: Authoritative public catalog
The system SHALL manage localized product descriptions, parameters, SKU, raster images, prices, publication and orderability through protected CRM controls and expose only explicitly public data.
#### Scenario: Publish edited product
- **WHEN** an authorized editor saves a published product
- **THEN** a fresh public catalog returns its new public values and no operational secrets or costs.
#### Scenario: Hidden or unavailable product
- **WHEN** a listing is unpublished or disabled for ordering
- **THEN** fresh checkout refuses that item with an actionable unavailable result and preserves the remaining cart.

### Requirement: Display ordering
The system SHALL sort assigned positive positions ascending and unassigned positions last.
#### Scenario: Occupied position
- **WHEN** an editor assigns a position already used by another listing
- **THEN** that position belongs to the edited listing and the other listing loses its position atomically.

### Requirement: Price consent and atomic acceptance
The system SHALL validate current availability and prices on adding to cart and again in the order creation transaction without silently changing buyer totals.
#### Scenario: Price change
- **WHEN** the displayed price differs from the authoritative price
- **THEN** the buyer sees the old and new price and explicitly confirms the change before submission.
#### Scenario: Retry after successful commit
- **WHEN** the same accepted request is retried after a catalog change
- **THEN** the original acknowledgement is replayed without duplicate orders.

### Requirement: Website migration preserves history
The system SHALL copy current website content and images into the managed catalog, reconcile finished-product identities and preserve historical orders, documents and component recipes.
#### Scenario: Existing sales product
- **WHEN** a website variant matches an existing sales product
- **THEN** its current public fields and price are updated without altering historical snapshots or deleting referenced records.
