## ADDED Requirements

### Requirement: Spare parts section
The `/order` page SHALL list spare parts in a separate "Комплектуючі" section below all product cards.

#### Scenario: Section placement
- **WHEN** the page renders
- **THEN** the "Комплектуючі" section appears after the last product card and shows each spare part as a compact card with name, model, short description, "Особливості", price and a "Замовити" button linking to `/cart?item=<id>`

#### Scenario: Quick navigation
- **WHEN** a visitor taps the "Комплектуючі" quick-navigation tab
- **THEN** the page scrolls to the "Комплектуючі" section
