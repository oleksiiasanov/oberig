## ADDED Requirements
### Requirement: Cursor And Claude Design Instructions
The repository SHALL include Cursor and Claude Code System Instructions that define the desired AI persona and premium design standards for future visual work.

#### Scenario: Agent instructions are added
- **WHEN** `AGENTS.md` is updated for this change
- **THEN** it includes the provided "Cursor & Claude Code System Instructions" content outside the managed OpenSpec block
- **AND** it preserves the managed OpenSpec block exactly enough for `openspec update` to refresh it later

### Requirement: Premium Visual Standards
The agent instructions SHALL direct future assistants toward premium, modern landing-page execution.

#### Scenario: Future assistant edits visual files
- **WHEN** an assistant modifies or creates visual landing files
- **THEN** the instructions establish an elite UI/UX frontend architect persona
- **AND** they call for complex neutrals, sleek dark/light modes, glass-like surfaces, refined borders, generous 8pt spacing, bento grids, bold tight typography, realistic copywriting, and high-quality responsive implementation

### Requirement: Tool And Dependency Guidelines
The agent instructions SHALL document how future assistants should handle visual libraries and component structure.

#### Scenario: Future assistant needs premium visuals
- **WHEN** a visual feature requires an external library or framework support
- **THEN** the instructions allow considering tools such as Framer Motion, lucide icons, Radix primitives, Tailwind, or similar dependencies
- **AND** any actual install remains subject to project tooling, terminal permissions, and repository approval constraints
- **AND** the implementation preserves existing business logic and any project configuration or types that are present in the repository at the time, unless explicitly changed

### Requirement: Visual Execution Protocol
The agent instructions SHALL require a concise design concept before visual-file changes.

#### Scenario: Future assistant starts visual implementation
- **WHEN** the assistant is about to modify or create visual files
- **THEN** it prints a one-sentence design concept outlining layout and animation flow
- **AND** it then produces clean, responsive, production-ready implementation aligned with the approved spec
