## ADDED Requirements
### Requirement: Correlated private checkout diagnostics
The system SHALL emit bounded structured events with a validated clientOrderId when available, stage, fixed reason code, server timestamp and elapsed time. It SHALL exclude customer names, phones, cart contents, tokens, IPs, URLs and arbitrary error text. Browser reports SHALL remain untrusted diagnostic evidence and SHALL never authorize order creation.

#### Scenario: Verification fails before CRM creation
- **WHEN** a browser or provider verification fails
- **THEN** diagnostics identify the stage and allowlisted failure reason without exposing the token
- **AND** the original verification result remains diagnostic evidence; an authenticated saved sheet request can still create an ordinary CRM order under the owner-approved policy.

#### Scenario: Request never reaches the gateway
- **WHEN** the browser detects a verification or network failure
- **THEN** it attempts bounded asynchronous reporting without delaying or breaking checkout
- **AND** diagnostics delivery failure cannot claim that the original request reached the server.

#### Scenario: Transient delivery failure recovers
- **WHEN** a CRM network timeout or temporary service failure occurs after verification
- **THEN** at most one automatic retry uses the original payload and clientOrderId with a fresh challenge
- **AND** price conflicts, validation errors and failed verification do not retry automatically.

#### Scenario: Public telemetry abuse
- **WHEN** unknown fields, invalid identifiers, oversized bodies, foreign origins or excessive reports arrive
- **THEN** the gateway rejects or omits them without calling CRM or consuming the checkout rate-limit allowance.

### Requirement: Recover saved sheet requests independently of anti-bot outcome
The system SHALL accept saved post-cutover sheet-only requests through the authenticated bridge regardless of the verification marker. It SHALL retain identity, original payload and commercial validation, audit recovery and prevent duplicate creation. Direct unsigned browser calls SHALL NOT gain authority to invoke the private bridge.

#### Scenario: Unverified accessory order is missing from CRM
- **WHEN** a signed request presents a saved post-cutover order containing two antennas, verified=false and an elapsed grace interval
- **THEN** CRM creates one ordinary NEW order with the original prices and quantities and writes its number to the existing row
- **AND** concurrent replay creates no second order and the stored verification flag remains false.

#### Scenario: Old verification conflict retries
- **WHEN** a saved keyed row has CONFLICT/verification_required
- **THEN** the next reconciliation retries it under the new policy without altering the original payload or verification evidence.

#### Scenario: Invalid or historical recovery
- **WHEN** recovery is unsigned, has changed prices, mismatched identity, a deleted-order tombstone or predates the capture boundary
- **THEN** existing validation rejects automatic creation and preserves a diagnostic.
