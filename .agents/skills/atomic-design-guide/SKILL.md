---
name: atomic-design-guide
description: Guide for organizing React components using Atomic Design methodology. Use when creating or organizing components, deciding component placement, refactoring component structure, or when the user asks about component architecture, atoms, molecules, organisms, or where to place a component.
keywords: atomic-design, atoms, molecules, organisms, component-placement, component-structure, component-architecture, feature-component, container
---

# Atomic Design Guide

## Overview

This skill provides guidance on organizing React components using Atomic Design principles, helping decide the correct placement and structure for components.

## Component Hierarchy

```
src/components/
├── atoms/              # Smallest, reusable UI elements
├── molecules/          # Combinations of atoms
├── organisms/          # Complex, self-contained components with data/logic
└── box/                # Layout components

src/containers/{feature}/
└── components/         # Feature-specific components
```

## Component Classification

### Atoms - Basic Building Blocks

**Definition:** Smallest, indivisible UI components with no business logic.

**Characteristics:**
- Single responsibility
- No data fetching
- No business logic
- Highly reusable across the entire app
- Usually shadcn/ui base components

**Examples:**
- `button.tsx` - Basic button
- `input.tsx` - Text input
- `label.tsx` - Form label
- `badge.tsx` - Status badge
- `avatar.tsx` - User avatar image
- `card.tsx` - Basic card container
- `separator.tsx` - Divider line

**Location:** `src/components/atoms/{component}.tsx`

**When to use:**
- Component is a single UI element
- Has no internal state or minimal state (like hover)
- Can be used anywhere in the app
- Comes from shadcn/ui or similar libraries

### Molecules - Atom Combinations

**Definition:** Groups of atoms functioning together as a unit.

**Characteristics:**
- Combines multiple atoms
- Has some internal logic (validation, formatting)
- Still reusable but more specific purpose
- May have props for configuration
- Has Storybook story

**Examples:**
- `search-input.tsx` - Input + icon + clear button
- `form-field.tsx` - Label + input + error message
- `user-card.tsx` - Avatar + name + role badge
- `data-table.tsx` - Table structure with sorting/filtering
- `date-picker.tsx` - Input + calendar popup
- `file-upload.tsx` - Input + button + preview

**Location:** `src/components/molecules/{component}/index.tsx`

**When to use:**
- Combines 2+ atoms into a cohesive unit
- Used in multiple places across the app
- Has reusable interaction patterns
- Can be documented in Storybook

**Critical Rule:** Once a molecule exists, **DO NOT use its constituent atoms directly**. Always use the molecule.

### Organisms - Complex Components

**Definition:** Complex, self-contained components that may fetch data or contain significant business logic.

**Characteristics:**
- Contains molecules and atoms
- May fetch data from APIs
- Has complex state management
- Reusable across multiple features
- Often has props for data injection

**Examples:**
- `user-selector.tsx` - Searchable dropdown that fetches users from API
- `product-selector.tsx` - Select with data fetching and filtering
- `data-table-with-filters.tsx` - Table + search + filters + pagination
- `rich-text-editor.tsx` - Complex editor with toolbar
- `chart-widget.tsx` - Chart with data fetching and controls
- `notification-panel.tsx` - Panel that fetches and displays notifications

**Location:** `src/components/organisms/{component}/index.tsx`

**When to use:**
- Component is complex and reusable
- Fetches its own data
- Used in multiple features
- Has significant internal logic
- Too complex for molecules/

### Box - Layout Components

**Definition:** Components that provide layout structure.

**Characteristics:**
- Define page/section layout
- No business logic
- Provide spacing, alignment, grid
- Highly reusable

**Examples:**
- `page-container.tsx` - Main page wrapper
- `content-wrapper.tsx` - Content area container
- `grid-layout.tsx` - Grid system
- `stack.tsx` - Vertical/horizontal stack

**Location:** `src/components/box/{component}.tsx`

### Feature-Specific Components

**Definition:** Components specific to a single feature/module.

**Characteristics:**
- Used only in one feature
- Contains feature-specific business logic
- Not reusable across features
- May combine molecules/organisms

**Examples:**
- `user-form.tsx` - Form specific to user management
- `order-summary.tsx` - Summary specific to orders
- `product-inventory-table.tsx` - Table specific to inventory

**Location:** `src/containers/{feature}/components/{component}/index.tsx`

**When to use:**
- Component is specific to one feature
- Contains feature-specific logic
- Won't be reused in other features

## Decision Tree

### Where Should My Component Go?

Ask these questions in order:

#### 1. Is it a single, basic UI element?
- **YES** → `atoms/`
- **NO** → Continue

#### 2. Does it combine multiple atoms into a reusable pattern?
- **YES** → `molecules/`
- **NO** → Continue

#### 3. Is it complex with data fetching or significant logic?
- **YES** → Is it reusable across features?
  - **YES** → `organisms/`
  - **NO** → `containers/{feature}/components/`
- **NO** → Continue

#### 4. Is it purely for layout/structure?
- **YES** → `box/`
- **NO** → Continue

#### 5. Is it specific to one feature?
- **YES** → `containers/{feature}/components/`
- **NO** → Re-evaluate if it should be `molecules/` or `organisms/`

For detailed decision guide, see [references/decision-guide.md](references/decision-guide.md).

## Critical Rules

### 1. Prefer Higher-Level Components

**❌ BAD:**
```typescript
// Using atoms directly when molecule exists
import { Input } from '@/components/atoms/input'
import { Label } from '@/components/atoms/label'
import { Alert } from '@/components/atoms/alert'

function MyForm() {
  return (
    <div>
      <Label>Name</Label>
      <Input />
      {error && <Alert>{error}</Alert>}
    </div>
  )
}
```

**✅ GOOD:**
```typescript
// Using molecule that encapsulates the pattern
import { FormField } from '@/components/molecules/form-field'

function MyForm() {
  return (
    <FormField
      label="Name"
      error={error}
      {...register('name')}
    />
  )
}
```

### 2. Create Molecules for Repeated Patterns

If you find yourself using the same combination of atoms in 3+ places, create a molecule.

**Signs you need a molecule:**
- Copy-pasting atom combinations
- Same pattern in multiple files
- Repeated layout/structure

### 3. Use Organisms for Data-Driven Components

Components that fetch data should be organisms if reusable, or feature-specific if not.

**✅ Organism (reusable):**
```typescript
// src/components/organisms/user-selector/index.tsx
export function UserSelector({ onSelect }: Props) {
  const { data: users } = useUsers()
  
  return (
    <Select>
      {users.map(user => (
        <SelectItem key={user.id} value={user.id}>
          {user.name}
        </SelectItem>
      ))}
    </Select>
  )
}
```

**✅ Feature-specific (not reusable):**
```typescript
// src/containers/projects/components/project-user-selector/index.tsx
export function ProjectUserSelector({ projectId }: Props) {
  const { data: users } = useProjectUsers(projectId)
  // Project-specific logic...
}
```

### 4. Feature Components Stay in Feature

Never move feature-specific components to shared folders, even if used twice within the same feature.

## Common Scenarios

### Scenario 1: Creating a Search Bar

**Component:** Input with icon, clear button, and search functionality

**Decision:** 
- Combines atoms (input, button, icon)
- Reusable pattern
- No data fetching
- **→ molecules/search-bar/**

### Scenario 2: Creating a User Selector Dropdown

**Component:** Dropdown that fetches users from API

**Decision:**
- Fetches data
- Reusable across features
- Complex internal logic
- **→ organisms/user-selector/**

### Scenario 3: Creating an Order Status Form

**Component:** Form specific to updating order status

**Decision:**
- Specific to order feature
- Not reusable elsewhere
- **→ containers/orders/components/order-status-form/**

### Scenario 4: Creating a Product Card

**Component:** Card showing product image, name, price, add to cart button

**Is it reusable across features?**
- If YES (used in catalog, search, recommendations): **→ molecules/product-card/**
- If NO (only in product management): **→ containers/products/components/product-card/**

For more scenarios, see [references/common-scenarios.md](references/common-scenarios.md).

## Refactoring Patterns

### When to Refactor Up (atoms → molecules)

If you see this pattern:
1. Same atoms used together in 3+ places
2. Same props passed repeatedly
3. Same layout/structure duplicated

**Action:** Extract to molecule

### When to Refactor Up (molecules → organisms)

If you see this pattern:
1. Data fetching added to multiple instances
2. Complex state management duplicated
3. Component becomes very configurable

**Action:** Extract to organism

### When to Refactor Down (shared → feature-specific)

If you see this pattern:
1. Organism only used in one feature
2. Props become feature-specific
3. Logic becomes feature-coupled

**Action:** Move to feature's components folder

For refactoring guide, see [references/refactoring-guide.md](references/refactoring-guide.md).

## Component Structure

### Atoms (single file)
```
src/components/atoms/
└── button.tsx
```

### Molecules (folder with story and tests)
```
src/components/molecules/search-bar/
├── index.tsx
├── search-bar.stories.tsx
└── __tests__/
    └── search-bar.test.tsx
```

### Organisms (folder with complex structure)
```
src/components/organisms/user-selector/
├── index.tsx
├── user-selector.stories.tsx
├── hooks/
│   └── use-user-search.ts
└── __tests__/
    └── user-selector.test.tsx
```

### Feature Components
```
src/containers/users/
└── components/
    └── user-form/
        ├── index.tsx
        └── __tests__/
            └── user-form.test.tsx
```

## Quick Reference

| Type | Location | Reusability | Data Fetching | Complexity |
|------|----------|-------------|---------------|------------|
| Atom | `atoms/` | High | No | Low |
| Molecule | `molecules/` | High | No | Medium |
| Organism | `organisms/` | High | Yes | High |
| Box | `box/` | High | No | Low |
| Feature | `containers/{feature}/components/` | None | Maybe | Any |

## Additional Resources

- [Decision guide](references/decision-guide.md) - Detailed decision flowchart
- [Common scenarios](references/common-scenarios.md) - Real-world examples
- [Refactoring guide](references/refactoring-guide.md) - How to reorganize components
- [Anti-patterns](references/anti-patterns.md) - What to avoid
