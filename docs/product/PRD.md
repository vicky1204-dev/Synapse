# Product Requirements Document — Synapse

## 1. Product

Synapse is a student learning workspace that turns scattered academic resources into an organized course-based study system.

## 2. Core problem

Students commonly have:

- notes in multiple places
- course material without a coherent study path
- difficulty turning notes into revision material
- weak visibility into study progress
- fragmented academic discussions

Synapse combines resources, courses, AI-generated study material, progress, and contextual discussion.

## 3. Core product loop

```text
Find / upload resource
        ↓
Associate with course
        ↓
Process and understand resource
        ↓
Generate / use study pack
        ↓
Study through activities
        ↓
Track progress
        ↓
Discuss concepts with peers
        ↓
Return to weak areas
```

## 4. Core areas

### Home

Shows:

- greeting
- continue studying
- current course coverage
- today's study plan
- upcoming academic event/reminder
- weekly study trend
- recent resources/courses

### Library

Users can:

- search resources
- filter by type/topic/department/year
- browse resources
- open resources
- save resources
- contribute/upload resources

### Courses

A course is the organizing context for:

```text
Course
├── Resources
├── Study Packs
├── Study Progress
└── Discussions
```

Examples shown in the design include Operating Systems, DBMS, and Networks.

### Study

A course exposes:

- overview
- resource relationship
- study pack
- concept path
- concept review
- flashcards
- quizzes
- study progress

### Discussions

Discussions are contextual, Reddit-like threads.

A discussion can be associated with:

- a course
- a resource
- optionally a study pack/concept

Users can:

- create discussions
- reply
- reply to comments
- edit/delete their own content
- save discussions where supported

V1 does not require generic DMs or realtime chat rooms.

### Contributions

Tracks resources and community contributions.

### Saved

Provides user-specific saved resources/content.

## 5. AI-assisted capabilities

AI may be used for:

- resource text extraction
- topic identification
- summaries
- tags
- concept extraction
- study-pack generation
- flashcards
- quiz generation

AI output is not automatically trusted. Structured output must be validated before persistence.

## 6. Non-goals for initial version

Do not build unless explicitly promoted into scope:

- generic one-to-one chat
- group chat rooms
- typing indicators
- online presence
- voice/video chat
- microservices
- RabbitMQ
- Redis
- complex recommendation engine
- collaborative realtime editing

## 7. Product principles

- Course is the primary academic context.
- Resources are the source material.
- Study packs transform resources into study material.
- Study progress belongs to a user in the context of a course.
- Discussions are contextual, not a generic messaging product.
- AI assists the student; it does not become the source of truth for user progress.
