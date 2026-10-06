## ADDED Requirements

### Requirement: Contacted orders are copied to the tracking spreadsheet
The CRM script SHALL append an order to the tracking spreadsheet when its "Контакт" checkbox is ticked in the CRM orders tab.

#### Scenario: Ticking the checkbox
- **WHEN** a manager ticks "Контакт" on an order that has a "№ замовлення"
- **THEN** a new row is added below the last row of the tracking tab with "№ замовлення", "Дата заявки" (from "Timestamp", shown as dd/mm/yy), "ПІБ" (from "Імʼя"), "Телефон" (from "Номер"), "Кількість детекторів" and "Сума замовлення" (from "Разом")

#### Scenario: Accessories
- **WHEN** the order has accessories with a quantity above 0
- **THEN** "Додаткове обладнання" lists them one per line as `<accessory name> x<quantity>` in CRM column order, and is empty when there are none

#### Scenario: Other columns
- **WHEN** the row is added
- **THEN** no other column of the new row and no existing row of the tracking spreadsheet is changed

#### Scenario: Already copied
- **WHEN** the order number already exists in the tracking tab, or the checkbox is unticked
- **THEN** nothing is written
