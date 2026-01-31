# Architecture Patterns

Key architectural decisions for this project's frontend design.

## Form/Logic Separation Pattern

**Core Principle**: Separate display concerns from business logic

### Structure

```
Page Component (Parent)             Form Component (Child)
├── Data fetching                   ├── Display fields
├── Mutations                       ├── Validation
├── Navigation                      ├── Field state
└── Error handling                  └── Emit onSubmit callback
```

### Why This Pattern?

✅ **Testability**: Form can be tested in isolation  
✅ **Reusability**: Same form for create/edit/different contexts  
✅ **Maintainability**: Clear separation of concerns  
✅ **Type Safety**: Well-defined props interface  

### Form Component Responsibilities

```typescript
// src/containers/users/components/user-form/index.tsx
interface UserFormProps {
  initialData?: UserFormData       // For edit mode
  onSubmit: (data: UserFormData) => void | Promise<void>
  isSubmitting?: boolean           // Parent controls loading
  submitLabel?: string             // Customizable button text
  onCancel?: () => void           // Parent handles navigation
}

export function UserForm({
  initialData,
  onSubmit,
  isSubmitting,
  submitLabel = 'Save',
  onCancel
}: UserFormProps) {
  // ✅ Handle: Display, validation, field state
  // ❌ Don't handle: API calls, navigation, toast notifications
  
  const form = useForm({
    defaultValues: initialData ?? defaultValues,
    validators: { onChange: schema },
    onSubmit: async ({ value }) => {
      await onSubmit(value)  // Just emit to parent
    }
  })
  
  return <form>...</form>
}
```

### Page Component Responsibilities

```typescript
// src/routes/_authenticated/users/create.tsx
function UserCreatePage() {
  const navigate = useNavigate()
  const createMutation = useCreateUser()
  
  // ✅ Handle: Data fetching, mutations, navigation, notifications
  // ❌ Don't handle: Field rendering, validation logic
  
  const handleSubmit = async (data: UserFormData) => {
    try {
      await createMutation.mutateAsync(data)
      toast.success('User created')
      navigate({ to: '/users' })
    } catch (error) {
      toast.error('Failed to create user')
    }
  }
  
  return (
    <UserForm
      onSubmit={handleSubmit}
      isSubmitting={createMutation.isPending}
    />
  )
}
```

## API Layer Structure

**Separation**: Pure functions (cores) vs React hooks (hooks)

### Cores Layer (Pure Functions)

```typescript
// src/apis/user/cores/create-user.ts
import { httpClient } from '@/libs/http-client'
import type { User, UserFormData } from '@/models/user'

export async function createUser(data: UserFormData): Promise<User> {
  const response = await httpClient.post<User>('/users', data)
  return response.data
}
```

**Characteristics:**
- Pure functions
- No React dependencies
- Easily testable
- Reusable outside React

### Hooks Layer (React Query)

```typescript
// src/apis/user/hooks/use-create-user.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createUser } from '../cores/create-user'
import type { UserFormData } from '@/models/user'

export function useCreateUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: UserFormData) => createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
```

**Characteristics:**
- React Query wrapper
- Cache management
- Optimistic updates
- Error handling

## Component Organization (Atomic Design)

### Atoms (Simple Components)

```
src/components/atoms/
├── button.tsx              # Single file
├── input.tsx
├── select.tsx
└── badge.tsx
```

**Rules:**
- Single responsibility
- Highly reusable
- No business logic
- Single file (no folder)

### Molecules (Complex Components)

```
src/components/molecules/
├── data-table/
│   ├── index.tsx
│   ├── data-table.stories.tsx
│   └── __tests__/
│       └── data-table.test.tsx
└── date-range-picker/
    └── index.tsx
```

**Rules:**
- Combination of atoms
- Specific functionality
- Folder structure with index.tsx
- Must have Storybook story
- Include tests

### Feature Components

```
src/containers/users/
└── components/
    ├── user-form/          # Specific to users feature
    │   ├── index.tsx
    │   └── __tests__/
    └── user-filters/
        └── index.tsx
```

**Rules:**
- Feature-specific logic
- Not globally reusable
- Lives within feature folder
- Can use atoms and molecules

## File Naming Convention

| Type | Example | Pattern |
|------|---------|---------|
| Component file | `user-form.tsx` | kebab-case |
| Component name | `UserForm` | PascalCase |
| API core file | `create-user.ts` | kebab-case |
| API core function | `createUser` | camelCase |
| Hook file | `use-create-user.ts` | kebab-case |
| Hook name | `useCreateUser` | camelCase with `use` |
| Model file | `user.ts` | kebab-case |
| Model type | `User`, `UserFormData` | PascalCase |
| Constant | `API_BASE_URL` | UPPER_SNAKE_CASE |

## Type Definitions

Define types in models, share across layers:

```typescript
// src/models/user.ts
export interface User {
  id: string
  name: string
  email: string
  // ... full entity
}

export interface UserFormData {
  name: string
  email: string
  // ... only form fields
}

export interface ListUsersParams {
  page?: number
  pageSize?: number
  search?: string
  // ... query params
}
```

**Benefits:**
- Single source of truth
- Used in: API cores, hooks, forms, pages
- Type-safe throughout application

## Import Paths

Always import from proper atomic design levels:

```typescript
// ✅ Good
import { Button } from '@/components/atoms/button'
import { DataTable } from '@/components/molecules/data-table'
import { UserForm } from '@/containers/users/components/user-form'
import { useCreateUser } from '@/apis/user/hooks/use-create-user'
import type { User } from '@/models/user'

// ❌ Bad
import { Button } from '@/components/button'  // Missing atomic level
import { createUser } from '@/apis/user'      // Should use hook, not core directly
```

## When to Break the Rules?

### Use Core Function Directly

Only in:
- Server-side operations
- Non-React utilities
- Testing

```typescript
// ✅ In tests
import { createUser } from '@/apis/user/cores/create-user'

test('createUser', async () => {
  const user = await createUser(mockData)
  expect(user).toBeDefined()
})
```

### Combine Display and Logic

Only for:
- Very simple components
- One-off components
- Prototypes

But still follow file naming and structure conventions.

## Summary

| Concern | Location | Responsibilities |
|---------|----------|------------------|
| Display + Validation | Form Component | Fields, validation, emit data |
| Data + Logic | Page Component | Fetch, mutate, navigate |
| API Calls | cores/ | Pure HTTP functions |
| React Query | hooks/ | Cache, mutations, invalidation |
| Models | models/ | Type definitions |
| Reusable UI | atoms/ | Simple components |
| Complex UI | molecules/ | Combined components |
| Feature UI | containers/*/components/ | Feature-specific |

**➡️ Always refer to [@project-conventions](../../project-conventions/SKILL.md) for complete guidelines**
