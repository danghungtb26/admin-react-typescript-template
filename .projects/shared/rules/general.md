# General Instructions for AI Assistants

This document contains critical rules and guidelines for AI assistants working on this project. Follow these instructions carefully to maintain consistency and quality.

## Project Overview

This is an **admin dashboard** built with:

- **React 19** - UI library
- **Vite 7** - Build tool and dev server
- **TypeScript 5.9+** - Type-safe JavaScript
- **TanStack Router** - Type-safe routing solution
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - Component library based on Radix UI
- **Apollo Client** - GraphQL client for data fetching
- **i18next** - Internationalization framework

## Package Management

- **ALWAYS use `pnpm`** as the package manager
- Never use `npm` or `yarn`
- When installing dependencies: `pnpm add <package>`
- When installing dev dependencies: `pnpm add -D <package>`
- Check if package already exists before installing
- Use exact versions when adding critical dependencies

## Component Architecture

### Component Structure

Components are organized in three layers:

1. **Atoms** (`src/components/atoms/`)
   - Base shadcn/ui components
   - Direct installations from shadcn CLI
   - Examples: `button.tsx`, `input.tsx`, `dialog.tsx`

2. **Molecules** (`src/components/molecules/`)
   - Complex components composed from atoms
   - Custom business logic and compositions
   - Examples: `data-table/`, `avatar/`, `dropdown-menu/`

3. **Containers** (`src/containers/`)
   - Page-level components with business logic
   - Feature-specific implementations

### shadcn/ui Component Installation

**CRITICAL: Always use the CLI, never generate code manually**

```bash
# Install a shadcn component
pnpm dlx shadcn@latest add <component-name>
```

Examples:

```bash
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add dialog
pnpm dlx shadcn@latest add data-table
```

**After installing shadcn components:**

- Components are installed to `src/components/atoms/`
- If the component is complex (e.g., data-table, select with search), create a molecule wrapper
- Place molecule components in `src/components/molecules/<component-name>/`

### Molecule Component Requirements

When creating molecule components:

1. **Create the molecule wrapper** in `src/components/molecules/<name>/`
2. **Add Storybook story** for the molecule component
3. Place story file as `src/components/molecules/<name>/<name>.stories.tsx`

Example structure:

```
src/components/molecules/
├── data-table/
│   ├── index.tsx
│   ├── data-table.stories.tsx
│   └── types.ts
└── avatar/
    ├── index.tsx
    └── avatar.stories.tsx
```

## Code Quality & Linting

### CRITICAL: Post-Task Linting

**After completing ANY task, ALWAYS:**

1. Run the lint command:

```bash
pnpm lint --fix
```

2. **ONLY show errors in the output**
3. **DO NOT automatically fix the errors**
4. Report the errors to the user for review

This is a CRITICAL step - never skip it.

### Linting Rules

- ESLint is configured with TypeScript, React, and Prettier rules
- Husky pre-commit hooks enforce linting
- Configuration: `eslint.config.mjs`

## TypeScript

- Use TypeScript for ALL new files (`.ts` or `.tsx`)
- Prefer `interface` over `type` for object shapes
- Use proper typing, avoid `any` when possible
- Use `unknown` instead of `any` for truly unknown types
- Decorators are used for models (see `src/decorators/`)
- Enable strict mode compliance
- Use utility types: `Partial<T>`, `Required<T>`, `Pick<T, K>`, `Omit<T, K>`
- Properly type function parameters and return values
- Use generics for reusable components and functions

## Styling

- Use **Tailwind CSS v4** for styling
- Main stylesheet: `src/styles/tailwind.css`
- Use `cn()` utility from `@/lib/utils` for conditional classes
- Follow shadcn's styling patterns
- Responsive design: use `sm:`, `md:`, `lg:`, `xl:` prefixes
- Dark mode: use `dark:` prefix (next-themes is configured)
- Avoid inline styles unless absolutely necessary
- Use CSS variables for theme customization
- Prefer Tailwind utilities over custom CSS

## Routing

- Using **TanStack Router** (type-safe routing)
- Routes are in `src/routes/`
- Auto-generated route tree: `src/routeTree.gen.ts` (DO NOT MODIFY)
- Protected routes use `_authenticated` layout
- Route file naming conventions:
  - `index.tsx` - Index route
  - `route-name.tsx` - Named route
  - `_layout.tsx` - Layout wrapper
  - `$param.tsx` - Dynamic parameter
- Use route hooks: `useNavigate()`, `useParams()`, `useSearch()`
- Type-safe navigation with proper params and search types

## State Management

- **Local state**: React `useState`, `useReducer`
- **Global state**: React Contexts (see `src/contexts/`)
  - `AuthContext` - Authentication state
  - `SettingContext` - App settings
  - `TagViewContext` - Tab/tag management
- **Server state**: Apollo Client for GraphQL
- **Forms**: `react-hook-form` with Zod validation
- Use `useImmer` for complex state updates
- Prefer composition over prop drilling

## Internationalization

- Using `i18next` and `react-i18next`
- Locale files in `src/locales/messages/`
- Configuration in `src/locales/config/`
- Use translation hook: `useTranslation()`
- Key format: `namespace:key` (e.g., `common:button.save`)
- **CRITICAL: ALWAYS use i18n for ALL user-facing text**
- **NEVER hardcode text strings directly in components**
- Always add translation keys to locale files
- Support multiple languages from the start
- Pattern for adding new text:

  ```typescript
  // ❌ WRONG - Hardcoded text
  <Button>Save</Button>

  // ✅ CORRECT - Using i18n
  const { t } = useTranslation();
  <Button>{t('common:button.save')}</Button>
  ```

## Forms & Validation

- Use `Zod` for schema validation
- Integration: `@common/validates/*`
- Pattern:

  ```typescript
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  })

  const form = useForm({
    resolver: zodResolver(schema),
  })
  ```

- Use Form components from `@/components/atoms/form`
- Always validate on submit
- Show validation errors inline
- Disable submit during submission

## Data Tables

- Use `@tanstack/react-table` for table logic
- Use shadcn Table components for UI
- Molecule wrapper in `src/components/molecules/data-table/`
- Features to implement:
  - Sorting (client-side and server-side)
  - Filtering
  - Pagination
  - Row selection
  - Column visibility
  - Responsive design
- Always type table data properly
- Use column helpers for type safety

## File Organization

- **Commons**: Utility functions (`src/commons/`)
- **Components**: UI components (atoms, molecules, boxes)
- **Containers**: Page-level components
- **Contexts**: React contexts for global state
- **Hooks**: Custom React hooks
- **Models**: Data models with decorators
- **Routers**: Routing configuration
- **Layouts**: Layout components

## Development Workflow

1. **Understand the requirement** - Read the task carefully and ask for clarification if needed
2. **Gather context** - Read relevant files to understand the codebase structure
3. **Plan the implementation** - Think about which files need to be created/modified
4. **Make changes** - Follow the architecture and coding standards
5. **Handle shadcn components** - Use CLI if adding new shadcn components
6. **Create molecules** - If creating complex components, add molecule wrappers
7. **Add Storybook stories** - Create stories for all new molecule components
8. **Test mentally** - Review your changes for correctness
9. **Run linting** - `pnpm lint --fix` and report errors (DO NOT FIX)
10. **Never create documentation** - Unless explicitly requested by the user

## CRITICAL Rules (Never Break These)

### 1. Documentation Policy

**❌ DO NOT create documentation files after completing tasks**

- No summary markdown files
- No changelog files
- No automatic documentation generation
- Only create docs if the user explicitly asks for it

### 2. Linting Policy

**After EVERY task:**

```bash
pnpm lint --fix
```

- Run this command without fail
- Show ONLY errors in the output
- DO NOT auto-fix the errors
- Report errors to the user for manual review
- This is non-negotiable

### 3. shadcn/ui Policy

**NEVER manually write shadcn component code**

- Always use: `pnpm dlx shadcn@latest add <component>`
- Never copy-paste shadcn code from documentation
- Never generate shadcn component code
- Let the CLI handle all installations

### 4. Package Manager Policy

**Only use pnpm**

- No `npm install`
- No `yarn add`
- No `npx` (use `pnpm dlx` instead)
- Always prefix commands with `pnpm`

## DO NOT

- ❌ Manually create shadcn component code
- ❌ Use npm or yarn
- ❌ Auto-fix linting errors after tasks
- ❌ Skip the linting step
- ❌ Use `any` type excessively
- ❌ Modify generated files (like `routeTree.gen.ts`)
- ❌ Create documentation after completing tasks
- ❌ Create markdown (.md) files for task summaries
- ❌ **Hardcode text directly in code - ALWAYS use i18n**
- ❌ Use inline styles (use Tailwind)
- ❌ Create components without proper typing
- ❌ Skip Storybook for molecule components
- ❌ Commit without running linter
- ❌ Use `var` (use `const` or `let`)
- ❌ Ignore accessibility (a11y)
- ❌ Create large monolithic components
- ❌ Skip error handling

## DO

- ✅ Use pnpm for all package operations
- ✅ Use shadcn CLI for component installation
- ✅ Create molecule wrappers for complex components
- ✅ Add Storybook stories for molecules
- ✅ Run `pnpm lint --fix` after every task
- ✅ Report lint errors without fixing
- ✅ Follow TypeScript best practices
- ✅ Use proper component layering (atoms → molecules → containers)
- ✅ Use i18n for all user-facing text
- ✅ Implement proper error boundaries
- ✅ Add loading states
- ✅ Handle edge cases
- ✅ Use semantic HTML
- ✅ Follow accessibility guidelines
- ✅ Write clean, readable code
- ✅ Use meaningful variable names
- ✅ Add proper TypeScript types
- ✅ Test edge cases mentally

## Storybook

- Storybook is configured for component development
- Run with: `pnpm storybook`
- Build with: `pnpm build-storybook`
- Create stories for all molecule components
- Follow Storybook CSF3 format
- Story file naming: `<component>.stories.tsx`
- Include multiple variants/states
- Document props with JSDoc
- Add controls for interactive props
- Example story structure:

  ```typescript
  import type { Meta, StoryObj } from '@storybook/react'
  import { MyComponent } from './index'

  const meta: Meta<typeof MyComponent> = {
    title: 'Molecules/MyComponent',
    component: MyComponent,
    tags: ['autodocs'],
  }

  export default meta
  type Story = StoryObj<typeof MyComponent>

  export const Default: Story = {
    args: {
      // default props
    },
  }
  ```

## GraphQL

- Using Apollo Client for GraphQL operations
- GraphQL files should use `.graphql` extension
- Use `@graphql-eslint/eslint-plugin` for linting
- Patterns:
  - Queries in `src/graphql/queries/`
  - Mutations in `src/graphql/mutations/`
  - Fragments in `src/graphql/fragments/`
- Use hooks: `useQuery`, `useMutation`, `useLazyQuery`
- Handle loading and error states
- Implement proper cache updates after mutations
- Use fragments for reusable field sets

## Performance Best Practices

- Implement code splitting with `React.lazy()`
- Use `useMemo()` and `useCallback()` when necessary
- Avoid unnecessary re-renders
- Optimize images (use proper formats and sizes)
- Lazy load routes and heavy components
- Monitor bundle size
- Use proper keys in lists
- Debounce expensive operations
- Virtualize long lists if needed

## Accessibility (a11y)

- Use semantic HTML elements
- Add proper ARIA labels
- Ensure keyboard navigation works
- Maintain proper heading hierarchy
- Add alt text to images
- Ensure sufficient color contrast
- Test with screen readers mentally
- Use focus-visible states
- Avoid `onClick` on non-interactive elements
- Provide text alternatives for icons

## Error Handling

- Implement error boundaries for React errors
- Handle async errors in try-catch blocks
- Show user-friendly error messages
- Log errors for debugging
- Provide recovery options
- Handle network errors gracefully
- Validate user input
- Handle edge cases
- Never expose sensitive error details to users
- Use proper HTTP status codes

## Common Patterns

### Creating a New Page

1. Create route file in `src/routes/`
2. Create container in `src/containers/`
3. Add translations in `src/locales/messages/`
4. Update route configuration if needed
5. Add to navigation/menu if applicable

### Creating a New Molecule Component

1. Install base shadcn components if needed
2. Create folder in `src/components/molecules/<name>/`
3. Create main component file `index.tsx`
4. Create types file if complex
5. Create Storybook story `<name>.stories.tsx`
6. Export from molecule folder
7. Document props with JSDoc

## Quick Reference

### Available Scripts

```bash
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm lint         # Run ESLint (MUST RUN AFTER TASKS)
pnpm type         # Type check without emit
pnpm storybook    # Start Storybook dev server
```

### Import Aliases

All configured in `tsconfig.json` and `vite.config.ts`:

- `@/` → `src/`
- Direct imports from aliases configured in `components.json`

---

**Remember: Quality over speed. Follow these rules strictly to maintain code consistency and project standards.**

**NEVER SKIP THE LINTING STEP. NEVER CREATE DOCUMENTATION UNLESS ASKED.**
