# Application Flow

## 1. Entry

```text
Landing
  ↓
Register / Login
  ↓
Does user.onboardingStatus === completed?
  ├── No → Onboarding
  └── Yes → App
```

The server/API should expose onboarding completion as part of the authenticated user/session response so the client does not have to infer it from missing profile data.

## 2. Onboarding

Recommended flow:

### Step 1 — Academic profile

- What are you studying?
- What year are you in?

### Step 2 — Institution

- What is your institution?
- Make this optional unless the product later needs institution-specific features.

### Step 3 — Intent

- What do you want to use Synapse for?
- Multi-select:
  - Understand concepts
  - Prepare for exams
  - Organize notes/resources
  - Practice with questions
  - Learn with other students

### Step 4 — Subjects

- Select up to/typically 3 subjects.
- Allow "Add another" for users whose subjects are not in the initial catalog.

### Completion

On completion:

1. update the user profile;
2. mark onboarding complete;
3. create personal Course containers for selected subjects if they do not already exist;
4. optionally seed a small set of relevant public resources;
5. redirect to Home.

This is the main mechanism for avoiding a first-login empty state.

## 3. Empty-state strategy

Do not fabricate content.

Instead:

- selected subjects create course containers;
- Home shows the selected courses;
- Library shows relevant resources when available;
- otherwise provide explicit actions such as Upload resource, Browse Library and Create course.

The dashboard should distinguish:

- empty because the user has no activity;
- empty because no matching resources exist;
- empty because processing is still running.

## 4. Course flow

```text
Courses
  ↓
Course
  ├── Overview
  ├── Resources
  ├── Study
  └── Discussions
```

Course relationships are references, not embedded resource arrays.

## 5. Resource processing

```text
Upload PDF
  ↓
Resource created: processing
  ↓
Inngest event
  ↓
Extract text
  ↓
Identify topics
  ↓
Generate summary
  ↓
Suggest tags
  ↓
Resource: ready
```

The UI initially polls processing status while the resource is processing. Realtime notification is optional and not required for correctness.

## 6. Study Pack flow

```text
Select resources
  ↓
Request Study Pack
  ↓
Create StudyPack: processing
  ↓
Consume credits if applicable
  ↓
Inngest workflow
  ↓
Generate structured activities
  ↓
Persist StudyPack + StudyActivities
  ↓
StudyPack: ready
  ↓
Study
```

## 7. Discussion flow

```text
Discussion list
  ↓
Discussion detail
  ↓
Comment
  ↓
Nested reply
```

Discussion is request/response based. No chat room, typing, presence or message delivery layer is required.
