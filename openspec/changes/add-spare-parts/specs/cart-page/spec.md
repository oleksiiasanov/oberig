## ADDED Requirements

### Requirement: Spare parts in the cart
The `/cart` page SHALL list spare parts in their own "Комплектуючі" section, separate from "Виберіть супутнє обладнання".

#### Scenario: Adding a spare part
- **WHEN** a visitor sets a spare part's quantity above 0
- **THEN** it is highlighted as added, appears in "Разом" with its model and price, and is sent with the order request

#### Scenario: Opening from a spare part
- **WHEN** a visitor taps "Замовити" on a spare part on `/order`
- **THEN** `/cart` opens with that part at the top with quantity 1 and the remaining spare parts under "Комплектуючі"
