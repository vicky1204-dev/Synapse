# Database Schema

MongoDB/Mongoose is the persistent source of truth.

## 1. Relationship philosophy

Do not embed large collections inside Course.

A Course is a container identified by `courseId`.

Relationships are expressed through references:

```text
Course
  ├── Resource.courseId
  ├── StudyPack.courseId
  ├── Discussion.courseId
  └── StudyProgress.courseId
```

This makes querying, pagination, independent lifecycle and future reuse straightforward.

## 2. User

```ts
User {
  _id
  email
  passwordHash
  name
  avatarUrl?

  onboardingStatus: "pending" | "completed"
  academicProfile: {
    program?: string
    year?: number
    institution?: string
  }

  onboardingGoals: string[]
  subjectIds: ObjectId[]

  preferences: {
    theme?: "light" | "dark" | "system"
  }

  createdAt
  updatedAt
}
```

Indexes:

- unique `email`
- optionally `subjectIds` only if query requirements justify it

## 3. Subject

Canonical subject catalog.

```ts
Subject {
  _id
  name
  slug
  department?
  active
  createdAt
  updatedAt
}
```

Unique index:

- `slug`

Subjects prevent every onboarding user from inventing slightly different strings.

## 4. Course

```ts
Course {
  _id
  title
  description?
  ownerId
  subjectId?

  code?
  department?
  semester?
  year?

  cover: {
    color
    icon?
  }

  source: "onboarding" | "user"
  status: "active" | "archived"

  createdAt
  updatedAt
}
```

Indexes:

- `{ ownerId: 1, status: 1 }`
- `{ ownerId: 1, subjectId: 1 }`

### Relationship

For:

```text
Operating Systems
├── Resources
├── Study Packs
├── Discussions
└── Study Progress
```

MongoDB does not need a nested structure.

Instead:

```text
courses
  { _id: course123, title: "Operating Systems", ownerId: user1 }

resources
  { _id: r1, courseId: course123, ... }

studyPacks
  { _id: sp1, courseId: course123, ... }

discussions
  { _id: d1, courseId: course123, ... }

studyProgress
  { _id: p1, courseId: course123, userId: user1, ... }
```

The API joins these relationships at read time.

## 5. Resource and CourseResource

```ts
Resource {
  _id
  uploaderId

  title
  description?
  type: "pdf" | "video" | "audio" | "link" | "note"

  file: {
    provider?
    publicId?
    url?
    mimeType?
    sizeBytes?
    pageCount?
  }

  processing: {
    status: "pending" | "processing" | "ready" | "failed"
    jobId?
    errorCode?
    completedAt?
  }

  aiMetadata: {
    summary?
    topics: string[]
    tags: string[]
  }

  visibility: "public" | "private"
  createdAt
  updatedAt
}
```

Indexes:

- `{ courseId: 1, createdAt: -1 }`
- `{ visibility: 1, createdAt: -1 }`
- text/search indexes only after real search requirements are known

```ts
CourseResource {
  _id

  courseId
  resourceId

  addedBy

  position?
  createdAt
}
```

## 6. StudyPack

```ts
StudyPack {
  _id
  ownerId
  courseId
  title

  sourceResourceIds: ObjectId[]

  status: "processing" | "ready" | "failed"
  jobId?

  summary?
  concepts: {
    id
    title
    description?
    order
  }[]

  generatedAt?
  createdAt
  updatedAt
}
```

A Study Pack can use one or many resources.

## 7. StudyActivity

```ts
StudyActivity {
  _id
  studyPackId
  courseId
  type: "concept-review" | "flashcard" | "quiz"
  order

  content: Mixed
  metadata: Mixed

  createdAt
  updatedAt
}
```

Keep the top-level activity contract stable while allowing activity-specific content.

## 8. StudyProgress

```ts
StudyProgress {
  _id
  userId
  courseId

  completedActivityCount
  totalActivityCount

  masteredConceptCount
  totalConceptCount

  lastActivityId?
  lastStudiedAt?

  createdAt
  updatedAt
}
```

Unique compound index:

- `{ userId: 1, courseId: 1 }`

This is a read-optimized projection. Individual activity completion records remain the detailed source for activity-level state.

## 9. ActivityProgress

```ts
ActivityProgress {
  _id
  userId
  activityId
  status: "not-started" | "in-progress" | "completed"

  startedAt?
  completedAt?
  updatedAt
}
```

Unique compound index:

- `{ userId: 1, activityId: 1 }`

## 10. FlashcardReview

```ts
FlashcardReview {
  _id
  userId
  activityId
  rating: "again" | "hard" | "good" | "easy"
  reviewedAt
  nextReviewAt?
}
```

## 11. QuizAttempt

```ts
QuizAttempt {
  _id
  userId
  quizActivityId
  answers: Mixed
  score
  total
  submittedAt
}
```

## 12. Discussion

```ts
Discussion {
  _id
  authorId

  courseId?
  resourceId?

  title
  body
  tags: string[]

  status: "published" | "hidden" | "deleted"

  commentCount
  createdAt
  updatedAt
}
```

Indexes:

- `{ courseId: 1, createdAt: -1 }`
- `{ resourceId: 1, createdAt: -1 }`
- `{ createdAt: -1 }`

## 13. Comment

```ts
Comment {
  _id
  discussionId
  authorId
  parentCommentId?

  body
  status: "published" | "hidden" | "deleted"

  createdAt
  updatedAt
}
```

This supports replies without creating a chat/message model.

## 14. SavedResource

```ts
SavedResource {
  _id
  userId
  resourceId
  createdAt
}
```

Unique compound index:

- `{ userId: 1, resourceId: 1 }`

## 15. CreditAccount

```ts
CreditAccount {
  _id
  userId
  balance
  lifetimeGranted
  lifetimeSpent
  createdAt
  updatedAt
}
```

Unique:

- `userId`

## 16. CreditTransaction

```ts
CreditTransaction {
  _id
  userId
  type: "grant" | "consume" | "refund"
  amount
  reason
  referenceType?
  referenceId?
  metadata?
  createdAt
}
```

Use transactions when balance and transaction records must change atomically.

## 17. What is intentionally not a collection

### Contributions

Compute contribution statistics from authored resources, discussions and comments initially.

### Course resources array

Do not duplicate the relationship on Course.

### Chat / Message

Not needed for V1.

### Notification

Add when an actual notification UX exists.

### Enrollment

Not required while Courses are personal containers owned by a user.

## 18. Important invariant

Any document containing `userId`, `ownerId`, or `authorId` must be authorized against the authenticated user before mutation or private reads.
