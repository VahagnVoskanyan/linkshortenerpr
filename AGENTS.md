# Link Shortener - Agent Instructions

> **Last Updated**: 2026-05-12
>
> This is a comprehensive guide for LLMs working on this project. Read the entire overview below, then consult specific guides as needed.

## ⚠️ CRITICAL: READ DOCS FIRST

**BEFORE GENERATING ANY CODE**, you MUST read the relevant individual instructions file from the `/docs` directory. This is non-negotiable. Each guide in `/docs` contains essential patterns, best practices, and anti-patterns specific to that feature area.

For detailed guidelines on specific topics, refer to the modular documentation in the `/docs` directory. ALWAYS refer to the relevant `.md` file BEFORE generating any code:

## 📋 Quick Reference

| Guide | Purpose | When to Use |
|-------|---------|-------------|
| [Authentication](/docs/authentication.md) | Clerk auth setup, protected routes, sign in/up modals | Implementing login flows, protecting routes, user sessions |
| [shadcn/ui Components](/docs/shadcn-ui.md) | Using shadcn/ui for all UI elements, installation, best practices | Building any UI, creating buttons/inputs/modals, styling components |



## 🎯 Project Overview

**Project**: Link Shortener  
**Purpose**: Convert long URLs into short, shareable links

### Tech Stack
- **Framework**: Next.js 16.2.6 (App Router)
- **Language**: TypeScript 5 (strict mode)
- **UI Framework**: React 19.2.4
- **Styling**: Tailwind CSS 4
- **Database**: Drizzle ORM + Neon PostgreSQL
- **Authentication**: Clerk
- **Linting**: ESLint 9

### Key Directory Structure
```
.
├── app/              # Next.js App Router (pages & layouts)
├── components/       # React components
├── db/              # Database schema & config
├── lib/             # Utilities & business logic
├── public/          # Static assets
├── docs/            # This agent instructions guide
└── (config files)
```

## ⚠️ Critical Rules

### 1. No `any` Types in TypeScript
All code must have explicit types. This is a strict TypeScript project (`"strict": true`).

```typescript
// ✅ GOOD
function getLink(id: string): Promise<Link | null> { }

// ❌ BAD
function getLink(id: any): Promise<any> { }
```

### 2. Always Check Next.js 16 Docs First
This project has breaking changes from Next.js 13-15. **Read the official docs** in `node_modules/next/dist/docs/` before implementing features.

```
❌ DON'T assume Next.js works like v13
✅ DO consult the v16 docs for new patterns
```

### 3. Server Components by Default
Next.js 16 uses Server Components by default. Only add `'use client'` when needed:
- Event handlers (form submission, clicks)
- React hooks (useState, useEffect, etc.)
- Browser APIs

### 4. Use Path Aliases
Always use `@/*` aliases for imports, never relative paths:

```typescript
// ✅ GOOD
import Button from '@/components/ui/button';
import { validateUrl } from '@/lib/utils';

// ❌ BAD
import Button from '../../../components/ui/button';
import { validateUrl } from '../../../../lib/utils';
```

### 5. Database Logic in Utilities
Database operations belong in `lib/` not in components or API routes directly.

```typescript
// ✅ GOOD - lib/links.ts
export async function createLink(url: string): Promise<Result<Link>> { }

// API route
export async function POST(req: NextRequest) {
  const result = await createLink(url);
}

// ❌ BAD - direct DB in route
export async function POST(req: NextRequest) {
  const result = await db.insert(links).values(...);
}
```

### 6. Consistent Response Format
API responses should follow a consistent structure:

```typescript
// ✅ GOOD
return NextResponse.json({
  success: true,
  data: link,
  message: 'Link created',
});

return NextResponse.json(
  { success: false, error: { code: 'ERROR_CODE', message: 'msg' } },
  { status: 400 },
);
```

## 📖 Development Workflow


### When Starting a New Feature



### When Working with APIs



### When Styling Components



### When Modifying Database

1. Update schema in [db/schema.ts](db/schema.ts)
2. Generate migration: `npm run db:generate`
3. Apply migration: `npm run db:migrate`
4. Add types to `lib/` utilities
5. Test in development

## 🔧 Common Tasks

### Create a New Component

1. File: `components/MyComponent.tsx` (PascalCase)
2. Export as named export
3. Define props interface
4. Use TypeScript with explicit types
5. Style with Tailwind classes

```typescript
interface MyComponentProps {
  title: string;
  onSubmit: (value: string) => void;
}

export function MyComponent({ title, onSubmit }: MyComponentProps) {
  return <div className="p-6 bg-white rounded shadow">{title}</div>;
}
```

### Create an API Endpoint

1. File: `app/api/resource/route.ts` for listing/creation
2. File: `app/api/resource/[id]/route.ts` for single resource
3. Use proper HTTP methods (GET, POST, PUT, DELETE)
4. Validate input
5. Return consistent response
6. Handle authentication with Clerk

### Create a Utility Function

1. File: `lib/utils.ts` or `lib/feature.ts` (camelCase)
2. Export as named export
3. Full TypeScript types
4. Document complex logic with comments

### Add Database Table

1. Update `db/schema.ts`
2. Use snake_case for columns
3. Add relations if needed
4. Generate migration
5. Create operations in `lib/`

## 🚫 Anti-Patterns

### ❌ DO NOT

- Use `any` types
- Put database logic in components
- Import from relative paths when aliases available
- Create components without TypeScript props
- Use class components
- Skip error handling
- Mix camelCase and snake_case inconsistently
- Add styles with inline styles (use Tailwind)
- Skip validation on API input
- Use `eval()` or `new Function()`
- Block rendering without suspense boundaries

## ✅ DO

- Provide explicit return types
- Keep components small and focused
- Test critical paths
- Document complex logic
- Handle errors gracefully
- Use TypeScript strictly
- Follow naming conventions consistently
- Support dark mode
- Validate all inputs
- Use composition over inheritance
- Implement proper loading states

## 📚 Detailed Guides

**MANDATORY**: Each guide is organized by topic and includes core principles, examples (✅ good, ❌ bad), best practices, common patterns, and anti-patterns. **You MUST consult the relevant guide before writing any code for that feature.** Do NOT skip this step.

- [Authentication](/docs/authentication.md) - **READ FIRST before implementing any auth features**
- [shadcn/ui Components](/docs/shadcn-ui.md) - **READ FIRST before building any UI**

Always start with the relevant guide for your task instead of asking general questions or making assumptions.

## 🐛 Debugging Tips


## 🤝 Contributing

When updating these guidelines:
1. Update the relevant `.md` file in `/docs`
2. Update the table in this file if adding new guides
3. Keep examples concise and focused
4. Always show ✅ good and ❌ bad patterns

---

**Remember**: When in doubt, refer to the appropriate guide. These guidelines exist to maintain code quality and consistency across the project.
