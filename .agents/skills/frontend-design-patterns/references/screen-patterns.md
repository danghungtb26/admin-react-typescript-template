# Screen Patterns Overview

Common screen types and how to design them.

## Available Patterns

### 1. List/Table Screen
**Use for:** Managing collections (users, orders, products)

**Structure:**
```
┌────────────────────────────────┐
│ Header + Actions               │
├────────────────────────────────┤
│ Filters                        │
├────────────────────────────────┤
│ Table                          │
├────────────────────────────────┤
│ Pagination                     │
└────────────────────────────────┘
```

**Key Components:**
- Container fetches data based on filters
- Filters update state/URL
- Table displays data with sorting/pagination

**➡️ [View Complete Example](examples/list-screen.md)**

---

### 2. Form Screen (Create/Edit)
**Use for:** Creating or editing single records

**Structure:**
```
┌────────────────────────────────┐
│ Header (Title + Breadcrumb)    │
├────────────────────────────────┤
│ Form                           │
│   [Input fields]               │
│   [Validation errors]          │
├────────────────────────────────┤
│ Actions (Save, Cancel)         │
└────────────────────────────────┘
```

**Key Points:**
- Single form component
- Load data for edit mode
- Validate on change/blur
- Show validation errors inline
- Disable submit during saving

**➡️ [View Complete Example](examples/form-screen.md)**

---

### 3. Multi-Step Form (Wizard)
**Use for:** Complex forms split into steps (onboarding, checkout)

**Structure:**
```
┌────────────────────────────────┐
│ Header + Progress (Step 1/3)  │
├────────────────────────────────┤
│ Step Content                   │
│   [Current step fields]        │
├────────────────────────────────┤
│ Actions (Back, Next, Submit)   │
└────────────────────────────────┘
```

**Key Points:**
- Track current step in state
- Validate current step before moving next
- Show progress indicator
- Allow back navigation
- Submit only on final step

**➡️ [View Complete Example](examples/multi-step-form-screen.md)**

---

### 4. Tabbed Form Screen
**Use for:** Settings, user profiles with multiple sections

**Structure:**
```
┌────────────────────────────────┐
│ Header                         │
├────────────────────────────────┤
│ [Tab 1] [Tab 2] [Tab 3]       │
├────────────────────────────────┤
│ Tab Content (Form)             │
│   [Fields for active tab]     │
├────────────────────────────────┤
│ Actions (Save)                 │
└────────────────────────────────┘
```

**Key Points:**
- Separate form instance per tab
- Independent save actions per tab
- Tab state in URL for direct links
- Each tab can have different validation

**➡️ [View Complete Example](examples/tabbed-form-screen.md)**

---

### 5. Detail/View Screen
**Use for:** Viewing record details (order details, user profile)

**Structure:**
```
┌────────────────────────────────┐
│ Header + Actions (Edit)        │
├────────────────────────────────┤
│ Info Sections                  │
│   [Section 1: Basic Info]     │
│   [Section 2: Details]        │
│   [Section 3: Activity]       │
└────────────────────────────────┘
```

**Key Points:**
- Read-only display of data
- Organized into logical sections
- Edit action navigates to form
- Related data in separate sections

**➡️ [View Complete Example](examples/detail-screen.md)**

---

### 6. Dashboard Screen
**Use for:** Overview/analytics (admin dashboard, analytics)

**Structure:**
```
┌────────────────────────────────┐
│ Header + Date Filter           │
├────────────────────────────────┤
│ [Card] [Card] [Card] [Card]   │  ← Metrics
├────────────────────────────────┤
│ [Chart 1]        [Chart 2]    │  ← Visualizations
├────────────────────────────────┤
│ [Recent Activity Table]        │  ← Summary table
└────────────────────────────────┘
```

**Key Points:**
- Multiple data queries
- Date range filter affects all data
- Mix of cards, charts, tables
- Focus on overview/summary

**➡️ [View Complete Example](examples/dashboard-screen.md)**

---

## Pattern Selection Guide

| Use Case | Pattern | Example |
|----------|---------|---------|
| Manage collection | List/Table | User list, product catalog |
| Create/edit record | Form | Create user, edit profile |
| Complex data entry | Multi-step Form | Onboarding, checkout |
| Multiple sections | Tabbed Form | Settings, user profile |
| View details | Detail | Order detail, user profile |
| Overview/metrics | Dashboard | Admin dashboard, analytics |

## Best Practices

1. **Choose the right pattern** for your use case
2. **Keep forms focused** - One responsibility per form
3. **Validate progressively** - As users type, not just on submit
4. **Show progress** - For multi-step forms
5. **Handle loading states** - For all async operations
6. **Provide clear navigation** - Back buttons, breadcrumbs
7. **Save state** - Don't lose data on navigation
8. **URL sync for shareability** - Save filters/state in URL when appropriate
