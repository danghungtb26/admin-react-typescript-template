---
applyTo: **
---

# General Project Instructions

**See [`.projects/shared/rules/general.md`](../../.projects/shared/rules/general.md) for complete guidelines.**

## Quick Reference

### Development Commands

```bash
pnpm dev      # Dev server on :3000
pnpm build    # TypeScript + Vite build
pnpm lint     # ESLint with auto-fix
pnpm type     # Type check only
```

### Path Aliases

All imports use `@/` prefix:

```typescript
import { Button } from '@/components/atoms/button'
import { User } from '@/models/user'
import { useUsers } from '@/apis/user/hooks/use-users'
```

### Component Structure

- `components/atoms/` - shadcn/ui primitives
- `components/molecules/` - Composed components
- `containers/` - Feature-specific smart components

### Key Technologies

- React 19 + TypeScript 5.9
- TanStack Router v7+ (file-based)
- TanStack Query (data fetching)
- Tailwind CSS v4
- shadcn/ui components

Refer to the shared rules for detailed conventions, styling guidelines, and best practices.
