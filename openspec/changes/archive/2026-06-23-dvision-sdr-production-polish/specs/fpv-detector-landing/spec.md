## MODIFIED Requirements

### Requirement: D.VISION SDR Brand And Production Domain
The landing page SHALL consistently use the D.VISION SDR brand and the production domain `https://www.dvision.com.ua/`.

#### Scenario: Public metadata is rendered
- **WHEN** the HTML document is served
- **THEN** the canonical URL points to `https://www.dvision.com.ua/`
- **AND** Open Graph and Twitter metadata identify the page as D.VISION SDR
- **AND** legacy names such as "Оберіг", "Oberig", or "Oberig SDR" are not used in public-facing copy, labels, or alt text.

### Requirement: CTA Destinations
The landing page SHALL route conversion actions to the approved order and contact destinations.

#### Scenario: Visitor starts an order
- **WHEN** a visitor activates an order CTA
- **THEN** it opens `https://prom.ua/p3099333953-dron-detektor-dvision.html`.

#### Scenario: Visitor contacts D.VISION SDR
- **WHEN** a visitor activates a contact CTA
- **THEN** it opens `https://wa.me/380954716680`.

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
- **AND** the visual includes a transparent poster fallback.

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
