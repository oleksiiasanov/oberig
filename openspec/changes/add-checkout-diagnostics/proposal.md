# Change: Correlated checkout diagnostics

## Why
A sheet-only website submission has verification_required but no server record explaining its original failure. Browser errors are currently lost and verification returns only a boolean.

## Authorization
Owner explicitly requested checking all available logs and adding missing diagnostics on 2026-11-21. This implements that request; owner subsequently explicitly authorized source publication and production release. Owner subsequently explicitly chose automatic ordinary CRM order creation from saved sheet requests even without successful anti-bot verification, accepting possible spam. Signed bridge authentication, catalog validation and original-key deduplication remain mandatory. Never fabricate a successful verification marker.

## What Changes
- Bounded structured diagnostics correlated by immutable clientOrderId across browser, gateway, signed sheet bridge and Apps Script.
- Record verification failure categories, request outcomes and timing, never customer fields, IP addresses, arbitrary errors or tokens.
- Preserve independent Sheets delivery, authoritative CRM acknowledgement and idempotent retries; retry one transient CRM delivery failure with a fresh verification token and the same payload/key.

## Impact
- Paired website and CRM repositories; gateway image, website bundle and Apps Script require coordinated release.
- No database migration. Existing verification_required sheet requests become eligible for normal idempotent recovery.
