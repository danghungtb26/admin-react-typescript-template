---
name: project-conventions
description: Project-specific coding standards, naming conventions, and folder structure for this React TypeScript admin template. Use when creating new files, components, APIs, hooks, or organizing code. Apply these conventions when the user asks to create components, pages, APIs, hooks, containers, routes, or any project files.
---

# Project Conventions

## Overview

This skill defines the coding standards and conventions for this React TypeScript admin dashboard project, including file naming, variable naming, folder structure, and architectural patterns.

## File Naming Conventions

All files use **kebab-case**:

- Components: `user-form.tsx`, `data-table.tsx`
- Utilities: `string.ts`, `object.ts`, `money.ts`
- Tests: `{name}.test.tsx` or `{name}.test.ts`
- Stories: `{name}.stories.tsx`
- API files: `get-users.ts`, `create-user.ts`, `use-create-user.ts`

## Variable & Function Naming

### Components
- **Pattern:** PascalCase
- **Examples:** `Avatar`, `UserForm`, `DataTable`, `UserCreatePage`

### Hooks
- **Pattern:** camelCase with `use` prefix
- **Examples:** `useUsers`, `useCreateUser`, `useIsMobile`, `useAuthContext`

### Functions
- **Pattern:** camelCase
- **Examples:** `getUsers`, `createUser`, `formatDate`, `slugify`

### Constants
- **Pattern:** UPPER_SNAKE_CASE
- **Examples:** `AUTHEN_TOKEN_KEY`, `LOCALE_KEY`, `MOBILE_BREAKPOINT`

### Types/Interfaces
- **Pattern:** PascalCase
- **Examples:** `UserFormProps`, `AuthContextType`, `ListUsersParams`

For complete naming rules, see [references/naming-conventions.md](references/naming-conventions.md).

## Component Organization

Components follow Atomic Design:

```
src/components/
├── atoms/              # Simple components (single file)
│   ├── button.tsx
│   └── input.tsx
├── molecules/          # Complex components (folder with index.tsx)
│   ├── avatar/
│   │   ├── index.tsx
│   │   ├── avatar.stories.tsx
│   │   └── __tests__/
│   └── data-table/
│       └── index.tsx
└── box/               # Layout components
    └── page-container.tsx
```

**Rules:**
- Simple components: Single `.tsx` file in `atoms/`
- Complex components: Folder in `molecules/` with `index.tsx`
- Always add Storybook stories for molecules
- Tests in `__tests__/` subdirectory

## Container/Feature Structure

Feature-based organization:

```
src/containers/{feature}/
├── index.tsx                    # Main list page
├── {feature}-create-page.tsx    # Create page
├── {feature}-edit-page.tsx      # Edit page
├── components/                  # Feature-specific components
│   └── {component}/
│       ├── index.tsx
│       └── __tests__/
└── __tests__/
```

For complete folder structure, see [references/folder-structure.md](references/folder-structure.md).

## API Structure

APIs separated into cores (pure functions) and hooks (React Query):

```
src/apis/{resource}/
├── cores/                 # Pure API functions
│   ├── get-{resource}s.ts
│   ├── get-{resource}-by-id.ts
│   ├── create-{resource}.ts
│   ├── update-{resource}.ts
│   └── delete-{resource}.ts
└── hooks/                 # React Query hooks
    ├── use-{resource}s.ts
    ├── use-{resource}-by-id.ts
    ├── use-create-{resource}.ts
    ├── use-update-{resource}.ts
    └── use-delete-{resource}.ts
```

**Naming Rules:**

| Operation | Core File | Core Function | Hook File | Hook Name |
|-----------|-----------|---------------|-----------|-----------|
| Create | `create-user.ts` | `createUser` | `use-create-user.ts` | `useCreateUser` |
| Update | `update-user.ts` | `updateUser` | `use-update-user.ts` | `useUpdateUser` |
| Delete | `delete-user.ts` | `deleteUser` | `use-delete-user.ts` | `useDeleteUser` |
| Get by ID | `get-user-by-id.ts` | `getUserById` | `use-user-by-id.ts` | `useUserById` |
| Get List | `get-users.ts` | `getUsers` | `use-users.ts` | `useUsers` |

For complete API patterns with code examples, see [references/api-patterns.md](references/api-patterns.md).

## Routing Conventions

Routes follow RESTful patterns with TanStack Router:

```
src/routes/_authenticated/{resource}/
├── index.tsx        # List → /{resource}
├── create.tsx       # Create → /{resource}/create
├── $id.tsx          # Detail → /{resource}/:id
└── $id.edit.tsx     # Edit → /{resource}/:id/edit
```

**Route Meta (REQUIRED):**
```typescript
export const Route = createFileRoute('/_authenticated/users/')({
  component: UserList,
  staticData: {
    meta: {
      title: 'Users',           // Plain text fallback
      titleKey: 'users.title',  // i18n key (REQUIRED)
    },
  },
})
```

For complete routing patterns, see [references/routing-patterns.md](references/routing-patterns.md).

## Context Structure

```
src/contexts/{feature}/
├── context.ts      # Context definition & hooks
└── provider.tsx    # Provider component
```

## Test Organization

Tests in `__tests__/` directories alongside code:

- Component tests: `{component-folder}/__tests__/{component-name}.test.tsx`
- Utility tests: `{utility-folder}/__tests__/{utility-name}.test.ts`
- Hook tests: `src/hooks/__tests__/{hook-name}.test.ts`

## Quick Checklist

When creating new code, verify:

- [ ] File name uses kebab-case
- [ ] Component name uses PascalCase
- [ ] Hook name uses camelCase with `use` prefix
- [ ] Function name uses camelCase
- [ ] Constants use UPPER_SNAKE_CASE
- [ ] Types/Interfaces use PascalCase
- [ ] Tests in `__tests__/` directory
- [ ] API follows cores/ and hooks/ separation
- [ ] Route has required meta with title and titleKey
- [ ] Complex components in molecules/ with Storybook story

## Where to Place New Files

### New Component?
- **Simple** → `src/components/atoms/{name}.tsx`
- **Complex** → `src/components/molecules/{name}/index.tsx`
- **Layout** → `src/components/box/{name}.tsx`

### New Page?
- **Container** → `src/containers/{feature}/index.tsx`
- **Route** → `src/routes/_authenticated/{feature}/index.tsx`

### New API?
- **Core** → `src/apis/{resource}/cores/{action}-{resource}.ts`
- **Hook** → `src/apis/{resource}/hooks/use-{action}-{resource}.ts`

### New Model?
- **Model** → `src/models/{model}.ts`

### New Hook?
- **Hook** → `src/hooks/{hook-name}.ts`

### New Context?
- **Context** → `src/contexts/{feature}/context.ts`
- **Provider** → `src/contexts/{feature}/provider.tsx`

### New Utility?
- **Simple** → `src/commons/{utility}.ts`
- **Grouped** → `src/commons/{category}/{utility}.ts`

## Additional Resources

For detailed documentation with complete examples:

- **Naming conventions** - See [references/naming-conventions.md](references/naming-conventions.md) for all naming rules with examples
- **Folder structure** - See [references/folder-structure.md](references/folder-structure.md) for complete project organization
- **API patterns** - See [references/api-patterns.md](references/api-patterns.md) for API implementation with code examples
- **Routing patterns** - See [references/routing-patterns.md](references/routing-patterns.md) for routing with TanStack Router
