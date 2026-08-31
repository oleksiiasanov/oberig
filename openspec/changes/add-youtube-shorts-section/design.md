## Context
The team keeps short-form product footage as YouTube Shorts on `@D·VisionSDR`. The site is a static Vite build on Vercel with a strict `default-src 'self'` CSP. A build-time sync already exists for the Notion manual and is the model to follow here.

## Goals / Non-Goals
- Goals: native, on-brand Shorts strip; newest video visible first without scrolling; tap-to-expand playback; automated daily refresh; minimal third-party surface.
- Non-Goals: live client-side YouTube fetching; comments/likes; infinite feed; hosting or re-encoding video ourselves.

## Decisions
- Decision: Sync with the **YouTube Data API v3** using a static API key (no OAuth, no token expiry). Resolve the channel via `forHandle`, read `contentDetails.relatedPlaylists.uploads`, page `playlistItems`, then `videos?part=contentDetails` to filter by duration (`<= YT_MAX_DURATION_SECONDS`, default 180). An optional `YT_PLAYLIST_ID` override lets the team point at a hand-curated playlist instead.
- Decision: Do **not** download video. Store only a manifest (`id`, `title`, `publishedAt`, `thumbnail` on `i.ytimg.com`, `embedUrl` on `youtube-nocookie.com`). Playback uses an `<iframe>` to the privacy-enhanced player.
- Decision: Add a single `frame-src 'self' https://www.youtube-nocookie.com` entry to the CSP. Thumbnails already pass under `img-src https:`.
- Decision: The card preview is a 1:1 crop (`object-fit: cover`) of the YouTube thumbnail; the modal plays the Short at its native 9:16.
- Decision: Ship a placeholder manifest (`source: "placeholder"`) whose items carry a local `src` and null `embedUrl`; the component renders a local `<video>` when `embedUrl` is absent, so review builds show the layout before the first sync.
- Alternatives considered: YouTube IFrame Player API/JS SDK (needs `script-src` for YouTube, more moving parts); downloading Shorts with yt-dlp (violates YouTube ToS, brittle); Instagram Graph API (expiring tokens, must self-host MP4s).

## Risks / Trade-offs
- Duration-only Short detection can include a normal video under the threshold → mitigated by the `YT_PLAYLIST_ID` curated-playlist override and a tunable threshold.
- YouTube player sets its own cookies/localStorage → mitigated by the `youtube-nocookie.com` domain and only loading the iframe after a user opens the modal.
- API key quota / key leakage → key is CI-only (GitHub secret); the browser never sees it.
- API failure → non-fatal outside CI; the previous manifest is preserved.

## Migration Plan
- Land with the placeholder manifest; the first successful CI sync replaces it. Full revert = remove the component, manifest, script, workflow, and the CSP entry.

## Open Questions
- Final channel identifier: ship configured for handle `@D·VisionSDR`; the team can set `YT_CHANNEL_ID` (a `UC…` id) as a repo variable for an exact match.
