## Context
The landing is already implemented and deployed from `main`. This archive is a retrospective production release record, not an active proposal awaiting implementation. The baseline spec has already been updated to describe the current shipped behavior.

## Goals / Non-Goals
- Goals: document the final D.VISION SDR naming, Prom order routing, production metadata, optimized 3D media, and quality gates.
- Goals: preserve the rationale behind the transparent WebM/PNG media assets and the height-sync behavior for the characteristics section.
- Non-Goals: reopen a new redesign phase, introduce new claims, or change production behavior beyond documentation clean-up.

## Decisions
- Decision: Public-facing brand text is `D.VISION SDR`; the production domain remains `https://www.dvision.com.ua/`.
- Decision: Order CTAs route to `https://prom.ua/p3099333953-dron-detektor-dvision.html`.
- Decision: Contact CTAs remain on WhatsApp at `https://wa.me/380954716680`.
- Decision: The rotating 3D device visual uses `device-loop-3d-alpha.webm` on wider screens, with `device-loop-3d-mobile-bg.mp4` as the mobile-safe fallback and `device-loop-3d-poster.png` as transparent poster.
- Decision: The high-resolution source MOV stays ignored and is not shipped as a production asset.
- Decision: Visual screenshot checks remain opt-in or risk-driven; routine validation uses content checks and production build.

## Risks / Trade-offs
- WebM alpha support is strongest in Chromium-based browsers; the MP4 fallback exists for broader playback, but without alpha support it may be visually less ideal.
- Social preview metadata can be cached by messengers; changing OG fields may require cache refresh on the messenger side.
- Retrospective archive entries can drift if baseline specs are edited later; mitigate by keeping baseline requirements concise and running OpenSpec validation after documentation work.

## Verification
- OpenSpec baseline validation: `openspec validate --all --strict --no-interactive`.
- App verification: `npm run check`.
- Manual visual review remains the preferred final check for small visual tweaks in this project.
