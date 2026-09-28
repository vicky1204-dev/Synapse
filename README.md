# Synapse

> **A focused learning workspace for students — turning scattered resources into structured study.**

Synapse is a student-focused learning platform designed around a simple idea: **studying should be a workflow, not a collection of disconnected files.**

Students can discover and save shared resources, organize them into personal courses, generate AI-powered study material, plan their preparation, track progress, and participate in discussions around the resources they use.

The project is being built as a production-oriented full-stack application, while intentionally keeping the architecture simple enough to understand, maintain, and evolve.

---

## The Idea

Most student resources live in disconnected places:

```text
PDFs
   ↓
Random folders
   ↓
Bookmarks
   ↓
WhatsApp / Telegram
   ↓
"Where was that note again?"
```

Synapse brings these pieces into one learning workflow:

```text
Discover
   ↓
Save / Study
   ↓
Organize into Courses
   ↓
Generate Study Material
   ↓
Create a Study Plan
   ↓
Study
   ↓
Track Progress
   ↓
Discuss & Learn
```

A **resource** is something students can discover and share.

A **course** is a student's personal organization of resources around a subject or goal.

A **study pack** transforms selected learning material into structured study content.

**My Study** turns those materials into an actionable learning workflow.

---

## Core Product

### Library

A shared discovery space for learning resources.

Students can:

- Browse resources
- Search and filter
- Explore by tags
- Open resources
- Save resources
- Start studying directly
- Generate study material from supported resources

### Courses

Courses are **personal to each user**.

A student can create:

> **Operating Systems**

and organize multiple resources inside it.

```text
Operating Systems
│
├── Resources
├── Study Packs
├── Study Plan
├── Discussions
└── Progress
```

Courses can optionally have deadlines and become the primary container for structured exam preparation.

### Study Packs

AI-generated learning material created from selected resources.

A student can generate a study pack from:

- An individual resource
- Multiple resources inside a course

Study packs can contain:

- Summaries
- Flashcards
- Quizzes
- Key concepts
- Revision material
- AI-generated study guidance

Generation is credit-based, allowing the product to introduce a free/pro model without changing the fundamental learning workflow.

### My Study

The student's personal study workspace.

It answers:

> **What am I studying, and what should I do next?**

It can surface:

- Active courses
- Upcoming courses
- Deadlines
- Study-plan activities
- Progress
- Recently studied material
- Upcoming revision
- Study-pack activities

### Discussions

A Reddit-style discussion layer around learning resources and topics.

Students can:

- Create discussions
- Comment
- Ask questions
- Share knowledge
- Discuss resources
- Discover conversations related to their studies

Discussions are intentionally asynchronous rather than being designed as a real-time chat system.

### AI & Automation

AI is used where it reduces repetitive study work rather than becoming the product itself.

Potential capabilities include:

- Note summarization
- Study-pack generation
- Flashcard generation
- Quiz generation
- Mind-map generation
- Study-plan generation
- Resource tagging
- AI moderation
- Future personalized study recommendations

Long-running AI work is handled asynchronously through **Inngest**.

---

## Product Architecture

```text
                         ┌─────────────────────┐
                         │       Student       │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │      Next.js        │
                         │    TypeScript       │
                         │                     │
                         │  App Router         │
                         │  React              │
                         │  shadcn/ui          │
                         │  TanStack Query     │
                         │  Zustand            │
                         └──────────┬──────────┘
                                    │
                                  HTTP
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │    Express API      │
                         │    TypeScript       │
                         │                     │
                         │  Auth               │
                         │  Domain Modules     │
                         │  Validation         │
                         │  Services           │
                         └──────┬──────┬───────┘
                                │      │
                    ┌───────────┘      └────────────┐
                    ▼                               ▼
             ┌─────────────┐                 ┌─────────────┐
             │   MongoDB   │                 │  Cloudinary  │
             │  Mongoose   │                 │   Media      │
             └─────────────┘                 └─────────────┘

                                │
                                ▼
                         ┌─────────────────┐
                         │     Inngest     │
                         │ Async Workflows │
                         └────────┬────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │    AI Models    │
                         │ Gemini / OpenAI │
                         └─────────────────┘
```

### Architectural Principles

- **Server Components by default**
- **Client Components only where interaction requires them**
- **Motion as progressive enhancement**
- **Business logic stays outside presentation components**
- **Validate input at system boundaries**
- **Keep domain logic inside feature/module boundaries**
- **Prefer composition over unnecessary abstraction**
- **Introduce infrastructure only when there is a concrete need**
- **Design for production without over-engineering**

---

## Tech Stack

### Frontend

| Technology      | Purpose                  |
| --------------- | ------------------------ |
| Next.js         | Application framework    |
| React           | UI                       |
| TypeScript      | Type safety              |
| Tailwind CSS    | Styling                  |
| shadcn/ui       | UI primitives            |
| Framer Motion   | Interface motion         |
| TanStack Query  | Server-state management  |
| Zustand         | Client/application state |
| React Hook Form | Form management          |

### Backend

| Technology | Purpose                      |
| ---------- | ---------------------------- |
| Node.js    | Runtime                      |
| Express    | HTTP API                     |
| TypeScript | Type safety                  |
| MongoDB    | Persistent data              |
| Mongoose   | MongoDB ODM                  |
| Inngest    | Background jobs/workflows    |
| Cloudinary | Media storage                |
| AI APIs    | AI-powered learning features |

---

## Project Structure

```text
Synapse/
│
├── apps/
│   ├── web/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── motion/
│   │   ├── providers/
│   │   ├── stores/
│   │   └── public/
│   │
│   └── api/
│       └── src/
│           ├── config/
│           ├── modules/
│           ├── inngest/
│           ├── middleware/
│           ├── lib/
│           ├── utils/
│           ├── app.ts
│           └── server.ts
│
├── docs/
│   ├── product/
│   ├── design/
│   ├── engineering/
│   ├── api/
│   └── implementation/
│
├── AGENTS.md
├── CLAUDE.md
└── package.json
```

The repository is organized around **domain ownership rather than technical dumping grounds**.

```text
features/
├── courses/
├── resources/
├── study/
├── study-packs/
├── discussions/
├── credits/
└── auth/
```

Each feature owns its UI-specific components, API functions, types, hooks, and utilities where appropriate.

---

## Design Philosophy

Synapse is intentionally **minimal, quiet, and functional**, while using small moments of visual interest to keep the experience from feeling sterile.

The visual language is built around:

- Strong typography
- Generous whitespace
- Soft neutral surfaces
- Subtle borders
- Rounded interfaces
- Electric blue as the primary accent
- Controlled gradients
- Colorful contextual accents
- Minimal but purposeful motion

The interface should feel like a **modern study workspace**, not a traditional LMS.

### Motion

Motion is primarily handled through **Framer Motion**.

Motion should communicate:

- State changes
- Hierarchy
- Continuity
- Opening/closing
- Feedback
- Interaction

It should not exist merely because an element can be animated.

---

## Development Philosophy

Synapse is being developed as a **human-led, AI-assisted engineering project**.

AI agents can handle implementation-heavy work, but architectural and product ownership remains human-controlled.

```text
Human
 │
 ├── Product decisions
 ├── UX decisions
 ├── Visual direction
 ├── Architecture
 └── Final approval
          │
          ▼
       AI Agents
          │
          ├── Implementation
          ├── Refactoring
          ├── Tests
          ├── Documentation
          └── Repetitive engineering work
```

Agents should understand the project through repository documentation rather than relying on conversation context.

---

## Development Workflow

```text
Idea
 ↓
Product definition
 ↓
Design
 ↓
Architecture
 ↓
Issue
 ↓
Implementation
 ↓
Validation
 ↓
Review
 ↓
Merge
```

### Design → Development

```text
Figma
 ↓
Design audit
 ↓
Design tokens
 ↓
Component inventory
 ↓
Motion specification
 ↓
Asset preparation
 ↓
Technical mapping
 ↓
Semantic HTML
 ↓
Responsive implementation
 ↓
Progressive enhancement
 ↓
Accessibility / performance review
```

### Git Workflow

```text
Milestone
   ↓
Parent Issue
   ↓
Sub-issue
   ↓
Branch
   ↓
Commits
   ↓
Pull Request
   ↓
Review
   ↓
Merge
```

Issues are grouped by:

```text
type:feature
type:bug
type:refactor
type:research
type:documentation
type:chore
```

and:

```text
area:frontend
area:backend
area:database
area:realtime
area:ai
area:design-system
area:infra
```

---

## Project Roadmap

### M0 — Foundation

Establish the technical foundation.

- Monorepo
- Next.js
- Express
- Configuration
- Developer tooling
- Logging
- Error handling
- MongoDB
- shadcn/design system
- Application shell
- API client
- Authentication

### M1 — MVP

Build the core learning workflow.

```text
Authentication
       ↓
Onboarding
       ↓
Library
       ↓
Resources
       ↓
Courses
       ↓
Study Packs
       ↓
My Study
       ↓
Progress
       ↓
Discussions
```

### M2 — Beta

Harden and expand the product.

Potential areas:

- Study reminders
- Email notifications
- Improved study planning
- Mind maps
- Better AI workflows
- Credits/subscription foundation
- Improved search
- Analytics
- Accessibility refinement
- Performance optimization

### M3 — 1.0

Prepare the product for a stable production release.

Focus areas include:

- Reliability
- Security
- Performance
- UX refinement
- Observability
- Production infrastructure
- Documentation
- Testing
- Final design-system consistency

---

## Future Direction

The initial product intentionally leaves room for expansion without making the MVP unnecessarily complicated.

### Personalized Learning

```text
Course
 ↓
Study history
 ↓
Performance
 ↓
Weak areas
 ↓
Personalized recommendations
```

### Advanced AI Study Tools

- AI tutors
- Adaptive quizzes
- Concept explanations
- Mind maps
- Exam preparation
- Personalized revision schedules

### Collaboration

- Course collaboration
- Study groups
- Shared study plans
- Collaborative notes
- Real-time study rooms

### Gamification

- XP
- Streaks
- Badges
- Leaderboards
- Contribution reputation

### Pro

A future paid tier can build naturally around:

- Higher AI credit limits
- Advanced study generation
- Larger study packs
- Advanced AI tools
- Personalized learning features
- Additional productivity features

The architecture should support these capabilities without requiring them to exist in the MVP.

---

## Current Status

**Development phase — Foundation**

The product, visual language, information architecture, and initial technical architecture have been established.

The immediate focus is:

```text
Documentation
      ↓
Repository foundation
      ↓
M0 implementation
      ↓
MVP
```

---

## Project Documentation

```text
docs/
│
├── product/
│   └── PRD.md
│
├── design/
│   └── DESIGN.md
│
├── engineering/
│   └── ARCHITECTURE.md
│
├── api/
│   └── API.md
│
└── implementation/
    └── IMPLEMENTATION.md
```

These documents act as the project's **shared source of context** for both human developers and AI development agents.

---

## License

This project is currently developed as a personal/educational product project.

License information will be added when the project is prepared for public distribution.
