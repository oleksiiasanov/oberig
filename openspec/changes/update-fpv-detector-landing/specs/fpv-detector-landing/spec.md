## ADDED Requirements
### Requirement: Military-Audience Landing Content
The landing page SHALL be written in Ukrainian for a military audience that already understands FPV, UAV video links, VTX, EW, false positives, and real RF environments.

#### Scenario: User reads the landing copy
- **WHEN** the landing page is displayed
- **THEN** the copy uses concise technical Ukrainian terminology
- **AND** the copy does not explain basic FPV concepts or use civilian dramatization

### Requirement: Hero Spectrum Positioning
The landing page SHALL present the product as an all-band FPV and UAV detector covering 1050-6040 MHz without blind zones.

#### Scenario: User views the hero section
- **WHEN** the first viewport is loaded
- **THEN** the page shows the headline "Вседіапазонний детектор FPV та БПЛА"
- **AND** the page shows the subheadline "Покриття 1050-6040 МГц без сліпих зон для роботи в актуальній РЕО."
- **AND** the page shows CTAs for consultation and ordering/commercial proposal
- **AND** the page shows a visual spectrum scale from 1050 to 6040 MHz with continuous active product coverage

### Requirement: Current Frequency Reality Section
The landing page SHALL show that current FPV/VTX configurations use multiple frequency areas and that narrow-band detectors create blind zones.

#### Scenario: User reviews current airborne signal context
- **WHEN** the "Що реально літає зараз" section is displayed
- **THEN** it includes frequency rows or cards for relevant areas such as 1.2, 2.4, 3.3, 3.5, 4.9, and 5.8 GHz
- **AND** each row explains where the frequency may appear and the risk for a narrow-band detector

### Requirement: Frequency Coverage Comparison Visual
The landing page SHALL include a primary coverage comparison visual that compares continuous product coverage against typical narrow-band detector coverage.

#### Scenario: User compares detector coverage
- **WHEN** the "Покриття частот" section is displayed
- **THEN** the page shows a 1050-6040 MHz scale
- **AND** the product row is a continuous band from 1050 to 6040 MHz
- **AND** typical 1.2/2.4/5.8, 2.4/5.8, and 5.8-only detector rows show shorter coverage with visible gaps
- **AND** competitors are described generically unless approved competitor data is provided

### Requirement: Detected Signal Classes
The landing page SHALL describe detected signal classes with careful non-guarantee wording.

#### Scenario: User reviews what the product detects
- **WHEN** the "Що виявляє" section is displayed
- **THEN** the page mentions FPV analog in supported ranges, DJI/quadro with video emission in the supported spectrum, non-standard VTX within 1050-6040 MHz, and some wings/custom platforms depending on video link
- **AND** the page states that detection depends on height, transmitter power, antennas, terrain, RF noise, and the specific aircraft configuration
- **AND** the page does not claim the product sees all drones

### Requirement: Detector Comparison Table
The landing page SHALL include a detector comparison table covering product, typical 1.2/2.4/5.8, typical 2.4/5.8, and 5.8-only detector columns.

#### Scenario: User scans detector capabilities
- **WHEN** the comparison table is displayed
- **THEN** it compares 1050-6040 MHz, 1.2 GHz, 2.4 GHz, 3.3-3.5 GHz, 4.9-6.0 GHz, non-standard VTX support, terrain calibration, noise filtering, operation near EW, alert/EW integration, blackout mode, and direction finding

### Requirement: Complex RF Environment Operation
The landing page SHALL include a section about operation in complex RF environments without turning the product into a generic alarm for all nearby emissions.

#### Scenario: User reviews RF environment behavior
- **WHEN** the "Робота в складній РЕО" section is displayed
- **THEN** it describes noise filtering, threshold adaptation, position-specific calibration, false positive reduction, optional disabling of interfering bands, and operation near WiFi, Bluetooth, and EW

### Requirement: Work Modes
The landing page SHALL present expected work modes as concise technical cards.

#### Scenario: User reviews work modes
- **WHEN** the "Режими роботи" section is displayed
- **THEN** it includes standby, FPV only, direction finding, blackout, EW integration, and spectrum monitoring cards
- **AND** Android, PC, and USB monitoring are marked as supported only if confirmed or as placeholders otherwise

### Requirement: Position Defense Integration
The landing page SHALL show the detector as an element of a position-defense system rather than a standalone beeper.

#### Scenario: User reviews system integration
- **WHEN** the "Інтеграція в захист позиції" section is displayed
- **THEN** it shows a flow equivalent to "Дрон / VTX -> Детектор -> Оповіщення -> РЕБ / укриття / КП"
- **AND** it lists suitable use contexts including positions, observation posts, command posts, vehicle crews, mobile groups, EW teams, and reconnaissance

### Requirement: Field Verification Placeholders
The landing page SHALL reserve space for tests and field verification without inventing data.

#### Scenario: User reviews tests and feedback
- **WHEN** the "Тести та польова перевірка" section is displayed
- **THEN** it includes placeholders for test videos, number of test flights, verified VTX/video links, unit feedback, and field photos/videos
- **AND** unconfirmed values remain clearly marked as placeholders

### Requirement: Technical Characteristics Placeholders
The landing page SHALL include a technical characteristics table near the end of the page with placeholders for unconfirmed values.

#### Scenario: User reviews technical characteristics
- **WHEN** the technical characteristics section is displayed
- **THEN** the table includes operating range 1050-6040 MHz and supported ranges 1.2 / 1.3 / 2.4 / 3.3 / 3.5 / 4.9 / 5.2 / 5.8
- **AND** it includes fields for notification methods, battery, autonomy, connectors, antennas, enclosure protection, weight, package contents, and options
- **AND** unknown fields use explicit placeholders instead of invented specifications

### Requirement: FAQ And Final CTA
The landing page SHALL include a technical FAQ and a final CTA focused on closing frequency gaps.

#### Scenario: User reaches the final page sections
- **WHEN** the FAQ and final CTA are displayed
- **THEN** the FAQ covers frequencies, difference from 2.4/5.8 detectors, non-standard VTX, EW-adjacent operation, disabling bands, blackout mode, detection range dependencies, external antenna support, and suitability for vehicle/position/command-post use
- **AND** the final CTA headline is "Закрийте частотні діри на позиції"
- **AND** the final CTA offers consultation and ordering/commercial proposal actions

### Requirement: Visual Style And Responsiveness
The landing page SHALL use a dark technical military-style interface and remain responsive across mobile, tablet, and desktop.

#### Scenario: User views the landing on different devices
- **WHEN** the page is viewed on mobile, tablet, or desktop
- **THEN** spectrum scales, tables, cards, CTAs, and section text remain readable without incoherent overlap
- **AND** the visual system uses dark background, graphite, olive, muted green, and amber frequency accents
- **AND** the layout avoids storefront product cards and decorative marketing filler

### Requirement: Safety And Claims Boundaries
The landing page SHALL avoid unconfirmed claims, named competitor claims without data, and tactical or combat-use instructions.

#### Scenario: User reviews product claims
- **WHEN** the landing page content is audited
- **THEN** no unconfirmed range, autonomy, enclosure-protection, test-count, unit, or competitor-specific claim is present
- **AND** no copy claims universal drone detection
- **AND** no section provides tactical instructions or combat-use guidance
