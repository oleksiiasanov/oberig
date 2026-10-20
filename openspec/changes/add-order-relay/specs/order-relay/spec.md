## ADDED Requirements

### Requirement: One idempotency key per order attempt
The cart SHALL send a `clientOrderId` (UUID v4) and `submittedAt` with every order, generated once per order attempt and reused while the order content stays the same.

#### Scenario: Retry after an error
- **WHEN** a submission fails and the visitor submits the same order again
- **THEN** the same `clientOrderId` and `submittedAt` are sent

#### Scenario: Order changed after an error
- **WHEN** the items, name, phone, comment, consent or language change before the next submission
- **THEN** a new `clientOrderId` and `submittedAt` are generated

#### Scenario: Order succeeded
- **WHEN** a submission succeeds
- **THEN** the next order uses a new `clientOrderId`

### Requirement: Google Sheets stays the primary order path
The cart SHALL show success only when the Apps Script web app answers `{ ok: true }`. The Apps Script SHALL skip an order whose `clientOrderId` is already in the sheet and still answer `{ ok: true }`.

#### Scenario: Repeated clientOrderId
- **WHEN** an order arrives with a `clientOrderId` already present in the `clientOrderId` column
- **THEN** no new row or notification is created and the response is `{ ok: true, duplicate: true, orderNumber }` with the number of the saved row, so the post-order survey still finds it

### Requirement: Best-effort copy to the OMS order intake
After the spreadsheet answers `{ ok: true }`, the cart SHALL post the order to `VITE_ORDER_MIRROR_URL` as `text/plain` JSON `{ clientOrderId, items: [{ id, cableLengthM?, quantity, unitPrice }], total, name, phone, comment, whatsappConsent, language, submittedAt }`, and the copy SHALL never change what the visitor sees.

#### Scenario: Intake not configured
- **WHEN** `VITE_ORDER_MIRROR_URL` is empty
- **THEN** no copy is sent

#### Scenario: Normalized lines
- **WHEN** several cart lines share the same id and cable length
- **THEN** the copy has one line with the summed quantity, lines sorted by id, then cable length, without product names

#### Scenario: Intake fails
- **WHEN** the intake errors or does not answer within 5 seconds
- **THEN** the visitor still sees the order as placed

### Requirement: Published price catalog
The build SHALL publish `/catalog.json` with one entry per sellable line (`id`, `cableLengthM` for products sold in lengths, `price` in whole UAH), computed by the same code the cart uses for prices.

#### Scenario: Catalog matches the cart
- **WHEN** the site is built
- **THEN** `/catalog.json` lists every cart line once with the price the cart charges, identical for both languages
