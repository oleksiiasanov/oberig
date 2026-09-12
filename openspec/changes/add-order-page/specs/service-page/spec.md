## ADDED Requirements

### Requirement: Service Page Route
The site SHALL provide a dedicated `/service` page presenting warranty and support terms, reachable by direct URL and by in-app navigation without a full page reload.

#### Scenario: Visitor opens the service page via navigation
- **WHEN** a visitor activates an in-app link to `/service`
- **THEN** the service page renders in place of the landing sections
- **AND** the browser URL updates to `/service` without a full page reload

#### Scenario: Visitor loads the service page directly
- **WHEN** a visitor requests `/service` directly (fresh load or refresh)
- **THEN** the service page renders correctly

### Requirement: Service Page Navigation Entry
The main header navigation SHALL include a link to the service page in both Ukrainian and English.

#### Scenario: Visitor opens the header navigation
- **WHEN** the header navigation is displayed
- **THEN** it includes a service-page link labeled in the active language
- **AND** activating it navigates to `/service`

### Requirement: Warranty And Support Content
The service page SHALL present the warranty term, what is covered, what voids the warranty, and the lifetime consultation support offered after the warranty period.

#### Scenario: Visitor reviews warranty terms
- **WHEN** the service page is displayed
- **THEN** it states a 12-month warranty from the date the device is received
- **AND** it lists the free warranty coverage (factory-defect diagnosis/repair, minor component replacement)
- **AND** it lists the conditions that void the warranty (physical damage, water/dirt ingress, unauthorized disassembly or modification)
- **AND** it describes the lifetime consultation support available after the warranty period.
