# Filter Patterns

Guide for implementing various types of filter inputs and layouts.

## Overview

Filters allow users to narrow down data in list/table screens. This guide covers:
- Common input types (text, select, date, etc.)
- Layout patterns (grid, flex, collapsible)
- Validation and default values
- Action buttons

**➡️ For complete implementation, see [List Screen Example](examples/list-screen.md)**

## Input Type Quick Reference

| Input Type | Use Case | Key Props |
|------------|----------|-----------|
| Text | Search by name/email/keyword | `value`, `onChange`, `placeholder` |
| Select (Static) | Fixed options (status, role) | `value`, `onChange`, `<option>` list |
| Select (API) | Dynamic options from API | `useQuery`, map data to options |
| Date | Single date selection | `value`, `onChange`, date format |
| Date Range | Start and end dates | `value: [start, end]`, `onChange` |
| Number | Age, price, quantity | `type="number"`, `min`, `max`, `step` |
| Multi-Select | Tags, categories | `value: string[]`, `onChange` |
| Checkbox | Boolean filters | `checked`, `onChange` |

## Input Type Patterns

### Text Search

```typescript
<div>
  <label>Search</label>
  <input
    type="text"
    value={filters.search ?? ''}
    onChange={(e) => updateFilter('search', e.target.value)}
    placeholder="Search by name or email"
  />
</div>
```

### Static Select

```typescript
const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
]

<select
  value={filters.status ?? ''}
  onChange={(e) => updateFilter('status', e.target.value)}
>
  <option value="">All Status</option>
  {STATUS_OPTIONS.map(opt => (
    <option key={opt.value} value={opt.value}>{opt.label}</option>
  ))}
</select>
```

### API-Driven Select

```typescript
function DepartmentSelect({ value, onChange }: SelectProps) {
  const { data: departments, isLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: fetchDepartments,
  })

  return (
    <select
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      disabled={isLoading}
    >
      <option value="">All Departments</option>
      {departments?.map(dept => (
        <option key={dept.id} value={dept.id}>{dept.name}</option>
      ))}
    </select>
  )
}
```

### Autocomplete with Search

```typescript
function UserAutocomplete({ value, onChange }: AutocompleteProps) {
  const [search, setSearch] = useState('')
  
  const { data: users } = useQuery({
    queryKey: ['users', 'search', search],
    queryFn: () => searchUsers(search),
    enabled: search.length > 2,
  })

  return (
    <Autocomplete
      options={users ?? []}
      value={value}
      onInputChange={setSearch}
      onChange={onChange}
      getOptionLabel={(user) => user.name}
      renderOption={(props, user) => (
        <li {...props}>
          <Avatar src={user.avatar} size="sm" />
          <span>{user.name}</span>
          <span className="text-gray-500">{user.email}</span>
        </li>
      )}
    />
  )
}
```

### Date Picker Types

**Single Date:**
```typescript
<DatePicker
  value={filters.date}
  onChange={(date) => updateFilter('date', date)}
/>
```

**Date Range:**
```typescript
<DateRangePicker
  value={filters.dateRange}
  onChange={(range) => updateFilter('dateRange', range)}
  maxDate={new Date()}
/>
```

**DateTime:**
```typescript
<DateTimePicker
  value={filters.datetime}
  onChange={(datetime) => updateFilter('datetime', datetime)}
  format="YYYY-MM-DD HH:mm"
/>
```

**Date + Time Range:**
```typescript
<DateTimeRangePicker
  value={filters.datetimeRange}
  onChange={(range) => updateFilter('datetimeRange', range)}
  showTime={{ format: 'HH:mm' }}
/>
```

### Number Range

```typescript
<div className="flex gap-2 items-center">
  <input
    type="number"
    value={filters.minPrice ?? ''}
    onChange={(e) => updateFilter('minPrice', e.target.valueAsNumber)}
    placeholder="Min"
  />
  <span>-</span>
  <input
    type="number"
    value={filters.maxPrice ?? ''}
    onChange={(e) => updateFilter('maxPrice', e.target.valueAsNumber)}
    placeholder="Max"
  />
</div>
```

### Multi-Select

```typescript
<MultiSelect
  options={CATEGORY_OPTIONS}
  value={filters.categories ?? []}
  onChange={(selected) => updateFilter('categories', selected)}
  placeholder="Select categories"
/>
```

### Checkbox Group

```typescript
<div className="space-y-2">
  {FEATURE_OPTIONS.map(feature => (
    <label key={feature.value} className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={filters.features?.includes(feature.value)}
        onChange={(e) => {
          const current = filters.features ?? []
          const updated = e.target.checked
            ? [...current, feature.value]
            : current.filter(f => f !== feature.value)
          updateFilter('features', updated)
        }}
      />
      {feature.label}
    </label>
  ))}
</div>
```

## Layout Patterns

### Grid Layout (Responsive)

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <div>{/* Filter 1 */}</div>
  <div>{/* Filter 2 */}</div>
  <div>{/* Filter 3 */}</div>
  <div>{/* Filter 4 */}</div>
</div>
```

### Flex Layout (Inline)

```typescript
<div className="flex flex-wrap gap-4">
  <div className="flex-1 min-w-[200px]">{/* Filter 1 */}</div>
  <div className="flex-1 min-w-[200px]">{/* Filter 2 */}</div>
  <div className="w-auto">{/* Action buttons */}</div>
</div>
```

### Collapsible Advanced Filters

```typescript
function Filters() {
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  return (
    <div>
      {/* Basic filters always visible */}
      <div className="grid grid-cols-3 gap-4">
        <input placeholder="Search" />
        <select>{/* Status */}</select>
        <button onClick={() => setShowAdvanced(!showAdvanced)}>
          Advanced {showAdvanced ? '▼' : '▶'}
        </button>
      </div>
      
      {/* Advanced filters collapsible */}
      {showAdvanced && (
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
          <DateRangePicker />
          <select>{/* Category */}</select>
          <MultiSelect />
        </div>
      )}
    </div>
  )
}
```

## Validation Patterns

### Required Fields

```typescript
<div>
  <label>
    Department <span className="text-red-500">*</span>
  </label>
  <select
    value={filters.department ?? ''}
    onChange={(e) => updateFilter('department', e.target.value)}
    className={!filters.department ? 'border-red-500' : ''}
  >
    <option value="">Select department</option>
    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
  </select>
  {!filters.department && (
    <span className="text-red-500 text-sm">Department is required</span>
  )}
</div>
```

### Range Validation

```typescript
const [error, setError] = useState('')

const handleMinChange = (value: number) => {
  if (filters.max && value > filters.max) {
    setError('Min cannot be greater than max')
  } else {
    setError('')
    updateFilter('min', value)
  }
}
```

## Default Values Patterns

### Empty Defaults

```typescript
const [filters, setFilters] = useState<Filters>({
  search: '',
  status: undefined,
  dateRange: undefined,
})
```

### Preset Defaults

```typescript
const [filters, setFilters] = useState<Filters>({
  status: 'active',  // Default to active
  dateRange: [startOfMonth(new Date()), new Date()],  // Current month
})
```

### URL-Based Defaults

```typescript
const searchParams = useSearchParams()

const [filters, setFilters] = useState<Filters>(() => ({
  search: searchParams.search ?? '',
  status: searchParams.status as Status,
  dateRange: searchParams.from && searchParams.to
    ? [new Date(searchParams.from), new Date(searchParams.to)]
    : undefined,
}))
```

## Action Button Patterns

### Basic Actions

```typescript
<div className="flex gap-2">
  <button
    onClick={onSearch}
    className="px-4 py-2 bg-blue-500 text-white rounded"
  >
    Search
  </button>
  <button
    onClick={onReset}
    className="px-4 py-2 border rounded"
  >
    Reset
  </button>
</div>
```

### With Loading State

```typescript
<button
  onClick={onSearch}
  disabled={isSearching}
  className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
>
  {isSearching ? <Spinner /> : 'Search'}
</button>
```

### Export Actions

```typescript
<div className="flex justify-between">
  <div className="flex gap-2">
    <button onClick={onSearch}>Search</button>
    <button onClick={onReset}>Reset</button>
  </div>
  
  <div className="flex gap-2">
    <button onClick={onExportCSV}>
      <DownloadIcon /> Export CSV
    </button>
    <button onClick={onExportPDF}>
      <DownloadIcon /> Export PDF
    </button>
  </div>
</div>
```

## Best Practices

1. **Always provide "All" option** for dropdowns
2. **Debounce text inputs** to reduce API calls
3. **Show loading states** for async dropdowns
4. **Clear validation on reset**
5. **Make buttons disabled** during loading
6. **Use placeholders** to guide users
7. **Group related filters** visually
