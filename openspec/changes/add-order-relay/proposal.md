# Change: Reliable website checkout into CRM on the existing host

## Why
Owner approved on 2026-10-21: «тоді вперед, роби все що треба» after reviewing the clean-branch implementation plan. Vercel remains the static host. CRM is the authoritative checkout destination; Sheets is a temporary independent copy for manual comparison, not an import source. This supersedes the separate-VM/browser-best-effort design and landing PRs35/36.

## What Changes
- Public POST /order through Cloudflare Tunnel to an isolated intake container on the existing CRM host; only the private intake credential, no DB/admin credentials.
- Server validation and Turnstile verification, stable per-order idempotency, success only after CRM commit.
- Independent existing Sheets write, normal bilingual success/retry copy, durable attempt identity across reload, no 99-unit business cap.
- Preserve current schema and manager behavior; remove-order-manager remains independent.

## Impact
- CRM change: add-public-order-intake. Landing counterpart: add-order-relay.
- No Pages move, new VM, queue, live data import, unrelated migration or deletion.
- Source PRs and local synthetic verification precede coordinated API activation and site release. Live secrets/domain resources must be configured privately; never substitute test keys in production.
