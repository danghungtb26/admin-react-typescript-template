# Naming Conventions

This document defines naming standards for all code elements in the project.

## File Naming

All files use **kebab-case**:

```
✅ CORRECT:
- user-form.tsx
- data-table.tsx
- get-users.ts
- create-user.ts
- use-create-user.ts
- string.test.ts
- avatar.stories.tsx

❌ WRONG:
- UserForm.tsx
- dataTable.tsx
- getUsers.ts
- user_form.tsx
```

## Variable Naming

### Components

**Pattern:** PascalCase

```typescript
✅ CORRECT:
const Avatar = () => { ... }
const UserForm = () => { ... }
const DataTable = () => { ... }
const UserCreatePage = () => { ... }

❌ WRONG:
const avatar = () => { ... }
const userForm = () => { ... }
const user_create_page = () => { ... }
```

### Hooks

**Pattern:** camelCase with `use` prefix

```typescript
✅ CORRECT:
const useUsers = () => { ... }
const useCreateUser = () => { ... }
const useIsMobile = () => { ... }
const useAuthContext = () => { ... }

❌ WRONG:
const Users = () => { ... }
const create_user = () => { ... }
const UseUsers = () => { ... }
```

### Functions

**Pattern:** camelCase

```typescript
✅ CORRECT:
function getUsers() { ... }
function createUser() { ... }
function formatDate() { ... }
function slugify() { ... }
function isExist() { ... }

❌ WRONG:
function GetUsers() { ... }
function create_user() { ... }
function format-date() { ... }
```

### Constants

**Pattern:** UPPER_SNAKE_CASE

```typescript
✅ CORRECT:
const AUTHEN_TOKEN_KEY = 'auth_token'
const LOCALE_KEY = 'locale'
const MOBILE_BREAKPOINT = 768
const HH_MM_SS_DD_MM_YYYY = 'HH:mm:ss DD/MM/YYYY'

❌ WRONG:
const authenTokenKey = 'auth_token'
const LocaleKey = 'locale'
const mobile_breakpoint = 768
```

### Types and Interfaces

**Pattern:** PascalCase

```typescript
✅ CORRECT:
interface UserFormProps { ... }
interface AuthContextType { ... }
type ListUsersParams = { ... }
type UserEditFormData = { ... }

❌ WRONG:
interface userFormProps { ... }
interface auth_context_type { ... }
type list_users_params = { ... }
```

### Classes (Models)

**Pattern:** PascalCase

```typescript
✅ CORRECT:
class User { ... }
class Account { ... }
class Pagination { ... }
class DateTime { ... }

❌ WRONG:
class user { ... }
class account_model { ... }
```

## Specific Naming Patterns

### Page Components

**Pattern:** `{Feature}{Action}Page` or `{Feature}{Action}Sheet`

```typescript
✅ CORRECT:
// File: user-create-page.tsx
export function UserCreatePage() { ... }

// File: user-edit-page.tsx
export function UserEditPage() { ... }

// File: user-edit-sheet.tsx
export function UserEditSheet() { ... }

❌ WRONG:
export function CreateUser() { ... }
export function UserEdit() { ... }
```

### Form Components

**Pattern:** `{Feature}Form` or `{Action}{Feature}Form`

```typescript
✅ CORRECT:
// Generic form
export function UserForm() { ... }

// Specific action forms
export function CreateUserForm() { ... }
export function EditUserForm() { ... }

❌ WRONG:
export function Form() { ... }
export function UserFormComponent() { ... }
```

### API Functions

#### Core Functions (in `cores/`)

**Pattern:** `{verb}{Resource}` (camelCase)

```typescript
✅ CORRECT:
// File: get-users.ts
export function getUsers() { ... }

// File: get-user-by-id.ts
export function getUserById() { ... }

// File: create-user.ts
export function createUser() { ... }

// File: update-user.ts
export function updateUser() { ... }

// File: delete-user.ts
export function deleteUser() { ... }

❌ WRONG:
export function fetchUsers() { ... }
export function Users() { ... }
export function get_users() { ... }
```

#### React Hooks (in `hooks/`)

**Pattern:** `use{Action}{Resource}` (camelCase)

```typescript
✅ CORRECT:
// File: use-users.ts
export function useUsers() { ... }

// File: use-user-by-id.ts
export function useUserById() { ... }

// File: use-create-user.ts
export function useCreateUser() { ... }

// File: use-update-user.ts
export function useUpdateUser() { ... }

// File: use-delete-user.ts
export function useDeleteUser() { ... }

❌ WRONG:
export function useFetchUsers() { ... }
export function useGetUsers() { ... }
export function useUser() { ... }  // Too vague
```

## Route Parameter Naming

**Pattern:** `${resourceName}Id` (camelCase with $ prefix in file name)

```typescript
✅ CORRECT:
// File: $userId.tsx
const { userId } = useParams()

// File: $productId.tsx
const { productId } = useParams()

// File: $orderId.tsx
const { orderId } = useParams()

❌ WRONG:
// File: $id.tsx (too generic)
// File: $user_id.tsx
// File: $UserID.tsx
```

## Boolean Variables and Functions

Prefix with `is`, `has`, `should`, or `can`:

```typescript
✅ CORRECT:
const isLoading = true
const hasPermission = false
const shouldRender = true
const canEdit = false

function isValid() { ... }
function hasAccess() { ... }

❌ WRONG:
const loading = true
const permission = false
const render = true
```

## Event Handler Naming

**Pattern:** `handle{EventName}` or `on{EventName}`

```typescript
✅ CORRECT:
const handleClick = () => { ... }
const handleSubmit = () => { ... }
const onUserCreate = () => { ... }
const onFormChange = () => { ... }

❌ WRONG:
const click = () => { ... }
const submit_handler = () => { ... }
const userCreate = () => { ... }
```

## Summary Table

| Element | Pattern | Example |
|---------|---------|---------|
| Files | kebab-case | `user-form.tsx`, `get-users.ts` |
| Components | PascalCase | `UserForm`, `DataTable` |
| Hooks | camelCase + `use` | `useUsers`, `useCreateUser` |
| Functions | camelCase | `getUsers`, `createUser` |
| Constants | UPPER_SNAKE_CASE | `AUTHEN_TOKEN_KEY` |
| Types/Interfaces | PascalCase | `UserFormProps`, `ListUsersParams` |
| Classes | PascalCase | `User`, `Account` |
| Booleans | `is/has/should/can` | `isLoading`, `hasPermission` |
| Event Handlers | `handle/on` + Event | `handleClick`, `onSubmit` |

## Enforcement

These naming conventions are enforced through:
- ESLint rules
- Code review process
- TypeScript strict mode

Always follow these conventions to maintain consistency across the codebase.
