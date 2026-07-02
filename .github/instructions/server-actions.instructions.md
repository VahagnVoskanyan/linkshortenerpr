---
description: Read this before implementing or modifying server actions in the project.
applyTo: "**/actions.ts"
---

# Server Actions

## File Naming & Colocation

- Server action files **must** be named `actions.ts`
- Place `actions.ts` in the same directory as the client component that calls it

```
components/
  links/
    CreateLinkForm.tsx   ← client component
    actions.ts           ← server actions for this component
```

## Calling Server Actions

Server actions must only be called from **client components** (`'use client'`).

## TypeScript Types

All data passed to server actions must have explicit TypeScript types. **Never use `FormData`** as a parameter type.

```typescript
// ✅ GOOD
type CreateLinkInput = {
  url: string;
  slug: string;
};

export async function createLink(input: CreateLinkInput): Promise<ActionResult> {}

// ❌ BAD
export async function createLink(formData: FormData) {}
```

## Input Validation with Zod

All inputs **must** be validated using Zod inside the server action.

```typescript
import { z } from 'zod';

const createLinkSchema = z.object({
  url: z.string().url(),
  slug: z.string().min(1).max(50),
});

export async function createLink(input: CreateLinkInput) {
  const parsed = createLinkSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten() };
  }
  // ...
}
```

## Authentication Check

Every server action **must** verify a logged-in user before any database operation.

```typescript
import { auth } from '@clerk/nextjs/server';

export async function createLink(input: CreateLinkInput) {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: 'Unauthorized' };
  }
  // proceed with DB operations
}
```

## Database Operations

- **Never** call Drizzle directly inside a server action
- Use helper functions from the `/data` directory

```typescript
// ✅ GOOD — delegate to /data helper
import { insertLink } from '@/data/links';

export async function createLink(input: CreateLinkInput) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: 'Unauthorized' };

  const validated = createLinkSchema.parse(input);
  return await insertLink({ ...validated, userId });
}

// ❌ BAD — direct Drizzle usage in server action
import { db } from '@/db';
import { links } from '@/db/schema';

export async function createLink(input: CreateLinkInput) {
  await db.insert(links).values(...);
}
```

## Return Format

Follow the project's consistent response format:

```typescript
// Success
return { success: true, data: result };

// Failure
return { success: false, error: 'Something went wrong' };
```
