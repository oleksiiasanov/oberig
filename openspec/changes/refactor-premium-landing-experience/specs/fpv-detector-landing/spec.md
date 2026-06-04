## ADDED Requirements
### Requirement: Authentic Product Content Source
The landing page content SHALL be derived from Oberig's authoritative reference space and SHALL NOT replicate competitor-derived page structure, old landing claims, or prior assumptions.

#### Scenario: Content is re-grounded in Oberig data
- **WHEN** the landing content is authored or reconciled
- **THEN** ranges, signal classes, work modes, and technical characteristics reflect the `references/` space
- **AND** where the reference space differs from any prior landing value, the reference space prevails
- **AND** any value not confirmed by the internal instruction remains an explicit placeholder rather than an invented or competitor-borrowed value

#### Scenario: Old content conflicts with the reference space
- **WHEN** old page copy, old OpenSpec requirements, or old visual assumptions conflict with `references/`
- **THEN** the old content is treated as invalid source material
- **AND** the new landing uses only confirmed reference-space claims or explicit placeholders

### Requirement: Consultation CTA Destination
The landing page consultation call-to-action SHALL link to the Oberig Signal group invite.

#### Scenario: User requests a consultation
- **WHEN** the user activates a "get consultation" call-to-action
- **THEN** it opens the Oberig Signal group invite link
- **AND** the link target is consistent across the hero and final CTA

### Requirement: Order CTA Destination
The landing page order call-to-action SHALL link to the Oberig Google Form order intake.

#### Scenario: User starts an order
- **WHEN** the user activates an "order" call-to-action
- **THEN** it opens the Oberig Google Form order link
- **AND** the link target is consistent across the hero and final CTA
- **AND** order CTAs are visually and semantically distinct from consultation CTAs
- **AND** order CTAs do not imply unconfirmed price, delivery, warranty, or availability details

### Requirement: Landing Content Plan
The landing page SHALL follow the detailed landing content plan in the reference space.

#### Scenario: Agent authors public landing sections
- **WHEN** an agent writes or revises landing content
- **THEN** the section order, section goals, CTA logic, allowed claims, placeholders, forbidden claims, and content eval checklist come from `references/06-landing-content-plan.md`
- **AND** every factual product claim maps to the content plan claims map or another referenced source
- **AND** any section that cannot be grounded remains a placeholder rather than invented copy

### Requirement: Authentic Product Imagery
The landing page SHALL use the real photograph of the Oberig detector as the primary product media.

#### Scenario: User views product media
- **WHEN** the hero or product-media area is displayed
- **THEN** it presents the real detector photo rather than a generated stand-in image
- **AND** until a high-quality asset is available, a clean neutral placeholder is shown instead of the previous generated image
- **AND** the imagery does not imply unconfirmed product claims

### Requirement: Modular Section-Based Landing
The landing page SHALL be organized as modular sections that support a premium product-first landing experience.

#### Scenario: User scans the redesigned landing
- **WHEN** the redesigned page is viewed
- **THEN** it presents a strong product-first hero, asymmetric/bento feature sections, clear comparison moments, and a polished final CTA
- **AND** it avoids generic three-column feature blocks as the primary structure
- **AND** when a component-driven stack is selected, the implementation is split into discrete sections rather than one unstructured file

### Requirement: Motion And Microinteractions
The landing page SHALL include restrained premium motion and tactile interactive states without harming readability or accessibility.

#### Scenario: User interacts with the redesigned page
- **WHEN** the user hovers, taps, scrolls, or activates interactive controls
- **THEN** buttons, cards, and primary visual elements provide subtle transitions, depth changes, or spring-like motion where technically appropriate
- **AND** the page respects reduced-motion preferences
- **AND** animations do not obscure critical technical copy or product claims

### Requirement: Brand Assets And Design Tokens
The landing page SHALL use the supplied Oberig logo and favicon as brand inputs for the visual identity system.

#### Scenario: Brand system is defined
- **WHEN** visual tokens are created for the premium rebuild
- **THEN** the supplied transparent logo informs wordmark treatment, display-type proportions, and brand presence
- **AND** the supplied favicon informs compact mark usage and palette extraction
- **AND** the final implementation includes an appropriate favicon asset
- **AND** derived fonts and colors remain legible, modern, and consistent with the premium mobile-first direction

### Requirement: Agentic Quality Gates
The landing page implementation SHALL include explicit quality gates suitable for AI-agent development.

#### Scenario: Agent verifies implementation readiness
- **WHEN** an agent completes a material implementation phase
- **THEN** it validates the active OpenSpec change
- **AND** it checks content grounding against `references/`
- **AND** it verifies consultation and order CTA destinations
- **AND** it checks mobile-first behavior, accessibility basics, reduced-motion handling, and performance risk
- **AND** it runs targeted visual/browser checks only when layout risk justifies them or when requested

## MODIFIED Requirements
### Requirement: Military-Audience Landing Content
The landing page SHALL be written in Ukrainian for a military and technical audience while grounding all product claims in the `references/` space.

#### Scenario: User reads the landing copy
- **WHEN** the landing page is displayed
- **THEN** the copy uses concise technical Ukrainian terminology around SDR, analog video reception, scanner, waterfall spectrum analysis, RSSI/SNR, antennas, USB-C, OTA, and device modes where confirmed
- **AND** the copy does not explain basic FPV concepts, use civilian dramatization, or reuse unsupported old frequency claims

### Requirement: Hero Spectrum Positioning
The landing page SHALL present Oberig as a Ukrainian SDR-based detector/analyzer for analog video signals, not as the old all-band 1050-6040 MHz landing claim.

#### Scenario: User views the hero section
- **WHEN** the first viewport is loaded
- **THEN** the page positions Oberig around SDR architecture, live decoded video, scanner workflow, waterfall spectrum analysis, and RSSI/SNR where confirmed by the reference space
- **AND** the hero CTA for consultation opens the Oberig Signal group invite
- **AND** the hero includes a distinct order CTA that opens the Oberig Google Form order link
- **AND** unconfirmed frequency ranges, distances, autonomy, battery, screen, and price are omitted or shown only as explicit placeholders
- **AND** the hero does not display the old "1050-6040 МГц" claim unless it is later confirmed in `references/`

### Requirement: Current Frequency Reality Section
The landing page SHALL describe the market problem using grounded category insights rather than presenting unsupported Oberig frequency coverage.

#### Scenario: User reviews market context
- **WHEN** the market-problem section is displayed
- **THEN** it explains category pain points such as unstable video, mismatched declared ranges, weak autonomy, or inconsistent production only at the level supported by the competitor-analysis reference
- **AND** it does not publish named competitor rankings or scores
- **AND** it does not turn category pain points into Oberig product claims unless confirmed by the technical reference

### Requirement: Frequency Coverage Comparison Visual
The landing page SHALL avoid claimed product frequency-coverage visuals until the relevant ranges are confirmed in the reference space.

#### Scenario: User compares coverage or spectrum behavior
- **WHEN** a frequency, spectrum, or coverage visual is displayed
- **THEN** any actual Oberig frequency ranges remain explicit placeholders unless confirmed in `references/`
- **AND** the visual may illustrate SDR/waterfall analysis behavior and configurable scanning without claiming unconfirmed coverage
- **AND** competitor coverage is described generically and only as category context, not as named-device claims

### Requirement: Detected Signal Classes
The landing page SHALL describe confirmed signal-handling capabilities with careful non-guarantee wording.

#### Scenario: User reviews what the product does
- **WHEN** the product-capability section is displayed
- **THEN** it describes confirmed capabilities such as analog video reception, live decoded video, scanner results, waterfall spectrum analysis, RSSI/SNR, and signals too weak for video decoding where supported by the reference space
- **AND** it uses placeholders for unsupported signal classes, frequency ranges, or aircraft categories
- **AND** the page does not claim the product sees all drones or all signal types

### Requirement: Detector Comparison Table
The landing page SHALL compare Oberig against the market by criteria grounded in the reference space, not by the old frequency-column table.

#### Scenario: User scans comparison content
- **WHEN** the comparison section is displayed
- **THEN** it compares criteria such as SDR vs repackaged video receiver, live video, waterfall analysis, RSSI/SNR, configurable scanning, OTA, USB-C functions, and Ukrainian engineering where confirmed
- **AND** market weaknesses are generalized from the competitor-analysis reference
- **AND** unconfirmed Oberig figures such as ranges, autonomy, battery, screen size, and price remain placeholders

### Requirement: Complex RF Environment Operation
The landing page SHALL describe confirmed SDR analysis and configuration capabilities without inventing EW-adjacent behavior.

#### Scenario: User reviews RF environment behavior
- **WHEN** RF-environment or analysis content is displayed
- **THEN** it describes confirmed capabilities such as waterfall spectrum view, adjustable scanning range, antenna switching, AGC, RSSI/SNR, and signals too weak for video decoding
- **AND** claims about terrain calibration, false-positive reduction, band disabling, operation near EW, alert integration, or direction finding are omitted unless confirmed in the reference space

### Requirement: Work Modes
The landing page SHALL present the confirmed Oberig application modes and device workflows from the reference space.

#### Scenario: User reviews work modes
- **WHEN** the work-modes section is displayed
- **THEN** it includes confirmed modes such as Перегляд, Сканер, Водоспад, Браузер, and Налаштування
- **AND** it may describe confirmed USB-C workflows such as UVC camera, remote frequency control, USB network for OTA, and serial console
- **AND** old modes such as standby, FPV only, direction finding, blackout, EW integration, or spectrum monitoring are not presented unless confirmed later

### Requirement: Position Defense Integration
The landing page SHALL present Oberig as a technical SDR tool for analysis and consultation without tactical workflow instructions.

#### Scenario: User reviews product fit
- **WHEN** an integration or use-context section is displayed
- **THEN** it explains the product's role through confirmed device capabilities and support/consultation framing
- **AND** it does not show tactical chains such as detection-to-EW/cover/command-post actions unless separately approved and grounded
- **AND** it does not provide combat-use instructions

### Requirement: Field Verification Placeholders
The landing page SHALL reserve space for tests and field verification without inventing data.

#### Scenario: User reviews tests and feedback
- **WHEN** the tests or verification section is displayed
- **THEN** it includes only confirmed evidence from `references/` or explicit placeholders for missing test videos, verified signals, unit feedback, field photos, and field videos
- **AND** unconfirmed values remain clearly marked as placeholders

### Requirement: Technical Characteristics Placeholders
The landing page SHALL include technical characteristics grounded in the reference space, using placeholders for missing marketing figures.

#### Scenario: User reviews technical characteristics
- **WHEN** the technical characteristics section is displayed
- **THEN** it lists confirmed characteristics such as SDR platform framing, analog video reception, five application modes, 1 MHz tuning step, AGC, RSSI/SNR, two antennas with auto switching, SD photo/video, English/Ukrainian interface, OTA, and USB-C functions where appropriate
- **AND** unconfirmed fields such as frequency ranges, detection distance, scan type, battery, runtime, screen size, price, warranty, and enclosure details use explicit placeholders
- **AND** no old 1050-6040 MHz or supported-band list is shown unless confirmed in `references/`

### Requirement: FAQ And Final CTA
The landing page SHALL include a technical FAQ and final CTAs grounded in the new content model.

#### Scenario: User reaches the final page sections
- **WHEN** the FAQ and final CTA are displayed
- **THEN** the FAQ covers SDR vs video receiver, live video, scanner, waterfall analysis, RSSI/SNR, antennas, OTA, USB-C workflows, missing confirmed figures, and claim boundaries where appropriate
- **AND** the final CTA includes consultation through the Oberig Signal group
- **AND** the final CTA includes ordering through the Oberig Google Form
- **AND** old CTA copy about commercial proposals or closing specific frequency gaps is not required unless re-approved

### Requirement: Visual Style And Responsiveness
The landing page SHALL use a premium, modern, mobile-first interface and remain responsive across mobile, tablet, and desktop.

#### Scenario: User views the landing on different devices
- **WHEN** the page is viewed on mobile, tablet, or desktop
- **THEN** spectrum scales, tables, cards, CTAs, and section text remain readable without incoherent overlap
- **AND** the visual system uses complex neutrals, refined borders, glass-like depth where useful, and purposeful blue/yellow accents where appropriate
- **AND** the visual system avoids pure `#000000`, the old olive/amber-dominant palette, decorative orb/blob backgrounds, storefront product cards, and decorative marketing filler
- **AND** the layout follows an 8pt spacing rhythm with generous whitespace and polished typography

### Requirement: Safety And Claims Boundaries
The landing page SHALL avoid unconfirmed claims, named competitor claims without approval, old invalid content, and tactical or combat-use instructions.

#### Scenario: User reviews product claims
- **WHEN** the landing page content is audited
- **THEN** no unconfirmed range, autonomy, enclosure-protection, test-count, unit, price, or competitor-specific claim is present
- **AND** no copy claims universal drone detection
- **AND** no section provides tactical instructions or combat-use guidance
- **AND** any legacy claim not supported by `references/` is absent or explicitly marked as `[потребує підтвердження]`
