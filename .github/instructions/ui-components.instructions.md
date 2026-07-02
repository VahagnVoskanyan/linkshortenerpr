---
description: Read this before implementing or modifying UI components in the project.
---

# shadcn UI Components Guide

All UI elements in this application use **shadcn/ui** components. Do NOT create custom components when shadcn/ui provides an equivalent.

## Core Principles

1. **Use shadcn/ui only** — Never build custom button, input, or layout components
2. **Leverage existing components** — Browse the installed shadcn/ui library before implementing anything new
3. **Compose, don't create** — Combine shadcn/ui components to build complex UIs
4. **Consistent styling** — All components automatically inherit Tailwind CSS theming

## Installation & Usage

### Adding a New shadcn/ui Component

```bash
npx shadcn-ui@latest add <component-name>
```

This adds the component to `components/ui/`.

### Importing Components

Always use path aliases:

```typescript
// ✅ GOOD
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// ❌ BAD
import Button from '../../../components/ui/button';
```

## Common Components

| Component | Use Case |
|-----------|----------|
| `Button` | Actions, form submissions, navigation |
| `Input` | Text input, URLs, search fields |
| `Select` | Dropdowns, option selection |
| `Dialog` | Modals, confirmations, forms |
| `Card` | Content containers, layouts |
| `Label` | Form labels, descriptions |
| `Badge` | Status, tags, categories |
| `Alert` | Notifications, warnings, errors |
| `Skeleton` | Loading placeholders |

## Best Practices

### ✅ DO

```typescript
// Compose shadcn components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export function LinkForm() {
  return (
    <Card className="p-6">
      <Input placeholder="Enter URL" />
      <Button className="mt-4">Shorten Link</Button>
    </Card>
  );
}
```

### ❌ DON'T

```typescript
// Creating custom components when shadcn exists
function CustomButton({ label }: { label: string }) {
  return <button className="px-4 py-2 bg-blue-600">{label}</button>;
}

// Duplicating button logic
function MyButton() {
  return <button onClick={...}>Click me</button>;
}
```

## Tailwind Customization

Shadcn/ui respects Tailwind configuration. Customize theme in:
- `tailwind.config.ts` — Colors, spacing, typography
- `globals.css` — Global styles and CSS variables

## When to Create a Component

Only create a wrapper component if:
- Combining multiple shadcn components with shared logic
- Handling application-specific behavior (not UI reuse)

```typescript
// ✅ OK - Application-specific wrapper
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

export function SignInModal() {
  return (
    <Dialog>
      <DialogTrigger>Sign In</DialogTrigger>
      <DialogContent>
        {/* Clerk sign-in form */}
      </DialogContent>
    </Dialog>
  );
}
```

---

**Reference**: [shadcn/ui Docs](https://ui.shadcn.com)
