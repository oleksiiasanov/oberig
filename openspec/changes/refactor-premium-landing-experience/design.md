## Context
The current site is a static HTML/CSS landing page. Its content structure is essentially inherited from competitor pages, and its visual treatment uses a military/olive skin the user wants removed. This change resets both: content is re-grounded in Oberig's own authoritative product instruction, and the visual direction restarts toward a premium, modern standard. The preferred visual reference is Busy (`https://busy.app/`): product-first hero composition, high-contrast interface depth, large media/device moments, long-form storytelling, and polished transitions — used as reference, not a template.

## Goals / Non-Goals
- Goals: reset the landing's visual direction; re-derive all content from Oberig's internal instruction; keep mobile-first behavior; preserve claim/safety boundaries; introduce a repeatable premium design standard; make future AI-assisted edits more consistent.
- Goals: decide whether the current static stack can support the desired quality or whether a component-driven stack is warranted.
- Goals: allow v0/Lovable exploration without making generated output the unquestioned source of truth.
- Goals: establish explicit agentic quality gates so future AI agents can verify grounded content, mobile-first behavior, CTA routing, accessibility, and performance consistently.
- Non-Goals: invent technical specifications, tactical claims, competitor claims, field-test numbers, or confirmed integrations not present in the internal instruction.
- Non-Goals: implement the redesign before the OpenSpec proposal is approved.
- Non-Goals: AI image generation/enhancement of the product photo — the high-quality asset is supplied externally.

## Phased Plan
This plan mirrors the section order in `tasks.md` (Approval → Content → Agent Instructions → Design Reset → Tooling → Implementation → Verification).

1. **Approval**: approve the phased proposal and confirm direction (reference space is the only source of truth; component-driven preference; v0/Lovable as inspiration only).
2. **Content Re-grounding**: treat all old landing content as non-authoritative, read the reference space, and re-derive all sections from Oberig's own data. Reconcile every range, mode, signal class, and characteristic against `references/`; where prior content differs, the reference space wins. Use `references/06-landing-content-plan.md` as the section-by-section contract for messaging, allowed claims, placeholders, forbidden claims, and CTA logic.
3. **Agent Instructions**: add the provided Cursor and Claude Code design standards to the root `AGENTS.md` outside the managed OpenSpec block.
4. **Design Reset & Brand System**: remove the existing olive/amber military skin while retaining safety constraints; ingest the supplied transparent logo and favicon, derive type direction and palette cues, and define design tokens before rebuilding visual sections.
5. **Tooling & Concept Direction**: plan for a component-driven frontend stack (e.g. Vite/React/Tailwind), with final setup confirmed during implementation; use Busy as the main visual reference and optionally generate inspiration through v0/Lovable, translating only suitable patterns into repo-native implementation.
6. **Implementation**: rebuild the page as modular sections with mobile-first layout, bento/asymmetric content areas, refined motion, polished interactive states, the real product photo as primary media, the Signal group link wired to consultation CTAs, and the Google Form wired to order CTAs.
7. **Agentic QA And Archive**: run focused validation/evals (see Agentic Quality Gates), update OpenSpec task statuses, and archive the change after implementation is accepted.

## Decisions
- Decision: Content is sourced from Oberig's authoritative internal instruction; the current competitor-derived structure is not treated as ground truth.
- Decision: All old frequency, spectrum, detector-class, technical-characteristic, and CTA claims are invalid unless confirmed in `references/`.
- Decision: The landing content plan defines the implementation order: Hero, Market Problem, Why SDR Matters, Work Modes, Capabilities, Spectrum/Unknown Specs, Market Comparison, Ukrainian Engineering, FAQ, Final CTA.
- Decision: Consultation CTAs link to the Oberig Signal group invite.
- Decision: Order CTAs link to the Oberig Google Form order intake.
- Decision: The supplied transparent logo and favicon inform the design system; the logo guides display-type proportions and brand presence, while the favicon informs compact mark usage and palette extraction.
- Decision: The real detector photo replaces the generated detector image as primary product media; image enhancement, if needed, is produced outside this agent and supplied as an asset.
- Decision: Treat Busy as a visual reference, not a template to copy (reference only; not a durable spec requirement).
- Decision: Use complex neutrals and purposeful blue/yellow accents, but avoid a one-note flag-themed palette.
- Decision: Use subtle layered gradients and light effects only when they support hierarchy; avoid decorative orb/blob backgrounds.
- Decision: Any dependency install that requires network access remains subject to terminal approval and repository fit.
- Decision: If using v0/Lovable, generated output is concept/component inspiration, reviewed and adapted before landing in the codebase.
- Decision: Prefer Vite/React/Tailwind for the premium rebuild if the implementation phase confirms the migration remains practical.
- Decision: Targeted screenshots or visual checks are reserved for meaningful layout/hero/responsive changes, not every small style edit.

## Agentic Quality Gates
- OpenSpec gate: validate the active change with `openspec validate refactor-premium-landing-experience --strict --no-interactive`.
- Content grounding gate: scan implemented copy for old invalid claims, unsupported frequency values, named competitor claims, and unconfirmed marketing numbers.
- Content-plan gate: verify every implemented section maps to `references/06-landing-content-plan.md` and every factual claim maps to the claims map.
- CTA gate: verify consultation actions point to Signal and order actions point to the Google Form.
- Mobile-first gate: verify the base layout is mobile-first, avoids horizontal overflow, uses usable tap targets, and keeps tables/cards readable on narrow screens.
- Accessibility gate: verify semantic headings, alt text, keyboard-visible focus states, and `prefers-reduced-motion` handling.
- Performance gate: verify assets and animations do not create avoidable load or runtime weight.
- Visual gate: run screenshots or browser checks only for material layout/design changes or when explicitly requested.

## Alternatives Considered
- Continue polishing the current static design: rejected because the user explicitly wants the current design removed.
- Keep the competitor-shaped content: rejected because the content must reflect Oberig's own product data.
- Directly import generated v0/Lovable code: risky because it may not preserve existing Ukrainian copy, OpenSpec constraints, accessibility, or repository conventions.
- Keep all work in a single HTML file: acceptable only if the static stack remains, but less aligned with the requested modular standard.

## Risks / Trade-offs
- The internal instruction may change the verified product values; mitigate by reconciling once during Content Re-grounding and flagging unknown fields as explicit placeholders.
- A full framework migration may add setup time and dependency weight; mitigate by deciding in the Tooling phase before implementation.
- Rich animation can hurt performance or accessibility; mitigate with restrained motion, reduced-motion handling, and focused checks.
- Public `AGENTS.md` instructions will be visible in the public repository; mitigate by keeping them process-oriented and non-sensitive.
- The supplied product photo is currently low quality; mitigate by requiring a usable high-quality asset before it becomes the hero media, with a clean placeholder until then.

## Open Questions
- Which exact Vite/React/Tailwind setup and dependency set should be installed during implementation?
- Which uploaded logo/favicon filenames and formats should be used in the repo?
- Which high-quality real detector photo should become the primary product media?
- Which missing marketing figures will be supplied later, and which should remain visible placeholders in the first rebuild?
