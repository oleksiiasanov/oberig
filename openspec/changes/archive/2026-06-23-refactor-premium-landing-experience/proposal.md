# Change: Refactor Premium Landing Experience

## Why
The current landing page visual direction no longer matches the desired quality bar, and its content structure is essentially inherited from competitor pages rather than built from D.VISION SDR's own product data. The next iteration needs a phased reset toward a premium, modern, conversion-oriented experience inspired by Busy, Stripe, Linear, and Apple-level landing craft, while re-grounding all content in D.VISION SDR's authoritative internal product instruction and preserving the existing safety/claims boundaries.

## What Changes
- Replace the current visual design system instead of iterating on its existing military/olive treatment.
- Re-derive all landing content from the `references/` space (D.VISION SDR's SDR user guide captured in `references/02-technical-documentation.md`) instead of the current competitor-shaped structure and assumptions.
- Treat all pre-reference-space landing content, frequency claims, spectrum claims, comparison structure, and CTA assumptions as invalid unless they are confirmed in `references/`.
- Use the detailed landing content plan to define section order, messaging hierarchy, allowed claims, placeholders, forbidden claims, and content evals.
- Route the contact call(s)-to-action to the approved D.VISION SDR WhatsApp link.
- Route order call(s)-to-action to the D.VISION SDR Google Form link.
- Use the supplied transparent logo and favicon as brand inputs for the typography, palette, favicon, and design-token system.
- Use the real product photo of the detector as the primary product media, replacing the previously generated detector image.
- Add repository-level Cursor and Claude Code instructions to guide future AI-assisted visual work.
- Add agentic quality gates for grounded content, mobile-first behavior, CTA destinations, accessibility, performance, and focused visual verification.
- Rebuild the landing with a mobile-first, premium UI system: complex neutrals, D.VISION SDR neon-green accents, bento-style sections, glass-like depth, generous 8pt spacing, and polished microinteractions.

Process steps (approval gate, design reset, tooling decision, concept direction, verification, archive) are tracked in `design.md` and `tasks.md` rather than encoded as durable product requirements.

## Resolved Direction
- **BREAKING (content):** Old landing claims are not valid source material. Authoritative content values come only from the `references/` space.
- Unconfirmed frequency ranges, detection distance, autonomy, battery, screen size, price, and similar marketing figures remain explicit placeholders until supplied in the reference space.
- Migrate toward a component-driven frontend stack for the premium rebuild unless implementation discovery reveals a strong reason to stay static.
- Use v0/Lovable, if at all, as concept exploration or draft inspiration rather than an unquestioned code source.
- Keep contact and order as separate valid actions: WhatsApp for contact, Google Form for order intake.

## Impact
- Affected specs: `fpv-detector-landing`, `project-agent-guidelines`
- Affected code: `AGENTS.md`, `index.html`, `styles.css`, current visual assets, and possibly future component files if the stack changes
- External inputs (curated in the `references/` space — single grounded input set):
  - `references/README.md` — space index and grounding rules (content derived only from these inputs)
  - SDR user guide (authoritative product content; provided as text and captured in `references/02-technical-documentation.md`; original Notion: `https://www.notion.so/SDR-374874c8aa8d80d9a786f2adfeb50383`)
  - Competitor analysis: independent FPV-detector testing report (captured in `references/03-competitor-analysis.md`)
  - WhatsApp contact CTA: `https://wa.me/380954716680`
  - Google Form link: `https://forms.gle/xFcMaTWR1G5pR4qW6`
  - Transparent D.VISION SDR logo and favicon assets, used as brand-system inputs
  - Real product photo of the detector (to be supplied as a high-quality asset)
  - Busy visual reference (`references/01-visual-reference.md`) and optional v0/Lovable-generated concepts
  - Content blueprint mapping inputs → blocks/copy/CTA: `references/04-content-blueprint.md`
  - Landing content plan with section-by-section copy contract and claims map: `references/06-landing-content-plan.md`
- Potential dependencies: `framer-motion`, `lucide-react`, Tailwind CSS, Radix primitives, or a Vite/React setup if approved during the tooling phase
