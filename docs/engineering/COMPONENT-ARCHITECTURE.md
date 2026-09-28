# Component Architecture

## Principle

Use shadcn/ui for primitives and compose them into Synapse components.

Do not turn every Figma element into a standalone React component.

## Layers

```text
shadcn primitive
    ↓
shared composed UI
    ↓
feature/domain component
    ↓
section/page
```

## shadcn primitives

```text
components/ui/
├── button.tsx
├── card.tsx
├── dialog.tsx
├── input.tsx
├── tabs.tsx
├── dropdown-menu.tsx
├── tooltip.tsx
├── progress.tsx
├── badge.tsx
└── ...
```

These are owned source files, not an external package you import as an opaque black box.

## When to modify a shadcn primitive

Modify it when:

- the change is globally reusable;
- it is a visual-system requirement;
- it is a general accessibility/behavior correction;
- multiple features need the same variant.

Example:

```text
Button
  variant: default | outline | ghost | destructive | ...
```

Adding a general `soft` variant can be appropriate.

## When to compose

If behavior is domain-specific, compose.

Example:

```text
CourseCard
  ├── Card
  ├── Badge
  ├── Progress
  ├── Button
  └── CourseFolder
```

Do not add `courseId`, `courseTitle`, or course-specific behavior to `Card`.

## Feature structure

```text
features/courses/
├── api/
│   └── courses.api.ts
├── components/
│   ├── CourseCard.tsx
│   ├── CourseFolder.tsx
│   ├── CourseHeader.tsx
│   └── CourseProgress.tsx
├── hooks/
├── motion/
│   ├── course-card.motion.ts
│   └── course-folder.motion.ts
├── utils/
└── index.ts
```

Repeat the pattern for:

- auth
- onboarding
- home
- library
- resources
- study
- discussions
- saved
- contributions

## Motion

Global:

```text
components/motion/
├── FadeIn.tsx
├── Stagger.tsx
└── Presence.tsx
```

Feature-specific:

```text
features/courses/motion/
features/library/motion/
features/study/motion/
```

Keep Framer Motion configuration out of business components where possible.

## Server/client boundary

Example:

```text
CoursePage.tsx              Server
  ↓
CourseHeader.tsx             Server
  ↓
CourseTabs.tsx               Client
  ↓
StudyTab.tsx                 Server
  ↓
StudyActivitySelector.tsx    Client
```

Do not mark the entire page as `"use client"` merely because one child needs interaction.

## Forms

Use React Hook Form + Zod for:

- onboarding
- course creation
- resource upload metadata
- discussion creation
- profile edits

Keep form schemas close to the feature or share them through `packages/contracts` when the exact same contract is used by both client and server.

## Data fetching

Do not fetch server data in every component.

Prefer:

```text
feature/api
  ↓
query options / hooks
  ↓
page/feature container
  ↓
presentational components
```

## Naming

Components:
`CourseCard.tsx`

Hooks:
`useCourse.ts`

API:
`courses.api.ts`

Motion:
`course-card.motion.ts`

Schemas:
`onboarding.schema.ts`

Do not use generic files such as `helpers.ts` for unrelated logic.
