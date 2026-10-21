## ADDED Requirements

### Requirement: CRM-authoritative independent checkout
The system SHALL persist website orders in CRM independently of the temporary Google Sheets copy and SHALL acknowledge success only after CRM commits.

#### Scenario: Sheets fails
- **WHEN** CRM commits and the independent Sheets call fails
- **THEN** the customer sees the normal thank-you message and the copy failure is observable without exposing customer data

#### Scenario: CRM unavailable
- **WHEN** CRM does not confirm persistence
- **THEN** the customer sees a generic retry message, the form remains, and the next attempt reuses the stable order ID

### Requirement: Idempotent retries
The system SHALL preserve an attempt across reload and SHALL prevent concurrent or ambiguous-response retries from creating duplicate orders.

#### Scenario: Response lost after commit
- **WHEN** the same ID and order content are resent
- **THEN** CRM returns the existing result without another order

#### Scenario: Changed order
- **WHEN** the order content changes
- **THEN** a new attempt ID is used and conflicting reuse of an old ID is refused

### Requirement: Narrow public intake boundary
The public service SHALL verify Turnstile, catalog, input and request limits and SHALL hold only the private intake credential; administrative APIs SHALL retain Cloudflare Access protection.

#### Scenario: Forged or unauthorized request
- **WHEN** a public request has invalid bot verification, altered prices, invalid quantities or tries another route
- **THEN** it cannot create an order or read CRM data

### Requirement: Quantities without a business cap
The website and both intake validators SHALL accept positive integer quantities above99 within the existing numeric representation and money safety bounds, including after duplicate-line merging.

#### Scenario: Large order
- **WHEN** a buyer orders100,1000 or10000 units at representable prices
- **THEN** UI, API and CRM preserve the exact quantity and total without clamping
