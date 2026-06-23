# fpv-detector-landing Specification

## Purpose
The landing page presents D.VISION SDR as a wide-band FPV/drone video detector based on SDR, supports Ukrainian and English audiences, and provides a polished mobile-first conversion path for consultation and order requests.

## Requirements

### Requirement: D.VISION SDR Brand And Production Domain
The landing page SHALL consistently use the D.VISION SDR brand and the production domain `https://www.dvision.com.ua/`.

#### Scenario: Public metadata is rendered
- **WHEN** the HTML document is served
- **THEN** the canonical URL points to `https://www.dvision.com.ua/`
- **AND** Open Graph and Twitter metadata identify the page as D.VISION SDR
- **AND** legacy names such as "Оберіг", "Oberig", or "Oberig SDR" are not used in public-facing copy, labels, or alt text.

### Requirement: Rich Link Preview Metadata
The landing page SHALL expose rich social preview metadata for messengers and social platforms.

#### Scenario: Messenger link preview
- **WHEN** a visitor shares the production URL in a messenger
- **THEN** the preview metadata includes the D.VISION SDR title
- **AND** includes a short SDR-based FPV video-detector description
- **AND** includes an absolute `og:image` and `twitter:image` URL on `https://www.dvision.com.ua/og-image.png`
- **AND** declares image dimensions and alt text for the branded preview image.

### Requirement: Favicon And Install Icons
The landing page SHALL provide browser, Apple, Android, and Microsoft tile icons through stable production paths.

#### Scenario: Browser requests site icons
- **WHEN** a browser or messenger requests `/favicon.ico`
- **THEN** the server can return a real favicon file from the public root
- **AND** additional PNG icon sizes are linked from `/favicons/`
- **AND** the web manifest and browserconfig use D.VISION SDR naming and paths that resolve under `/favicons/`.

### Requirement: Domain Trust And Security Metadata
The landing page SHALL expose basic crawler, security-contact, and browser security metadata that supports domain reputation and safe production operation.

#### Scenario: Crawlers inspect the site
- **WHEN** a search or messenger crawler requests site discovery files
- **THEN** `/robots.txt` allows indexing
- **AND** references `https://www.dvision.com.ua/sitemap.xml`
- **AND** `/sitemap.xml` includes the production homepage.

#### Scenario: Security tooling inspects the site
- **WHEN** a security scanner or researcher checks standard security metadata
- **THEN** `/.well-known/security.txt` is available
- **AND** includes a contact URL, canonical URL, preferred languages, and expiry date.

#### Scenario: Browser receives production headers
- **WHEN** the site is served through Vercel
- **THEN** configured response headers include Content Security Policy, Permissions Policy, Referrer Policy, X-Content-Type-Options, and X-Frame-Options.

### Requirement: Multilingual Landing Experience
The landing page SHALL support Ukrainian and English content variants across all public landing sections.

#### Scenario: Manual language switch
- **WHEN** a visitor selects Ukrainian or English from the header language dropdown
- **THEN** the visible content updates to the selected language
- **AND** the selection is persisted for future visits.

#### Scenario: Geographic default language
- **WHEN** a visitor has no stored language preference
- **AND** the IP lookup resolves the visitor country as Ukraine
- **THEN** the page defaults to Ukrainian.

#### Scenario: Fallback language detection
- **WHEN** IP lookup is unavailable or fails
- **THEN** the page falls back to the browser locale
- **AND** defaults to English unless the browser locale starts with Ukrainian.

### Requirement: Mobile Header And Burger Menu
The landing page SHALL provide a mobile-friendly header with a language dropdown and full-viewport burger menu.

#### Scenario: Mobile menu opens
- **WHEN** a visitor opens the burger menu on a mobile viewport
- **THEN** the menu is displayed as a fixed full-viewport overlay
- **AND** the page background is scroll-locked
- **AND** menu scrolling is contained inside the overlay
- **AND** closing the menu restores the previous page scroll position.

#### Scenario: Mobile menu navigation
- **WHEN** a visitor taps a section link in the open menu
- **THEN** the menu closes
- **AND** the page scrolls to the requested section.

### Requirement: Brand Assets And Hidden Logo Variant
The landing page SHALL use the supplied D.VISION SDR logo assets and support a hidden internal logo variant switch.

#### Scenario: Header logo is displayed
- **WHEN** the header is visible
- **THEN** the header uses a real logo image from the public assets
- **AND** the logo height is scaled to approximately 1.4 times the header text size.

#### Scenario: Hidden logo switch
- **WHEN** a reviewer quickly clicks the first characteristics card ten times
- **THEN** the page toggles between the plain D.VISION SDR logo and the D.VISION SDR logo
- **AND** persists the selected logo variant for future visits.

### Requirement: Hero Positioning
The landing page SHALL position D.VISION SDR as a wide-band drone detector with SDR-based FPV video detection.

#### Scenario: Visitor views the first screen
- **WHEN** the first viewport loads
- **THEN** the hero shows the product name "D.VISION SDR"
- **AND** states wide-band drone detection coverage of 500-9000 MHz
- **AND** highlights approximately 9-second full-range scanning
- **AND** includes order and contact actions
- **AND** uses the real detector product image with accurate alt text.

### Requirement: Technical Advantages
The landing page SHALL present the primary technical advantages as concise, scannable product facts.

#### Scenario: Visitor scans advantages
- **WHEN** the advantages section is displayed
- **THEN** it explains the SDR platform value in terms of receiving radio signals and transforming them into color video
- **AND** includes compactness of 13 × 8 cm without antennas
- **AND** includes color video display
- **AND** includes additional PETG screen protection.

### Requirement: Characteristics List
The landing page SHALL present product characteristics in a readable list format with a lightweight rotating 3D-device visual.

#### Scenario: Visitor reviews characteristics
- **WHEN** the characteristics section is displayed
- **THEN** the section label is "Характеристики" in Ukrainian and "Characteristics" in English
- **AND** it lists power autonomy, remote observation format, screen protection, device dimensions, application options, working-condition adaptation, and accessibility
- **AND** the remote observation item mentions Windows laptops plus Android tablets and phones
- **AND** the device dimensions item includes 13 × 8 cm without antennas and a 4.3-inch display.

#### Scenario: Visitor sees the device visual
- **WHEN** the characteristics section is displayed
- **THEN** a lightweight optimized transparent video loop presents the rotating D.VISION SDR device visual
- **AND** on desktop the visual column aligns to the characteristics list height
- **AND** the original high-resolution source MOV is not shipped as the production asset
- **AND** the visual includes a poster fallback.

### Requirement: Market Comparison
The landing page SHALL compare D.VISION SDR with typical market devices using a readable responsive comparison pattern.

#### Scenario: Desktop comparison
- **WHEN** the comparison section is displayed on desktop
- **THEN** it uses the label "Альтернативи" / "Alternatives"
- **AND** the title is "Порівняння з рішеннями на ринку" / "Comparison with market solutions"
- **AND** compares D.VISION SDR against a generic typical device without named competitor claims.

#### Scenario: Mobile comparison
- **WHEN** the comparison section is displayed on mobile
- **THEN** each characteristic title spans the row width
- **AND** D.VISION SDR and typical-device values appear as adjacent blocks below the title
- **AND** the column labels are compact and placed at the top edge of the value blocks without disrupting text alignment.

#### Scenario: Comparison rows
- **WHEN** the comparison table is rendered
- **THEN** it includes architecture, video-frequency coverage, antennas, firmware updates, operating noise, battery-charge indication, and competitive price
- **AND** the D.VISION SDR operating-noise value states passive cooling with no fan.

### Requirement: Usage Scenarios
The landing page SHALL present practical use cases without turning them into tactical instructions.

#### Scenario: Visitor reviews use cases
- **WHEN** the usage section is displayed
- **THEN** the section chip reads "Застосування" in Ukrainian and "Usage scenario" in English
- **AND** the English section title contains "Use cases"
- **AND** the layout supports three cards in the first row and two cards in the second row on wider viewports
- **AND** card heights adapt to the tallest content in the relevant row to avoid unnecessary empty spacing.

### Requirement: FAQ And Team Sections
The landing page SHALL include FAQ and team/about sections grounded in the D.VISION SDR product story.

#### Scenario: Visitor reads FAQ
- **WHEN** the FAQ section is displayed
- **THEN** the first question explains how D.VISION SDR differs from detectors based on video receivers
- **AND** the FAQ covers Waterfall, RSSI/SNR, non-universal detection boundaries, price accessibility, and Ukrainian/English language availability
- **AND** it does not mention French-language support.

#### Scenario: Visitor reads team section
- **WHEN** the team section is displayed
- **THEN** the section label is "Про нас" in Ukrainian and "About us" in English
- **AND** it describes the D.VISION SDR team and mission without changing into a large final sales CTA.

### Requirement: Footer And Social Links
The landing page SHALL use a minimal footer with current D.VISION SDR social links.

#### Scenario: Footer is displayed
- **WHEN** the footer appears
- **THEN** it contains TikTok and Instagram links only
- **AND** TikTok points to `https://www.tiktok.com/@dvision_sdr`
- **AND** Instagram points to `https://www.instagram.com/dvision_sdr`
- **AND** Facebook is not displayed
- **AND** the footer includes the `D.VISION SDR ™` trademark.

### Requirement: CTA Destinations
The landing page SHALL route conversion actions to the approved order and contact destinations.

#### Scenario: Visitor starts an order
- **WHEN** a visitor activates an order CTA
- **THEN** it opens `https://prom.ua/p3099333953-dron-detektor-dvision.html`.

#### Scenario: Visitor contacts D.VISION SDR
- **WHEN** a visitor activates a contact CTA
- **THEN** it opens `https://wa.me/380954716680`.

### Requirement: Visual System And Responsiveness
The landing page SHALL use the neon-green D.VISION SDR visual system and remain readable across mobile, tablet, and desktop.

#### Scenario: Visitor views responsive layouts
- **WHEN** the page is viewed at mobile, tablet, or desktop widths
- **THEN** sections, cards, CTAs, comparison rows, and header controls remain readable without incoherent overlap
- **AND** the CSS is mobile-first
- **AND** tap targets meet mobile usability expectations.

#### Scenario: Visitor views the visual theme
- **WHEN** the page renders
- **THEN** the default accent color is based on `rgb(162, 251, 10)` / `#a2fb0a`
- **AND** the removed bronze/gold alternate theme is not part of the visual system
- **AND** the design avoids pure `#000000`.

### Requirement: Motion And Accessibility
The landing page SHALL include restrained motion and accessible interaction states.

#### Scenario: Visitor interacts with the page
- **WHEN** the visitor hovers, taps, scrolls, or focuses interactive elements
- **THEN** controls provide clear hover/focus/active states
- **AND** section motion remains restrained
- **AND** the page respects `prefers-reduced-motion`.

### Requirement: Claims And Content Boundaries
The landing page SHALL avoid unsupported legacy claims and competitor-specific assertions.

#### Scenario: Public copy is audited
- **WHEN** public content is reviewed
- **THEN** legacy frequency values such as 1050 and 6040 are absent
- **AND** unsupported slogans such as "без сліпих зон" and "виявляє все" are absent
- **AND** named competitor claims are absent
- **AND** claims remain within the current approved content model and reference space.

### Requirement: Agentic Quality Gates
The project SHALL include lightweight checks that protect the landing from regressions during AI-assisted iteration.

#### Scenario: Agent verifies changes
- **WHEN** an agent completes a material implementation change
- **THEN** `npm run check` runs the content/design checks and production build
- **AND** the checks verify required content, CTA destinations, social links, logo assets, OG metadata, favicon metadata, mobile-first CSS, reduced-motion handling, and removal of forbidden legacy claims.
