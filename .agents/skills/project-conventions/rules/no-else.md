# No Else Rule

**CRITICAL PROJECT RULE:** Never use `else` statements in this project.

## No Else Statement Rule

**Rule:** Never use `else` statements. Use early returns instead.

### Why?

✅ **Reduces nesting**: Flatter code is easier to read  
✅ **Clearer intent**: Early returns make conditions explicit  
✅ **Easier testing**: Each path is independent  
✅ **Better maintenance**: Less cognitive load  

### Pattern: Early Return

#### ❌ Bad - Using else

```typescript
function getUserStatus(user: User) {
  if (user.isActive) {
    return 'active'
  } else {
    if (user.isPending) {
      return 'pending'
    } else {
      return 'inactive'
    }
  }
}

function processOrder(order: Order) {
  if (order.status === 'paid') {
    // ... many lines of code
    return result
  } else {
    // ... more lines
    return error
  }
}
```

#### ✅ Good - Early return

```typescript
function getUserStatus(user: User) {
  if (user.isActive) {
    return 'active'
  }
  
  if (user.isPending) {
    return 'pending'
  }
  
  return 'inactive'
}

function processOrder(order: Order) {
  if (order.status !== 'paid') {
    return error
  }
  
  // ... continue with main logic
  return result
}
```

## Guard Clauses Pattern

Use guard clauses at the beginning of functions to handle edge cases.

### ❌ Bad - Nested conditions

```typescript
function calculateDiscount(user: User, amount: number) {
  if (user) {
    if (user.isPremium) {
      if (amount > 100) {
        return amount * 0.2
      } else {
        return amount * 0.1
      }
    } else {
      return 0
    }
  } else {
    return 0
  }
}
```

### ✅ Good - Guard clauses with early return

```typescript
function calculateDiscount(user: User | null, amount: number) {
  // Guard clauses first
  if (!user) {
    return 0
  }
  
  if (!user.isPremium) {
    return 0
  }
  
  if (amount > 100) {
    return amount * 0.2
  }
  
  return amount * 0.1
}
```

## Extract to Utility Functions

When logic becomes complex, extract to utility functions.

### Location Strategy

#### Container Utils (Feature-Specific)
```
src/containers/{feature}/utils/
├── validation.ts
├── formatting.ts
└── business-logic.ts
```

Use when:
- Logic specific to one feature
- Business rules for that domain
- Not reusable across features

#### Project Utils (Shared)
```
src/commons/
├── validates/
│   └── user.ts
├── formatters/
│   └── currency.ts
└── helpers/
    └── array.ts
```

Use when:
- Reusable across multiple features
- General-purpose utilities
- Common validations/formatters

### Example: Extract Complex Logic

#### ❌ Bad - Complex nested logic

```typescript
function UserFormPage() {
  const handleSubmit = (data: UserFormData) => {
    if (data.email) {
      if (data.email.includes('@')) {
        if (data.age) {
          if (data.age >= 18) {
            // ... process
          } else {
            toast.error('Must be 18+')
          }
        } else {
          toast.error('Age required')
        }
      } else {
        toast.error('Invalid email')
      }
    } else {
      toast.error('Email required')
    }
  }
}
```

#### ✅ Good - Extract to utils with early returns

```typescript
// src/containers/users/utils/validation.ts
export function validateUserForm(data: UserFormData): { valid: boolean; error?: string } {
  if (!data.email) {
    return { valid: false, error: 'Email required' }
  }
  
  if (!data.email.includes('@')) {
    return { valid: false, error: 'Invalid email' }
  }
  
  if (!data.age) {
    return { valid: false, error: 'Age required' }
  }
  
  if (data.age < 18) {
    return { valid: false, error: 'Must be 18+' }
  }
  
  return { valid: true }
}

// src/containers/users/user-form-page.tsx
function UserFormPage() {
  const handleSubmit = (data: UserFormData) => {
    const validation = validateUserForm(data)
    
    if (!validation.valid) {
      toast.error(validation.error)
      return
    }
    
    // Continue with valid data
    processUserData(data)
  }
}
```

## Ternary for Simple Assignment Only

Ternary operators are acceptable **only** for simple value assignment.

### ✅ Acceptable ternary usage

```typescript
// Simple value assignment
const status = user.isActive ? 'active' : 'inactive'
const color = isPremium ? 'gold' : 'silver'

// JSX className
<div className={isOpen ? 'visible' : 'hidden'}>

// Simple props
<Button variant={isPrimary ? 'primary' : 'secondary'} />
```

### ❌ Avoid ternary for complex logic

```typescript
// ❌ Bad - nested ternary
const status = user.isActive 
  ? user.isPremium 
    ? 'premium-active' 
    : 'active'
  : 'inactive'

// ✅ Good - function with early returns
function getUserStatus(user: User): string {
  if (!user.isActive) {
    return 'inactive'
  }
  
  if (user.isPremium) {
    return 'premium-active'
  }
  
  return 'active'
}

const status = getUserStatus(user)
```

## Switch Statements

When you have multiple conditions based on a value, use switch statements or lookup objects instead of if-else chains.

### Pattern 1: Switch Statement

```typescript
// ✅ Good - switch with early return in each case
function getStatusColor(status: OrderStatus): string {
  switch (status) {
    case 'pending':
      return 'yellow'
    case 'processing':
      return 'blue'
    case 'completed':
      return 'green'
    case 'cancelled':
      return 'red'
    default:
      return 'gray'
  }
}
```

### Pattern 2: Lookup Object (Preferred)

```typescript
// ✅ Better - lookup object
const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'yellow',
  processing: 'blue',
  completed: 'green',
  cancelled: 'red',
}

function getStatusColor(status: OrderStatus): string {
  return STATUS_COLORS[status] ?? 'gray'
}
```

## Complex Condition Handling

### Extract Boolean Conditions to Variables

```typescript
// ❌ Bad - complex inline condition
if (user.age >= 18 && user.isVerified && !user.isBanned && user.hasAcceptedTerms) {
  // ...
}

// ✅ Good - named boolean variables
const isAdult = user.age >= 18
const canAccess = user.isVerified && !user.isBanned && user.hasAcceptedTerms

if (isAdult && canAccess) {
  // ...
}
```

### Extract to Predicate Functions

```typescript
// ✅ Better - predicate functions
function isEligibleUser(user: User): boolean {
  if (user.age < 18) {
    return false
  }
  
  if (!user.isVerified) {
    return false
  }
  
  if (user.isBanned) {
    return false
  }
  
  if (!user.hasAcceptedTerms) {
    return false
  }
  
  return true
}

// Usage
if (isEligibleUser(user)) {
  // ...
}
```

## Array Filtering Patterns

### ❌ Bad - Using if-else in loops

```typescript
function getActiveUsers(users: User[]): User[] {
  const result: User[] = []
  
  for (const user of users) {
    if (user.isActive) {
      result.push(user)
    } else {
      // Skip inactive users
    }
  }
  
  return result
}
```

### ✅ Good - Use array methods

```typescript
function getActiveUsers(users: User[]): User[] {
  return users.filter(user => user.isActive)
}

// Or with early return in predicate
function isActiveUser(user: User): boolean {
  if (!user.isActive) {
    return false
  }
  
  if (user.deletedAt) {
    return false
  }
  
  return true
}

function getActiveUsers(users: User[]): User[] {
  return users.filter(isActiveUser)
}
```

## React Component Patterns

### Early Return in Components

```typescript
// ✅ Good - early returns for loading/error states
function UserProfile({ userId }: { userId: string }) {
  const { data: user, isLoading, error } = useUserById(userId)
  
  // Guard clauses first
  if (isLoading) {
    return <Spinner />
  }
  
  if (error) {
    return <ErrorMessage error={error} />
  }
  
  if (!user) {
    return <NotFound />
  }
  
  // Main render with valid data
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )
}
```

### Conditional Rendering

```typescript
// ❌ Bad - nested ternary in JSX
return (
  <div>
    {user ? (
      user.isPremium ? (
        <PremiumBadge />
      ) : (
        <StandardBadge />
      )
    ) : (
      <GuestBadge />
    )}
  </div>
)

// ✅ Good - extract to function
function getUserBadge(user: User | null) {
  if (!user) {
    return <GuestBadge />
  }
  
  if (user.isPremium) {
    return <PremiumBadge />
  }
  
  return <StandardBadge />
}

return <div>{getUserBadge(user)}</div>

// ✅ Also good - multiple returns in component
function UserBadge({ user }: { user: User | null }) {
  if (!user) {
    return <GuestBadge />
  }
  
  if (user.isPremium) {
    return <PremiumBadge />
  }
  
  return <StandardBadge />
}

return <div><UserBadge user={user} /></div>
```

## Utility Function Organization

### Container Utils Example

```typescript
// src/containers/users/utils/validation.ts
export function validateEmail(email: string): boolean {
  if (!email) {
    return false
  }
  
  if (!email.includes('@')) {
    return false
  }
  
  return true
}

export function validateAge(age: number): boolean {
  if (!age) {
    return false
  }
  
  if (age < 18) {
    return false
  }
  
  return true
}

// src/containers/users/utils/formatting.ts
export function formatUserDisplayName(user: User): string {
  if (user.displayName) {
    return user.displayName
  }
  
  if (user.name) {
    return user.name
  }
  
  return user.email
}
```

### Project Utils Example

```typescript
// src/commons/validates/common.ts
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) {
    return true
  }
  
  if (typeof value === 'string' && value.trim() === '') {
    return true
  }
  
  if (Array.isArray(value) && value.length === 0) {
    return true
  }
  
  return false
}

// src/commons/formatters/string.ts
export function capitalize(str: string): string {
  if (!str) {
    return ''
  }
  
  return str.charAt(0).toUpperCase() + str.slice(1)
}
```

## Exception: When Else is Actually OK

The only acceptable use of `else` is with `if-else if-else` chains that are better served by switch statements. But even then, prefer switch or lookup objects.

```typescript
// ⚠️ Acceptable but not ideal
function getDay(num: number): string {
  if (num === 0) return 'Sunday'
  if (num === 1) return 'Monday'
  if (num === 2) return 'Tuesday'
  if (num === 3) return 'Wednesday'
  if (num === 4) return 'Thursday'
  if (num === 5) return 'Friday'
  if (num === 6) return 'Saturday'
  return 'Invalid'
}

// ✅ Better - lookup object
const DAYS: Record<number, string> = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
}

function getDay(num: number): string {
  return DAYS[num] ?? 'Invalid'
}
```

## Summary

### Key Rules

1. **Never use `else`** - Use early returns instead
2. **Guard clauses first** - Handle edge cases at the top
3. **Extract complex logic** - Move to utils when needed
4. **Flat is better** - Reduce nesting depth
5. **Ternary for simple values only** - Not for control flow
6. **Use array methods** - filter, map, reduce over loops with if-else
7. **Switch or lookup** - For multiple value-based conditions

### Decision Tree: Where to Put Utils?

```
Is the logic specific to one feature?
├─ YES → src/containers/{feature}/utils/
└─ NO → Is it reusable across features?
        ├─ YES → src/commons/
        └─ NO → Keep inline with early returns
```

### Quick Checklist

Before committing code, check:

- [ ] No `else` statements used
- [ ] Guard clauses at function start
- [ ] Complex conditions extracted to functions
- [ ] Boolean expressions have meaningful names
- [ ] Ternary only for simple assignments
- [ ] Switch/lookup for multiple conditions
- [ ] Utils properly organized (container vs project)

**➡️ See also:**
- [Folder Structure](folder-structure.md) - Where to place utils
- [Naming Conventions](naming-conventions.md) - How to name utility functions
