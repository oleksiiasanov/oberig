## 1. Implementation
- [x] 1.1 Add the column mapping (tracking tab URL comes from a Script property) to `crm/Code.gs`
- [x] 1.2 Add `syncContactedOrder(e)` (installable onEdit handler) with duplicate guard and lock
- [x] 1.3 Add `previewTrackingRow()` that logs the row for a given order without writing
- [x] 1.4 Add `installTrackingTrigger()` and document the one-time setup in `crm/README.md`

## 2. Rollout
- [x] 2.1 Show the preview rows to the owner and get approval
- [ ] 2.2 Paste the script, authorize, install the trigger
- [ ] 2.3 Tick "Контакт" on one real order and verify the tracking row
