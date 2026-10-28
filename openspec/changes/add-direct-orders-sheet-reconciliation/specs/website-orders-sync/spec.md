## ADDED Requirements
### Requirement: Independent direct Orders capture
The system SHALL retain independent CRM and Sheets writes with one immutable clientOrderId, blank initial sheet business status and CRM-owned visible numbering.
#### Scenario: Parallel arrival
- **WHEN** requests arrive in either order or repeat after a timeout
- **THEN** one keyed sheet row and one CRM order result, with the same displayed number.
### Requirement: Durable reconciliation
The system SHALL schedule checks after successful writes and run a15-minute fallback. Missing counterparts SHALL be recovered only after a grace interval, using the original validated request and key.
#### Scenario: Partial outage
- **WHEN** only one destination receives a request
- **THEN** reconciliation restores the other destination after recovery without changing manager fields.
#### Scenario: Conflict or deletion
- **WHEN** payloads differ, prices changed, duplicate keys exist or a previously accepted CRM order was deleted
- **THEN** the conflict is reported without merging, repricing or resurrecting an order.
### Requirement: Historical isolation
The system SHALL exclude unkeyed historical rows and non-website CRM orders from automatic recovery.
#### Scenario: Existing imported orders
- **WHEN** the feature is enabled
- **THEN** historical data remains intact and new technical columns do not replace existing data.
