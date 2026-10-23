## ADDED Requirements
### Requirement: CRM-controlled display groups
The website SHALL preserve API displayGroup and show MAIN products first, followed by ADDITIONAL under Комплектуючі in Ukrainian or Accessories in English. It SHALL preserve source order within each group and omit empty sections. Grouping SHALL NOT use internal warehouse kind or public descriptive category.
#### Scenario: Accessory in additional group
- **WHEN** the API marks an antenna ADDITIONAL
- **THEN** it appears below Комплектуючі regardless of its descriptive category and checkout remains unchanged
#### Scenario: Rolling deployment
- **WHEN** a catalog item has no displayGroup
- **THEN** it remains visible as MAIN
