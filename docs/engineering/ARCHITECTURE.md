# System Architecture

## 1. High-level

```text
┌─────────────────────────────┐
│          Next.js            │
│        TypeScript           │
│     Server Components       │
│     Client Components       │
└──────────────┬──────────────┘
               │
        TanStack Query
               │
               ▼
┌─────────────────────────────┐
│       Express API           │
│        TypeScript            │
│ modules / services / data    │
└───────┬─────────┬───────────┘
        │         │
        ▼         ▼
    MongoDB     Cloudinary
   Mongoose      media
        │
        │
        ▼
   persistent state

        Express
           │
           ▼
       Inngest
           │
     durable jobs
           │
     ┌─────┴────────┐
     ▼              ▼
 extraction      AI providers
 / processing    Gemini/OpenAI

Optional future boundary:
        Socket.IO
           │
           ▼
 client notifications / live UX
```

## 2. Core architectural rule

MongoDB is authoritative.

Inngest performs durable background work.

The browser never treats an event, socket message or optimistic UI state as the source of truth.

## 3. Why no RabbitMQ in V1

Inngest already provides the durable event/workflow abstraction needed for:

- resource processing
- AI generation
- retries
- background workflows
- scheduled work later

Adding RabbitMQ would introduce another operational system without solving a V1 requirement.

If the product later develops high-volume independent consumers requiring broker-level routing semantics, reassess the decision through an ADR.

## 4. Monorepo

```text
apps/
├── web
└── api

packages/
└── contracts

docs/
```

Only add additional packages when there is a real shared responsibility.

## 5. Frontend architecture

Next.js App Router.

Server Components by default.

Client Components for:

- interactive forms
- dialogs
- tabs where state is client-owned
- charts
- drag/drop
- Framer Motion
- browser APIs

TanStack Query handles server state.

Zustand should be reserved for genuine client-only global state, not server data.

## 6. Backend architecture

Express modules use:

```text
route
  ↓
controller
  ↓
service
  ↓
repository/data access where useful
  ↓
Mongoose model
```

Do not create repositories for every collection merely because a pattern exists. Introduce one when it actually isolates complex data access.

Each module owns:

- model
- validation
- types
- service
- controller
- routes
- tests

## 7. Cross-cutting backend

```text
src/
├── config/
├── middleware/
├── lib/
├── utils/
├── inngest/
├── modules/
├── app.ts
└── server.ts
```

Cross-cutting infrastructure must not contain domain rules.

## 8. Logging

Use structured logging through Winston.

Log:

- request IDs
- operation names
- durations
- errors
- job identifiers
- relevant user/entity IDs where safe

Never log:

- passwords
- access tokens
- refresh tokens
- raw sensitive credentials
- full uploaded documents

## 9. Error model

All API errors use a stable machine-readable code and human-readable message.

Clients should branch on `error.code`, not string matching.

## 10. Authentication

Authentication details are documented in the auth module implementation plan.

The important architectural property is that:

- the API owns session/auth state;
- the web app consumes authenticated API state;
- onboarding status is part of user/session data;
- protected routes are enforced server-side, not only by client redirects.
