# Technical Requirements Document

## 1. Stack

### Web

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- TanStack Query
- Zustand where required
- React Hook Form
- Zod

### API

- Node.js
- Express
- TypeScript
- Mongoose
- Winston
- Zod

### Data / infrastructure

- MongoDB
- Cloudinary
- Inngest
- Socket.IO
- Gemini/OpenAI for AI workloads

## 2. Architectural style

Modular monolith.

The system is separated by domain modules, not deployed as independent services.

```text
Web
 ↓
REST API
 ↓
Domain modules
 ↓
MongoDB
```

Async work:

```text
API
 ↓
Inngest event
 ↓
durable workflow
 ↓
AI / processing
 ↓
MongoDB
 ↓
optional Socket.IO notification
```

## 3. Rendering

Server Components by default.

Use Client Components when a component requires:

- browser APIs
- local interactive state
- event handlers
- TanStack Query client behavior
- Framer Motion
- interactive forms

Do not make an entire route client-rendered merely because one child is interactive.

## 4. State

### Server state

TanStack Query.

Examples:

- courses
- resources
- discussions
- study packs
- progress
- notifications

### Local UI state

React state.

Examples:

- modal open
- selected tab
- temporary form state

### Global client state

Zustand only when state genuinely crosses feature/route boundaries.

Do not mirror server data into Zustand.

## 5. Validation

Validate at system boundaries:

- HTTP request body
- query parameters
- route parameters where appropriate
- uploaded file metadata
- AI structured output

## 6. Security

Minimum requirements:

- password hashes, never plaintext passwords
- secure authentication cookies/tokens
- authorization checks in services
- ownership checks
- file type/size validation
- rate limits on sensitive operations
- safe error responses
- no secrets in client bundles
- validate AI output before persistence

## 7. Performance

- server-render static/read-heavy page structure
- paginate lists
- lazy-load expensive UI
- optimize images
- avoid loading unused font weights
- use poster images for video
- keep client component boundaries narrow
- avoid unnecessary global state

## 8. Testing

Target layers:

```text
validation/unit
service/domain tests
API integration tests
critical UI tests
E2E tests for high-value flows
```

Do not require every component to have a snapshot test.

## 9. Observability

Winston logging on the API.

Log:

- request correlation information
- important domain events
- job failures
- authentication/security events
- external service failures

Never log passwords, tokens, or sensitive user data.
