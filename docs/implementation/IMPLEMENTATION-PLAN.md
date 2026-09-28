# Implementation Plan

## Phase 0 — Documentation

First commit:

```text
docs: establish Synapse project documentation
```

Includes:

- PRD
- App Flow
- UI/UX
- Design System
- Architecture
- Database Schema
- API
- Async Jobs
- Realtime boundary
- Component Architecture
- Agent instructions
- GitHub workflow

No application implementation is required for this commit.

## Phase 1 — Repository foundation

Issues:

1. Initialize monorepo
2. Configure Next.js app
3. Configure Express API
4. Configure shared contracts package
5. Configure TypeScript
6. Configure ESLint
7. Configure Prettier
8. Configure environment validation
9. Configure Winston logging
10. Configure error handling
11. Configure MongoDB/Mongoose
12. Configure shadcn/ui and design tokens
13. Configure TanStack Query
14. Configure auth foundation

These are separate issues even if implemented in one cohesive branch/PR.

## Phase 2 — App shell

- sidebar
- routing
- protected app layout
- responsive shell
- profile
- theme provider
- global loading/error boundaries

## Phase 3 — Onboarding

- onboarding route guard
- stepper
- forms
- subject catalog
- profile update
- course seeding
- redirect to Home

Acceptance:
A new account should reach a populated Home state with selected subject/course containers.

## Phase 4 — Courses

- course list
- create/edit/archive
- course detail
- resource relationship
- course progress projection

## Phase 5 — Library + resources

- search/filter UI
- resource list
- upload
- Cloudinary
- processing state
- Inngest resource workflow
- resource detail
- save

## Phase 6 — Study Packs

- resource selection
- credit consumption
- StudyPack creation
- Inngest generation
- StudyActivity persistence
- progress

## Phase 7 — Study UX

- concept path
- flashcards
- quizzes
- activity completion
- review records
- progress updates

## Phase 8 — Discussions

- list
- create
- detail
- comments
- replies
- resource/course context
- moderation integration point

## Phase 9 — Home / My Study

- continue studying
- study statistics
- recent items
- progress
- upcoming information

## Phase 10 — Hardening

- tests
- accessibility
- responsive QA
- performance
- error handling
- security
- observability
- documentation
- production configuration

## Build rule

For each feature:

```text
design audit
→ component inventory
→ server/client mapping
→ API/schema check
→ static structure
→ responsive layout
→ interaction
→ motion
→ loading/error/empty states
→ tests
→ accessibility
→ performance
```

Motion comes after structural stability.
