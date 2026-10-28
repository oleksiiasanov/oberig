## ADDED Requirements
### Requirement: CRM-owned retail fields
The system SHALL mirror current retail stage, manual payment/prepayment labels, explicit problem flag and customer-received detector quantity into the five matching Orders columns for linked website orders.
#### Scenario: Cancellation and payment edits
- **WHEN** a linked order is cancelled or its manual labels change
- **THEN** the corresponding sheet values update without changing payment amounts, comments, dates or other fields.
#### Scenario: Receipt versus dispatch
- **WHEN** detectors are partially shipped but customer receipt is not confirmed
- **THEN** the received quantity remains zero, and accessories never count as detectors.
#### Scenario: Historical isolation
- **WHEN** reconciliation runs
- **THEN** rows without the captured immutable website key are unchanged.
### Requirement: Durable ordered state delivery
The system SHALL queue committed changes, wake reconciliation after commit and repair failures on the existing periodic trigger. It SHALL reject older state snapshots and stale acknowledgements.
#### Scenario: Overlapping updates
- **WHEN** an older reply arrives after a newer sheet update
- **THEN** it cannot overwrite the newer values or acknowledge unseen CRM changes.
#### Scenario: Google outage
- **WHEN** Google is unavailable during an order action
- **THEN** the CRM action succeeds and the durable queued state is retried.
### Requirement: Manual retail problem marker
The system SHALL offer an authorized, audited and version-checked retail problem flag independent of cancellation and payments.
#### Scenario: Mark and clear
- **WHEN** an authorized manager toggles the flag
- **THEN** the marker is saved, visible in CRM, audited and mirrored to the linked row.
