## ADDED Requirements

### Requirement: Multilingual Landing Experience
The landing page SHALL support Ukrainian and English content variants for all public-facing landing sections.

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

### Requirement: Product Media Video
The landing page SHALL present the product media block as a looping video of the D.VISION device rather than duplicating the hero product image.

#### Scenario: Product video playback
- **WHEN** the landing page loads
- **THEN** the product media video is preloaded and attempts muted autoplay before the visitor scrolls to the media block
- **AND** the video loops continuously
- **AND** the product image is only used as a poster or fallback.

### Requirement: Link Preview Metadata
The landing page SHALL expose rich social preview metadata for messengers and social platforms, including the page title, short product description, canonical URL, and branded preview image.

#### Scenario: Messenger link preview
- **WHEN** a visitor shares the public site URL in a messenger
- **THEN** the preview metadata identifies the page as D.VISION
- **AND** includes a short description of the SDR-based FPV video detector
- **AND** includes image preview metadata that resolves on the production D.VISION domain.

### Requirement: Hidden Logo Variant
The landing page SHALL use the neon green accent palette based on `#a2fb0a` as the default visual theme and keep two D.VISION logo variants available for internal comparison.

#### Scenario: Hidden logo switch
- **WHEN** a reviewer quickly clicks the first design feature card ten times
- **THEN** the page toggles between the plain D.VISION logo and the D.VISION SDR logo
- **AND** persists the selected logo variant for later visits.

### Requirement: Responsive Comparison Layout
The landing page SHALL present the market comparison in a mobile-readable pattern that does not collapse all table cells into a single hard-to-scan vertical list.

#### Scenario: Mobile comparison rows
- **WHEN** a visitor views the comparison section on a mobile viewport
- **THEN** each characteristic label spans the full row width
- **AND** the D.VISION and typical-device values appear as two adjacent comparison blocks below the label.

## MODIFIED Requirements

### Requirement: Landing Positioning
The landing page SHALL position D.VISION as a wide-band FPV video detector based on SDR, with a primary claim of 500-9000 MHz coverage and approximately 9-second full-range scanning.

#### Scenario: Hero positioning
- **WHEN** a visitor opens the page
- **THEN** the hero presents D.VISION as a drone detector for 500-9000 MHz
- **AND** highlights approximately 9-second full-range scanning.
