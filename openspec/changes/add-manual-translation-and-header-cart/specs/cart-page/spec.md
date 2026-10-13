## ADDED Requirements

### Requirement: Header cart
The header SHALL show a cart icon next to the language switcher that opens `/cart`.

#### Scenario: Empty cart
- **WHEN** a visitor who has added nothing taps the cart icon
- **THEN** `/cart` opens with every product at quantity 0 and no preselected product

#### Scenario: Items are kept for the session
- **WHEN** a visitor adds items and goes to other pages
- **THEN** the icon shows the number of added items and `/cart` still lists them, until the tab is closed or the order is sent

#### Scenario: Adding from the catalog
- **WHEN** a visitor taps "Замовити" on a product while the cart already has items
- **THEN** that product is added at quantity 1 and the existing items stay
