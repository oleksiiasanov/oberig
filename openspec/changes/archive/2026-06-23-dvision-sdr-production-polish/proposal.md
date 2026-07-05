# Change: Document D.VISION SDR Production Polish

## Why
The D.VISION SDR landing received a set of production-facing updates after the main premium rebuild: final brand wording, order routing, metadata, domain-trust files, and a transparent rotating device visual. These shipped changes need a clean archived OpenSpec record so future agents can understand the current production baseline.

## What Changes
- Standardize public brand text, metadata, alt labels, docs, and specs around `D.VISION SDR`.
- Route all order CTAs to the Google Form instead of the Prom product page.
- Add production trust metadata: `robots.txt`, `sitemap.xml`, `security.txt`, favicon manifest naming, and Vercel security headers.
- Replace the outdated product media block with optimized transparent 3D device loop assets and a transparent poster fallback.
- Align the desktop 3D visual height with the characteristics list and preserve mobile-first behavior.
- Keep OpenSpec baseline requirements synchronized with the implemented landing behavior.

## Impact
- Affected specs: `fpv-detector-landing`
- Affected docs: `openspec/project.md`, `references/*`
- Affected code/assets: `index.html`, `src/data/content.js`, `src/components/*`, `src/styles.css`, `scripts/check-content.mjs`, `public/*`, `vercel.json`
- Verification: `openspec validate --all --strict --no-interactive`; `npm run check`
