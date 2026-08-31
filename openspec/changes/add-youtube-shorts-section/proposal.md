# Change: Add YouTube Shorts section to the landing page

## Why
The team publishes short field videos as YouTube Shorts, but the landing page has no place to show them. A native, newest-first video strip below the technical-advantages section adds social proof and product context without sending visitors off-site.

## What Changes
- Add a horizontal, newest-first slider of YouTube Shorts to the landing page directly below the "Технічні переваги" (`#advantages`) section.
- Each card shows the D·Vision SDR channel name, the YouTube glyph, and a square video preview; tapping a card opens a modal with the full Short playing in the privacy-enhanced YouTube player plus a "watch on YouTube" link.
- Add a build-time YouTube Data API sync (`npm run sync:shorts`) that resolves the channel's uploads, keeps Short-length videos, and writes `src/data/reels.generated.json` (id, title, published date, thumbnail, embed URL — no media files committed).
- Add a daily GitHub Actions workflow for the sync.
- Add a `frame-src` allowance for `https://www.youtube-nocookie.com` to the Vercel Content-Security-Policy.
- Add Ukrainian and English copy for the section.

## Impact
- Affected specs: `fpv-detector-landing`
- Affected code: `src/App.jsx`, `src/components/SocialReels.jsx` (new), `src/data/content.js`, `src/data/reels.generated.json` (new), `src/styles.css`, `scripts/sync-youtube-shorts.mjs` (new), `scripts/check-content.mjs`, `package.json`, `vercel.json`, `.github/workflows/sync-youtube-shorts.yml` (new)
- New external dependency: YouTube Data API v3 at build time; YouTube privacy-enhanced iframe player at runtime (one `frame-src` CSP entry).
