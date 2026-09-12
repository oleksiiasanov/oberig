## MODIFIED Requirements

### Requirement: CTA Destinations
The landing page SHALL route conversion actions to the approved order and contact destinations.

#### Scenario: Visitor starts an order
- **WHEN** a visitor activates the primary order CTA on the landing page
- **THEN** it navigates to the `/order` page
- **AND** from the order page the visitor can proceed to `https://forms.gle/xFcMaTWR1G5pR4qW6` to submit an order for a specific item.

#### Scenario: Visitor contacts D·Vision SDR
- **WHEN** a visitor activates a contact CTA
- **THEN** it opens `https://wa.me/380954716680`.

### Requirement: Hero Positioning
The landing page SHALL position D·Vision SDR as a wide-band drone detector with SDR-based FPV video detection.

#### Scenario: Visitor views the first screen
- **WHEN** the first viewport loads
- **THEN** the hero shows the product name "D·Vision SDR"
- **AND** states wide-band drone detection coverage of 500-8700 MHz
- **AND** highlights approximately 9-second full-range scanning
- **AND** includes order and contact actions
- **AND** uses the real detector product image with accurate alt text.
