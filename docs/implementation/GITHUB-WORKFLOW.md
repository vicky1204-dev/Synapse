# GitHub Workflow

## 1. Project board

Create a GitHub Project with:

### Status
```text
Backlog
Ready
In Progress
Review
Done
```

### Custom fields

Priority:
```text
P0
P1
P2
```

Effort:
```text
XS
S
M
L
XL
```

Sprint:
```text
Sprint 0
Sprint 1
Sprint 2
Sprint 3
...
```

Type:
```text
Feature
Bug
Research
Refactor
Documentation
Chore
```

Area:
```text
Frontend
Backend
Database
Realtime
AI
Design System
Infrastructure
```

## 2. Views

### Kanban
Group by Status.

### Table
Columns:
- Title
- Type
- Area
- Priority
- Effort
- Sprint
- Status
- Milestone

### Optional roadmap
Group by Milestone.

## 3. Labels

Use labels for filtering, not as a replacement for custom fields.

Recommended:

```text
type:feature
type:bug
type:research
type:refactor
type:documentation
type:chore

area:frontend
area:backend
area:database
area:ai
area:design-system
area:infra
area:realtime

priority:p0
priority:p1
priority:p2
```

Do not duplicate `type` and `priority` in both labels and custom fields unless you deliberately want both. Prefer custom fields for planning and labels for filtering.

## 4. Milestones

### MVP
Foundation + auth + onboarding + courses + resources + basic study flow.

### Beta
Study Packs + discussions + progress + hardening.

### v1.0
Production polish, accessibility, performance, reliability and final UX.

## 5. Issue hierarchy

Use parent issues for meaningful vertical slices.

Example:

```text
#100 Resource Upload
  ├── #101 Upload UI
  ├── #102 Cloudinary integration
  ├── #103 Resource schema
  ├── #104 Inngest processing
  └── #105 Processing UI
```

Do not create an issue for every file.

An issue should represent independently trackable work.

## 6. Branching

Branch from main:

```text
feat/101-resource-upload-ui
fix/123-resource-processing-error
refactor/130-study-query-layer
docs/1-project-architecture
chore/2-repository-foundation
```

## 7. Commit conventions

Use conventional commits.

Examples:

```text
docs: establish Synapse project documentation
chore: initialize monorepo
feat: add onboarding flow
feat: add course resource endpoint
fix: handle failed resource processing
refactor: extract course query options
test: add study progress service tests
```

## 8. Issue vs commit vs PR

They are different.

An issue defines work.

A commit records a change.

A PR reviews a set of commits.

Therefore:

```text
Issue #1
Issue #2
Issue #3
Issue #4
        ↓
implementation branch
        ↓
one or more commits
        ↓
PR
```

A single PR can close multiple issues when they form one coherent change.

Example PR:

```text
chore: establish application foundation
```

can close issues for:
- Next.js setup
- API setup
- MongoDB setup
- environment validation
- linting
- formatting

But it should not pretend that one commit "covers" those issues automatically.

GitHub closes issues through explicit references such as:

```text
Closes #1
Closes #2
Closes #3
```

## 9. First development sequence

```text
Commit 1:
docs: establish Synapse project documentation

↓
Create GitHub issues from implementation plan

↓
Configure Project board

↓
Create Sprint 0

↓
Repository foundation branch

↓
Implement foundation issues

↓
PR

↓
App shell

↓
Onboarding

↓
Vertical feature slices
```

## 10. Agent workflow

Before giving an agent a task:
- give it the issue number;
- point it to the relevant docs;
- specify the acceptance criteria;
- define what it must not change.

The repository itself should contain enough context that this message can remain short.
