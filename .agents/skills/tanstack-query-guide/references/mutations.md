# Mutation Patterns

Comprehensive patterns for `useMutation` in TanStack Query.

## Basic Mutations

### Create

```typescript
const createTodoMutation = useMutation({
  mutationFn: async (newTodo: { title: string }) => {
    const response = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTodo),
    })
    if (!response.ok) throw new Error('Failed to create')
    return response.json()
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] })
  },
})

// Usage
createTodoMutation.mutate({ title: 'New Todo' })
```

### Update

```typescript
const updateTodoMutation = useMutation({
  mutationFn: async ({ id, data }: { id: string; data: Partial<Todo> }) => {
    const response = await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return response.json()
  },
  onSuccess: (data, variables) => {
    queryClient.invalidateQueries({ queryKey: ['todos', variables.id] })
    queryClient.invalidateQueries({ queryKey: ['todos'] })
  },
})
```

### Delete

```typescript
const deleteTodoMutation = useMutation({
  mutationFn: async (id: string) => {
    await fetch(`/api/todos/${id}`, { method: 'DELETE' })
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] })
  },
})
```

## Mutation Callbacks

### onMutate - Optimistic Updates

```typescript
const mutation = useMutation({
  mutationFn: updateTodo,
  
  onMutate: async (newTodo) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['todos'] })
    
    // Snapshot previous value
    const previousTodos = queryClient.getQueryData(['todos'])
    
    // Optimistically update cache
    queryClient.setQueryData(['todos'], (old: Todo[]) => {
      return old.map(todo =>
        todo.id === newTodo.id ? { ...todo, ...newTodo } : todo
      )
    })
    
    // Return context for rollback
    return { previousTodos }
  },
})
```

### onSuccess - After Success

```typescript
const mutation = useMutation({
  mutationFn: createTodo,
  
  onSuccess: (data, variables, context) => {
    // data: Response from mutationFn
    // variables: Arguments passed to mutate()
    // context: Value returned from onMutate
    
    console.log('Created todo:', data)
    queryClient.invalidateQueries({ queryKey: ['todos'] })
  },
})
```

### onError - Handle Errors

```typescript
const mutation = useMutation({
  mutationFn: updateTodo,
  
  onError: (error, variables, context) => {
    // Rollback optimistic update
    if (context?.previousTodos) {
      queryClient.setQueryData(['todos'], context.previousTodos)
    }
    
    // Show error toast
    toast.error(`Failed to update: ${error.message}`)
  },
})
```

### onSettled - Always Runs

```typescript
const mutation = useMutation({
  mutationFn: updateTodo,
  
  onSettled: (data, error, variables, context) => {
    // Runs after onSuccess or onError
    // Always refetch to ensure consistency
    queryClient.invalidateQueries({ queryKey: ['todos'] })
  },
})
```

## Async/Await with Mutations

### Using mutateAsync

```typescript
const createTodoMutation = useMutation({
  mutationFn: createTodo,
})

const handleSubmit = async (data: TodoData) => {
  try {
    const newTodo = await createTodoMutation.mutateAsync(data)
    console.log('Created:', newTodo)
    navigate(`/todos/${newTodo.id}`)
  } catch (error) {
    console.error('Failed:', error)
  }
}
```

## Mutation Status

### Track Mutation State

```typescript
const mutation = useMutation({ mutationFn: createTodo })

const {
  isPending,    // Mutation in progress
  isError,      // Mutation failed
  isSuccess,    // Mutation succeeded
  data,         // Response data
  error,        // Error object
  variables,    // Variables passed to mutate
} = mutation
```

## Sequential Mutations

### Chain Mutations

```typescript
const createUserMutation = useMutation({
  mutationFn: createUser,
  onSuccess: async (user) => {
    // After creating user, create profile
    await createProfileMutation.mutateAsync({ userId: user.id })
  },
})

const createProfileMutation = useMutation({
  mutationFn: createProfile,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] })
  },
})
```

## Retry Logic

### Custom Retry

```typescript
const mutation = useMutation({
  mutationFn: updateTodo,
  retry: 3,
  retryDelay: (attemptIndex) => {
    // Exponential backoff: 1s, 2s, 4s
    return Math.min(1000 * 2 ** attemptIndex, 30000)
  },
})
```

### Conditional Retry

```typescript
const mutation = useMutation({
  mutationFn: createTodo,
  retry: (failureCount, error) => {
    // Don't retry on 4xx errors
    if (error.status >= 400 && error.status < 500) {
      return false
    }
    return failureCount < 3
  },
})
```

## Cache Updates

### Update Query Data Directly

```typescript
const updateTodoMutation = useMutation({
  mutationFn: updateTodo,
  onSuccess: (updatedTodo) => {
    // Update cache directly instead of invalidating
    queryClient.setQueryData(
      ['todos', updatedTodo.id],
      updatedTodo
    )
    
    // Update in list
    queryClient.setQueryData(['todos'], (old: Todo[]) =>
      old.map(todo =>
        todo.id === updatedTodo.id ? updatedTodo : todo
      )
    )
  },
})
```

### Add to Cache

```typescript
const createTodoMutation = useMutation({
  mutationFn: createTodo,
  onSuccess: (newTodo) => {
    // Add to cache
    queryClient.setQueryData(['todos'], (old: Todo[]) => [...old, newTodo])
  },
})
```

### Remove from Cache

```typescript
const deleteTodoMutation = useMutation({
  mutationFn: deleteTodo,
  onSuccess: (_, deletedId) => {
    // Remove from cache
    queryClient.setQueryData(['todos'], (old: Todo[]) =>
      old.filter(todo => todo.id !== deletedId)
    )
    
    // Remove individual query
    queryClient.removeQueries({ queryKey: ['todos', deletedId] })
  },
})
```

## Form Integration

### With React Hook Form

```typescript
function TodoForm() {
  const { register, handleSubmit, reset } = useForm()
  
  const mutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      reset()  // Reset form
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })
  
  return (
    <form onSubmit={handleSubmit(data => mutation.mutate(data))}>
      <input {...register('title')} />
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Creating...' : 'Create'}
      </button>
      {mutation.isError && <p>Error: {mutation.error.message}</p>}
    </form>
  )
}
```

## Multiple Mutations

### Batch Mutations

```typescript
function BulkActions() {
  const deleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(ids.map(id => deleteTodo(id)))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })
  
  return (
    <button onClick={() => deleteMutation.mutate(selectedIds)}>
      Delete Selected
    </button>
  )
}
```

## Best Practices

1. **Always handle errors** with onError
2. **Invalidate related queries** after mutations
3. **Use optimistic updates** for instant feedback
4. **Return context from onMutate** for rollback
5. **Use onSettled** for cleanup actions
6. **Set appropriate retry logic**
7. **Update cache directly** when possible to avoid refetch
8. **Use mutateAsync** for sequential operations
