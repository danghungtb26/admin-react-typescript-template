# Form Screen Example

Complete implementation of create/edit form screen following project conventions.

## Architecture

**Key Principles:**
1. **Separation of Concerns**: Form component only handles display & validation
2. **Submit logic in parent**: Page component handles data fetching and mutations
3. **Project conventions**: Follow atomic design and API structure

## Structure

```
┌────────────────────────────────┐
│ Header (Title + Breadcrumb)    │
├────────────────────────────────┤
│ Form Component                 │
│   [Display & Validation only]  │
│   [Pass data to parent]        │
├────────────────────────────────┤
│ Actions (in Form component)    │
└────────────────────────────────┘

Parent (Page):
  - Fetch initial data
  - Handle submit mutation
  - Navigation logic
  
Child (Form):
  - Display fields
  - Validation
  - Emit onSubmit to parent
```

## File Structure

```
src/
├── routes/_authenticated/users/
│   ├── create.tsx              # Create page (parent)
│   └── $id.edit.tsx            # Edit page (parent)
├── containers/users/
│   └── components/
│       └── user-form/          # Form component (child)
│           ├── index.tsx
│           └── __tests__/
│               └── user-form.test.tsx
├── apis/user/
│   ├── cores/
│   │   ├── get-user-by-id.ts
│   │   ├── create-user.ts
│   │   └── update-user.ts
│   └── hooks/
│       ├── use-user-by-id.ts
│       ├── use-create-user.ts
│       └── use-update-user.ts
└── models/
    └── user.ts
```

## Complete Example

### Step 1: Define Model

```typescript
// src/models/user.ts
export interface User {
  id: string
  name: string
  email: string
  role: string
  department?: string
  phone?: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface UserFormData {
  name: string
  email: string
  role: string
  department?: string
  phone?: string
}
```

### Step 2: API Layer

```typescript
// src/apis/user/cores/get-user-by-id.ts
import { httpClient } from '@/libs/http-client'
import type { User } from '@/models/user'

export async function getUserById(id: string): Promise<User> {
  const response = await httpClient.get<User>(`/users/${id}`)
  return response.data
}

// src/apis/user/cores/create-user.ts
import { httpClient } from '@/libs/http-client'
import type { User, UserFormData } from '@/models/user'

export async function createUser(data: UserFormData): Promise<User> {
  const response = await httpClient.post<User>('/users', data)
  return response.data
}

// src/apis/user/cores/update-user.ts
import { httpClient } from '@/libs/http-client'
import type { User, UserFormData } from '@/models/user'

export async function updateUser(id: string, data: UserFormData): Promise<User> {
  const response = await httpClient.put<User>(`/users/${id}`, data)
  return response.data
}

// src/apis/user/hooks/use-user-by-id.ts
import { useQuery } from '@tanstack/react-query'
import { getUserById } from '../cores/get-user-by-id'

export function useUserById(id: string) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => getUserById(id),
    enabled: !!id,
  })
}

// src/apis/user/hooks/use-create-user.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createUser } from '../cores/create-user'
import type { UserFormData } from '@/models/user'

export function useCreateUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: UserFormData) => createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

// src/apis/user/hooks/use-update-user.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateUser } from '../cores/update-user'
import type { UserFormData } from '@/models/user'

export function useUpdateUser(id: string) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: UserFormData) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['users', id] })
    },
  })
}
```

### Step 3: Form Component (Display & Validation Only)

```typescript
// src/containers/users/components/user-form/index.tsx
import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { z } from 'zod'
import { Button } from '@/components/atoms/button'
import { Input } from '@/components/atoms/input'
import { Select } from '@/components/atoms/select'
import type { UserFormData } from '@/models/user'

// Validation schema
const userFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  role: z.string().min(1, 'Role is required'),
  department: z.string().optional(),
  phone: z.string().optional(),
})

interface UserFormProps {
  initialData?: UserFormData
  onSubmit: (data: UserFormData) => void | Promise<void>
  isSubmitting?: boolean
  submitLabel?: string
  onCancel?: () => void
}

export function UserForm({
  initialData,
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Save',
  onCancel,
}: UserFormProps) {
  const form = useForm({
    defaultValues: initialData ?? {
      name: '',
      email: '',
      role: '',
      department: '',
      phone: '',
    },
    validatorAdapter: zodValidator,
    validators: {
      onChange: userFormSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })
  
  // Role options (could come from API)
  const roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'user', label: 'User' },
    { value: 'viewer', label: 'Viewer' },
  ]
  
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="bg-white p-6 rounded-lg shadow space-y-6"
    >
      {/* Name field */}
      <form.Field
        name="name"
        children={(field) => (
          <div>
            <label className="block text-sm font-medium mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="Enter user name"
              error={!field.state.meta.isValid && field.state.meta.isTouched}
            />
            {!field.state.meta.isValid && field.state.meta.isTouched && (
              <p className="text-red-500 text-sm mt-1">
                {field.state.meta.errors[0]}
              </p>
            )}
          </div>
        )}
      />
      
      {/* Email field */}
      <form.Field
        name="email"
        children={(field) => (
          <div>
            <label className="block text-sm font-medium mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="user@example.com"
              error={!field.state.meta.isValid && field.state.meta.isTouched}
            />
            {!field.state.meta.isValid && field.state.meta.isTouched && (
              <p className="text-red-500 text-sm mt-1">
                {field.state.meta.errors[0]}
              </p>
            )}
          </div>
        )}
      />
      
      {/* Role field */}
      <form.Field
        name="role"
        children={(field) => (
          <div>
            <label className="block text-sm font-medium mb-1">
              Role <span className="text-red-500">*</span>
            </label>
            <Select
              value={field.state.value}
              onChange={(value) => field.handleChange(value)}
              onBlur={field.handleBlur}
              options={roleOptions}
              placeholder="Select a role"
              error={!field.state.meta.isValid && field.state.meta.isTouched}
            />
            {!field.state.meta.isValid && field.state.meta.isTouched && (
              <p className="text-red-500 text-sm mt-1">
                {field.state.meta.errors[0]}
              </p>
            )}
          </div>
        )}
      />
      
      {/* Department field (optional) */}
      <form.Field
        name="department"
        children={(field) => (
          <div>
            <label className="block text-sm font-medium mb-1">
              Department
            </label>
            <Input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Engineering, Sales, etc."
            />
          </div>
        )}
      />
      
      {/* Phone field (optional) */}
      <form.Field
        name="phone"
        children={(field) => (
          <div>
            <label className="block text-sm font-medium mb-1">
              Phone
            </label>
            <Input
              type="tel"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="+1 (555) 000-0000"
            />
          </div>
        )}
      />
      
      {/* Form actions */}
      <div className="flex gap-2 pt-6 border-t">
        <Button
          type="submit"
          disabled={!form.state.canSubmit || isSubmitting}
        >
          {isSubmitting ? 'Saving...' : submitLabel}
        </Button>
        
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
      </div>
      
      {/* Unsaved changes warning */}
      {form.state.isDirty && (
        <p className="text-sm text-amber-600">
          You have unsaved changes
        </p>
      )}
    </form>
  )
}
```

### Step 4: Create Page (Parent Component)

```typescript
// src/routes/_authenticated/users/create.tsx
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { PageHeader } from '@/components/atoms/page-header'
import { UserForm } from '@/containers/users/components/user-form'
import { useCreateUser } from '@/apis/user/hooks/use-create-user'
import { toast } from '@/components/atoms/toast'
import type { UserFormData } from '@/models/user'

export const Route = createFileRoute('/_authenticated/users/create')({
  component: UserCreatePage,
  staticData: {
    meta: {
      title: 'Create User',
      titleKey: 'users.create.title',
    },
  },
})

function UserCreatePage() {
  const navigate = useNavigate()
  const createMutation = useCreateUser()
  
  const handleSubmit = async (data: UserFormData) => {
    try {
      await createMutation.mutateAsync(data)
      toast.success('User created successfully')
      navigate({ to: '/users' })
    } catch (error) {
      toast.error('Failed to create user')
      throw error // Re-throw to let form handle it
    }
  }
  
  const handleCancel = () => {
    navigate({ to: '/users' })
  }
  
  return (
    <div className="max-w-2xl mx-auto p-6">
      <PageHeader
        title="Create User"
        breadcrumb={['Users', 'Create']}
      />
      
      <div className="mt-6">
        <UserForm
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending}
          submitLabel="Create User"
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}
```

### Step 5: Edit Page (Parent Component)

```typescript
// src/routes/_authenticated/users/$id.edit.tsx
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { PageHeader } from '@/components/atoms/page-header'
import { Spinner } from '@/components/atoms/spinner'
import { UserForm } from '@/containers/users/components/user-form'
import { useUserById } from '@/apis/user/hooks/use-user-by-id'
import { useUpdateUser } from '@/apis/user/hooks/use-update-user'
import { toast } from '@/components/atoms/toast'
import type { UserFormData } from '@/models/user'

export const Route = createFileRoute('/_authenticated/users/$id/edit')({
  component: UserEditPage,
  staticData: {
    meta: {
      title: 'Edit User',
      titleKey: 'users.edit.title',
    },
  },
})

function UserEditPage() {
  const { id } = useParams({ from: '/_authenticated/users/$id/edit' })
  const navigate = useNavigate()
  
  // Fetch user data
  const { data: user, isLoading, error } = useUserById(id)
  
  // Update mutation
  const updateMutation = useUpdateUser(id)
  
  const handleSubmit = async (data: UserFormData) => {
    try {
      await updateMutation.mutateAsync(data)
      toast.success('User updated successfully')
      navigate({ to: '/users' })
    } catch (error) {
      toast.error('Failed to update user')
      throw error
    }
  }
  
  const handleCancel = () => {
    navigate({ to: '/users' })
  }
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    )
  }
  
  if (error || !user) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600">Error</h2>
          <p className="mt-2">Failed to load user data</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="max-w-2xl mx-auto p-6">
      <PageHeader
        title="Edit User"
        breadcrumb={['Users', user.name, 'Edit']}
      />
      
      <div className="mt-6">
        <UserForm
          initialData={{
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department,
            phone: user.phone,
          }}
          onSubmit={handleSubmit}
          isSubmitting={updateMutation.isPending}
          submitLabel="Update User"
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}
```

## Key Features

### 1. **Separation of Concerns**
   - **Form Component**: Only handles display & validation
   - **Page Component**: Handles data fetching, mutations, navigation
   - Clean props interface between parent and child

### 2. **Project Conventions**
   - **File naming**: kebab-case (`user-form`, `create-user.ts`)
   - **Component naming**: PascalCase (`UserForm`, `PageHeader`)
   - **Hook naming**: camelCase with `use` prefix (`useCreateUser`)
   - **API structure**: Separated into `cores/` and `hooks/`

### 3. **Reusability**
   - Same form component for create & edit
   - Different initial data
   - Different submit handlers
   - Different submit labels

### 4. **Type Safety**
   - Shared `UserFormData` type
   - Type-safe API functions
   - Type-safe form validation

### 5. **Error Handling**
   - Toast notifications for success/error
   - Error thrown to form for field-level errors
   - Loading states handled in parent

## Form Component Props Pattern

```typescript
interface FormComponentProps {
  initialData?: FormData        // Optional for create, required for edit
  onSubmit: (data: FormData) => void | Promise<void>  // Parent handles logic
  isSubmitting?: boolean        // Parent controls loading state
  submitLabel?: string          // Customize button text
  onCancel?: () => void        // Parent handles navigation
}
```

## Benefits of This Pattern

✅ **Testable**: Form can be tested independently  
✅ **Reusable**: Same form for create/edit/view modes  
✅ **Maintainable**: Clear separation of display vs logic  
✅ **Type-safe**: Strong typing throughout  
✅ **Convention-compliant**: Follows project structure  

## Related Patterns

- [List Screen](list-screen.md) - Navigate from list to form
- [Multi-Step Form](multi-step-form-screen.md) - For complex forms
- [Project Conventions](../../../project-conventions/SKILL.md) - Full conventions guide
