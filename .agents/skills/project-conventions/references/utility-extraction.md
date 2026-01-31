# Utility Extraction Rules

Guide for when and how to extract logic into utility functions.

## Core Rule

**Logic functions > 10 lines must be extracted to utils.**

If extraction is not possible (e.g. tight coupling, time constraint), add a comment to refactor later.

## Why Extract?

✅ **Readability**: Shorter functions are easier to understand  
✅ **Testability**: Pure utils are easy to unit test  
✅ **Reusability**: Shared logic in one place  
✅ **Maintainability**: Changes isolated to one file  
✅ **Single responsibility**: One function, one purpose  

## Rule in Practice

### ❌ Bad - Long function inline (> 10 lines)

```typescript
function UserFormPage() {
  const handleSubmit = (data: UserFormData) => {
    // Line 1
    if (!data.email) {
      toast.error('Email required')
      return
    }
    // Line 2
    if (!data.email.includes('@')) {
      toast.error('Invalid email')
      return
    }
    // Line 3
    if (!data.name) {
      toast.error('Name required')
      return
    }
    // Line 4
    if (data.name.length < 2) {
      toast.error('Name too short')
      return
    }
    // Line 5
    if (!data.phone) {
      toast.error('Phone required')
      return
    }
    // Line 6
    const phoneRegex = /^\+?[0-9]{10,15}$/
    if (!phoneRegex.test(data.phone)) {
      toast.error('Invalid phone')
      return
    }
    // Line 7
    if (!data.age || data.age < 18) {
      toast.error('Must be 18+')
      return
    }
    // Line 8
    createMutation.mutate(data)
    // Line 9
    toast.success('User created')
    // Line 10
    navigate({ to: '/users' })
    // > 10 lines - VIOLATION
  }
  
  return <form onSubmit={handleSubmit}>...</form>
}
```

### ✅ Good - Extracted to util

```typescript
// src/containers/users/utils/validation.ts
export interface UserFormValidation {
  valid: boolean
  error?: string
}

export function validateUserForm(data: UserFormData): UserFormValidation {
  if (!data.email) {
    return { valid: false, error: 'Email required' }
  }
  
  if (!data.email.includes('@')) {
    return { valid: false, error: 'Invalid email' }
  }
  
  if (!data.name) {
    return { valid: false, error: 'Name required' }
  }
  
  if (data.name.length < 2) {
    return { valid: false, error: 'Name too short' }
  }
  
  if (!data.phone) {
    return { valid: false, error: 'Phone required' }
  }
  
  const phoneRegex = /^\+?[0-9]{10,15}$/
  if (!phoneRegex.test(data.phone)) {
    return { valid: false, error: 'Invalid phone' }
  }
  
  if (!data.age || data.age < 18) {
    return { valid: false, error: 'Must be 18+' }
  }
  
  return { valid: true }
}

// src/containers/users/user-form-page.tsx
function UserFormPage() {
  const createMutation = useCreateUser()
  const navigate = useNavigate()
  
  const handleSubmit = (data: UserFormData) => {
    const validation = validateUserForm(data)
    
    if (!validation.valid) {
      toast.error(validation.error)
      return
    }
    
    createMutation.mutate(data)
    toast.success('User created')
    navigate({ to: '/users' })
  }
  
  return <form onSubmit={handleSubmit}>...</form>
}
```

## When to Extract

### Extract when:

- Function body **> 10 lines** (excluding blank lines and closing braces)
- Logic is **reusable** in other components/pages
- Logic is **complex** (multiple conditions, loops, transformations)
- Logic can be **tested in isolation** (pure function)
- Logic has **single responsibility** (one clear purpose)

### Count lines like this:

```typescript
function example() {
  const a = 1           // line 1
  const b = 2           // line 2
  if (a > b) {         // line 3
    return a           // line 4
  }                    // line 5
  const c = a + b      // line 6
  const d = c * 2      // line 7
  return process(d)    // line 8
}                      // 8 lines - OK

function longExample() {
  // ... 11+ lines of logic
}                      // > 10 lines - EXTRACT
```

**Count:** Executable statements and control flow. Blank lines and `}` alone don’t count. Comments that explain “what” can be excluded; prefer extracting over long comments.

## Where to Put Utils

### Feature-specific logic

```
src/containers/{feature}/utils/
├── validation.ts
├── formatting.ts
└── business-logic.ts
```

**Use when:** Logic is specific to one feature (users, orders, products).

### Shared logic

```
src/commons/
├── validates/
│   └── common.ts
├── formatters/
│   └── currency.ts
├── helpers/
│   └── array.ts
└── datetime/
    └── format.ts
```

**Use when:** Logic is reused across multiple features.

### Decision flow

```
Is the logic used only in one feature?
├─ YES → src/containers/{feature}/utils/
└─ NO  → Used in 2+ features?
         ├─ YES → src/commons/
         └─ NO  → Still extract to feature utils first
```

## When Extraction Is Not Possible

If you **cannot** extract (e.g. heavy React/context usage, urgent deadline, unclear boundaries), add an explicit comment so it can be refactored later.

### Comment format

```typescript
// TODO(refactor): Extract to utils - function exceeds 10 lines
// Reason: [brief reason e.g. "tight coupling to component state"]
// Target: src/containers/users/utils/xxx.ts
function handleComplexSubmit() {
  // ... long logic
}
```

### Example – deferred extraction

```typescript
function OrderWizard() {
  // TODO(refactor): Extract to utils - exceeds 10 lines
  // Reason: Needs access to step state and setStep; consider passing as params
  // Target: src/containers/orders/utils/step-validation.ts
  const validateCurrentStep = () => {
    if (step === 1) {
      if (!formData.email) return false
      if (!formData.name) return false
      // ... 10+ more lines
    }
    if (step === 2) {
      // ...
    }
    return true
  }
  
  return <Wizard validateStep={validateCurrentStep} />
}
```

### What to write in the comment

- **What:** “Extract to utils – function exceeds 10 lines”
- **Why not now:** e.g. “Tight coupling to component state”, “Deadline – refactor in next sprint”
- **Where:** Suggested target file, e.g. `src/containers/users/utils/validation.ts`

## Extraction Patterns

### Pattern 1: Validation logic

```typescript
// Before: 15+ lines in component
const handleSubmit = (data) => {
  if (!data.x) { toast.error('...'); return }
  if (!data.y) { toast.error('...'); return }
  // ... many more checks
  submit(data)
}

// After: util
// src/containers/users/utils/validation.ts
export function validateUserForm(data: UserFormData): ValidationResult {
  if (!data.x) return { valid: false, error: '...' }
  if (!data.y) return { valid: false, error: '...' }
  return { valid: true }
}

// Component: short handler
const handleSubmit = (data) => {
  const result = validateUserForm(data)
  if (!result.valid) {
    toast.error(result.error)
    return
  }
  submit(data)
}
```

### Pattern 2: Data transformation

```typescript
// Before: long mapping in component
const tableData = items.map(item => {
  const status = item.status === 1 ? 'active' : 'inactive'
  const date = format(new Date(item.createdAt), 'dd/MM/yyyy')
  const fullName = [item.firstName, item.lastName].filter(Boolean).join(' ')
  // ... 10+ more lines
  return { ...item, status, date, fullName }
})

// After: util
// src/containers/users/utils/formatting.ts
export function mapUserToTableRow(item: User): UserTableRow {
  const status = item.status === 1 ? 'active' : 'inactive'
  const date = format(new Date(item.createdAt), 'dd/MM/yyyy')
  const fullName = [item.firstName, item.lastName].filter(Boolean).join(' ')
  // ...
  return { ...item, status, date, fullName }
}

// Component
const tableData = items.map(mapUserToTableRow)
```

### Pattern 3: Conditional / branching logic

```typescript
// Before: long switch/if in component
const getStatusColor = (status: string) => {
  if (status === 'pending') return 'yellow'
  if (status === 'approved') return 'green'
  if (status === 'rejected') return 'red'
  if (status === 'draft') return 'gray'
  // ... more cases
  return 'gray'
}

// After: util
// src/commons/helpers/status.ts
export const STATUS_COLORS: Record<string, string> = {
  pending: 'yellow',
  approved: 'green',
  rejected: 'red',
  draft: 'gray',
}

export function getStatusColor(status: string): string {
  return STATUS_COLORS[status] ?? 'gray'
}
```

### Pattern 4: Split long function into smaller utils

```typescript
// One 25-line function
function processOrder(order: Order) {
  // validation block - 8 lines
  // calculation block - 10 lines
  // formatting block - 7 lines
}

// After: multiple utils
// src/containers/orders/utils/order-helpers.ts
export function validateOrder(order: Order): ValidationResult { ... }
export function calculateOrderTotal(order: Order): number { ... }
export function formatOrderForApi(order: Order): ApiOrderPayload { ... }

// Component or higher-level util
function processOrder(order: Order) {
  const validation = validateOrder(order)
  if (!validation.valid) return
  const total = calculateOrderTotal(order)
  const payload = formatOrderForApi(order)
  return submit(payload)
}
```

## File Naming for Utils

Follow project naming:

- **File name:** kebab-case  
  - `validation.ts`, `format-date.ts`, `order-helpers.ts`
- **Function name:** camelCase  
  - `validateUserForm`, `formatDate`, `calculateOrderTotal`
- **One primary concern per file** when possible  
  - `validation.ts` – validation only  
  - `formatting.ts` – formatting only  

## Quick Checklist

Before committing a function with more than a few lines:

- [ ] Is the function **> 10 lines**? → Extract to util or add TODO(refactor) comment
- [ ] Is the util **feature-specific**? → `src/containers/{feature}/utils/`
- [ ] Is the util **shared**? → `src/commons/`
- [ ] File name **kebab-case**? (e.g. `user-validation.ts`)
- [ ] Function name **camelCase**? (e.g. `validateUserForm`)
- [ ] If not extracted: **TODO(refactor)** comment with reason and target file

## Summary

| Situation | Action |
|-----------|--------|
| Function **≤ 10 lines** | OK to keep inline (if readable) |
| Function **> 10 lines** | Extract to util |
| Cannot extract now | Add `// TODO(refactor): Extract to utils - ...` with reason and target |
| Reused in one feature | `src/containers/{feature}/utils/` |
| Reused in many features | `src/commons/` |

**➡️ See also:**
- [No else rule](../rules/no-else.md) – use early returns in extracted utils
- [Folder structure](folder-structure.md) – where to place utils
- [Naming conventions](../rules/naming-conventions.md) – naming for files and functions
