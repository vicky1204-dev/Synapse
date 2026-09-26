# AGENTS.md

## Project

This is a production-oriented college SaaS project.

The human developer owns:
- product decisions
- UX decisions
- visual design
- architecture decisions
- final approval

Agents are implementation and engineering assistants.

## Before changing code

Understand only the relevant parts of:
Product decisions → docs/product
Design decisions → docs/design
Architecture → docs/engineering
Implementation plans → docs/implementation

Do not read every project document unless the task requires it.

## Engineering principles

- Prefer simple, maintainable solutions.
- Do not introduce dependencies without justification.
- Reuse existing abstractions before creating new ones.
- Keep components composable.
- Keep business logic out of presentation components where practical.
- Validate inputs at system boundaries.
- Handle loading, error, empty, and success states.
- Avoid premature abstractions.
- Do not rewrite working code unnecessarily.
- Do not introduce infrastructure without a documented reason.
- Keep business logic out of React components.
- Validate all external input.
- Server Components by default.
- Client Components only where interaction requires them.
- Motion is progressive enhancement.
- Do not rewrite unrelated code.
- Preserve existing behavior unless explicitly changing it.

## UI

The human developer owns visual direction.

Agents should implement the provided design faithfully rather than inventing a new visual language.

Preserve:
- spacing system
- typography
- component hierarchy
- responsive behavior
- interaction states

Do not add gratuitous animations.

## Changes

Before modifying code:
1. Identify relevant files.
2. Explain the implementation plan briefly if the task is non-trivial.
3. Make the smallest coherent change.

After modifying code:
1. Run relevant checks.
2. Fix issues caused by the change.

## Git

Do not reset, discard, or overwrite unrelated user changes.

Do not commit unless explicitly requested.

## Documentation

Update project documentation only when the change materially affects:
- architecture
- product behavior
- development conventions
- important technical decisions.

## Definition of done

Feature isn't done until:

- Requirements satisfied
- Acceptance criteria satisfied
- Tests passing
- Accessibility checked
- Responsive behavior checked
- Error states handled
- Security considerations checked
- Code reviewed
- Documentation updated where necessary

## Implementation Summary

### Changed
- ...

### Added
- ...

### Removed
- ...

### API Changes
- ...

### Schema Changes
- ...

### Documentation Changes
- ...

### Validation
- Typecheck:
- Lint:
- Tests:

### Remaining Work
- ...

### Risks
- ...