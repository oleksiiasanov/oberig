## 1. Approval
- [x] 1.1 Review and approve the phased proposal.
- [x] 1.2 Confirm the old landing content is non-authoritative and the reference space is the only source of truth.
- [x] 1.3 Confirm v0/Lovable is concept exploration or draft inspiration only.
- [x] 1.4 Confirm the rebuild should prefer a component-driven stack unless implementation discovery blocks it.

## 2. Content Re-grounding
- [x] 2.1 Capture authoritative product data in the `references/` space (SDR user guide provided as text → `references/02-technical-documentation.md`).
- [x] 2.2 Map current sections to Oberig's own data; remove competitor-shaped structure and assumptions.
- [x] 2.3 Reconcile ranges, signal classes, work modes, and technical characteristics against the instruction; correct or placeholder anything not confirmed by it.
- [x] 2.4 Add both valid CTA destinations to the content model: Signal for consultation and Google Form for order intake.
- [x] 2.5 Create the detailed landing content plan with section goals, allowed claims, placeholders, forbidden claims, CTA logic, claims map, and content eval checklist.

## 3. Agent Instructions
- [x] 3.1 Add the provided Cursor and Claude Code System Instructions to `AGENTS.md` outside the managed OpenSpec block.
- [x] 3.2 Preserve the managed OpenSpec block so `openspec update` can refresh it.

## 4. Design Reset
- [x] 4.1 Remove the current visual design treatment from the landing.
- [x] 4.2 Preserve verified product copy, calls to action, safety boundaries, and placeholders (as reconciled in Phase 2).
- [x] 4.3 Define the new visual tokens: neutrals, blue/yellow accents, spacing, borders, shadows, and responsive breakpoints.
- [x] 4.4 Ingest the supplied transparent logo and favicon assets, then derive brand type direction, compact mark usage, and palette cues from them.

## 5. Tooling And Structure
- [x] 5.1 Choose the component-driven path rather than the static fallback.
- [x] 5.2 Scaffold the approved frontend stack and install approved visual dependencies.
- [x] 5.3 Create modular landing sections such as Hero, Bento Features, Spectrum Coverage, Comparison, Modes, Verification, FAQ, and CTA.

## 6. Premium Landing Implementation
- [x] 6.1 Rebuild the hero with product-first visual hierarchy inspired by Busy without copying it.
- [x] 6.2 Use the real detector photo as primary product media; until a high-quality asset is supplied, use a clean placeholder rather than the old generated image.
- [x] 6.3 Wire the consultation CTA(s) to the Oberig Signal group invite link.
- [x] 6.4 Wire the order CTA(s) to the Oberig Google Form link.
- [x] 6.5 Rebuild feature and comparison content using asymmetric/bento layouts instead of generic three-column blocks.
- [x] 6.6 Add refined motion, hover states, active states, and reduced-motion handling.
- [x] 6.7 Ensure the landing remains mobile-first and avoids incoherent overlap on phone, tablet, and desktop layouts.
- [x] 6.8 Keep all unconfirmed values as explicit placeholders and avoid new tactical or universal-detection claims.

## 7. Verification And Closeout
- [x] 7.1 Run focused formatting/static validation appropriate to the chosen stack.
- [x] 7.2 Run content grounding checks for old invalid claims, unsupported frequencies, named competitors, unconfirmed marketing numbers, and mismatch with `references/06-landing-content-plan.md`.
- [x] 7.3 Run mobile-first checks for narrow widths, tap targets, readable tables/cards, and no horizontal overflow.
- [x] 7.4 Verify the consultation CTA opens the correct Signal group link.
- [x] 7.5 Verify the order CTA opens the correct Google Form link.
- [x] 7.6 Run accessibility and reduced-motion checks.
- [x] 7.7 Run targeted visual checks only when layout risk justifies them or when requested.
- [x] 7.8 Update task statuses after implementation.
- [x] 7.9 Validate active OpenSpec change.
- [ ] 7.10 Archive the change after acceptance.
