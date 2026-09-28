# Mongoose Model Conventions

These conventions apply to every model in `apps/api/src/modules/`.

## File location

Each module owns its own model file:

```
src/modules/<name>/
├── <name>.model.ts     ← Mongoose model + schema
├── <name>.types.ts     ← TypeScript interfaces
├── <name>.service.ts
├── <name>.controller.ts
└── <name>.routes.ts
```

## Schema definition

Define the TypeScript interface first, then derive the schema from it.

```ts
// user.types.ts
export interface IUser {
  email: string;
  passwordHash: string;
  name: string;
  onboardingStatus: "pending" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

// user.model.ts
import { Schema, model } from "mongoose";
import type { IUser } from "./user.types";

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    onboardingStatus: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export const User = model<IUser>("User", userSchema);
```

## Rules

### Timestamps
Always use `{ timestamps: true }` — never manage `createdAt`/`updatedAt` manually.

### Enums
Define enum values as `const` arrays and derive the TypeScript union:

```ts
export const ONBOARDING_STATUS = ["pending", "completed"] as const;
export type OnboardingStatus = (typeof ONBOARDING_STATUS)[number];
```

Reference them in the schema:

```ts
onboardingStatus: { type: String, enum: ONBOARDING_STATUS, default: "pending" }
```

### References
Use `Schema.Types.ObjectId` with `ref`:

```ts
ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true }
```

### Indexes
Declare compound indexes on the schema, not as field options:

```ts
userSchema.index({ ownerId: 1, status: 1 });
```

Single-field unique constraints may use the field option for readability.

### Sensitive fields
Never serialize sensitive fields (e.g. `passwordHash`) to API responses.
Use `.select("-passwordHash")` in queries or a dedicated response mapper.

### Virtuals
Avoid virtuals for computed fields that belong in the service layer.

### Model naming
Use singular PascalCase for the model name (`"User"`, `"Course"`, `"StudyPack"`).
Mongoose will pluralize the collection name automatically (`users`, `courses`, `study_packs`).
