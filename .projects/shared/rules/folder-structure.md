# Folder Structure

This document defines the organization and structure of files and directories in the project.

## Project Root Structure

```
.
├── .agents/              # Agent-specific configurations and skills
├── .github/              # GitHub configurations and workflows
├── .projects/            # Project-level rules and documentation
├── .storybook/           # Storybook configuration
├── .vscode/              # VSCode settings
├── caddy_server/         # Caddy server configuration
├── docker/               # Docker configurations
├── public/               # Static assets
└── src/                  # Source code (main application code)
    ├── apis/             # API layer
    ├── app/              # App entry point
    ├── assets/           # Application assets
    ├── commons/          # Common utilities
    ├── components/       # UI components
    ├── constants/        # Constants
    ├── containers/       # Page-level components
    ├── contexts/         # React contexts
    ├── decorators/       # TypeScript decorators
    ├── hooks/            # Custom React hooks
    ├── layouts/          # Layout components
    ├── lib/              # Third-party library configurations
    ├── locales/          # Internationalization
    ├── models/           # Data models
    ├── routers/          # Router configurations
    ├── routes/           # Route definitions (TanStack Router)
    ├── styles/           # Global styles
    └── tests/            # Test utilities
```

## Component Organization

### Atomic Design Pattern

Components follow Atomic Design principles:

```
src/components/
├── atoms/              # Simplest components (single file)
│   ├── button.tsx
│   ├── input.tsx
│   ├── dialog.tsx
│   └── card.tsx
├── molecules/          # Complex components (folder structure)
│   ├── avatar/
│   │   ├── index.tsx
│   │   ├── avatar.stories.tsx
│   │   └── __tests__/
│   │       └── avatar.test.tsx
│   └── data-table/
│       ├── index.tsx
│       ├── data-table.stories.tsx
│       ├── types.ts
│       └── __tests__/
│           └── data-table.test.tsx
└── box/               # Layout components
    ├── page-container.tsx
    └── content-wrapper.tsx
```

**Rules:**
1. **Atoms**: Single `.tsx` file for simple, standalone components
2. **Molecules**: Folder with `index.tsx` for complex components
   - Must include Storybook story (`.stories.tsx`)
   - Should include tests in `__tests__/` directory
   - Can include additional files (`types.ts`, `utils.ts`, etc.)
3. **Box**: Layout components that provide structure

## Container Structure

Feature-based organization for pages and business logic:

```
src/containers/
└── {feature}/
    ├── index.tsx                    # Main container/list page
    ├── {feature}-create-page.tsx    # Create page
    ├── {feature}-edit-page.tsx      # Edit page
    ├── {feature}-edit-sheet.tsx     # Edit sheet/modal
    ├── components/                  # Feature-specific components
    │   ├── {component}/
    │   │   ├── index.tsx
    │   │   └── __tests__/
    │   │       └── {component}.test.tsx
    │   └── {feature}-form/
    │       ├── index.tsx
    │       └── __tests__/
    └── __tests__/                   # Container-level tests
        └── {feature}.test.tsx
```

**Example: Users Feature**

```
src/containers/users/
├── index.tsx                        # User list page
├── user-create-page.tsx             # Create user page
├── user-edit-page.tsx               # Edit user page
├── user-edit-sheet.tsx              # Edit user sheet
├── components/
│   ├── user-form/
│   │   ├── index.tsx
│   │   └── __tests__/
│   │       └── user-form.test.tsx
│   ├── create-user-form/
│   │   ├── index.tsx
│   │   └── __tests__/
│   │       └── create-user-form.test.tsx
│   └── edit-user-form/
│       ├── index.tsx
│       └── __tests__/
│           └── edit-user-form.test.tsx
└── __tests__/
    └── users.test.tsx
```

## API Structure

Separation between core logic and React hooks:

```
src/apis/
└── {resource}/
    ├── cores/                      # Pure API functions
    │   ├── get-{resource}s.ts      # List operation
    │   ├── get-{resource}-by-id.ts # Single item
    │   ├── create-{resource}.ts    # Create operation
    │   ├── update-{resource}.ts    # Update operation
    │   ├── delete-{resource}.ts    # Delete operation
    │   └── helpers.ts              # Helper functions
    ├── hooks/                      # React Query hooks
    │   ├── use-{resource}s.ts
    │   ├── use-{resource}-by-id.ts
    │   ├── use-create-{resource}.ts
    │   ├── use-update-{resource}.ts
    │   └── use-delete-{resource}.ts
    └── mock-data.ts                # Mock data for development
```

**Example: User API**

```
src/apis/user/
├── cores/
│   ├── get-users.ts
│   ├── get-user-by-id.ts
│   ├── create-user.ts
│   ├── update-user.ts
│   ├── delete-user.ts
│   └── helpers.ts
├── hooks/
│   ├── use-users.ts
│   ├── use-user-by-id.ts
│   ├── use-create-user.ts
│   ├── use-update-user.ts
│   └── use-delete-user.ts
└── mock-data.ts
```

## Context Structure

```
src/contexts/
└── {feature}/
    ├── context.ts      # Context definition and custom hooks
    └── provider.tsx    # Provider component
```

**Example:**

```
src/contexts/
├── auth/
│   ├── context.ts      # AuthContext, useAuthContext
│   └── provider.tsx    # AuthProvider
├── setting/
│   ├── context.ts
│   └── provider.tsx
└── tag-view/
    ├── context.ts
    └── provider.tsx
```

## Routing Structure

TanStack Router file-based routing:

```
src/routes/
├── __root.tsx                      # Root layout
├── _authenticated.tsx              # Authenticated layout
├── _authenticated/
│   └── {resource}/
│       ├── index.tsx               # List page
│       ├── create.tsx              # Create page
│       ├── $id.tsx                 # Detail page
│       └── $id.edit.tsx            # Edit page
├── index.tsx                       # Home page
└── login.tsx                       # Login page
```

**Example: Users Routes**

```
src/routes/
├── __root.tsx
├── _authenticated.tsx
├── _authenticated/
│   └── users/
│       ├── index.tsx               # /users
│       ├── create.tsx              # /users/create
│       ├── $userId.tsx             # /users/:userId
│       └── $userId.edit.tsx        # /users/:userId/edit
├── index.tsx                       # /
└── login.tsx                       # /login
```

## Common Utilities Structure

```
src/commons/
├── {utility}.ts           # Single utility file
├── {category}/            # Grouped utilities
│   ├── index.ts
│   ├── {utility}.ts
│   └── __tests__/
│       └── {utility}.test.ts
└── validates/             # Validation schemas
    ├── common.ts
    └── {feature}.ts
```

**Example:**

```
src/commons/
├── cookies.ts
├── money.ts
├── object.ts
├── string.ts
├── datetime/
│   ├── index.ts
│   ├── format.ts
│   └── __tests__/
│       └── format.test.ts
└── validates/
    ├── common.ts
    └── user.ts
```

## Test Organization

Tests are placed in `__tests__/` directories alongside the code being tested:

```
✅ CORRECT:
src/components/molecules/avatar/
├── index.tsx
└── __tests__/
    └── avatar.test.tsx

src/containers/users/
├── index.tsx
└── __tests__/
    └── users.test.tsx

src/hooks/
├── use-mobile.ts
└── __tests__/
    └── use-mobile.test.ts

src/commons/
├── string.ts
└── __tests__/
    └── string.test.ts
```

## Model Structure

```
src/models/
├── {model}.ts            # Model with decorators
└── index.ts              # Barrel export (optional)
```

**Example:**

```
src/models/
├── user.ts
├── account.ts
├── pagination.ts
└── base.ts
```

## Constants Structure

```
src/constants/
├── config.ts             # App configuration
├── env.ts                # Environment variables
├── key.ts                # Storage/cookie keys
└── permission.ts         # Permission constants
```

## Locales Structure

```
src/locales/
├── config/
│   ├── i18n.ts          # i18n configuration
│   └── index.ts
└── messages/
    ├── en.json          # English translations
    ├── vi.json          # Vietnamese translations
    └── index.ts
```

## Layout Structure

```
src/layouts/
└── {layout-name}/
    ├── constants.ts
    ├── content/
    │   └── index.tsx
    ├── header/
    │   └── index.tsx
    ├── sider/
    │   ├── index.tsx
    │   └── components/
    └── footer/
        └── index.tsx
```

## Where to Place New Files

### New Component?
- **Simple component** → `src/components/atoms/{name}.tsx`
- **Complex component** → `src/components/molecules/{name}/index.tsx`
- **Layout component** → `src/components/box/{name}.tsx`

### New Page?
- **Container** → `src/containers/{feature}/index.tsx`
- **Route** → `src/routes/_authenticated/{feature}/index.tsx`

### New API?
- **Core function** → `src/apis/{resource}/cores/{action}-{resource}.ts`
- **Hook** → `src/apis/{resource}/hooks/use-{action}-{resource}.ts`

### New Model?
- **Model** → `src/models/{model}.ts`

### New Hook?
- **Hook** → `src/hooks/{hook-name}.ts`

### New Context?
- **Context** → `src/contexts/{feature}/context.ts`
- **Provider** → `src/contexts/{feature}/provider.tsx`

### New Utility?
- **Simple utility** → `src/commons/{utility}.ts`
- **Grouped utilities** → `src/commons/{category}/{utility}.ts`

### New Test?
- Place in `__tests__/` directory next to the file being tested

## Key Principles

1. **Feature-based organization**: Group by feature, not by file type
2. **Co-location**: Keep related files close together
3. **Test proximity**: Tests live next to the code they test
4. **Clear separation**: Separate concerns (UI, logic, data)
5. **Consistent structure**: Follow the same pattern across features
6. **Progressive complexity**: Simple files at top level, complex in folders
