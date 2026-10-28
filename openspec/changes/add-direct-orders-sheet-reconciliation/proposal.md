# Change: Direct Orders writes with CRM-owned numbering

## Why
Parallel website writes currently use independent numbers and a manual intermediate-sheet transfer. Missing writes can go unnoticed.

## What Changes
- Keep independent website writes; a new standalone Apps Script writes directly to Orders with blank business status. Replace the website webhook URL and retire the primary-sheet path.
- Match immutable clientOrderId; CRM owns visible numbers. Preserve manager fields.
- Persist accepted CRM snapshots and keyed Sheets requests. Trigger presence checks, allow a two-minute grace interval, and reconcile every15 minutes.
- Recover only validated gaps, retain conflicts for review, never replay deleted or unkeyed historical orders.
- Preserve survey and notifications.

## Impact
CRM intake/schema/private bridge; public gateway signed server-only bridge; website Apps Script and survey identity. No historical migration.

## Approval
Owner explicitly approved this design and instructed implementation on2026-10-28 (“то що імпоементуємо тоді”). Publication requires live Apps Script access and coordinated deployment.

Owner subsequently approved immediate standalone replacement (“просто переводимо на нове”), without a dual-writer transition. New project publication remains pending connected editor access.
