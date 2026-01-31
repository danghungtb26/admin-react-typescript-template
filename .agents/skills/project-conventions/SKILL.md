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

For complete naming rules, see [references/rules/naming-conventions.md](references/rules/naming-conventions.md).

## Coding Style Rules

### No Else Statement (CRITICAL)

**Never use `else` statements.** Use early returns instead.

```typescript
// ❌ Bad - using else
function getStatus(user: User) {
  if (user.isActive) {
    return 'active'
  } else {
    return 'inactive'
  }
}

// ✅ Good - early return
function getStatus(user: User) {
  if (user.isActive) {
    return 'active'
  }

  return 'inactive'
}
```

**When logic is complex, extract to utility functions:**

- **Feature-specific logic** → `src/containers/{feature}/utils/`
- **Reusable utilities** → `src/commons/`

For complete patterns and examples, see [references/rules/no-else.md](references/rules/no-else.md).

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

| Operation | Core File           | Core Function | Hook File            | Hook Name       |
| --------- | ------------------- | ------------- | -------------------- | --------------- |
| Create    | `create-user.ts`    | `createUser`  | `use-create-user.ts` | `useCreateUser` |
| Update    | `update-user.ts`    | `updateUser`  | `use-update-user.ts` | `useUpdateUser` |
| Delete    | `delete-user.ts`    | `deleteUser`  | `use-delete-user.ts` | `useDeleteUser` |
| Get by ID | `get-user-by-id.ts` | `getUserById` | `use-user-by-id.ts`  | `useUserById`   |
| Get List  | `get-users.ts`      | `getUsers`    | `use-users.ts`       | `useUsers`      |

For complete API patterns with code examples, see [references/api-patterns.md](references/api-patterns.md).

## Model Organization

Models use decorator pattern for serialization and field mapping:

```
src/models/
├── base.ts          # Base class with common fields
├── user.ts          # User model
├── role.ts          # Role model
├── category.ts      # Category model
└── pagination.ts    # Pagination model
```

**Model Structure:**

```typescript
import { field } from '@/decorators/field'
import { model } from '@/decorators/model'
import { Base } from './base'

@model()
export class User extends Base {
  @field()
  name?: string

  @field('user_id') // Map snake_case to camelCase
  userId?: string

  @field('address', Address) // Nested model
  address?: Address
}
```

**Key Features:**

- Extend `Base` for common fields (id, createdAt, etc.)
- Use `@field()` decorator for API-mapped properties
- Automatic snake_case ↔ camelCase conversion
- Support for nested models and arrays
- `fromJson()` for deserialization
- `toJson()` for serialization

For complete model patterns with examples, see [references/model-patterns.md](references/model-patterns.md).

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
      title: 'Users', // Plain text fallback
      titleKey: 'users.title', // i18n key (REQUIRED)
    },
  },
})
```

For complete routing patterns, see [references/routing-patterns.md](references/routing-patterns.md).

## i18n (Internationalization)

All user-facing text must use i18n translations:

```typescript
import { useTranslation } from 'react-i18next'

function UserForm() {
  const { t } = useTranslation()

  return (
    <div>
      <h1>{t('users.title')}</h1>
      <button>{t('common.button.save')}</button>
    </div>
  )
}
```

**Key Rules:**

- Never hardcode user-facing text
- Use `useTranslation()` hook and `t()` function
- Add keys to both `src/locales/messages/en.json` and `vi.json`
- Organize keys hierarchically by feature
- Memoize translated options/arrays with `[t]` dependency

For complete i18n patterns and examples, see [references/i18n-patterns.md](references/i18n-patterns.md).

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

- [ ] **No `else` statements** - Use early returns (CRITICAL)
- [ ] **All text uses i18n** - No hardcoded user-facing text (CRITICAL)
- [ ] Translation keys added to both en.json and vi.json
- [ ] **Functions > 10 lines** - Extracted to utils, or TODO(refactor) comment if not possible
- [ ] Complex logic in feature/utils or commons/
- [ ] File name uses kebab-case
- [ ] Component name uses PascalCase
- [ ] Hook name uses camelCase with `use` prefix
- [ ] Function name uses camelCase
- [ ] Constants use UPPER_SNAKE_CASE
- [ ] Types/Interfaces use PascalCase
- [ ] Model extends Base and uses @model() decorator
- [ ] Model fields use @field() decorator for API mapping
- [ ] Tests in `__tests__/` directory
- [ ] API follows cores/ and hooks/ separation
- [ ] Route has required meta with title and titleKey
- [ ] Complex components in molecules/ with Storybook story

## Where to Place New Files

### New Component?

- **Simple** → `src/components/atoms/{name}.tsx`
- **Complex** → `src/components/molecules/{name}/index.tsx`
- **Layout** → `src/components/containers/{name}.tsx`

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

- **Feature-specific** → `src/containers/{feature}/utils/{category}.ts`
- **Shared/Common** → `src/commons/{category}/{utility}.ts`

**Rule:** Logic functions **> 10 lines** must be extracted to utils. If extraction is not possible, add `// TODO(refactor): Extract to utils - ...` with reason and target file.

**Examples:**

- `src/containers/users/utils/validation.ts` - User validation logic
- `src/commons/validates/common.ts` - Shared validation helpers
- `src/commons/formatters/currency.ts` - Currency formatting

For when and how to extract, see [references/utility-extraction.md](references/utility-extraction.md).

## Additional Resources

For detailed documentation with complete examples:

### Rules (CRITICAL)

- **No else rule** - See [references/rules/no-else.md](rules/no-else.md) for early return patterns and utility extraction
- **Naming conventions** - See [references/rules/naming-conventions.md](rules/naming-conventions.md) for all naming rules with examples

### Patterns

- **Utility extraction** - See [references/utility-extraction.md](references/utility-extraction.md) for when to extract functions > 10 lines
- **i18n patterns** - See [references/i18n-patterns.md](references/i18n-patterns.md) for internationalization usage
- **Model patterns** - See [references/model-patterns.md](references/model-patterns.md) for model definition with decorators
- **Folder structure** - See [references/folder-structure.md](references/folder-structure.md) for complete project organization
- **API patterns** - See [references/api-patterns.md](references/api-patterns.md) for API implementation with code examples
- **Routing patterns** - See [references/routing-patterns.md](references/routing-patterns.md) for routing with TanStack Router
