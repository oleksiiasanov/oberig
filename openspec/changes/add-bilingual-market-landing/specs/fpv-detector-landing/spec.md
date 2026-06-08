## ADDED Requirements

### Requirement: Multilingual Landing Experience
The landing page SHALL support Ukrainian, English and French content variants for all public-facing landing sections.

#### Scenario: Manual language switch
- **WHEN** a visitor selects a language from the header language dropdown
- **THEN** the page updates visible content to the selected language
- **AND** persists the selected language for future visits.

#### Scenario: IP-based default language
- **WHEN** a visitor has no stored language preference
- **AND** IP geolocation resolves to Ukraine
- **THEN** the page defaults to Ukrainian.

#### Scenario: Non-Ukrainian IP default
- **WHEN** a visitor has no stored language preference
- **AND** IP geolocation does not resolve to Ukraine
- **THEN** the page defaults to English.

## MODIFIED Requirements

### Requirement: Landing Positioning
The landing page SHALL position Oberig SDR as a wide-band FPV video detector based on SDR, with a primary claim of 500-9000 MHz coverage and approximately 9-second full-range scanning.

#### Scenario: Hero positioning
- **WHEN** a visitor opens the page
- **THEN** the hero presents Oberig SDR as a drone detector for 500-9000 MHz
- **AND** highlights approximately 9-second full-range scanning.
