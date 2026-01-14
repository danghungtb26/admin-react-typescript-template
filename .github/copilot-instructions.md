# Copilot Instructions - Admin React TypeScript Template

## Overview

React + TypeScript admin template with:

- **TanStack Router v7+** - File-based routing with type safety
- **TanStack Query** - Server state management and data fetching
- **Tailwind CSS v4** - Utility-first styling
- **TypeScript Decorators** - Model serialization pattern
- **shadcn/ui** - Radix UI component system

## Detailed Instructions

For comprehensive guidance on specific areas:

- **[General Conventions](./instructions/general.instructions.md)** - Project structure, development workflow, dependencies, styling
- **[API Patterns](./instructions/apis.instructions.md)** - API layer organization, model decorators, React Query hooks
- **[Routing](./instructions/routing.instructions.md)** - File-based routing, navigation, protected routes, layouts

## Quick Reference

### Essential Commands

```bash
pnpm dev          # Dev server on :3000
pnpm build        # TypeScript check + Vite build
pnpm lint         # ESLint with auto-fix
pnpm type         # Type check only
```

### Core Patterns

**Models use decorators:**

```typescript
import { field } from '@/decorators/field'
import { model } from '@/decorators/model'

@model()
export class User extends Base {
  @field('user_name')
  name?: string
}
```

**API organized by domain:**

```
src/apis/<domain>/
├── cores/      # Core API functions
├── hooks/      # React Query hooks
└── mock-data.ts
```

**Routes are file-based:**

```
src/routes/
├── __root.tsx
├── _authenticated.tsx
└── _authenticated/
    ├── home.tsx        # /home
    └── users/
        └── index.tsx   # /users
```

**Navigation uses route keys:**

```typescript
import { router_keys } from '@/routers/key'
navigate({ to: router_keys.users }) // ✅
// Never: navigate({ to: '/users' })  // ❌
```

### Path Aliases

All imports use `@/` prefix:

```typescript
import { Button } from '@/components/atoms/button'
import { User } from '@/models/user'
import { useUsers } from '@/apis/user/hooks/use-users'
```

### Critical Rules

⚠️ **Never edit:** `src/routeTree.gen.ts` (auto-generated)  
✅ **Always extend:** `Base` model when creating models  
✅ **Use:** `router_keys` for navigation, never hardcoded paths  
✅ **Export:** React Query hooks from `apis/*/hooks/`, not core functions  
❌ **Avoid:** Apollo Client (legacy dependency, not in use)
