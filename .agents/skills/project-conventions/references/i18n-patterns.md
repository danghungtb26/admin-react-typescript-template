# i18n Usage Patterns

Guide for using internationalization (i18n) in components and pages.

## Basic Usage

### Import and Use Translation Hook

```typescript
import { useTranslation } from 'react-i18next'

function MyComponent() {
  const { t } = useTranslation()
  
  return <h1>{t('common.welcome')}</h1>
}
```

## Translation Key Structure

Translation keys follow a hierarchical structure:

```
{namespace}.{section}.{subsection}.{key}
```

### Common Namespaces

| Namespace | Purpose | Example |
|-----------|---------|---------|
| `common` | Shared text across app | `common.button.save` |
| `auth` | Authentication pages | `auth.labels.sign_in` |
| `{feature}` | Feature-specific text | `users.title`, `products.actions.create` |

## Translation File Structure

```json
{
  "common": {
    "button": {
      "save": "Save",
      "cancel": "Cancel",
      "back": "Back"
    },
    "error": {
      "something_went_wrong": "Something went wrong"
    }
  },
  "users": {
    "title": "User Management",
    "actions": {
      "create": "Create User",
      "edit": "Edit User"
    },
    "labels": {
      "name": "Name",
      "email": "Email"
    }
  }
}
```

## Usage Patterns

### Pattern 1: Simple Text Translation

```typescript
function UserList() {
  const { t } = useTranslation()
  
  return (
    <div>
      <h1>{t('users.title')}</h1>
      <button>{t('users.actions.create')}</button>
    </div>
  )
}
```

### Pattern 2: Translation with Variables

```typescript
// Translation file
{
  "users": {
    "greeting": "Hello, {{name}}!",
    "items_count": "You have {{count}} items"
  }
}

// Component
function Welcome({ userName }: { userName: string }) {
  const { t } = useTranslation()
  
  return <h1>{t('users.greeting', { name: userName })}</h1>
}
```

### Pattern 3: Pluralization

```typescript
// Translation file
{
  "items": {
    "count_one": "{{count}} item",
    "count_other": "{{count}} items"
  }
}

// Component
function ItemCounter({ count }: { count: number }) {
  const { t } = useTranslation()
  
  return <span>{t('items.count', { count })}</span>
}
```

### Pattern 4: Form Labels and Placeholders

```typescript
function UserForm() {
  const { t } = useTranslation()
  
  return (
    <form>
      <div>
        <label>{t('users.labels.name')}</label>
        <input placeholder={t('users.placeholders.name')} />
      </div>
      
      <div>
        <label>{t('users.labels.email')}</label>
        <input 
          type="email"
          placeholder={t('users.placeholders.email')} 
        />
      </div>
      
      <button type="submit">
        {t('common.button.save')}
      </button>
    </form>
  )
}
```

### Pattern 5: Validation Messages

```typescript
function validateForm(data: FormData, t: TFunction) {
  if (!data.email) {
    return { 
      valid: false, 
      error: t('users.errors.email.required') 
    }
  }
  
  if (!data.email.includes('@')) {
    return { 
      valid: false, 
      error: t('users.errors.email.invalid') 
    }
  }
  
  return { valid: true }
}

// Usage in component
function UserFormPage() {
  const { t } = useTranslation()
  
  const handleSubmit = (data: FormData) => {
    const validation = validateForm(data, t)
    
    if (!validation.valid) {
      toast.error(validation.error)
      return
    }
    
    // Continue...
  }
}
```

### Pattern 6: Select/Dropdown Options with i18n

```typescript
function GenderSelect() {
  const { t } = useTranslation()
  
  // Memoize options to prevent recreation on every render
  const options = React.useMemo(
    () => [
      {
        value: 'male',
        label: t('common.gender.male'),
      },
      {
        value: 'female',
        label: t('common.gender.female'),
      },
      {
        value: 'other',
        label: t('common.gender.other'),
      },
    ],
    [t]
  )
  
  return <Select options={options} />
}
```

### Pattern 7: Dynamic Keys

```typescript
function StatusBadge({ status }: { status: string }) {
  const { t } = useTranslation()
  
  // Dynamic key based on status
  return (
    <Badge>
      {t(`common.status.${status}`)}
    </Badge>
  )
}

// Translation file
{
  "common": {
    "status": {
      "active": "Active",
      "inactive": "Inactive",
      "pending": "Pending"
    }
  }
}
```

### Pattern 8: Table Columns with i18n

```typescript
function UserTable() {
  const { t } = useTranslation()
  
  const columns = React.useMemo(
    () => [
      {
        accessorKey: 'name',
        header: t('users.columns.name'),
      },
      {
        accessorKey: 'email',
        header: t('users.columns.email'),
      },
      {
        accessorKey: 'role',
        header: t('users.columns.role'),
      },
    ],
    [t]
  )
  
  return <DataTable columns={columns} data={data} />
}
```

### Pattern 9: Toast Notifications

```typescript
function UserActions() {
  const { t } = useTranslation()
  const createMutation = useCreateUser()
  
  const handleCreate = async (data: UserFormData) => {
    try {
      await createMutation.mutateAsync(data)
      toast.success(t('users.messages.create_success'))
    } catch (error) {
      toast.error(t('users.messages.create_failed'))
    }
  }
}
```

### Pattern 10: Route Meta Titles

```typescript
// Route definition
export const Route = createFileRoute('/_authenticated/users/')({
  component: UserList,
  staticData: {
    meta: {
      title: 'Users',                    // Fallback
      titleKey: 'users.title',           // i18n key (REQUIRED)
    },
  },
})

// The framework will automatically use t('users.title')
```

## Organizing Translation Keys

### By Feature (Recommended)

```json
{
  "users": {
    "title": "User Management",
    "actions": {
      "create": "Create User",
      "edit": "Edit User",
      "delete": "Delete User"
    },
    "labels": {
      "name": "Name",
      "email": "Email",
      "role": "Role"
    },
    "placeholders": {
      "name": "Enter user name",
      "email": "user@example.com"
    },
    "errors": {
      "name": {
        "required": "Name is required"
      },
      "email": {
        "required": "Email is required",
        "invalid": "Invalid email format"
      }
    },
    "messages": {
      "create_success": "User created successfully",
      "create_failed": "Failed to create user"
    }
  }
}
```

### By Type (For Shared Items)

```json
{
  "common": {
    "button": {
      "save": "Save",
      "cancel": "Cancel",
      "delete": "Delete",
      "edit": "Edit",
      "create": "Create",
      "back": "Back"
    },
    "status": {
      "active": "Active",
      "inactive": "Inactive",
      "pending": "Pending"
    },
    "error": {
      "required": "This field is required",
      "invalid_format": "Invalid format",
      "something_went_wrong": "Something went wrong"
    }
  }
}
```

## Best Practices

### 1. Always Use Translation Keys

```typescript
// ❌ Bad - hardcoded text
<button>Save</button>
<h1>User Management</h1>

// ✅ Good - translated text
<button>{t('common.button.save')}</button>
<h1>{t('users.title')}</h1>
```

### 2. Memoize Options with Dependencies

```typescript
// ❌ Bad - recreated every render
function MySelect() {
  const { t } = useTranslation()
  const options = [
    { value: '1', label: t('option.one') }
  ]
  return <Select options={options} />
}

// ✅ Good - memoized with t dependency
function MySelect() {
  const { t } = useTranslation()
  const options = React.useMemo(
    () => [
      { value: '1', label: t('option.one') }
    ],
    [t]
  )
  return <Select options={options} />
}
```

### 3. Use Descriptive Key Names

```typescript
// ❌ Bad - unclear keys
t('btn1')
t('msg')
t('txt')

// ✅ Good - descriptive keys
t('common.button.save')
t('users.messages.create_success')
t('users.labels.email')
```

### 4. Group Related Keys

```typescript
// ❌ Bad - flat structure
{
  "user_name": "Name",
  "user_email": "Email",
  "user_create": "Create User",
  "user_edit": "Edit User"
}

// ✅ Good - hierarchical structure
{
  "users": {
    "labels": {
      "name": "Name",
      "email": "Email"
    },
    "actions": {
      "create": "Create User",
      "edit": "Edit User"
    }
  }
}
```

### 5. Reuse Common Translations

```typescript
// Translation file
{
  "common": {
    "button": {
      "save": "Save",
      "cancel": "Cancel"
    }
  }
}

// Multiple components use same keys
function UserForm() {
  const { t } = useTranslation()
  return <button>{t('common.button.save')}</button>
}

function ProductForm() {
  const { t } = useTranslation()
  return <button>{t('common.button.save')}</button>
}
```

### 6. Provide Context in Key Names

```typescript
// ❌ Bad - ambiguous
t('status')  // What status? User? Order? System?

// ✅ Good - specific context
t('users.status')
t('orders.status')
t('system.status')
```

### 7. Use Variables for Dynamic Content

```typescript
// ❌ Bad - string concatenation
const message = t('hello') + ', ' + userName + '!'

// ✅ Good - use variables
const message = t('greeting', { name: userName })

// Translation: "greeting": "Hello, {{name}}!"
```

## Common Translation Keys Reference

```typescript
// Buttons
t('common.button.save')
t('common.button.cancel')
t('common.button.delete')
t('common.button.edit')
t('common.button.create')
t('common.button.back')
t('common.button.submit')

// Actions
t('common.actions.create')
t('common.actions.edit')
t('common.actions.delete')
t('common.actions.view')
t('common.actions.search')

// Status
t('common.status.active')
t('common.status.inactive')
t('common.status.pending')

// Messages
t('common.messages.success')
t('common.messages.error')
t('common.messages.loading')
t('common.messages.no_data')

// Errors
t('common.error.required')
t('common.error.invalid_format')
t('common.error.something_went_wrong')

// Confirmation
t('common.confirm.delete')
t('common.confirm.cancel')
```

## Quick Checklist

When adding new text to UI:

- [ ] Never hardcode text in components
- [ ] Always use `t()` function for all user-facing text
- [ ] Add translation keys to both `en.json` and `vi.json`
- [ ] Use hierarchical key structure
- [ ] Memoize options/columns with `[t]` dependency
- [ ] Reuse `common.*` keys when possible
- [ ] Provide context in key names
- [ ] Use variables for dynamic content

## Summary

**Key Points:**
- Always use `useTranslation()` hook and `t()` function
- Never hardcode user-facing text
- Organize keys hierarchically by feature
- Reuse common translations
- Memoize translated options/arrays
- Both `en.json` and `vi.json` must have same keys

**➡️ See also:**
- [Routing Patterns](routing-patterns.md) - Route meta with titleKey
