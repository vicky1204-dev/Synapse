# API Specification

Base path:

```text
/api/v1
```

## Response contract

### Success

```json
{
  "success": true,
  "data": {}
}
```

### Paginated

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "hasNextPage": true
  }
}
```

### Error

```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Resource not found"
  }
}
```

## Authentication

```text
POST /auth/register
POST /auth/login
POST /auth/logout
POST /auth/refresh
GET  /auth/me
PATCH /users/me
PATCH /users/me/onboarding
```

`/auth/me` should include onboarding status and enough profile data for route decisions.

## Subjects

```text
GET /subjects
```

Subjects are catalog data used by onboarding and course creation.

## Courses

```text
GET    /courses
POST   /courses
GET    /courses/:courseId
PATCH  /courses/:courseId
DELETE /courses/:courseId

GET /courses/:courseId/resources
GET /courses/:courseId/study-packs
GET /courses/:courseId/study
GET /courses/:courseId/progress
GET /courses/:courseId/discussions
```

Prefer course-scoped GET endpoints for UI pages because they make ownership and context explicit.

## Resources

```text
GET    /resources
POST   /resources
GET    /resources/:resourceId
PATCH  /resources/:resourceId
DELETE /resources/:resourceId

POST   /resources/upload
GET    /resources/:resourceId/processing

POST   /resources/:resourceId/save
DELETE /resources/:resourceId/save
```

Upload creates a resource and starts asynchronous processing.

## Study Packs

```text
POST /courses/:courseId/study-packs
GET  /courses/:courseId/study-packs
GET  /study-packs/:studyPackId
POST /study-packs/:studyPackId/regenerate
```

## Study

```text
GET  /courses/:courseId/study
GET  /courses/:courseId/progress

POST /study/activities/:activityId/start
POST /study/activities/:activityId/complete

POST /study/flashcards/:flashcardId/review

POST /study/quizzes/:quizId/attempts
GET  /study/quizzes/:quizId/attempts/:attemptId
```

## Discussions

```text
GET    /discussions
POST   /discussions

GET    /discussions/:discussionId
PATCH  /discussions/:discussionId
DELETE /discussions/:discussionId

GET    /discussions/:discussionId/comments
POST   /discussions/:discussionId/comments

PATCH  /comments/:commentId
DELETE /comments/:commentId
```

## Saved

```text
GET /saved/resources
```

## Credits

```text
GET /credits
GET /credits/transactions
```

## API conventions

### Pagination

Use:

- `page`
- `limit`
- explicit maximum limit

### Filtering

Use query parameters:

```text
/resources?type=pdf&topic=os&page=1&limit=20
```

### Sorting

Use a controlled allow-list:

```text
sort=popular
sort=recent
```

Do not pass arbitrary MongoDB sort fields from the client.

### Validation

Validate:

- path params
- query params
- body
- uploaded file metadata
- authenticated ownership

## Query keys

Client query keys should mirror resource identity:

```text
["courses"]
["courses", courseId]
["courses", courseId, "resources"]
["courses", courseId, "study"]
["courses", courseId, "progress"]

["resources", filters]
["resources", resourceId]
["resources", resourceId, "processing"]

["discussions", filters]
["discussions", discussionId]
["discussions", discussionId, "comments"]
```

Variables that affect a query must be part of its key.
