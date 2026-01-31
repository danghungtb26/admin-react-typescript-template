---
name: frontend-design-patterns
description: Guide for designing and decomposing UI screens into components with proper data flow and API integration following project conventions. Use when designing new features, breaking down complex UIs, planning component structure, or connecting components to APIs. All examples follow @project-conventions with form/logic separation, atomic design, and API cores/hooks structure.
keywords: screen-design, list-screen, form-screen, filter, table, data-flow, dashboard, wizard, component-decomposition, tabbed-form, detail-screen, url-sync
---

# Frontend Design Patterns

## Overview

This skill provides systematic approaches for analyzing UI designs and breaking them down into well-structured, maintainable React components with proper data flow and API integration.

## When to Use This Skill

Use this skill when:
- Designing a new feature/screen from scratch
- Breaking down a complex UI design into components
- Planning component structure and data flow
- Deciding how to handle filters, tables, forms
- Figuring out state management strategy
- Connecting components to APIs

## Screen Type Patterns

Different screens need different approaches:

### 1. List/Table Screen
**For:** Managing collections (users, orders, products)
- Filters + Table + Pagination
- Server-side sorting/filtering

### 2. Form Screen
**For:** Creating or editing records
- Single form with validation
- Load data for edit mode

### 3. Multi-Step Form (Wizard)
**For:** Complex forms split into steps
- Progress indicator
- Step-by-step validation

### 4. Tabbed Form
**For:** Settings, profiles with multiple sections
- Independent forms per tab
- Tab state in URL

### 5. Detail/View Screen
**For:** Viewing record details
- Read-only display
- Organized into sections

### 6. Dashboard
**For:** Overview/metrics/analytics
- Metric cards + Charts + Tables
- Date range filtering

**➡️ See [Screen Patterns](references/screen-patterns.md) for complete examples of each type**

## Design Analysis Framework

### Step 1: Identify Screen Type

Choose the pattern that fits your use case:
- Managing a list? → **List/Table Screen**
- Creating/editing? → **Form Screen**
- Complex multi-step entry? → **Multi-Step Form**
- Multiple independent sections? → **Tabbed Form**
- Just viewing info? → **Detail Screen**
- Overview with metrics? → **Dashboard**

### Step 2: Break Down Components

For each major section, determine:

1. **What data does it need?**
   - Props from parent?
   - API data?
   - Local state?

2. **What actions can users perform?**
   - Button clicks
   - Form submissions
   - Filters/sorting

3. **How does it communicate?**
   - Callbacks to parent
   - URL parameters
   - Shared context

## Filter Component Design

### Key Questions

When designing filters, determine:

1. **Input Types**
   - Text search → `<input type="text">`
   - Status/Category → Static `<select>` or API-driven
   - Date → Single date, date range, datetime, datetime range
   - Number → Single input or range (min/max)
   - Multi-select → Checkboxes, multi-select dropdown

2. **Data Source**
   - Static options → Define in component
   - API-driven → Fetch with React Query

3. **Layout**
   - Grid layout (responsive columns)
   - Flex layout (inline)
   - Collapsible advanced filters

4. **Default Values**
   - Empty (all filters cleared)
   - Preset (default to specific values)
   - From URL (read from search params)

5. **Validation**
   - Required fields?
   - Range validation (min < max)?
   - Format validation?

6. **Actions**
   - Search button
   - Reset/Clear button
   - Export button

### Quick Decision Guide

```typescript
// Text input - for search/free text
<input type="text" value={filters.search} onChange={...} />

// Static select - for predefined options (status, type, etc.)
<select value={filters.status}>
  <option value="">All</option>
  <option value="active">Active</option>
  <option value="inactive">Inactive</option>
</select>

// API-driven select - for dynamic options (users, departments, etc.)
const { data: departments } = useQuery({ queryKey: ['departments'], queryFn: fetchDepartments })
<select value={filters.department}>
  {departments?.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
</select>

// Date range - for filtering by date
<DateRangePicker value={filters.dateRange} onChange={...} />

// Number range - for price, quantity, etc.
<input type="number" placeholder="Min" value={filters.min} />
<input type="number" placeholder="Max" value={filters.max} />
```

**➡️ See [Filter Patterns](references/filter-patterns.md) for complete examples**

## Table Component Design

### Key Questions

When designing tables, determine:

1. **Columns**
   - What columns to display?
   - Which are sortable?
   - Any special formatting (badges, avatars)?

2. **Features**
   - Sorting (client or server-side)
   - Pagination (client or server-side)
   - Row selection (checkboxes)
   - Row actions (edit, delete, view)

3. **Performance**
   - Virtual scrolling needed?
   - How many rows typically?

### Quick Decision Guide

```typescript
// Simple column
{ accessorKey: 'name', header: 'Name' }

// Badge column
{ 
  accessorKey: 'status',
  cell: ({ getValue }) => <Badge>{getValue()}</Badge>
}

// Actions column
{
  id: 'actions',
  cell: ({ row }) => (
    <div className="flex gap-2">
      <button onClick={() => handleEdit(row.original)}>Edit</button>
      <button onClick={() => handleDelete(row.original.id)}>Delete</button>
    </div>
  )
}

// Server-side sorting & pagination
const { data } = useQuery({
  queryKey: ['users', filters, pagination, sorting],
  queryFn: () => fetchUsers({ ...filters, ...pagination, ...sorting })
})
```

**➡️ See [Table Patterns](references/table-patterns.md) for complete examples**

## Data Flow Strategies

Choose the right pattern for your use case:

### Pattern 1: Local State + Props
**Best for:** Simple parent-child communication
```typescript
function Page() {
  const [filters, setFilters] = useState({})
  return (
    <>
      <Filters filters={filters} onChange={setFilters} />
      <Table filters={filters} />
    </>
  )
}
```

### Pattern 2: URL as Source of Truth
**Best for:** Shareable URLs, browser back/forward support
```typescript
const { search } = useSearch()
const filters = { search: search.q, status: search.status }
// Update URL when filters change
navigate({ search: newFilters })
```

### Pattern 3: React Query
**Best for:** Server-driven data with caching
```typescript
const { data } = useQuery({
  queryKey: ['users', filters],
  queryFn: () => fetchUsers(filters)
})
```

### Pattern 4: Context
**Best for:** Deep component trees, shared state
```typescript
const FiltersContext = createContext()
// Provider in parent, useContext in children
```

### Pattern 5: Context + Reducer
**Best for:** Complex state with multiple actions
```typescript
const [state, dispatch] = useReducer(reducer, initialState)
<Context.Provider value={{ state, dispatch }}>
```

**➡️ See [Data Flow](references/data-flow.md) for detailed patterns**

## URL Sync Pattern

For shareable state (filters, pagination), sync with URL:

```typescript
// Read from URL
const { search } = useSearch()
const filters = {
  search: search.q,
  status: search.status,
}

// Write to URL
const updateFilters = (newFilters) => {
  navigate({
    search: {
      q: newFilters.search || undefined,
      status: newFilters.status || undefined,
    }
  })
}
```

## Complete Examples

**➡️ See [Real Examples](references/real-examples.md) for:**
- User Management Screen (complete implementation)
- Product List with Advanced Filters
- Order Dashboard with Metrics

## Quick Reference

### Screen Types
| Use Case | Pattern | Reference |
|----------|---------|-----------|
| Manage collection | List/Table Screen | [Screen Patterns](references/screen-patterns.md) |
| Create/edit record | Form Screen | [Screen Patterns](references/screen-patterns.md) |
| Complex data entry | Multi-step Form | [Screen Patterns](references/screen-patterns.md) |
| Multiple sections | Tabbed Form | [Screen Patterns](references/screen-patterns.md) |
| View details | Detail Screen | [Screen Patterns](references/screen-patterns.md) |
| Overview/metrics | Dashboard | [Screen Patterns](references/screen-patterns.md) |

### Components
| Need | Solution | Reference |
|------|----------|-----------|
| Text search input | `<input type="text">` | [Filter Patterns](references/filter-patterns.md) |
| Static dropdown | `<select>` with options array | [Filter Patterns](references/filter-patterns.md) |
| API-driven dropdown | `useQuery` + `<select>` | [Filter Patterns](references/filter-patterns.md) |
| Date picker | `<DatePicker>` or `<DateRangePicker>` | [Filter Patterns](references/filter-patterns.md) |
| Table with sorting | TanStack Table + server-side sorting | [Table Patterns](references/table-patterns.md) |
| Table with pagination | TanStack Table + server-side pagination | [Table Patterns](references/table-patterns.md) |
| Row selection | `enableRowSelection` + checkbox column | [Table Patterns](references/table-patterns.md) |
| Shareable filters | URL sync pattern | [Data Flow](references/data-flow.md) |
| Complex state | Context + Reducer | [Data Flow](references/data-flow.md) |

## Best Practices

1. **Follow project conventions** - **IMPORTANT**: Always follow [@project-conventions](../.agents/skills/project-conventions/SKILL.md)
   - Separate form display from submit logic (form in child, submit in parent)
   - API structure: cores/ for functions, hooks/ for React Query
   - File naming: kebab-case (user-form.tsx, create-user.ts)
   - Import components from atoms/molecules folders
   - Feature components in containers/{feature}/components/

2. **Break down by functionality first** - Identify major sections before coding
3. **Identify data sources early** - Know what's static vs API-driven
4. **Plan state management** - Choose the right pattern for your needs
5. **Design component APIs** - Think about props/callbacks before implementing
6. **Consider URL sync** - For filters, pagination, sorting
7. **Handle loading/error states** - Always show loading and error UI
8. **Keep components focused** - Single responsibility principle
9. **Optimize re-renders** - Use React.memo, useMemo, useCallback when needed

## Common Patterns Summary

### Basic Filter + Table Page
```typescript
function Page() {
  const [filters, setFilters] = useState({})
  const { data } = useQuery({
    queryKey: ['items', filters],
    queryFn: () => fetchItems(filters)
  })
  
  return (
    <>
      <Filters filters={filters} onChange={setFilters} />
      <Table data={data} />
    </>
  )
}
```

### With URL Sync
```typescript
function Page() {
  const navigate = useNavigate()
  const { search } = useSearch()
  const filters = { ...search }
  
  const updateFilters = (newFilters) => {
    navigate({ search: newFilters })
  }
  
  // Query automatically refetches when URL changes
  const { data } = useQuery({
    queryKey: ['items', filters],
    queryFn: () => fetchItems(filters)
  })
  
  return (
    <>
      <Filters filters={filters} onChange={updateFilters} />
      <Table data={data} />
    </>
  )
}
```

## Resources

### Core Guides
- **[Architecture Patterns](references/architecture-patterns.md)** - ⭐ Form/Logic separation, API structure, file organization
- [Screen Patterns](references/screen-patterns.md) - 6 common screen types overview
- [Filter Patterns](references/filter-patterns.md) - All input types and layouts
- [Table Patterns](references/table-patterns.md) - Sorting, pagination, selection
- [Data Flow](references/data-flow.md) - State management strategies

### Complete Examples (Following Project Conventions)
- [Form Screen](references/examples/form-screen.md) - ⭐ Create/edit with validation (shows full structure)
- [List/Table Screen](references/examples/list-screen.md) - User management with filters
- [Multi-Step Form](references/examples/multi-step-form-screen.md) - Wizard with progress
- [Tabbed Form](references/examples/tabbed-form-screen.md) - Settings with tabs
- [Detail Screen](references/examples/detail-screen.md) - Read-only view
- [Dashboard](references/examples/dashboard-screen.md) - Metrics and charts
