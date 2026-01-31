# Component Placement Decision Guide

Step-by-step guide to decide where a component should be placed.

## Decision Flowchart

```
START: I need to create/place a component
│
├─ Q1: Is it a single, basic UI element? (button, input, icon, etc.)
│  ├─ YES → Place in atoms/
│  └─ NO → Continue
│
├─ Q2: Is it purely for layout/spacing? (container, grid, stack, etc.)
│  ├─ YES → Place in box/
│  └─ NO → Continue
│
├─ Q3: Does it combine 2+ atoms into a reusable pattern?
│  ├─ YES → Continue to Q4
│  └─ NO → Continue to Q5
│
├─ Q4: Does it fetch data or have complex business logic?
│  ├─ YES → Continue to Q5
│  └─ NO → Place in molecules/
│
├─ Q5: Is it complex with data fetching or significant internal logic?
│  ├─ YES → Continue to Q6
│  └─ NO → Re-evaluate (might be molecules/)
│
├─ Q6: Will it be reused across multiple features?
│  ├─ YES → Place in organisms/
│  └─ NO → Continue to Q7
│
└─ Q7: Is it specific to one feature/module?
   ├─ YES → Place in containers/{feature}/components/
   └─ NO → Re-evaluate from Q3
```

## Detailed Questions

### Question 1: Is it a single, basic UI element?

**What qualifies:**
- Single HTML element wrapper
- No composition of other components
- Usually from UI library (shadcn)
- Minimal or no state
- Pure presentation

**Examples:**
- ✅ Button
- ✅ Input
- ✅ Label
- ✅ Badge
- ✅ Icon
- ✅ Avatar
- ❌ Form field (combines input + label + error)
- ❌ Search bar (combines input + icon + button)

**Decision:** atoms/

---

### Question 2: Is it purely for layout/spacing?

**What qualifies:**
- Provides structure
- No business logic
- No data display
- Uses CSS/Tailwind for layout
- Reusable layout patterns

**Examples:**
- ✅ PageContainer
- ✅ ContentWrapper
- ✅ Grid
- ✅ Stack (vertical/horizontal)
- ✅ Center
- ❌ UserCard (has content)
- ❌ DataTable (has logic)

**Decision:** box/

---

### Question 3: Does it combine 2+ atoms?

**What qualifies:**
- Uses multiple atoms together
- Creates a reusable pattern
- Has a cohesive purpose
- May have some internal logic

**Examples:**
- ✅ SearchInput (input + icon + button)
- ✅ FormField (label + input + error)
- ✅ UserAvatar (avatar + badge + tooltip)
- ✅ StatCard (card + icon + text + number)
- ❌ Button (single atom)
- ❌ UserSelector (fetches data)

**Decision:** If YES and no data fetching → molecules/

---

### Question 4: Does it fetch data or have complex logic?

**What qualifies:**
- Makes API calls
- Uses React Query hooks
- Has significant state management
- Has complex calculations
- Handles authentication/authorization

**Examples:**
- ✅ UserSelector (fetches users)
- ✅ ChartWidget (fetches chart data)
- ✅ NotificationPanel (fetches notifications)
- ❌ SearchInput (just UI pattern)
- ❌ FormField (just validation)

**Decision:** If YES → Check reusability (Q6)

---

### Question 5: Is it complex?

**What qualifies:**
- Multiple sub-components
- Significant internal state
- Complex interactions
- Not just presentation

**Examples:**
- ✅ DataTable with sorting/filtering
- ✅ RichTextEditor
- ✅ FileUploader with preview
- ❌ Simple SearchInput
- ❌ Basic FormField

**Decision:** Continue to Q6

---

### Question 6: Will it be reused across features?

**Critical question for placement**

**How to determine:**

**Reused across features (organisms/):**
- Used in 2+ different feature modules
- Generic enough for multiple contexts
- Configurable through props
- No feature-specific coupling

**Examples:**
- ✅ UserSelector (used in teams, projects, assignments)
- ✅ DateRangePicker (used everywhere)
- ✅ TagSelector (used in multiple modules)
- ✅ FileUploader (used in multiple forms)

**Not reused (feature-specific):**
- Only makes sense in one feature
- Has feature-specific business rules
- Tightly coupled to feature logic
- Only used once or within one feature

**Examples:**
- ❌ OrderStatusForm (only in orders)
- ❌ ProductInventoryTable (only in inventory)
- ❌ InvoicePreview (only in billing)

**Decision:** 
- If reusable → organisms/
- If not reusable → containers/{feature}/components/

---

### Question 7: Is it specific to one feature?

**Final catch-all question**

**What qualifies:**
- Only used in one module/feature
- Contains feature-specific logic
- Not abstracted for reuse
- Tightly coupled to feature data/state

**Examples:**
- ✅ UserForm (only in user management)
- ✅ OrderSummary (only in orders)
- ✅ ProjectSettings (only in projects)

**Decision:** containers/{feature}/components/

---

## Common Edge Cases

### Case 1: Component used in 2 places in same feature

**Question:** Should it be shared?

**Answer:** NO. Keep it in feature's components folder.

**Reason:** Just because it's used twice within a feature doesn't make it reusable across the app.

**Location:** `containers/{feature}/components/`

---

### Case 2: Component might be reused "someday"

**Question:** Should I make it shared now?

**Answer:** NO. Keep it feature-specific until actually reused.

**Reason:** YAGNI (You Aren't Gonna Need It). Premature abstraction is harder to maintain.

**Location:** `containers/{feature}/components/`

**When to move:** When actually needed in a second feature, refactor to molecules/ or organisms/

---

### Case 3: Molecule needs data fetching

**Question:** Should it become an organism?

**Answer:** MAYBE. Depends on complexity and reusability.

**If simple data:**
- Keep as molecule
- Accept data as props
- Parent handles fetching

**If complex with internal data:**
- Promote to organism
- Handle own data fetching
- More self-contained

---

### Case 4: Organism only used once

**Question:** Should it stay as organism?

**Answer:** NO. Move to feature-specific.

**Reason:** If not reusable, no need for shared folder.

**Action:** Move to `containers/{feature}/components/`

---

### Case 5: Feature component used in another feature

**Question:** Where should it go?

**Answer:** Refactor to appropriate shared folder.

**Steps:**
1. Identify what it is (molecule vs organism)
2. Remove feature-specific coupling
3. Make it configurable through props
4. Move to molecules/ or organisms/
5. Update imports in both features

---

## Quick Decision Matrix

| Characteristic | atoms/ | molecules/ | organisms/ | box/ | feature/components/ |
|----------------|--------|------------|------------|------|---------------------|
| Single element | ✅ | ❌ | ❌ | ❌ | ❌ |
| Combines atoms | ❌ | ✅ | ✅ | ❌ | ✅ |
| Data fetching | ❌ | ❌ | ✅ | ❌ | Maybe |
| Reusable | ✅ | ✅ | ✅ | ✅ | ❌ |
| Layout only | ❌ | ❌ | ❌ | ✅ | ❌ |
| Feature-specific | ❌ | ❌ | ❌ | ❌ | ✅ |
| Has story | ❌ | ✅ | ✅ | ❌ | ❌ |
| Complex logic | ❌ | ❌ | ✅ | ❌ | Maybe |

## Examples by Category

### Atoms
- `button.tsx`
- `input.tsx`
- `label.tsx`
- `badge.tsx`
- `avatar.tsx`
- `separator.tsx`
- `card.tsx`
- `dialog.tsx`

### Molecules
- `search-input/` - Input + icon + clear button
- `form-field/` - Label + input + error
- `user-card/` - Avatar + name + role
- `stat-card/` - Icon + label + value
- `breadcrumb-nav/` - Breadcrumb with icons
- `pagination/` - Pagination controls

### Organisms
- `user-selector/` - Select with user data fetching
- `data-table/` - Table with sorting/filtering/pagination
- `rich-text-editor/` - Complex editor with toolbar
- `chart-widget/` - Chart with data and controls
- `notification-panel/` - Panel with notifications
- `file-uploader/` - Upload with preview and progress

### Box
- `page-container.tsx`
- `content-wrapper.tsx`
- `grid.tsx`
- `stack.tsx`
- `center.tsx`

### Feature Components
- `containers/users/components/user-form/`
- `containers/orders/components/order-summary/`
- `containers/projects/components/project-settings/`
- `containers/products/components/inventory-table/`

## When in Doubt

1. **Start feature-specific** - If unsure, put it in feature's components
2. **Refactor when reused** - Move to shared only when needed elsewhere
3. **Ask:** "Would another feature use this exactly as-is?"
   - If NO → Feature-specific
   - If YES → Shared (molecules/ or organisms/)

## Red Flags

🚩 Atoms importing molecules
🚩 Molecules importing organisms
🚩 Shared components importing from containers
🚩 Multiple features importing from one feature's components
🚩 Molecule fetching its own data
🚩 Organism with no internal logic/data
