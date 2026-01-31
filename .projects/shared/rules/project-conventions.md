# Project Conventions Overview

This document provides an overview of all coding standards and conventions for this React TypeScript admin template project.

## Quick Reference

This project follows strict conventions for consistency and maintainability. All rules are documented in detail in separate files:

### 📝 [Naming Conventions](./naming-conventions.md)
Standards for naming files, variables, functions, components, and more.

**Key highlights:**
- Files: `kebab-case`
- Components: `PascalCase`
- Hooks: `camelCase` with `use` prefix
- Functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE`

### 📁 [Folder Structure](./folder-structure.md)
Organization of files and directories throughout the project.

**Key highlights:**
- Atomic Design for components (atoms/molecules/box)
- Feature-based container organization
- Separation of API cores and hooks
- Co-located tests in `__tests__/` directories

### 🚦 [Routing](./routing.md)
RESTful routing patterns with TanStack Router.

**Key highlights:**
- RESTful patterns: `/resource`, `/resource/create`, `/resource/:id`, `/resource/:id/edit`
- Required meta with `title` and `titleKey`
- File-based routing structure

### 🔌 [APIs](./apis.md)
API naming and organization standards.

**Key highlights:**
- Separation: `cores/` (pure functions) and `hooks/` (React Query)
- Naming: `getUsers`, `createUser`, `useUsers`, `useCreateUser`
- Consistent patterns for CRUD operations

### 📚 [General Guidelines](./general.md)
Overall project guidelines, tools, and best practices.

**Key highlights:**
- React 19 + TypeScript 5.9+ + Vite 7
- TanStack Router for routing
- shadcn/ui components
- Always use `pnpm` (never npm/yarn)
- Always use i18n for user-facing text

## Technology Stack

- **React 19** - UI library
- **TypeScript 5.9+** - Type-safe JavaScript
- **Vite 7** - Build tool and dev server
- **TanStack Router** - Type-safe routing
- **TanStack Query** - Server state management
- **Tailwind CSS v4** - Utility-first CSS
- **shadcn/ui** - Component library (Radix UI)
- **i18next** - Internationalization
- **Vitest** - Testing framework
- **Storybook** - Component development

## Development Workflow Checklist

When creating new features, ensure you follow these steps:

### Creating a New Component

- [ ] Use `kebab-case` for file name
- [ ] Use `PascalCase` for component name
- [ ] Place in correct folder (atoms/molecules/box)
- [ ] Add Storybook story if it's a molecule
- [ ] Add tests in `__tests__/` directory
- [ ] Use TypeScript with proper types
- [ ] Use i18n for all text

### Creating a New Page/Container

- [ ] Create container in `src/containers/{feature}/`
- [ ] Create route in `src/routes/_authenticated/{feature}/`
- [ ] Add required route meta (title + titleKey)
- [ ] Add translations in locale files
- [ ] Follow RESTful routing patterns
- [ ] Use feature-based organization

### Creating a New API

- [ ] Create core function in `src/apis/{resource}/cores/`
- [ ] Create React hook in `src/apis/{resource}/hooks/`
- [ ] Define types in `src/models/{resource}.ts`
- [ ] Follow naming convention (getUsers, useUsers)
- [ ] Use React Query for hooks
- [ ] Implement proper cache invalidation

### Creating a New Hook

- [ ] Use `camelCase` with `use` prefix
- [ ] Place in `src/hooks/{hook-name}.ts`
- [ ] Add tests in `src/hooks/__tests__/`
- [ ] Export from hook file

### Creating a New Context

- [ ] Create folder in `src/contexts/{feature}/`
- [ ] Create `context.ts` with definition and hooks
- [ ] Create `provider.tsx` with provider component
- [ ] Use TypeScript for context types

## Common Patterns

### Component File Structure

```typescript
// src/components/molecules/avatar/index.tsx
import { FC } from 'react'

interface AvatarProps {
  src: string
  alt: string
  size?: 'sm' | 'md' | 'lg'
}

export const Avatar: FC<AvatarProps> = ({ src, alt, size = 'md' }) => {
  return (
    <img src={src} alt={alt} className={cn('rounded-full', sizeClasses[size])} />
  )
}
```

### API Core Function

```typescript
// src/apis/user/cores/get-users.ts
import { httpClient } from '@/apis/http-client'
import type { ListUsersParams, ListUsersResponse } from '@/models/user'

export async function getUsers(params?: ListUsersParams): Promise<ListUsersResponse> {
  const response = await httpClient.get<ListUsersResponse>('/users', { params })
  return response.data
}
```

### React Query Hook

```typescript
// src/apis/user/hooks/use-users.ts
import { useQuery } from '@tanstack/react-query'
import { getUsers } from '../cores/get-users'

export function useUsers(params?: ListUsersParams) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => getUsers(params),
  })
}
```

### Route Definition

```typescript
// src/routes/_authenticated/users/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import { UserList } from '@/containers/users'

export const Route = createFileRoute('/_authenticated/users/')({
  component: UserList,
  staticData: {
    meta: {
      title: 'Users',
      titleKey: 'users.title',
    },
  },
})
```

## Important Rules

### ✅ DO

- Use `pnpm` for all package operations
- Use shadcn CLI for component installation
- Add Storybook stories for molecules
- Run `pnpm lint --fix` after tasks
- Use i18n for all user-facing text
- Follow TypeScript best practices
- Use proper component layering
- Implement error boundaries
- Add loading states
- Use semantic HTML

### ❌ DON'T

- Use npm or yarn
- Manually create shadcn component code
- Skip linting step
- Hardcode text in components
- Use `any` type excessively
- Modify generated files
- Use inline styles
- Ignore accessibility
- Create large monolithic components
- Skip error handling

## Getting Help

Each rule file contains detailed explanations with examples:

1. **Naming issues?** → See [naming-conventions.md](./naming-conventions.md)
2. **Where to put files?** → See [folder-structure.md](./folder-structure.md)
3. **Routing questions?** → See [routing.md](./routing.md)
4. **API patterns?** → See [apis.md](./apis.md)
5. **General guidelines?** → See [general.md](./general.md)

## Enforcement

These conventions are enforced through:

- ESLint with TypeScript and React rules
- Husky pre-commit hooks
- Code review process
- TypeScript strict mode
- Automated linting on commits

Follow these conventions strictly to maintain code quality and consistency across the project.
