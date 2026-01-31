# Optimistic Updates

Complete guide for implementing optimistic UI updates with TanStack Query.

## Basic Pattern

### Complete Optimistic Update

```typescript
const updateTodoMutation = useMutation({
  mutationFn: updateTodo,
  
  // Step 1: Before mutation runs
  onMutate: async (newTodo) => {
    // Cancel outgoing refetches to prevent overwriting
    await queryClient.cancelQueries({ queryKey: ['todos'] })
    
    // Snapshot previous value for rollback
    const previousTodos = queryClient.getQueryData(['todos'])
    
    // Optimistically update cache
    queryClient.setQueryData(['todos'], (old: Todo[]) =>
      old.map(todo =>
        todo.id === newTodo.id ? { ...todo, ...newTodo } : todo
      )
    )
    
    // Return context with rollback data
    return { previousTodos }
  },
  
  // Step 2: If mutation fails
  onError: (err, newTodo, context) => {
    // Rollback to previous state
    if (context?.previousTodos) {
      queryClient.setQueryData(['todos'], context.previousTodos)
    }
    
    // Show error to user
    toast.error(`Failed to update: ${err.message}`)
  },
  
  // Step 3: After success or error
  onSettled: () => {
    // Refetch to ensure server state is correct
    queryClient.invalidateQueries({ queryKey: ['todos'] })
  },
})
```

## Optimistic Create

### Add to List

```typescript
const createTodoMutation = useMutation({
  mutationFn: createTodo,
  
  onMutate: async (newTodo) => {
    await queryClient.cancelQueries({ queryKey: ['todos'] })
    
    const previousTodos = queryClient.getQueryData(['todos'])
    
    // Add with temporary ID
    const optimisticTodo = {
      id: `temp-${Date.now()}`,
      ...newTodo,
      createdAt: new Date().toISOString(),
    }
    
    queryClient.setQueryData(['todos'], (old: Todo[]) => [
      ...old,
      optimisticTodo,
    ])
    
    return { previousTodos, optimisticTodo }
  },
  
  onSuccess: (serverTodo, variables, context) => {
    // Replace temp ID with real ID from server
    queryClient.setQueryData(['todos'], (old: Todo[]) =>
      old.map(todo =>
        todo.id === context.optimisticTodo.id ? serverTodo : todo
      )
    )
  },
  
  onError: (err, newTodo, context) => {
    if (context?.previousTodos) {
      queryClient.setQueryData(['todos'], context.previousTodos)
    }
  },
  
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] })
  },
})
```

## Optimistic Update

### Single Item

```typescript
const updateTodoMutation = useMutation({
  mutationFn: ({ id, data }: { id: string; data: Partial<Todo> }) =>
    updateTodo(id, data),
  
  onMutate: async ({ id, data }) => {
    // Cancel both list and detail queries
    await queryClient.cancelQueries({ queryKey: ['todos'] })
    await queryClient.cancelQueries({ queryKey: ['todos', id] })
    
    // Snapshot
    const previousTodo = queryClient.getQueryData(['todos', id])
    const previousTodos = queryClient.getQueryData(['todos'])
    
    // Update detail
    queryClient.setQueryData(['todos', id], (old: Todo) => ({
      ...old,
      ...data,
    }))
    
    // Update in list
    queryClient.setQueryData(['todos'], (old: Todo[]) =>
      old.map(todo =>
        todo.id === id ? { ...todo, ...data } : todo
      )
    )
    
    return { previousTodo, previousTodos }
  },
  
  onError: (err, { id }, context) => {
    if (context?.previousTodo) {
      queryClient.setQueryData(['todos', id], context.previousTodo)
    }
    if (context?.previousTodos) {
      queryClient.setQueryData(['todos'], context.previousTodos)
    }
  },
  
  onSettled: (data, error, { id }) => {
    queryClient.invalidateQueries({ queryKey: ['todos', id] })
    queryClient.invalidateQueries({ queryKey: ['todos'] })
  },
})
```

## Optimistic Delete

### Remove from List

```typescript
const deleteTodoMutation = useMutation({
  mutationFn: deleteTodo,
  
  onMutate: async (todoId) => {
    await queryClient.cancelQueries({ queryKey: ['todos'] })
    
    const previousTodos = queryClient.getQueryData(['todos'])
    
    // Remove from cache
    queryClient.setQueryData(['todos'], (old: Todo[]) =>
      old.filter(todo => todo.id !== todoId)
    )
    
    return { previousTodos }
  },
  
  onError: (err, todoId, context) => {
    // Restore deleted item
    if (context?.previousTodos) {
      queryClient.setQueryData(['todos'], context.previousTodos)
    }
    toast.error('Failed to delete')
  },
  
  onSuccess: (data, todoId) => {
    // Remove individual query
    queryClient.removeQueries({ queryKey: ['todos', todoId] })
  },
  
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] })
  },
})
```

## Toggle State

### Optimistic Toggle

```typescript
const toggleTodoMutation = useMutation({
  mutationFn: ({ id }: { id: string }) => toggleTodoCompletion(id),
  
  onMutate: async ({ id }) => {
    await queryClient.cancelQueries({ queryKey: ['todos'] })
    
    const previousTodos = queryClient.getQueryData(['todos'])
    
    // Toggle completed state
    queryClient.setQueryData(['todos'], (old: Todo[]) =>
      old.map(todo =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    )
    
    return { previousTodos }
  },
  
  onError: (err, variables, context) => {
    if (context?.previousTodos) {
      queryClient.setQueryData(['todos'], context.previousTodos)
    }
  },
})

// Usage
<Checkbox
  checked={todo.completed}
  onChange={() => toggleTodoMutation.mutate({ id: todo.id })}
/>
```

## Batch Operations

### Multiple Updates

```typescript
const batchUpdateMutation = useMutation({
  mutationFn: async (updates: Array<{ id: string; data: Partial<Todo> }>) => {
    return await Promise.all(
      updates.map(({ id, data }) => updateTodo(id, data))
    )
  },
  
  onMutate: async (updates) => {
    await queryClient.cancelQueries({ queryKey: ['todos'] })
    
    const previousTodos = queryClient.getQueryData(['todos'])
    
    // Apply all updates optimistically
    queryClient.setQueryData(['todos'], (old: Todo[]) => {
      const updatesMap = new Map(updates.map(u => [u.id, u.data]))
      
      return old.map(todo => {
        const update = updatesMap.get(todo.id)
        return update ? { ...todo, ...update } : todo
      })
    })
    
    return { previousTodos }
  },
  
  onError: (err, variables, context) => {
    if (context?.previousTodos) {
      queryClient.setQueryData(['todos'], context.previousTodos)
    }
  },
  
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] })
  },
})
```

## UI Feedback

### Loading States

```typescript
function TodoItem({ todo }: { todo: Todo }) {
  const updateMutation = useMutation({
    mutationFn: updateTodo,
    // ... optimistic update logic
  })
  
  return (
    <div className={updateMutation.isPending ? 'opacity-50' : ''}>
      <h3>{todo.title}</h3>
      <button
        onClick={() => updateMutation.mutate({ id: todo.id, completed: true })}
        disabled={updateMutation.isPending}
      >
        {updateMutation.isPending ? 'Saving...' : 'Mark Complete'}
      </button>
    </div>
  )
}
```

### Success/Error Indicators

```typescript
function TodoItem({ todo }: { todo: Todo }) {
  const updateMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => toast.success('Updated!'),
    onError: () => toast.error('Failed to update'),
  })
  
  return (
    <div>
      {/* Todo content */}
      {updateMutation.isPending && <Spinner />}
      {updateMutation.isError && <ErrorIcon />}
      {updateMutation.isSuccess && <SuccessIcon />}
    </div>
  )
}
```

## Complex Scenarios

### Nested Updates

```typescript
// Update user and their todos
const updateUserMutation = useMutation({
  mutationFn: async ({ userId, userData, todoUpdates }) => {
    const user = await updateUser(userId, userData)
    const todos = await Promise.all(
      todoUpdates.map(t => updateTodo(t.id, t.data))
    )
    return { user, todos }
  },
  
  onMutate: async ({ userId, userData, todoUpdates }) => {
    // Cancel related queries
    await queryClient.cancelQueries({ queryKey: ['users', userId] })
    await queryClient.cancelQueries({ queryKey: ['todos'] })
    
    // Snapshot
    const previousUser = queryClient.getQueryData(['users', userId])
    const previousTodos = queryClient.getQueryData(['todos'])
    
    // Update user
    queryClient.setQueryData(['users', userId], (old: User) => ({
      ...old,
      ...userData,
    }))
    
    // Update todos
    queryClient.setQueryData(['todos'], (old: Todo[]) => {
      const updateMap = new Map(todoUpdates.map(u => [u.id, u.data]))
      return old.map(todo => {
        const update = updateMap.get(todo.id)
        return update ? { ...todo, ...update } : todo
      })
    })
    
    return { previousUser, previousTodos }
  },
  
  onError: (err, variables, context) => {
    // Rollback both
    if (context?.previousUser) {
      queryClient.setQueryData(['users', variables.userId], context.previousUser)
    }
    if (context?.previousTodos) {
      queryClient.setQueryData(['todos'], context.previousTodos)
    }
  },
  
  onSettled: (data, error, variables) => {
    queryClient.invalidateQueries({ queryKey: ['users', variables.userId] })
    queryClient.invalidateQueries({ queryKey: ['todos'] })
  },
})
```

## Best Practices

1. **Always cancel queries** in onMutate to prevent race conditions
2. **Snapshot previous state** for rollback on error
3. **Return context** from onMutate with rollback data
4. **Rollback on error** using context
5. **Always use onSettled** to refetch and ensure consistency
6. **Show visual feedback** during pending state
7. **Handle temporary IDs** for create operations
8. **Update all related queries** (list + detail)
9. **Test rollback scenarios** thoroughly
10. **Consider network latency** in UX design
