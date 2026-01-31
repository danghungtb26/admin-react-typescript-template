# API Patterns Reference

Complete guide for implementing APIs in this project.

## Core API Functions

Core API functions are pure Promise-based functions in `src/apis/{resource}/cores/`.

### Standard Pattern

```typescript
// src/apis/user/cores/get-users.ts
import { httpClient } from '@/apis/http-client'
import type { ListUsersParams, ListUsersResponse } from '@/models/user'

export async function getUsers(
  params?: ListUsersParams
): Promise<ListUsersResponse> {
  const response = await httpClient.get<ListUsersResponse>('/users', {
    params,
  })
  return response.data
}
```

### Create Operation

```typescript
// src/apis/user/cores/create-user.ts
import { httpClient } from '@/apis/http-client'
import type { CreateUserData, User } from '@/models/user'

export async function createUser(data: CreateUserData): Promise<User> {
  const response = await httpClient.post<User>('/users', data)
  return response.data
}
```

### Update Operation

```typescript
// src/apis/user/cores/update-user.ts
import { httpClient } from '@/apis/http-client'
import type { UpdateUserData, User } from '@/models/user'

export async function updateUser(
  id: string,
  data: UpdateUserData
): Promise<User> {
  const response = await httpClient.put<User>(`/users/${id}`, data)
  return response.data
}
```

### Delete Operation

```typescript
// src/apis/user/cores/delete-user.ts
import { httpClient } from '@/apis/http-client'

export async function deleteUser(id: string): Promise<void> {
  await httpClient.delete(`/users/${id}`)
}
```

### Get by ID Operation

```typescript
// src/apis/user/cores/get-user-by-id.ts
import { httpClient } from '@/apis/http-client'
import type { User } from '@/models/user'

export async function getUserById(id: string): Promise<User> {
  const response = await httpClient.get<User>(`/users/${id}`)
  return response.data
}
```

## React Query Hooks

Hooks wrap core functions and use React Query for caching and state management.

### Query Hook (List)

```typescript
// src/apis/user/hooks/use-users.ts
import { useQuery } from '@tanstack/react-query'
import { getUsers } from '../cores/get-users'
import type { ListUsersParams } from '@/models/user'

export function useUsers(params?: ListUsersParams) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => getUsers(params),
  })
}
```

### Query Hook (By ID)

```typescript
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
```

### Mutation Hook (Create)

```typescript
// src/apis/user/hooks/use-create-user.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createUser } from '../cores/create-user'
import type { CreateUserData } from '@/models/user'

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateUserData) => createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
```

### Mutation Hook (Update)

```typescript
// src/apis/user/hooks/use-update-user.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateUser } from '../cores/update-user'
import type { UpdateUserData } from '@/models/user'

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserData }) =>
      updateUser(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
```

### Mutation Hook (Delete)

```typescript
// src/apis/user/hooks/use-delete-user.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteUser } from '../cores/delete-user'

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
```

## Type Definitions

Place type definitions in `src/models/{resource}.ts`:

```typescript
// src/models/user.ts
export interface User {
  id: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface CreateUserData {
  name: string
  email: string
  password: string
}

export interface UpdateUserData {
  name?: string
  email?: string
}

export interface ListUsersParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface ListUsersResponse {
  data: User[]
  total: number
  page: number
  limit: number
}
```

## Usage in Components

```typescript
// In a component
import { useUsers } from '@/apis/user/hooks/use-users'
import { useCreateUser } from '@/apis/user/hooks/use-create-user'

function UserList() {
  const { data, isLoading, error } = useUsers({ page: 1, limit: 10 })
  const createUserMutation = useCreateUser()

  const handleCreate = async (userData: CreateUserData) => {
    try {
      await createUserMutation.mutateAsync(userData)
      // Success handling
    } catch (error) {
      // Error handling
    }
  }

  // Component rendering...
}
```

## Best Practices

1. **Separation of Concerns**: Core functions are pure, hooks handle React integration
2. **Type Safety**: Always define proper types for params and responses
3. **Query Keys**: Use consistent query key patterns for cache invalidation
4. **Error Handling**: Let React Query handle errors, use error boundaries
5. **Optimistic Updates**: Use for better UX when appropriate
6. **Cache Invalidation**: Invalidate related queries after mutations
