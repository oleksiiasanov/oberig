# D·Vision landing — current change context

Owner-approved2026-10-21: static site remains on Vercel. Clean branch
`feat/crm-order-checkout` from remote main1d07156 replaces PR36, while PR35 Pages
move is cancelled. `add-order-relay` is the updated approved plan. Checkout success
will depend on CRM acknowledgement; the existing Apps Script write remains an
independent temporary copy. No business cap99; stable retry identity across reload.
CRM counterpart: `crm_oberig` branch `feat/website-order-api`.
Production activation follows API readiness and private Turnstile configuration.
No live release or verification is claimed by local source completion.
See `openspec/project.md` for existing product conventions.

Local content/build, checkout and Apps Script synthetic tests pass; strict OpenSpec8
passes. Browser discovery returned no connections. Real Turnstile, Vercel public env
and Apps Script deployment remain activation prerequisites. See crm/WEBSITE-CHECKOUT.md.
