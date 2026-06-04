# Change: Update FPV Detector Landing

## Why
The current landing direction needs to speak to a military audience that already understands FPV, UAV video links, EW, VTX, false positives, and real RF environments. The page must sell the core advantage: all-band coverage of 1050-6040 MHz without blind zones, instead of presenting a generic civilian-facing drone detector.

## What Changes
- Rebuild the landing content around spectrum coverage, frequency comparison, and field-oriented product use.
- Add a hero spectrum visual showing continuous 1050-6040 MHz product coverage.
- Add a main frequency coverage comparison visual with typical narrow-band detector rows and visible gaps.
- Add a comparison table across the product and typical 1.2/2.4/5.8, 2.4/5.8, and 5.8-only detectors.
- Add sections for detected signal classes, complex RF environment operation, work modes, position-defense integration, tests and field verification, technical characteristics, FAQ, and final CTA.
- Add placeholders for unconfirmed test counts, videos, unit feedback, autonomy, battery, connectors, antennas, enclosure protection, weight, package contents, and options.
- Keep all copy in Ukrainian with a technical military tone and without basic FPV explanations.

## Impact
- Affected specs: `fpv-detector-landing`
- Affected code: landing page structure, content components, spectrum coverage visual component, comparison table component, responsive layout/styles
- Approval gate: implementation MUST NOT start until this proposal is reviewed and approved.
