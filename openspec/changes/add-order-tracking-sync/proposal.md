# Change: Copy contacted orders to the tracking spreadsheet

## Why
Orders arrive in the CRM spreadsheet ("Передзамовлення виробів D.vision SDR"), but payments and shipments are tracked in a second spreadsheet ("SDR _ трекінг оплат і відправок"). Today a manager retypes each order there by hand.

## What Changes
- When a manager ticks the "Контакт" checkbox of an order in the CRM tab, the order is appended as a new row to the tracking spreadsheet.
- Only these tracking columns are written, found by header text: "№ замовлення", "Дата заявки", "ПІБ", "Телефон", "Кількість детекторів", "Додаткове обладнання", "Сума замовлення". Every other cell is left alone.
- "Додаткове обладнання" lists each accessory with a quantity above 0, one per line, as `<CRM column header> x<quantity>`.
- An order number that is already present in the tracking spreadsheet is never added twice; unticking the checkbox does nothing.
- The tracking tab URL is read from the `TRACKING_SHEET_URL` Script property, so it is not stored in the public repository.
- Runs from an installable `onEdit` trigger in `crm/Code.gs` (a simple trigger cannot write to another spreadsheet), installed once from the editor.

## Impact
- Affected specs: `order-tracking-sync` (new)
- Affected code: `crm/Code.gs`, `crm/README.md`
- Needs a one-time Google authorization by the spreadsheet owner (access to other spreadsheets).
