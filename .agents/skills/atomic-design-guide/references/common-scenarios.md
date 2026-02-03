# Common Scenarios

Real-world examples of component placement decisions.

## Scenario 1: Search Bar Component

**Requirement:** Create a search input with an icon and clear button.

### Analysis

**Components involved:**
- Input (atom)
- Icon (atom)  
- Button (atom)

**Functionality:**
- Search text input
- Clear button to reset
- Search icon for visual cue
- onChange callback

**Business logic:** None (just UI pattern)

**Data fetching:** None

**Reusability:** Used in multiple pages (users, products, orders)

### Decision: `molecules/search-bar/`

**Reasoning:**
- ✅ Combines multiple atoms
- ✅ Reusable pattern
- ✅ No data fetching
- ✅ Used across features

### Implementation

```typescript
// src/components/molecules/search-bar/index.tsx
import { Input } from '@/components/atoms/input'
import { Button } from '@/components/atoms/button'
import { Search, X } from 'lucide-react'

export function SearchBar({ value, onChange, placeholder }: Props) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-3 h-4 w-4" />
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="pl-9 pr-9"
      />
      {value && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange('')}
          className="absolute right-1 top-1"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
```

---

## Scenario 2: User Selector Dropdown

**Requirement:** Create a dropdown that fetches users from API and allows selection.

### Analysis

**Components involved:**
- Select (atom)
- Multiple sub-components

**Functionality:**
- Fetch users from API
- Search/filter users
- Select single/multiple users
- Display avatar + name

**Business logic:** Data fetching, search

**Data fetching:** Yes (useUsers hook)

**Reusability:** Used in teams, projects, task assignment

### Decision: `organisms/user-selector/`

**Reasoning:**
- ✅ Fetches own data
- ✅ Complex internal logic
- ✅ Reusable across features
- ✅ Self-contained

### Implementation

```typescript
// src/components/organisms/user-selector/index.tsx
import { Select } from '@/components/atoms/select'
import { Avatar } from '@/components/atoms/avatar'
import { useUsers } from '@/apis/user/hooks/use-users'

export function UserSelector({ value, onChange, multiple }: Props) {
  const { data: users, isLoading } = useUsers()
  
  return (
    <Select value={value} onValueChange={onChange} multiple={multiple}>
      {isLoading ? (
        <SelectItem disabled>Loading...</SelectItem>
      ) : (
        users?.map(user => (
          <SelectItem key={user.id} value={user.id}>
            <div className="flex items-center gap-2">
              <Avatar src={user.avatar} size="sm" />
              <span>{user.name}</span>
            </div>
          </SelectItem>
        ))
      )}
    </Select>
  )
}
```

---

## Scenario 3: User Profile Form

**Requirement:** Create a form to edit user profile information.

### Analysis

**Components involved:**
- Form molecules (FormField, etc.)
- Submit button
- User-specific fields

**Functionality:**
- Edit user data
- Validation
- Submit to API
- Success/error handling

**Business logic:** User-specific validation, submission

**Data fetching:** Receives user data as props

**Reusability:** Only used in user management module

### Decision: `containers/users/components/user-form/`

**Reasoning:**
- ✅ Feature-specific (only users)
- ✅ Not reusable elsewhere
- ✅ User-specific logic
- ❌ Not a generic form

### Implementation

```typescript
// src/containers/users/components/user-form/index.tsx
import { FormField } from '@/components/molecules/form-field'
import { Button } from '@/components/atoms/button'
import { useUpdateUser } from '@/apis/user/hooks/use-update-user'

export function UserForm({ user, onSuccess }: Props) {
  const updateUser = useUpdateUser()
  
  // User-specific form logic
  const onSubmit = (data) => {
    updateUser.mutate({ id: user.id, data }, {
      onSuccess: () => onSuccess()
    })
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField label="Name" {...register('name')} />
      <FormField label="Email" {...register('email')} />
      <FormField label="Role" {...register('role')} />
      {/* User-specific fields */}
      <Button type="submit">Save User</Button>
    </form>
  )
}
```

---

## Scenario 4: Product Card

**Requirement:** Display product with image, name, price, and "Add to Cart" button.

### Analysis (Two possible interpretations)

#### Option A: E-commerce Product Card

**Used in:**
- Product catalog
- Search results
- Recommendations
- Related products

**Reusability:** High (used across multiple customer-facing features)

**Decision:** `molecules/product-card/`

**Reasoning:**
- ✅ Used in multiple features
- ✅ Consistent design needed
- ✅ No data fetching (receives props)
- ✅ Reusable pattern

```typescript
// src/components/molecules/product-card/index.tsx
export function ProductCard({ product, onAddToCart }: Props) {
  return (
    <Card>
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="price">{product.price}</p>
      <Button onClick={() => onAddToCart(product)}>
        Add to Cart
      </Button>
    </Card>
  )
}
```

#### Option B: Admin Product Management Card

**Used in:**
- Product management admin only
- Inventory management

**Reusability:** Low (only in product admin)

**Decision:** `containers/products/components/product-card/`

**Reasoning:**
- ✅ Feature-specific (admin only)
- ✅ Different requirements than customer-facing
- ✅ Admin-specific actions

---

## Scenario 5: Date Range Picker

**Requirement:** Component to select start and end dates.

### Analysis

**Components involved:**
- Calendar (molecule)
- Popover (atom)
- Input (atom)

**Functionality:**
- Select date range
- Validation (end >= start)
- Formatting
- Preset ranges

**Business logic:** Date validation, formatting

**Data fetching:** None

**Reusability:** Used everywhere (reports, filters, forms)

### Decision: `molecules/date-range-picker/`

**Reasoning:**
- ✅ Combines multiple atoms/molecules
- ✅ Reusable pattern
- ✅ No data fetching
- ✅ Used across entire app

### Implementation

```typescript
// src/components/molecules/date-range-picker/index.tsx
import { Calendar } from '@/components/molecules/calendar'
import { Popover } from '@/components/atoms/popover'
import { Button } from '@/components/atoms/button'

export function DateRangePicker({ value, onChange }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          {formatDateRange(value)}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Calendar
          mode="range"
          selected={value}
          onSelect={onChange}
        />
      </PopoverContent>
    </Popover>
  )
}
```

---

## Scenario 6: Data Table with Filters

**Requirement:** Table with sorting, filtering, pagination, and search.

### Analysis

**Components involved:**
- Table (atom)
- SearchBar (molecule)
- Pagination (molecule)
- Multiple controls

**Functionality:**
- Display data
- Sort columns
- Filter by criteria
- Paginate results
- Search
- Column visibility

**Business logic:** Sorting, filtering, pagination logic

**Data fetching:** Receives data as props (parent fetches)

**Reusability:** Used for users, products, orders tables

### Decision: `organisms/data-table/`

**Reasoning:**
- ✅ Very complex component
- ✅ Reusable across features
- ✅ Significant internal logic
- ✅ Generic enough for multiple use cases

### Implementation

```typescript
// src/components/organisms/data-table/index.tsx
import { Table } from '@/components/atoms/table'
import { SearchBar } from '@/components/molecules/search-bar'
import { Pagination } from '@/components/molecules/pagination'

export function DataTable<TData>({ 
  data, 
  columns, 
  onSort,
  onFilter,
  pagination 
}: Props<TData>) {
  // Complex table logic
  return (
    <div>
      <SearchBar {...searchProps} />
      <Table>
        {/* Table implementation */}
      </Table>
      <Pagination {...paginationProps} />
    </div>
  )
}
```

---

## Scenario 7: Order Status Badge

**Requirement:** Badge showing order status with appropriate color.

### Analysis (Two interpretations)

#### Option A: Generic Status Badge

**Used in:** Orders, shipments, tasks, tickets

**Reusability:** High (status concept is universal)

**Decision:** `molecules/status-badge/`

```typescript
// src/components/molecules/status-badge/index.tsx
export function StatusBadge({ status, variant }: Props) {
  return (
    <Badge variant={getVariant(status)}>
      {status}
    </Badge>
  )
}
```

#### Option B: Order-Specific Badge

**Used in:** Only order management

**Reusability:** Low (order-specific logic/colors)

**Decision:** `containers/orders/components/order-status-badge/`

```typescript
// src/containers/orders/components/order-status-badge/index.tsx
export function OrderStatusBadge({ order }: Props) {
  // Order-specific status logic
  const variant = getOrderStatusVariant(order.status)
  const icon = getOrderStatusIcon(order)
  
  return (
    <Badge variant={variant}>
      {icon}
      {order.status}
    </Badge>
  )
}
```

---

## Scenario 8: Notification Panel

**Requirement:** Panel that shows recent notifications with real-time updates.

### Analysis

**Components involved:**
- Panel/Sheet (atom)
- NotificationItem (molecule)
- Badge for unread count

**Functionality:**
- Fetch notifications
- Real-time updates (WebSocket)
- Mark as read
- Clear all
- Load more

**Business logic:** Notification management, real-time sync

**Data fetching:** Yes (useNotifications hook)

**Reusability:** Used in app header across all pages

### Decision: `organisms/notification-panel/`

**Reasoning:**
- ✅ Fetches own data
- ✅ Complex with real-time logic
- ✅ Reusable (same everywhere)
- ✅ Self-contained

### Implementation

```typescript
// src/components/organisms/notification-panel/index.tsx
import { Sheet } from '@/components/atoms/sheet'
import { useNotifications } from '@/apis/notification/hooks/use-notifications'

export function NotificationPanel({ open, onOpenChange }: Props) {
  const { data: notifications } = useNotifications()
  const markAsRead = useMarkNotificationRead()
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        {notifications?.map(notif => (
          <NotificationItem
            key={notif.id}
            notification={notif}
            onRead={() => markAsRead.mutate(notif.id)}
          />
        ))}
      </SheetContent>
    </Sheet>
  )
}
```

---

## Summary Pattern

| Scenario | Decision | Key Factor |
|----------|----------|------------|
| Search Bar | molecules/ | Reusable UI pattern |
| User Selector | organisms/ | Data fetching + reusable |
| User Form | feature/components/ | Feature-specific |
| Product Card (e-commerce) | molecules/ | Reusable across features |
| Product Card (admin) | feature/components/ | Admin-specific |
| Date Range Picker | molecules/ | Reusable pattern |
| Data Table | organisms/ | Complex + reusable |
| Status Badge (generic) | molecules/ | Reusable concept |
| Status Badge (specific) | feature/components/ | Feature-specific |
| Notification Panel | organisms/ | Data fetching + complex |

## Key Takeaways

1. **Reusability is the primary factor** for shared vs feature-specific
2. **Data fetching usually means organism** (if reusable)
3. **Feature-specific logic means feature folder** (even if complex)
4. **When in doubt, start feature-specific** and refactor when reused
5. **Don't prematurely optimize for reuse** - YAGNI principle
