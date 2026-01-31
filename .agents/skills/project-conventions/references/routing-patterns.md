# Routing Patterns Reference

Complete guide for implementing routes with TanStack Router.

## RESTful Route Patterns

Follow these consistent patterns for all resources:

```
/{resource}              → List all resources
/{resource}/create       → Create new resource
/{resource}/:id          → View resource detail
/{resource}/:id/edit     → Edit existing resource
```

## File Structure

```
src/routes/_authenticated/
└── {resource}/
    ├── index.tsx        # List page
    ├── create.tsx       # Create page
    ├── $id.tsx          # Detail page
    └── $id.edit.tsx     # Edit page
```

## Route Template

Every route MUST include `staticData.meta` with both `title` and `titleKey`:

```typescript
import { createFileRoute } from '@tanstack/react-router'
import { ComponentName } from '@/containers/path/to/component'

export const Route = createFileRoute('/_authenticated/{resource}/{action}')({
  component: ComponentName,
  staticData: {
    meta: {
      title: 'Plain Text Title',      // REQUIRED: English fallback
      titleKey: 'i18n.translation.key', // REQUIRED: i18n key
    },
  },
})
```

## Complete Examples

### List Page (index.tsx)

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

### Create Page (create.tsx)

```typescript
// src/routes/_authenticated/users/create.tsx
import { createFileRoute } from '@tanstack/react-router'
import { UserCreatePage } from '@/containers/users/user-create-page'

export const Route = createFileRoute('/_authenticated/users/create')({
  component: UserCreatePage,
  staticData: {
    meta: {
      title: 'Create User',
      titleKey: 'users.create_user.page_title',
    },
  },
})
```

### Detail Page ($id.tsx)

```typescript
// src/routes/_authenticated/users/$userId.tsx
import { createFileRoute } from '@tanstack/react-router'
import { UserDetailPage } from '@/containers/users/user-detail-page'

export const Route = createFileRoute('/_authenticated/users/$userId')({
  component: UserDetailPage,
  staticData: {
    meta: {
      title: 'User Detail',
      titleKey: 'users.detail.page_title',
    },
  },
})
```

### Edit Page ($id.edit.tsx)

```typescript
// src/routes/_authenticated/users/$userId.edit.tsx
import { createFileRoute } from '@tanstack/react-router'
import { UserEditPage } from '@/containers/users/user-edit-page'

export const Route = createFileRoute('/_authenticated/users/$userId/edit')({
  component: UserEditPage,
  staticData: {
    meta: {
      title: 'Edit User',
      titleKey: 'users.edit_user.page_title',
    },
  },
})
```

## Route Parameters

### Dynamic Parameters

Use `$` prefix for dynamic segments:

```typescript
// Parameter naming conventions:
$userId     // For user ID
$productId  // For product ID
$orderId    // For order ID
```

### Accessing Parameters

```typescript
import { useParams } from '@tanstack/react-router'

function UserDetailPage() {
  const { userId } = useParams({ from: '/_authenticated/users/$userId' })
  // Use userId...
}
```

### Search Parameters

```typescript
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

// Define search schema
const userSearchSchema = z.object({
  page: z.number().optional(),
  search: z.string().optional(),
})

export const Route = createFileRoute('/_authenticated/users/')({
  component: UserList,
  validateSearch: userSearchSchema,
  staticData: {
    meta: {
      title: 'Users',
      titleKey: 'users.title',
    },
  },
})

// In component
function UserList() {
  const { page, search } = Route.useSearch()
  // Use page and search...
}
```

## i18n Translation Keys

Ensure translation keys exist in locale files:

```json
// src/locales/messages/en.json
{
  "users": {
    "title": "User Management",
    "create_user": {
      "page_title": "Create New User"
    },
    "edit_user": {
      "page_title": "Edit User"
    },
    "detail": {
      "page_title": "User Details"
    }
  }
}
```

## Navigation

### Programmatic Navigation

```typescript
import { useNavigate } from '@tanstack/react-router'

function MyComponent() {
  const navigate = useNavigate()

  const goToUserDetail = (userId: string) => {
    navigate({
      to: '/users/$userId',
      params: { userId },
    })
  }
}
```

### Link Component

```typescript
import { Link } from '@tanstack/react-router'

function UserRow({ user }: { user: User }) {
  return (
    <Link to="/users/$userId" params={{ userId: user.id }}>
      {user.name}
    </Link>
  )
}
```

## Common Mistakes

### ❌ Missing Meta

```typescript
// WRONG
export const Route = createFileRoute('/_authenticated/users/')({
  component: UserList,
})
```

### ✅ Correct

```typescript
// CORRECT
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
