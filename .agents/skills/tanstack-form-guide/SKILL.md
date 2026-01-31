---
name: tanstack-form-guide
description: Guide for using TanStack Form for building type-safe, performant forms with validation. Use when implementing forms, form validation, dynamic fields, or form state management. Apply when the user asks about TanStack Form, form handling, form validation, field arrays, or schema validation with Zod/Yup/Valibot.
---

# TanStack Form Guide

## Overview

TanStack Form is a headless, performant, and type-safe form state management library. It provides powerful form primitives without enforcing any UI, giving you complete control over your form's appearance.

## Key Features

- 🎨 **Headless** - No UI opinions, full markup control
- ⚡ **High Performance** - Optimized re-renders and validation
- 🔧 **Type-Safe** - Full TypeScript support with type inference
- ✅ **Flexible Validation** - Multiple validation strategies
- 📦 **Small Bundle** - Lightweight with no dependencies
- 🎯 **Framework Agnostic** - Works with React, Vue, Solid, etc.

## Installation

```bash
pnpm add @tanstack/react-form
```

## Basic Form

### Simple Form Setup

```typescript
import { useForm } from '@tanstack/react-form'

interface FormData {
  firstName: string
  lastName: string
  email: string
}

function MyForm() {
  const form = useForm<FormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
    },
    onSubmit: async ({ value }) => {
      // Handle form submission
      console.log('Form submitted:', value)
      await api.submitForm(value)
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <form.Field
        name="firstName"
        children={(field) => (
          <div>
            <label htmlFor={field.name}>First Name:</label>
            <input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </div>
        )}
      />

      <form.Field
        name="lastName"
        children={(field) => (
          <div>
            <label htmlFor={field.name}>Last Name:</label>
            <input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </div>
        )}
      />

      <form.Field
        name="email"
        children={(field) => (
          <div>
            <label htmlFor={field.name}>Email:</label>
            <input
              id={field.name}
              name={field.name}
              type="email"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </div>
        )}
      />

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <button type="submit" disabled={!canSubmit}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        )}
      />
    </form>
  )
}
```

## Field Validation

### onChange Validation

```typescript
<form.Field
  name="age"
  validators={{
    onChange: ({ value }) =>
      value < 13 ? 'You must be at least 13 years old' : undefined,
  }}
  children={(field) => (
    <div>
      <label htmlFor={field.name}>Age:</label>
      <input
        id={field.name}
        name={field.name}
        type="number"
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.valueAsNumber)}
      />
      {field.state.meta.errors.length > 0 && (
        <em role="alert">{field.state.meta.errors.join(', ')}</em>
      )}
    </div>
  )}
/>
```

### onBlur Validation

```typescript
<form.Field
  name="email"
  validators={{
    onBlur: ({ value }) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return !emailRegex.test(value) ? 'Invalid email address' : undefined
    },
  }}
  children={(field) => (
    <div>
      <label htmlFor={field.name}>Email:</label>
      <input
        id={field.name}
        name={field.name}
        type="email"
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      {!field.state.meta.isValid && field.state.meta.isTouched && (
        <em role="alert">{field.state.meta.errors.join(', ')}</em>
      )}
    </div>
  )}
/>
```

### Multiple Validators

```typescript
<form.Field
  name="username"
  validators={{
    onChange: ({ value }) =>
      value.length < 3 ? 'Username must be at least 3 characters' : undefined,
    onBlur: ({ value }) =>
      /[^a-zA-Z0-9_]/.test(value)
        ? 'Username can only contain letters, numbers, and underscores'
        : undefined,
    onSubmit: ({ value }) =>
      !value ? 'Username is required' : undefined,
  }}
  children={(field) => (
    <div>
      <label htmlFor={field.name}>Username:</label>
      <input
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      {!field.state.meta.isValid && (
        <em role="alert">{field.state.meta.errors.join(', ')}</em>
      )}
    </div>
  )}
/>
```

## Async Validation

### Basic Async Validation

```typescript
<form.Field
  name="username"
  validators={{
    onChangeAsync: async ({ value }) => {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const response = await fetch(`/api/check-username?username=${value}`)
      const { available } = await response.json()
      
      return available ? undefined : 'Username is already taken'
    },
  }}
  children={(field) => (
    <div>
      <label htmlFor={field.name}>Username:</label>
      <input
        id={field.name}
        name={field.name}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      {field.state.meta.isValidating && <span>Checking...</span>}
      {!field.state.meta.isValid && (
        <em role="alert">{field.state.meta.errors.join(', ')}</em>
      )}
    </div>
  )}
/>
```

### With Debounce

```typescript
<form.Field
  name="username"
  validators={{
    onChangeAsyncDebounceMs: 500,
    onChangeAsync: async ({ value }) => {
      const isAvailable = await checkUsernameAvailability(value)
      return isAvailable ? undefined : 'Username is taken'
    },
  }}
  children={(field) => (
    <div>
      <input
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      {field.state.meta.isValidating && <span>Checking availability...</span>}
    </div>
  )}
/>
```

## Schema Validation (Zod)

### Install Zod

```bash
pnpm add zod
```

### Form-Level Zod Validation

```typescript
import { z } from 'zod'
import { useForm } from '@tanstack/react-form'

const userSchema = z.object({
  firstName: z.string().min(3, 'First name must be at least 3 characters'),
  lastName: z.string().min(3, 'Last name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  age: z.number().min(13, 'Must be at least 13 years old'),
})

function MyForm() {
  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      age: 0,
    },
    validators: {
      onChange: userSchema,
    },
    onSubmit: async ({ value }) => {
      console.log('Valid form data:', value)
    },
  })

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      form.handleSubmit()
    }}>
      <form.Field name="firstName" children={(field) => (
        <div>
          <label>First Name:</label>
          <input
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
          />
          {!field.state.meta.isValid && (
            <em>{field.state.meta.errors.join(', ')}</em>
          )}
        </div>
      )} />
      {/* Other fields */}
    </form>
  )
}
```

### Field-Level Zod Validation

```typescript
<form.Field
  name="email"
  validators={{
    onChange: z.string().email('Invalid email address'),
  }}
  children={(field) => (
    <div>
      <label>Email:</label>
      <input
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      {!field.state.meta.isValid && (
        <em>{field.state.meta.errors.join(', ')}</em>
      )}
    </div>
  )}
/>
```

## Field Arrays

### Basic Array Field

```typescript
function HobbiesForm() {
  const form = useForm({
    defaultValues: {
      hobbies: [] as Array<{ name: string; years: number }>,
    },
    onSubmit: async ({ value }) => {
      console.log('Hobbies:', value.hobbies)
    },
  })

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      form.handleSubmit()
    }}>
      <form.Field
        name="hobbies"
        mode="array"
        children={(field) => (
          <div>
            <h3>Hobbies</h3>
            {field.state.value.map((_, i) => (
              <div key={i} className="flex gap-4">
                <form.Field
                  name={`hobbies[${i}].name`}
                  children={(subField) => (
                    <div>
                      <label>Hobby Name:</label>
                      <input
                        value={subField.state.value}
                        onChange={(e) => subField.handleChange(e.target.value)}
                      />
                    </div>
                  )}
                />
                
                <form.Field
                  name={`hobbies[${i}].years`}
                  children={(subField) => (
                    <div>
                      <label>Years:</label>
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
                >
                  Remove
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => field.pushValue({ name: '', years: 0 })}
            >
              Add Hobby
            </button>
          </div>
        )}
      />
      
      <button type="submit">Submit</button>
    </form>
  )
}
```

## Form State Management

### Subscribe to Form State

```typescript
<form.Subscribe
  selector={(state) => [state.canSubmit, state.isSubmitting]}
  children={([canSubmit, isSubmitting]) => (
    <button type="submit" disabled={!canSubmit}>
      {isSubmitting ? 'Submitting...' : 'Submit'}
    </button>
  )}
/>
```

### Access Form State

```typescript
const form = useForm({
  // ... config
})

// Check if form can be submitted
const canSubmit = form.state.canSubmit

// Check if form is currently submitting
const isSubmitting = form.state.isSubmitting

// Check if form is valid
const isValid = form.state.isValid

// Get form errors
const errors = form.state.errorMap

// Get form values
const values = form.state.values
```

## Form Actions

### Reset Form

```typescript
<button
  type="button"
  onClick={() => form.reset()}
>
  Reset Form
</button>
```

### Set Field Value

```typescript
form.setFieldValue('email', 'user@example.com')
```

### Validate Form Manually

```typescript
<button
  type="button"
  onClick={() => form.validateAllFields('change')}
>
  Validate All
</button>
```

## Best Practices

1. **Use TypeScript** - Define clear types for form data
2. **Validate appropriately** - Use onChange for instant feedback, onBlur for less intrusive validation
3. **Debounce async validation** - Prevent excessive API calls
4. **Schema validation** - Use Zod/Yup for complex validation rules
5. **Show validation state** - Display loading indicators during async validation
6. **Handle errors gracefully** - Show clear, actionable error messages
7. **Optimize re-renders** - Use form.Subscribe for selective updates

For detailed patterns and advanced features, see:
- [Validation](references/validation.md) - Advanced validation patterns
- [Field Arrays](references/field-arrays.md) - Dynamic form fields
- [Schema Integration](references/schema-validation.md) - Zod, Yup, Valibot integration
- [Advanced Patterns](references/advanced-patterns.md) - Complex form scenarios
