# Data Flow Patterns

Guide for managing state and data flow in complex UIs.

## Overview

Choose the right state management approach based on:
- Component hierarchy depth
- Data sharing requirements
- URL synchronization needs
- State complexity

**➡️ For complete implementations:**
- [List Screen Example](examples/list-screen.md) - URL sync pattern
- [Form Screen Example](examples/form-screen.md) - Form state management
- [Dashboard Example](examples/dashboard-screen.md) - Multiple queries

## Pattern Selection Guide

| Scenario | Pattern | When to Use |
|----------|---------|-------------|
| Parent-child only | Local State + Props | Simple, 1-2 levels deep |
| Shareable filters | URL as Source of Truth | Need bookmarkable URLs |
| Server data | React Query | Fetching, caching, syncing |
| Deep component tree | Context | 3+ levels, avoid prop drilling |
| Complex state logic | Context + Reducer | Multiple actions, state transitions |

## Pattern 1: Local State + Props

**Use when:** Simple parent-child communication

```typescript
function UserManagementPage() {
  const [filters, setFilters] = useState<Filters>({})
  
  return (
    <div>
      <UserFilters
        filters={filters}
        onFiltersChange={setFilters}
      />
      <UserTable filters={filters} />
    </div>
  )
}
```

**Pros:**
- Simple and straightforward
- Easy to understand data flow
- No external dependencies

**Cons:**
- Props drilling for deep trees
- Harder to share state between distant components

## Pattern 2: URL as Source of Truth

**Use when:** Need shareable URLs and browser navigation

```typescript
function UserManagementPage() {
  const navigate = useNavigate()
  const { search } = useSearch()
  
  const filters = useMemo(() => ({
    search: search.q,
    status: search.status,
    page: search.page ?? 1,
  }), [search])
  
  const updateFilters = useCallback((newFilters: Filters) => {
    navigate({
      search: {
        q: newFilters.search || undefined,
        status: newFilters.status || undefined,
        page: newFilters.page || undefined,
      },
    })
  }, [navigate])
  
  return (
    <div>
      <UserFilters
        filters={filters}
        onFiltersChange={updateFilters}
      />
      <UserTable filters={filters} />
    </div>
  )
}
```

**Pros:**
- Shareable URLs
- Browser back/forward works
- Refresh preserves state
- Great for bookmarks

**Cons:**
- Limited to serializable data
- URL length constraints
- More complex updates

## Pattern 3: React Query + Filters

**Use when:** Server-driven data with complex filtering

```typescript
function UserManagementPage() {
  const [filters, setFilters] = useState<Filters>({})
  
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['users', filters],
    queryFn: () => fetchUsers(filters),
  })
  
  return (
    <div>
      <UserFilters
        filters={filters}
        onFiltersChange={setFilters}
        onSearch={refetch}
      />
      <UserTable
        data={data?.users}
        isLoading={isLoading}
      />
    </div>
  )
}
```

**Pros:**
- Automatic caching
- Background refetching
- Loading states handled
- Optimistic updates support

**Cons:**
- Additional library
- Learning curve

## Pattern 4: Context for Deep Trees

**Use when:** Many nested components need same data

```typescript
interface FiltersContextType {
  filters: Filters
  setFilters: (filters: Filters) => void
  isLoading: boolean
}

const FiltersContext = createContext<FiltersContextType>(null!)

function UserManagementPage() {
  const [filters, setFilters] = useState<Filters>({})
  const { data, isLoading } = useQuery({
    queryKey: ['users', filters],
    queryFn: () => fetchUsers(filters),
  })
  
  return (
    <FiltersContext.Provider value={{ filters, setFilters, isLoading }}>
      <Header />
      <Sidebar>
        <UserFilters />
      </Sidebar>
      <MainContent>
        <UserStats />
        <UserTable data={data?.users} />
      </MainContent>
    </FiltersContext.Provider>
  )
}

// Deep nested component can access filters
function UserFilters() {
  const { filters, setFilters } = useContext(FiltersContext)
  // ...
}
```

**Pros:**
- No props drilling
- Clean component APIs
- Easy to add consumers

**Cons:**
- All consumers re-render
- Less explicit data flow
- Harder to track changes

## Pattern 5: Context with Reducer

**Use when:** Complex state logic with multiple actions

```typescript
interface FiltersState {
  filters: Filters
  isLoading: boolean
}

type FiltersAction =
  | { type: 'SET_FILTER'; key: string; value: any }
  | { type: 'RESET_FILTERS' }
  | { type: 'SET_LOADING'; isLoading: boolean }

const filtersReducer = (state: FiltersState, action: FiltersAction): FiltersState => {
  switch (action.type) {
    case 'SET_FILTER':
      return {
        ...state,
        filters: { ...state.filters, [action.key]: action.value },
      }
    case 'RESET_FILTERS':
      return { ...state, filters: {} }
    case 'SET_LOADING':
      return { ...state, isLoading: action.isLoading }
    default:
      return state
  }
}

const FiltersContext = createContext<{
  state: FiltersState
  dispatch: React.Dispatch<FiltersAction>
}>(null!)

function UserManagementPage() {
  const [state, dispatch] = useReducer(filtersReducer, {
    filters: {},
    isLoading: false,
  })
  
  return (
    <FiltersContext.Provider value={{ state, dispatch }}>
      <UserFilters />
      <UserTable />
    </FiltersContext.Provider>
  )
}

// Component usage
function UserFilters() {
  const { state, dispatch } = useContext(FiltersContext)
  
  const updateFilter = (key: string, value: any) => {
    dispatch({ type: 'SET_FILTER', key, value })
  }
  
  return (
    <input
      value={state.filters.search}
      onChange={(e) => updateFilter('search', e.target.value)}
    />
  )
}
```

**Pros:**
- Built-in React API
- Predictable state updates
- Good for complex state logic
- Easy to test

**Cons:**
- More boilerplate than useState
- All consumers re-render (unless optimized)

## API Integration Patterns

### Pattern 1: Container Component Fetches

```typescript
function UserManagementPage() {
  const [filters, setFilters] = useState<Filters>({})
  
  // Container fetches all data
  const { data: users } = useQuery({
    queryKey: ['users', filters],
    queryFn: () => fetchUsers(filters),
  })
  
  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: fetchDepartments,
  })
  
  return (
    <div>
      <UserFilters
        filters={filters}
        onFiltersChange={setFilters}
        departments={departments}
      />
      <UserTable users={users} />
    </div>
  )
}
```

**Pros:**
- Centralized data fetching
- Easy to see all API calls
- Components stay pure

**Cons:**
- Container can get complex
- Props drilling for data

### Pattern 2: Components Fetch Own Data

```typescript
function UserFilters() {
  // Component fetches its own dropdown data
  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: fetchDepartments,
  })
  
  return (
    <select>
      {departments?.map(d => <option key={d.id}>{d.name}</option>)}
    </select>
  )
}

function UserTable({ filters }: { filters: Filters }) {
  // Table fetches its own data
  const { data } = useQuery({
    queryKey: ['users', filters],
    queryFn: () => fetchUsers(filters),
  })
  
  return <table>{/* ... */}</table>
}
```

**Pros:**
- Components are self-contained
- Easier to move/reuse
- Automatic loading states

**Cons:**
- Multiple network requests
- Less visibility of data flow

## Form State Synchronization

### URL Sync Pattern

```typescript
function UserFilters() {
  const navigate = useNavigate()
  const { search } = useSearch()
  
  // Read from URL
  const filters = useMemo(() => ({
    search: search.q ?? '',
    status: search.status,
  }), [search])
  
  // Write to URL
  const handleChange = (key: string, value: any) => {
    navigate({
      search: (prev) => ({
        ...prev,
        [key]: value || undefined,
      }),
    })
  }
  
  return (
    <input
      value={filters.search}
      onChange={(e) => handleChange('q', e.target.value)}
    />
  )
}
```

### Debounced URL Updates

```typescript
function UserFilters() {
  const navigate = useNavigate()
  const { search } = useSearch()
  const [localSearch, setLocalSearch] = useState(search.q ?? '')
  
  // Debounce URL updates
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate({
        search: (prev) => ({ ...prev, q: localSearch || undefined }),
      })
    }, 500)
    
    return () => clearTimeout(timer)
  }, [localSearch, navigate])
  
  return (
    <input
      value={localSearch}
      onChange={(e) => setLocalSearch(e.target.value)}
    />
  )
}
```

## Best Practices

1. **Choose pattern based on requirements:**
   - Local state for simple cases
   - URL for shareable state
   - React Query for server data
   - Context for deep trees
   - Context + Reducer for complex state logic

2. **Keep data flow unidirectional**
3. **Minimize prop drilling**
4. **Use React Query for server state**
5. **Debounce text input updates**
6. **Validate before API calls**
7. **Show loading states**
8. **Handle errors gracefully**
9. **Prefer built-in React APIs** over external libraries
10. **Optimize Context re-renders** with useMemo/useCallback
