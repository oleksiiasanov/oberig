## Context
The landing page is for soldiers, EW specialists, operators, unit commanders, and procurement volunteers who understand FPV/UAV frequency realities. The product message centers on closing frequency gaps across 1050-6040 MHz.

## Goals / Non-Goals
- Goals: communicate continuous spectrum coverage, compare blind-zone risk against narrow-band detectors, and provide a dense technical product page in Ukrainian.
- Goals: support responsive layouts for mobile, tablet, and desktop.
- Goals: preserve uncertainty by using placeholders where product data is not confirmed.
- Non-Goals: explain what FPV is, dramatize civilian drone danger, provide tactical instructions, or invent performance metrics.
- Non-Goals: name competitors without provided source data.

## Decisions
- Decision: Treat the spectrum coverage visual as a reusable component that accepts frequency range rows, labels, and segment metadata.
- Decision: Use semantic tables for frequency and detector comparisons so content remains scannable and accessible.
- Decision: Keep technical characteristics near the end of the page rather than in the hero.
- Decision: Represent missing evidence and specs as explicit Ukrainian placeholders.
- Alternatives considered: use static decorative imagery only. Rejected because the core value is frequency coverage and blind-zone comparison.

## Risks / Trade-offs
- Risk: The page can overclaim detection guarantees. Mitigation: copy must refer to supported video-link/VTX spectrum and include dependency notes.
- Risk: Military terminology can drift into tactical guidance. Mitigation: keep content at product capability, configuration, and integration level only.
- Risk: Dense technical content can become hard to scan on mobile. Mitigation: use responsive tables/cards, stable spectrum scales, and concise copy.

## Migration Plan
Replace or refactor the current landing sections into the proposed structure. Keep existing project framework, routing, styling patterns, and component conventions.

## Open Questions
- Which product photos or rugged device renders are approved for use?
- Which notification methods, battery, autonomy, connectors, antennas, enclosure protection, weight, kit contents, and options are confirmed?
- Which tests, videos, VTX/video links, and unit feedback can be published?
