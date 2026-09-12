## ADDED Requirements

### Requirement: Order Page Route
The site SHALL provide a dedicated `/order` page that lists orderable products, reachable by direct URL and by in-app navigation without a full page reload.

#### Scenario: Visitor opens the order page via navigation
- **WHEN** a visitor activates an in-app link to `/order`
- **THEN** the order page renders in place of the landing sections
- **AND** the browser URL updates to `/order` without a full page reload

#### Scenario: Visitor loads the order page directly
- **WHEN** a visitor requests `/order` directly (fresh load or refresh)
- **THEN** the order page renders correctly

### Requirement: Order Page Navigation Entry
The main header navigation SHALL include a link to the order page in both Ukrainian and English.

#### Scenario: Visitor opens the header navigation
- **WHEN** the header navigation is displayed
- **THEN** it includes an order-page link labeled in the active language
- **AND** activating it navigates to `/order`

### Requirement: Orderable Item Catalog
The order page SHALL list each orderable item with a name, a description, and key specifications. The catalog SHALL include: the D·Vision SDR detector, the automotive holder for the detector, the external antenna for car mounting, and the external antenna for bunker/dugout mounting.

#### Scenario: Visitor reviews the catalog
- **WHEN** the order page is displayed
- **THEN** each of the four items shows a name, a description, and its key specifications
- **AND** an item without a supplied product photo shows a placeholder visual instead of a broken image

### Requirement: Order Page CTA Destination
Each item on the order page SHALL provide an action that opens the existing Google Form used for order intake.

#### Scenario: Visitor orders an item
- **WHEN** a visitor activates an item's order action on `/order`
- **THEN** it opens `https://forms.gle/xFcMaTWR1G5pR4qW6` in a new tab
