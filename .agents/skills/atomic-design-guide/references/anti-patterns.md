# Anti-Patterns

Common mistakes to avoid when organizing components.

## 1. Using Atoms When Molecule Exists

### ❌ Bad

```typescript
// Directly using atoms everywhere
import { Input } from '@/components/atoms/input'
import { Label } from '@/components/atoms/label'
import { Alert } from '@/components/atoms/alert'

function RegistrationForm() {
  return (
    <div>
      <Label>Email</Label>
      <Input type="email" {...register('email')} />
      {errors.email && <Alert>{errors.email.message}</Alert>}
      
      <Label>Password</Label>
      <Input type="password" {...register('password')} />
      {errors.password && <Alert>{errors.password.message}</Alert>}
    </div>
  )
}
```

**Problems:**
- Repeated pattern
- Inconsistent styling
- Hard to maintain
- Error-prone

### ✅ Good

```typescript
// Using molecule that encapsulates the pattern
import { FormField } from '@/components/molecules/form-field'

function RegistrationForm() {
  return (
    <div>
      <FormField
        label="Email"
        type="email"
        error={errors.email?.message}
        {...register('email')}
      />
      
      <FormField
        label="Password"
        type="password"
        error={errors.password?.message}
        {...register('password')}
      />
    </div>
  )
}
```

**Benefits:**
- Consistent pattern
- Less code
- Easier to maintain
- Single source of truth

---

## 2. Premature Abstraction

### ❌ Bad

```typescript
// Creating shared component "just in case"
// src/components/molecules/user-profile-card/index.tsx

export function UserProfileCard({ user }: Props) {
  // Complex logic for ONE feature
  // "Might be reused someday"
  return (...)
}
```

**Problems:**
- YAGNI violation
- Unclear requirements
- Harder to change
- Wrong abstraction risk

### ✅ Good

```typescript
// Keep it feature-specific until actually reused
// src/containers/users/components/user-profile-card/index.tsx

export function UserProfileCard({ user }: Props) {
  // Feature-specific logic
  // Easy to change
  return (...)
}
```

**When to move:** When another feature needs it

---

## 3. Organism Without Complexity

### ❌ Bad

```typescript
// src/components/organisms/simple-card/index.tsx
// No data fetching, no complex logic

import { Card } from '@/components/atoms/card'

export function SimpleCard({ title, content }: Props) {
  return (
    <Card>
      <h3>{title}</h3>
      <p>{content}</p>
    </Card>
  )
}
```

**Problems:**
- Mis-categorized
- Should be molecule
- Misleading structure
- Too simple for organism

### ✅ Good

```typescript
// src/components/molecules/content-card/index.tsx
import { Card } from '@/components/atoms/card'

export function ContentCard({ title, content }: Props) {
  return (
    <Card>
      <h3>{title}</h3>
      <p>{content}</p>
    </Card>
  )
}
```

---

## 4. Molecule with Data Fetching

### ❌ Bad

```typescript
// src/components/molecules/user-dropdown/index.tsx

export function UserDropdown({ onChange }: Props) {
  const { data: users } = useUsers() // Data fetching in molecule!
  
  return (
    <Select onChange={onChange}>
      {users?.map(user => (
        <SelectItem key={user.id} value={user.id}>
          {user.name}
        </SelectItem>
      ))}
    </Select>
  )
}
```

**Problems:**
- Molecule shouldn't fetch data
- Should be organism
- Mis-categorized

### ✅ Good

```typescript
// src/components/organisms/user-selector/index.tsx

export function UserSelector({ onChange }: Props) {
  const { data: users } = useUsers()
  
  return (
    <Select onChange={onChange}>
      {users?.map(user => (
        <SelectItem key={user.id} value={user.id}>
          {user.name}
        </SelectItem>
      ))}
    </Select>
  )
}
```

---

## 5. Feature Components in Shared Folders

### ❌ Bad

```typescript
// src/components/molecules/order-status-updater/index.tsx
// Only used in orders feature!

export function OrderStatusUpdater({ order }: Props) {
  // Order-specific logic
  // Only makes sense for orders
  return (...)
}
```

**Problems:**
- Not reusable
- Pollutes shared space
- Misleading location
- Hard to maintain

### ✅ Good

```typescript
// src/containers/orders/components/order-status-updater/index.tsx

export function OrderStatusUpdater({ order }: Props) {
  // Order-specific logic in order feature
  return (...)
}
```

---

## 6. Cross-Level Imports (Wrong Direction)

### ❌ Bad

```typescript
// src/components/atoms/button.tsx
import { SearchBar } from '@/components/molecules/search-bar' // ❌

export function Button() {
  // Atom importing molecule!
  return (...)
}
```

**Problems:**
- Violates hierarchy
- Circular dependency risk
- Wrong abstraction

### ✅ Good

```typescript
// src/components/molecules/search-bar/index.tsx
import { Button } from '@/components/atoms/button' // ✅

export function SearchBar() {
  // Molecule importing atom - correct direction
  return (...)
}
```

**Rule:** Only import from lower levels
- Organisms → Molecules → Atoms
- Never reverse

---

## 7. Shared Components Importing from Features

### ❌ Bad

```typescript
// src/components/organisms/data-table/index.tsx
import { UserBadge } from '@/containers/users/components/user-badge' // ❌

export function DataTable() {
  // Shared component depending on feature!
  return (...)
}
```

**Problems:**
- Tight coupling
- Not reusable
- Breaks other features

### ✅ Good

```typescript
// src/components/organisms/data-table/index.tsx
// Accept render prop for custom cells

export function DataTable({ columns, renderCell }: Props) {
  return (...)
}

// Usage in feature
<DataTable
  columns={columns}
  renderCell={(column, data) => {
    if (column.id === 'status') {
      return <UserBadge status={data.status} />
    }
  }}
/>
```

---

## 8. Over-Generalization

### ❌ Bad

```typescript
// src/components/molecules/super-card/index.tsx

export function SuperCard({
  title,
  subtitle,
  content,
  footer,
  headerAction,
  variant,
  size,
  showBorder,
  showShadow,
  onClick,
  onHover,
  leftIcon,
  rightIcon,
  badge,
  // ... 20 more props
}: SuperCardProps) {
  // Trying to handle every possible case
  return (...)
}
```

**Problems:**
- Too many props
- Hard to use
- Hard to maintain
- Trying to do everything

### ✅ Good

```typescript
// Split into specific variants

// src/components/molecules/content-card/index.tsx
export function ContentCard({ title, content }: Props) {
  return (...)
}

// src/components/molecules/stat-card/index.tsx
export function StatCard({ label, value, icon }: Props) {
  return (...)
}

// src/components/molecules/action-card/index.tsx
export function ActionCard({ title, actions }: Props) {
  return (...)
}
```

---

## 9. Creating Barrel Exports

### ❌ Bad

```typescript
// src/components/atoms/index.ts
export * from './button'
export * from './input'
export * from './label'
// ... exporting everything

// Usage
import { Button, Input, Label } from '@/components/atoms'
```

**Problems:**
- Circular dependency risk
- Slow imports
- Bundle size issues
- Hard to tree-shake

### ✅ Good

```typescript
// Direct imports
import { Button } from '@/components/atoms/button'
import { Input } from '@/components/atoms/input'
import { Label } from '@/components/atoms/label'
```

---

## 10. Ignoring Component Size

### ❌ Bad

```typescript
// src/components/molecules/mega-form/index.tsx
// 2000+ lines in one file

export function MegaForm() {
  // Everything in one component
  // All validation
  // All sub-forms
  // All logic
  return (...)
}
```

**Problems:**
- Too large
- Hard to test
- Hard to maintain
- Should be split

### ✅ Good

```typescript
// src/components/organisms/user-registration/
├── index.tsx (main orchestration)
├── components/
│   ├── personal-info-section.tsx
│   ├── account-info-section.tsx
│   └── preferences-section.tsx
└── hooks/
    └── use-registration-form.ts
```

---

## 11. No Tests for Molecules

### ❌ Bad

```typescript
// src/components/molecules/search-bar/index.tsx
// No tests folder
```

**Problems:**
- Untested reusable code
- Breaks easily
- No confidence in changes

### ✅ Good

```typescript
// src/components/molecules/search-bar/
├── index.tsx
├── search-bar.stories.tsx
└── __tests__/
    └── search-bar.test.tsx
```

---

## 12. No Storybook for Molecules

### ❌ Bad

```typescript
// src/components/molecules/data-table/
├── index.tsx
└── __tests__/
    └── data-table.test.tsx
// Missing .stories.tsx
```

**Problems:**
- Hard to showcase
- No visual documentation
- Developers don't know it exists

### ✅ Good

```typescript
// src/components/molecules/data-table/
├── index.tsx
├── data-table.stories.tsx  // ✅
└── __tests__/
    └── data-table.test.tsx
```

---

## 13. Multiple Responsibilities

### ❌ Bad

```typescript
// Molecule doing too much
export function UserCardWithActions({ user }: Props) {
  const deleteUser = useDeleteUser()
  const updateUser = useUpdateUser()
  const navigate = useNavigate()
  
  // Displaying user
  // Handling deletion
  // Handling updates
  // Navigation
  
  return (...)
}
```

**Problems:**
- Too many responsibilities
- Hard to reuse
- Tight coupling

### ✅ Good

```typescript
// Split responsibilities

// Molecule: just display
import { Card } from '@/components/atoms/card'
import { Avatar } from '@/components/atoms/avatar'

export function UserCard({ user, actions }: Props) {
  return (
    <Card>
      <Avatar src={user.avatar} />
      <h3>{user.name}</h3>
      {actions}
    </Card>
  )
}

// Feature component: handle actions
export function UserCardWithActions({ user }: Props) {
  const deleteUser = useDeleteUser()
  // ... action handlers
  
  return (
    <UserCard
      user={user}
      actions={<UserActions onDelete={handleDelete} />}
    />
  )
}
```

---

## 14. Not Using Composition

### ❌ Bad

```typescript
// Trying to handle all variants with props
export function Card({ 
  hasHeader, 
  hasFooter, 
  headerContent,
  footerContent,
  bodyContent 
}: Props) {
  return (
    <div>
      {hasHeader && <div>{headerContent}</div>}
      <div>{bodyContent}</div>
      {hasFooter && <div>{footerContent}</div>}
    </div>
  )
}
```

**Problems:**
- Inflexible
- Many conditional props
- Hard to extend

### ✅ Good

```typescript
// Use composition pattern
export function Card({ children }: Props) {
  return <div className="card">{children}</div>
}

export function CardHeader({ children }: Props) {
  return <div className="card-header">{children}</div>
}

export function CardBody({ children }: Props) {
  return <div className="card-body">{children}</div>
}

export function CardFooter({ children }: Props) {
  return <div className="card-footer">{children}</div>
}

// Usage
<Card>
  <CardHeader>Title</CardHeader>
  <CardBody>Content</CardBody>
  <CardFooter>Actions</CardFooter>
</Card>
```

---

## Summary of Key Anti-Patterns

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| Using atoms when molecule exists | Inconsistent, repetitive | Use the molecule |
| Premature abstraction | Unclear requirements | Keep feature-specific |
| Organism without complexity | Mis-categorized | Use molecule |
| Molecule with data fetching | Wrong level | Promote to organism |
| Feature in shared | Not reusable | Move to feature folder |
| Wrong import direction | Violates hierarchy | Import from lower levels |
| Shared imports feature | Tight coupling | Use composition/props |
| Over-generalization | Too complex | Split into variants |
| Barrel exports | Performance issues | Direct imports |
| No tests/stories | Unmaintainable | Add proper documentation |

## Prevention Checklist

Before creating/moving a component:

- [ ] Is it truly reusable or just used here?
- [ ] Am I importing in the right direction?
- [ ] Does it have the right level of complexity?
- [ ] Am I using existing molecules instead of atoms?
- [ ] Is it in the correct folder for its purpose?
- [ ] Does it have tests (if molecule/organism)?
- [ ] Does it have Storybook (if molecule/organism)?
- [ ] Is it properly composed vs over-configured?
