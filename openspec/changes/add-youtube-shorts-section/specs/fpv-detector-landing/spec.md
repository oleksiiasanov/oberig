## ADDED Requirements

### Requirement: YouTube Shorts Section
The landing page SHALL present a horizontal, newest-first slider of the D·Vision SDR YouTube Shorts directly below the technical-advantages section, with each card expandable to a full-video view.

#### Scenario: Section placement and order
- **WHEN** the landing page is rendered with at least one synced short
- **THEN** a video section appears immediately after the `#advantages` (technical advantages) section
- **AND** shorts are ordered newest-first with the most recent card visible without horizontal scrolling

#### Scenario: Video card contents
- **WHEN** a video card is displayed
- **THEN** it shows the D·Vision SDR channel name and the YouTube glyph
- **AND** it shows a square video preview image

#### Scenario: Expanding a video
- **WHEN** a visitor activates a video card
- **THEN** a full-video view opens and plays the short
- **AND** it provides a link to the video on YouTube
- **AND** it can be dismissed with a close control, a backdrop click, or the Escape key

#### Scenario: No videos available
- **WHEN** no shorts have been synced
- **THEN** the video section is not rendered

#### Scenario: Bilingual copy
- **WHEN** the site language is Ukrainian or English
- **THEN** the section kicker, title, description, and control labels are shown in that language

### Requirement: YouTube Shorts Sync
The project SHALL provide a build-time synchronization that retrieves recent YouTube Shorts for the D·Vision SDR channel and stores a manifest for native rendering.

#### Scenario: Sync retrieves recent shorts
- **WHEN** the shorts sync runs with a valid YouTube Data API key
- **THEN** the channel's recent short-form videos are resolved and filtered by duration
- **AND** a generated manifest lists each short with its id, title, publish date, thumbnail URL, and privacy-enhanced embed URL

#### Scenario: Sync failure is non-fatal outside CI
- **WHEN** the shorts sync fails and strict mode is not enabled
- **THEN** the previously generated manifest is preserved
- **AND** the build continues

### Requirement: Content Security Policy Allows The YouTube Player
The site response headers SHALL permit the YouTube privacy-enhanced player to load while keeping all other framing denied.

#### Scenario: CSP frame-src
- **WHEN** the site is served with its security headers
- **THEN** the `Content-Security-Policy` allows `frame-src` from `https://www.youtube-nocookie.com`
- **AND** `frame-ancestors 'none'` is retained
