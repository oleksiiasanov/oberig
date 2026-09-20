## ADDED Requirements

### Requirement: Cart page
The site SHALL provide a `/cart` page where a visitor selects quantities of the chosen item and accessories and submits an order request without payment.

#### Scenario: Opening from the catalog
- **WHEN** a visitor taps "Замовити" on a product on `/order`
- **THEN** `/cart?item=<id>` opens with H1 "Ваше замовлення" and that product highlighted at the top with quantity 1

#### Scenario: Quantities
- **WHEN** the visitor changes a quantity
- **THEN** the chosen item allows 1-300 and each accessory allows 0-300, and accessories with quantity above 0 are highlighted as added

#### Scenario: Accessories list
- **WHEN** the page renders
- **THEN** every other `/order` product is listed under "Виберіть супутнє обладнання" and tapping one opens a preview with its full description from `/order`

#### Scenario: Submitting
- **WHEN** the visitor enters name and phone and taps "Залишити заявку"
- **THEN** the success message "Дякуємо за замовлення. Ми зв'яжемося з вами для підтвердження черги та уточнення деталей найближчим часом." is shown
