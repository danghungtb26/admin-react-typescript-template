# Admin React TypeScript Template

A production-ready admin dashboard template built with modern React ecosystem and best practices.

## ✨ Features

- ⚡️ **React 19** - Latest React with concurrent features
- 🎯 **TypeScript 5.9+** - Full type safety with decorators support
- 🚀 **Vite 7** - Lightning fast dev server and HMR
- 🛣️ **TanStack Router v7+** - Type-safe file-based routing
- 🔄 **TanStack Query** - Powerful data fetching and caching
- 🎨 **Tailwind CSS v4** - Utility-first styling
- 🧩 **shadcn/ui** - Beautiful, accessible component library
- 🌍 **i18next** - Internationalization ready
- 🎭 **Storybook** - Component development and documentation
- 📝 **ESLint + Prettier** - Code quality and formatting
- 🎨 **Dark Mode** - Built-in theme switching
- 🔐 **Authentication** - Protected routes with auth context
- 🏗️ **Model Decorators** - Elegant API serialization pattern

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (required package manager)

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The app will be available at `http://localhost:3000`

## 📦 Available Scripts

```bash
pnpm dev          # Start dev server on :3000
pnpm build        # Type check + production build
pnpm preview      # Preview production build
pnpm lint         # Run ESLint with auto-fix
pnpm type         # TypeScript type checking
pnpm storybook    # Start Storybook dev server
```

## 🏗️ Project Structure

```
src/
├── apis/              # API layer organized by domain
│   └── [domain]/
│       ├── cores/     # Core API functions
│       └── hooks/     # React Query hooks
├── app/               # Legacy containers (deprecated)
├── components/
│   ├── atoms/         # shadcn/ui base components
│   ├── molecules/     # Complex composed components
│   └── box/           # Layout components
├── containers/        # Page-level components
├── contexts/          # React contexts (auth, settings)
├── decorators/        # TypeScript decorators for models
├── hooks/             # Custom React hooks
├── layouts/           # Layout components
├── locales/           # i18n translations
├── models/            # Data models with decorators
├── routes/            # TanStack Router file-based routes
│   ├── __root.tsx
│   ├── _authenticated.tsx
│   └── _authenticated/  # Protected routes
└── styles/            # Global styles
```

## 🎨 Component Architecture

### Atoms (Base Components)

shadcn/ui components installed via CLI:

```bash
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add dialog
```

### Molecules (Composed Components)

Complex components built from atoms with custom logic:

- Data tables with sorting/filtering
- Custom form fields
- Complex dropdowns

### Containers (Page Components)

Feature-specific page implementations with business logic.

## 🛣️ Routing

File-based routing with TanStack Router:

```
src/routes/_authenticated/
├── home.tsx              # /home
└── users/
    ├── index.tsx         # /users
    ├── create.tsx        # /users/create
    ├── $userId.tsx       # /users/:userId
    └── $userId.edit.tsx  # /users/:userId/edit
```

### Navigation

Always use route keys for type-safe navigation:

```typescript
import { router_keys } from '@/routers/key'

navigate({ to: router_keys.users })
```

## 🔌 API Layer

### Model Decorators

```typescript
import { field } from '@/decorators/field'
import { model } from '@/decorators/model'

@model()
export class User extends Base {
  @field('user_name')
  name?: string

  @field()
  email?: string
}
```

### React Query Hooks

```typescript
// src/apis/user/hooks/use-users.ts
export const useUsers = (params?: ListUsersParams) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => getUsers(params || {}),
    placeholderData: keepPreviousData,
  })
}
```

## 🌍 Internationalization

All user-facing text uses i18n:

```typescript
import { useTranslation } from 'react-i18next'

function MyComponent() {
  const { t } = useTranslation()

  return <Button>{t('common:button.save')}</Button>
}
```

Translation files: `src/locales/messages/[lang].json`

## 🎯 Path Aliases

All imports use `@/` prefix:

```typescript
import { Button } from '@/components/atoms/button'
import { User } from '@/models/user'
import { useUsers } from '@/apis/user/hooks/use-users'
```

## 🔒 Authentication

Protected routes use `_authenticated` layout:

- Automatic redirect to login if not authenticated
- Auth state managed via `AuthContext`
- Token management with cookies

## 📖 Documentation

For detailed guidelines, see:

- [General Instructions](.github/instructions/general.instructions.md)
- [API Patterns](.github/instructions/apis.instructions.md)
- [Routing Conventions](.github/instructions/routing.instructions.md)

## 🤝 Contributing

1. Follow the project structure and naming conventions
2. Use `pnpm` as package manager
3. Always run `pnpm lint` before committing
4. Create Storybook stories for molecule components
5. Use i18n for all user-facing text
6. Never hardcode routes - use `router_keys`

## 📝 License

[Your License]
