---
description: Read this before implementing or modifying authentication in the project.
---

# Authentication Guide

All authentication in this project is handled exclusively by **Clerk**. No other authentication methods should be implemented.

## 🔑 Clerk Configuration

Clerk is configured via environment variables:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Public key for Clerk
- `CLERK_SECRET_KEY` - Secret key for server-side operations

These are used in the app layout and API routes. Refer to [Clerk documentation](https://clerk.com/docs) for detailed setup.

## 🛡️ Protected Routes

### /dashboard Route

The `/dashboard` page is a **protected route** that requires user authentication. Use Clerk's middleware to enforce this protection:

```typescript
// ✅ GOOD - Protect dashboard route
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function DashboardLayout() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/');
  }

  return <>{/* dashboard content */}</>;
}
```

### Homepage Redirect Logic

If a user is already logged in and visits the homepage (`/`), they should be redirected to `/dashboard`:

```typescript
// ✅ GOOD - Redirect logged-in users
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect('/dashboard');
  }

  return <>{/* homepage content for guests */}</>;
}
```

## 🔐 Sign In & Sign Up

### Modal Implementation

Sign in and sign up flows **must always launch as modals**, not full-page redirects. Use Clerk's modal components:

```typescript
// ✅ GOOD - Modal for sign in
'use client';

import { SignIn } from '@clerk/nextjs';

export function SignInModal() {
  return (
    <SignIn
      appearance={{ elements: { rootBox: 'w-full' } }}
      fallbackRedirectUrl="/dashboard"
    />
  );
}
```

```typescript
// ✅ GOOD - Modal for sign up
'use client';

import { SignUp } from '@clerk/nextjs';

export function SignUpModal() {
  return (
    <SignUp
      appearance={{ elements: { rootBox: 'w-full' } }}
      fallbackRedirectUrl="/dashboard"
    />
  );
}
```

### Using the `<SignInButton>` and `<SignUpButton>` Components

Clerk provides convenient button components that open modals:

```typescript
// ✅ GOOD - Using Clerk's built-in buttons
import { SignInButton, SignUpButton } from '@clerk/nextjs';

export function AuthButtons() {
  return (
    <>
      <SignInButton mode="modal">
        <button>Sign In</button>
      </SignInButton>
      <SignUpButton mode="modal">
        <button>Sign Up</button>
      </SignUpButton>
    </>
  );
}
```

### Accessing Current User Information

Use Clerk's hooks and server functions to get user data:

```typescript
// ✅ GOOD - Server-side (server component)
import { auth, currentUser } from '@clerk/nextjs/server';

export async function UserCard() {
  const user = await currentUser();

  return <div>Welcome, {user?.firstName}!</div>;
}
```

```typescript
// ✅ GOOD - Client-side (use client component)
'use client';

import { useUser } from '@clerk/nextjs';

export function UserProfile() {
  const { user } = useUser();

  return <div>Email: {user?.emailAddresses[0].emailAddress}</div>;
}
```

## 🚫 Anti-Patterns

### ❌ DO NOT

- Use any authentication system other than Clerk
- Implement custom JWT tokens or session management
- Store passwords in the database
- Use full-page sign in/sign up redirects (use modals instead)
- Skip protecting sensitive routes like `/dashboard`
- Rely on client-side authentication checks only

## ✅ DO

- Always use `auth()` or `currentUser()` from `@clerk/nextjs/server` for protected routes
- Use Clerk components with `mode="modal"` for sign in/sign up
- Redirect unauthenticated users away from protected pages
- Redirect authenticated users to `/dashboard` when they visit `/`
- Store Clerk IDs in the database if user-specific data is needed
- Test authentication flows before deployment

## 📚 Resources

- [Clerk Next.js Documentation](https://clerk.com/docs/quickstarts/nextjs)
- [Clerk React Hooks](https://clerk.com/docs/references/react/use-user)
- [Clerk Server-Side Helpers](https://clerk.com/docs/references/backend/authentication/auth)
- [Clerk Modal Components](https://clerk.com/docs/components/authentication/sign-in)
