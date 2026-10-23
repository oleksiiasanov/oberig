## Implementation and release
- [x] Render groups from API and verify order, language and unchanged checkout.
- [x] Content, tests, build, browser verification and strict OpenSpec pass.
- [x] Release to Vercel after CRM API exposes groups; verify published catalog.

Local evidence:12 unit tests, content/build, strict OpenSpec; catalog grouping and no overflow at1440/390px; existing checkout browser regression passes both widths with repeated price changes, explicit consent and successful synthetic checkout.

Production: PR44 /91d66eb deployed on Vercel, CRM fbd8943f exposes1 MAIN and7 ADDITIONAL listings. Live browser verified both sections, correct IDs, mobile fit and no page errors without submitting orders. Follow-up preserves quick-navigation targets for spare-part cards now inside display groups.
