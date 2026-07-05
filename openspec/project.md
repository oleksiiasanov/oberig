# Project Context

## Purpose
D.VISION SDR is a product landing page for a wide-band FPV/drone video detector based on SDR. The site must communicate the product clearly to Ukrainian and international audiences, provide order/contact paths, and stay grounded in approved product/reference material.

## Tech Stack
- Vite
- React 19
- Framer Motion for restrained section motion
- Lucide React for interface icons
- Plain CSS with mobile-first breakpoints
- OpenSpec for proposal/spec tracking

## Project Conventions

### Code Style
- Keep public content in `src/data/content.js` so Ukrainian and English variants stay aligned.
- Keep sections modular under `src/components/`.
- Prefer concise, readable React components over large monolithic files.
- Use CSS custom properties for design tokens and keep base CSS mobile-first.

### Architecture Patterns
- `src/App.jsx` owns persistent language and logo-variant state.
- Header language choice is persisted in `localStorage`.
- The site attempts IP-country language defaulting via `ipapi.co`, with browser-locale fallback.
- Brand assets live in `public/`; root `/favicon.ico`, additional icons in `/favicons/`, OG image at `/og-image.png`.
- CTA URLs and social URLs are centralized in `src/data/content.js`.

### Testing Strategy
- Run `npm run check` for material changes.
- `npm run check` executes content/design checks and a production Vite build.
- Visual screenshot checks are used only when layout risk is material or explicitly requested.
- OpenSpec changes should be validated with `openspec validate ... --strict --no-interactive` before being treated as ready.

### Git Workflow
- Work on `main` for the current landing project.
- Ask before pushing unless the user explicitly requests an immediate push.
- Keep commits focused and describe the product-facing change.

## Domain Context
- The landing positions D.VISION SDR as an SDR-based FPV/drone video detector.
- Current public positioning highlights 500-9000 MHz coverage and approximately 9-second full-range scanning.
- Supported public languages are Ukrainian and English.
- Current social links are TikTok and Instagram only.
- Approved CTA destinations:
  - Order: `https://forms.gle/xFcMaTWR1G5pR4qW6`
  - Contact: `https://wa.me/380954716680`

## Important Constraints
- Do not reintroduce legacy Oberig/Oberig SDR naming.
- Do not reintroduce the old bronze/gold alternate theme.
- Do not reintroduce unsupported old frequency claims such as 1050 or 6040 MHz.
- Do not claim universal drone detection.
- Do not add named competitor claims without approved evidence.
- Do not provide tactical or combat-use instructions.
- Keep the mobile burger menu stable on Android Chrome/Samsung Browser with body scroll locked while open.

## External Dependencies
- `ipapi.co` is used client-side for optional country detection when no language preference exists.
- Google Form is used for order intake.
- WhatsApp is used for the contact CTA.
- TikTok and Instagram are the current public social destinations.
