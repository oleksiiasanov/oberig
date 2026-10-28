# Change: Mirror retail state into Orders

## Why
OMS-408 was cancelled in CRM while its linked Orders row remained blank. The owner approved extending the existing one-way CRM authority to order/payment/prepayment status, a manual problem flag and the number of detectors actually received by the customer.

## What Changes
- Mirror only these five business fields on immutable-key-linked website rows.
- Add an audited, version-checked retail problem toggle in CRM.
- Queue committed changes and wake the existing script; retain 15-minute repair.
- Fence stale snapshots and acknowledgements. Keep NEW sheet status blank.
- Receipt quantity counts customer receipt, not shipment or accessories.

## Impact
CRM schema/API/UI, signed bridge, standalone Apps Script and tests. Historical unkeyed rows remain isolated. Payment/prepayment labels do not create or infer financial transactions. Approval is the owner’s current request and explicit answers about receipt/problem semantics.
