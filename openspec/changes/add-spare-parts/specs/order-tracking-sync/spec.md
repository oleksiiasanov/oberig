## ADDED Requirements

### Requirement: Spare parts in the spreadsheets
The CRM script SHALL record spare-part quantities in the orders spreadsheet and include them in the tracking spreadsheet.

#### Scenario: Orders spreadsheet
- **WHEN** an order contains spare antennas
- **THEN** their quantities are written to the "Антена 2.8 – 12 (більша)" and "Антена 0.5 – 3 (менша)" columns

#### Scenario: Tracking spreadsheet
- **WHEN** "Контакт" is ticked on an order with spare antennas
- **THEN** "Додаткове обладнання" lists them after the other accessories as `<column header> x<quantity>`
