# Field Arrays

Dynamic field arrays for managing lists of data in TanStack Form.

## Basic Array Field

### Simple Array

```typescript
function TagsForm() {
  const form = useForm({
    defaultValues: {
      tags: [] as string[],
    },
    onSubmit: async ({ value }) => {
      console.log('Tags:', value.tags)
    },
  })

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      form.handleSubmit()
    }}>
      <form.Field
        name="tags"
        mode="array"
        children={(field) => (
          <div>
            <h3>Tags</h3>
            {field.state.value.map((_, i) => (
              <div key={i}>
                <form.Field
                  name={`tags[${i}]`}
                  children={(subField) => (
                    <div className="flex gap-2">
                      <input
                        value={subField.state.value}
                        onChange={(e) => subField.handleChange(e.target.value)}
                        placeholder="Tag name"
                      />
                      <button
                        type="button"
                        onClick={() => field.removeValue(i)}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => field.pushValue('')}
            >
              Add Tag
            </button>
          </div>
        )}
      />
      <button type="submit">Submit</button>
    </form>
  )
}
```

## Array of Objects

### Complex Array Items

```typescript
interface Person {
  name: string
  email: string
  age: number
}

function PeopleForm() {
  const form = useForm({
    defaultValues: {
      people: [] as Person[],
    },
    onSubmit: async ({ value }) => {
      await api.savePeople(value.people)
    },
  })

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      form.handleSubmit()
    }}>
      <form.Field
        name="people"
        mode="array"
        children={(field) => (
          <div>
            {field.state.value.map((_, i) => (
              <div key={i} className="border p-4 mb-4">
                <h4>Person {i + 1}</h4>
                
                <form.Field
                  name={`people[${i}].name`}
                  validators={{
                    onChange: ({ value }) =>
                      !value ? 'Name is required' : undefined,
                  }}
                  children={(subField) => (
                    <div>
                      <label>Name:</label>
                      <input
                        value={subField.state.value}
                        onChange={(e) => subField.handleChange(e.target.value)}
                      />
                      {!subField.state.meta.isValid && (
                        <em>{subField.state.meta.errors[0]}</em>
                      )}
                    </div>
                  )}
                />
                
                <form.Field
                  name={`people[${i}].email`}
                  validators={{
                    onChange: ({ value }) => {
                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                      return !emailRegex.test(value) ? 'Invalid email' : undefined
                    },
                  }}
                  children={(subField) => (
                    <div>
                      <label>Email:</label>
                      <input
                        type="email"
                        value={subField.state.value}
                        onChange={(e) => subField.handleChange(e.target.value)}
                      />
                      {!subField.state.meta.isValid && (
                        <em>{subField.state.meta.errors[0]}</em>
                      )}
                    </div>
                  )}
                />
                
                <form.Field
                  name={`people[${i}].age`}
                  children={(subField) => (
                    <div>
                      <label>Age:</label>
                      <input
                        type="number"
                        value={subField.state.value}
                        onChange={(e) => subField.handleChange(e.target.valueAsNumber)}
                      />
                    </div>
                  )}
                />
                
                <button
                  type="button"
                  onClick={() => field.removeValue(i)}
                  className="mt-2 text-red-500"
                >
                  Remove Person
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => field.pushValue({ name: '', email: '', age: 0 })}
            >
              Add Person
            </button>
          </div>
        )}
      />
      
      <button type="submit">Submit</button>
    </form>
  )
}
```

## Array Operations

### Push Value

```typescript
<form.Field
  name="items"
  mode="array"
  children={(field) => (
    <div>
      {/* Render items */}
      <button
        type="button"
        onClick={() => field.pushValue({ name: '', quantity: 1 })}
      >
        Add Item
      </button>
    </div>
  )}
/>
```

### Remove Value

```typescript
<button
  type="button"
  onClick={() => field.removeValue(index)}
>
  Remove
</button>
```

### Insert Value

```typescript
<button
  type="button"
  onClick={() => field.insertValue(index, { name: '', quantity: 1 })}
>
  Insert at {index}
</button>
```

### Replace Value

```typescript
<button
  type="button"
  onClick={() => field.replaceValue(index, { name: 'Updated', quantity: 5 })}
>
  Replace
</button>
```

### Swap Values

```typescript
<button
  type="button"
  onClick={() => field.swapValues(index, index + 1)}
  disabled={index >= field.state.value.length - 1}
>
  Move Down
</button>
```

### Move Value

```typescript
<button
  type="button"
  onClick={() => field.moveValue(index, 0)}
>
  Move to Top
</button>
```

## Nested Arrays

### Array Within Array

```typescript
interface Project {
  name: string
  tasks: Array<{ title: string; completed: boolean }>
}

function ProjectsForm() {
  const form = useForm({
    defaultValues: {
      projects: [] as Project[],
    },
  })

  return (
    <form.Field
      name="projects"
      mode="array"
      children={(projectField) => (
        <div>
          {projectField.state.value.map((_, i) => (
            <div key={i}>
              <form.Field
                name={`projects[${i}].name`}
                children={(field) => (
                  <input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                )}
              />
              
              <form.Field
                name={`projects[${i}].tasks`}
                mode="array"
                children={(taskField) => (
                  <div>
                    {taskField.state.value.map((_, j) => (
                      <div key={j}>
                        <form.Field
                          name={`projects[${i}].tasks[${j}].title`}
                          children={(field) => (
                            <input
                              value={field.state.value}
                              onChange={(e) => field.handleChange(e.target.value)}
                            />
                          )}
                        />
                        <button
                          type="button"
                          onClick={() => taskField.removeValue(j)}
                        >
                          Remove Task
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => taskField.pushValue({ title: '', completed: false })}
                    >
                      Add Task
                    </button>
                  </div>
                )}
              />
            </div>
          ))}
        </div>
      )}
    />
  )
}
```

## Array Validation

### Validate Array Length

```typescript
<form.Field
  name="hobbies"
  mode="array"
  validators={{
    onChange: ({ value }) =>
      value.length < 1 ? 'At least one hobby is required' : undefined,
  }}
  children={(field) => (
    <div>
      {/* Render items */}
      {!field.state.meta.isValid && (
        <em>{field.state.meta.errors[0]}</em>
      )}
    </div>
  )}
/>
```

### Validate Array Items

```typescript
<form.Field
  name={`items[${i}].quantity`}
  validators={{
    onChange: ({ value }) => {
      if (value < 1) return 'Quantity must be at least 1'
      if (value > 100) return 'Maximum quantity is 100'
      return undefined
    },
  }}
  children={(field) => (
    <div>
      <input
        type="number"
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.valueAsNumber)}
      />
      {!field.state.meta.isValid && (
        <em>{field.state.meta.errors[0]}</em>
      )}
    </div>
  )}
/>
```

## Dynamic Forms

### Conditional Array Items

```typescript
<form.Field
  name="orderType"
  children={(field) => (
    <select
      value={field.state.value}
      onChange={(e) => field.handleChange(e.target.value)}
    >
      <option value="simple">Simple Order</option>
      <option value="bulk">Bulk Order</option>
    </select>
  )}
/>

<form.Subscribe
  selector={(state) => state.values.orderType}
  children={(orderType) => (
    orderType === 'bulk' && (
      <form.Field
        name="items"
        mode="array"
        children={(field) => (
          <div>
            {/* Render bulk items */}
          </div>
        )}
      />
    )
  )}
/>
```

## Drag and Drop Reordering

### With react-beautiful-dnd

```typescript
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

<form.Field
  name="items"
  mode="array"
  children={(field) => {
    const handleDragEnd = (result: any) => {
      if (!result.destination) return
      
      const from = result.source.index
      const to = result.destination.index
      
      field.moveValue(from, to)
    }
    
    return (
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="items">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {field.state.value.map((_, i) => (
                <Draggable key={i} draggableId={`item-${i}`} index={i}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {/* Item content */}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    )
  }}
/>
```

## Best Practices

1. **Use unique keys** - Use stable IDs instead of array indices when possible
2. **Validate items** - Add validation to array items, not just the array
3. **Empty state** - Show helpful message when array is empty
4. **Clear operations** - Provide clear UI for add/remove/reorder
5. **Nested arrays** - Limit nesting depth for better UX
6. **Performance** - Use React.memo for array item components
7. **Default values** - Provide sensible defaults when adding items
