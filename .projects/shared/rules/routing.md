# Routing Rules

## Route Naming Convention

All routes must follow a consistent RESTful pattern for resource management.

### Standard Route Patterns

For any resource (e.g., users, products, orders), follow this structure:

```
/resources              → List all resources
/resources/create       → Create new resource
/resources/:id          → View resource detail
/resources/:id/edit     → Edit existing resource
```

### Examples

#### Users Resource

```
/users                  → User list page
/users/create           → Create new user page
/users/:userId          → User detail page
/users/:userId/edit     → Edit user page
```

---

## Route File Naming

TanStack Router uses file-based routing. Follow these naming conventions:

### File Structure

```
src/routes/_authenticated/
  └── [resource]/
      ├── index.tsx           → List page (/resources)
      ├── create.tsx          → Create page (/resources/create)
      ├── $id.tsx             → Detail page (/resources/:id)
      └── $id.edit.tsx        → Edit page (/resources/:id/edit)
```

### Parameter Naming

- Use singular form for resource ID parameters
- Prefix with `$` for dynamic segments
- Use descriptive names: `$userId`, `$productId`, `$orderId`

---

## Route Meta Definition

**CRITICAL**: Every route MUST define `staticData.meta` with both `title` and `titleKey`.

### Required Meta Properties

```typescript
export const Route = createFileRoute('/path')({
  component: Component,
  staticData: {
    meta: {
      title: 'Plain Text Title', // REQUIRED: Fallback title in English
      titleKey: 'i18n.key.path', // REQUIRED: i18n translation key
    },
  },
})
```

### Meta Examples

#### List Page

```typescript
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

#### Create Page

```typescript
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

#### Detail Page

```typescript
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

#### Edit Page

```typescript
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

---

## Complete Route Template

Use this template when creating new routes:

```typescript
import { createFileRoute } from '@tanstack/react-router'

import { ComponentName } from '@/containers/path/to/component'

export const Route = createFileRoute('/_authenticated/[resource]/[action]')({
  component: ComponentName,
  staticData: {
    meta: {
      title: '[Plain Text Title]', // REQUIRED
      titleKey: '[i18n.translation.key]', // REQUIRED
    },
  },
})
```

---

## Route Checklist

Before creating a new route, ensure:

- [ ] Route follows RESTful pattern
- [ ] File is in correct directory under `src/routes/_authenticated/`
- [ ] File name matches TanStack Router conventions
- [ ] Component is imported correctly
- [ ] `staticData.meta.title` is defined
- [ ] `staticData.meta.titleKey` is defined
- [ ] Corresponding i18n key exists in translation files
- [ ] Route path matches file name pattern

---

## Common Mistakes to Avoid

### ❌ Missing Meta

```typescript
// WRONG - Missing meta definition
export const Route = createFileRoute('/_authenticated/users/')({
  component: UserList,
})
```

### ❌ Incomplete Meta

```typescript
// WRONG - Missing titleKey
export const Route = createFileRoute('/_authenticated/users/')({
  component: UserList,
  staticData: {
    meta: {
      title: 'Users',
    },
  },
})
```

### ❌ Wrong Route Pattern

```typescript
// WRONG - Not following RESTful pattern
/users/edit/:userId      // Should be /users/:userId/edit
/users/new               // Should be /users/create
/users/:userId/details   // Should be /users/:userId
```

### ✅ Correct Implementation

```typescript
// CORRECT - Complete meta definition
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

---

## i18n Translation Keys

Ensure corresponding translation keys exist in `src/locales/messages/[lang].json`:

```json
{
  "users": {
    "title": "Quản lý người dùng",
    "create_user": {
      "page_title": "Tạo người dùng mới"
    },
    "edit_user": {
      "page_title": "Chỉnh sửa người dùng"
    },
    "detail": {
      "page_title": "Chi tiết người dùng"
    }
  }
}
```

---

## Enforcement

All routes must comply with these rules. Pull requests with non-compliant routes will be rejected.
