# Change: Add Notion-synced user manual page

## Why
The product usage instruction is maintained in Notion because that is the most convenient editing surface for the team. The public site needs to render the latest approved instruction natively, without forcing visitors to leave the landing page.

## What Changes
- Add a dedicated user manual page to the site with the same Ukrainian/English language frame and D·Vision SDR visual system.
- Add header and burger-menu navigation to the manual page.
- Add a landing CTA that routes visitors from the landing experience to the manual.
- Add a daily synchronization path that fetches the current Notion instruction and stores a build-time representation for native rendering.
- Keep the Notion source URL configurable so credentials or publication details are not hard-coded into the UI.

## Impact
- Affected specs: `fpv-detector-landing`
- Affected code: `src/App.jsx`, `src/components/Header.jsx`, `src/data/content.js`, new manual components/data, sync script, package scripts, deployment scheduler/configuration
