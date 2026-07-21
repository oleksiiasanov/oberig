## ADDED Requirements
### Requirement: Notion-Synced User Manual
The site SHALL provide a native public user manual page generated from the D·Vision SDR Notion instruction source.

#### Scenario: Visitor opens the manual page
- **WHEN** a visitor navigates to the manual page
- **THEN** the site renders the instruction as native HTML using the D·Vision SDR visual system
- **AND** the page does not require the visitor to open Notion.

#### Scenario: Manual content is unavailable
- **WHEN** generated manual content is missing or empty
- **THEN** the site shows a clear non-broken empty state
- **AND** provides a path back to the landing page.

### Requirement: Daily Notion Synchronization
The project SHALL include a daily synchronization path that fetches the current Notion instruction and stores generated site content for the manual page.

#### Scenario: Scheduled sync runs
- **WHEN** the daily synchronization job runs with valid Notion access
- **THEN** it fetches the current Notion page content
- **AND** writes a generated representation consumed by the site build.

#### Scenario: Sync credentials are absent
- **WHEN** the sync command runs without Notion API credentials
- **THEN** it attempts to fetch the public Notion page without exposing secrets in browser code
- **AND** falls back to a clear placeholder only if public synchronization is unavailable.

### Requirement: Manual Navigation Entry Points
The landing page SHALL make the user manual discoverable from persistent navigation and the main landing experience.

#### Scenario: Header navigation includes manual
- **WHEN** the header or mobile burger menu is displayed
- **THEN** it includes a user manual navigation item
- **AND** selecting it opens the manual page.

#### Scenario: Landing CTA opens manual
- **WHEN** a visitor activates the landing manual CTA
- **THEN** the site opens the manual page
- **AND** preserves the current language selection.
