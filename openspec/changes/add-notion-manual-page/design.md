## Context
The site is a Vite/React static landing with no server-side runtime. Public content is centralized in `src/data/content.js`, and production deployment currently relies on static assets plus Vercel headers. The Notion instruction URL may be public in a browser, but reliable block-level synchronization usually requires a Notion integration token and page/database access.

## Goals / Non-Goals
- Goals: render the instruction natively on the website, make Notion the editing source, refresh generated site content once per day, keep the manual reachable from desktop nav, mobile burger menu, and landing CTA.
- Goals: preserve mobile-first layout, claim boundaries, and the existing D·Vision SDR visual language.
- Non-Goals: create a full CMS admin, expose private Notion tokens in browser code, or provide tactical/combat-use guidance beyond the approved instruction content.

## Decisions
- Decision: Sync Notion at build/scheduled time into a generated JSON file consumed by React. This keeps tokens out of client bundles and makes the public page fast and native.
- Decision: Support Notion API credentials through environment variables, with a graceful generated-content fallback if sync cannot run locally.
- Decision: Render a constrained set of rich text blocks first: headings, paragraphs, bulleted/numbered lists, callouts, toggles, quotes, code, dividers, images, and child pages where available.
- Decision: Use lightweight hash/path state in `App.jsx` rather than adding React Router for one extra page.

## Risks / Trade-offs
- Risk: Public Notion HTML can change and is less stable than the official API. Mitigation: prefer the official Notion API and keep public scraping as a fallback only if credentials are unavailable.
- Risk: A scheduled sync without a deploy step may update generated content in CI but not the live static bundle. Mitigation: scheduler should run sync before build/deploy, or commit generated JSON when using repository automation.
- Risk: Manual content could include unsupported claims. Mitigation: content checks should continue to guard known forbidden claims, and public instruction copy remains reviewable in generated JSON.

## Migration Plan
1. Add generated manual data with a safe empty/loading state.
2. Add sync script and package command.
3. Add scheduler/deploy wiring for daily sync before production build.
4. Render the manual page and navigation.
5. Validate OpenSpec and run project checks.
