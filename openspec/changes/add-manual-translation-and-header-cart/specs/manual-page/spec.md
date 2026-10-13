## ADDED Requirements

### Requirement: Manual translation
The `/manual` page SHALL show the manual in English when the site language is English.

#### Scenario: Translated text
- **WHEN** the site language is English
- **THEN** headings, the table of contents, paragraphs, lists, tables and image captions are shown in English with the original formatting and links

#### Scenario: Text changed in Notion
- **WHEN** a text synced from Notion has no entry in the English dictionary
- **THEN** that text is shown in Ukrainian and the sync log lists it as untranslated
