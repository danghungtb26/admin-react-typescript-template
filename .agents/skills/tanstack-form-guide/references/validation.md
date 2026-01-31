# Validation

Comprehensive validation patterns for TanStack Form.

## Validation Timing

### onChange - Real-time Validation

```typescript
<form.Field
  name="username"
  validators={{
    onChange: ({ value }) => {
      if (!value) return 'Username is required'
      if (value.length < 3) return 'Username must be at least 3 characters'
      if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Only letters, numbers, and underscores allowed'
      return undefined
    },
  }}
  children={(field) => (
    <div>
      <input
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      {!field.state.meta.isValid && (
        <em>{field.state.meta.errors[0]}</em>
      )}
    </div>
  )}
/>
```

### onBlur - Validate After Focus Loss

```typescript
<form.Field
  name="email"
  validators={{
    onBlur: ({ value }) => {
      if (!value) return 'Email is required'
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return !emailRegex.test(value) ? 'Invalid email format' : undefined
    },
  }}
  children={(field) => (
    <div>
      <input
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      {!field.state.meta.isValid && field.state.meta.isTouched && (
        <em>{field.state.meta.errors[0]}</em>
      )}
    </div>
  )}
/>
```

### onSubmit - Validate Before Submission

```typescript
<form.Field
  name="terms"
  validators={{
    onSubmit: ({ value }) =>
      !value ? 'You must accept the terms and conditions' : undefined,
  }}
  children={(field) => (
    <div>
      <label>
        <input
          type="checkbox"
          checked={field.state.value}
          onChange={(e) => field.handleChange(e.target.checked)}
        />
        I accept the terms
      </label>
      {!field.state.meta.isValid && (
        <em>{field.state.meta.errors[0]}</em>
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
      if (!value) return undefined
      
      const response = await fetch(`/api/users/check?username=${value}`)
      const { available } = await response.json()
      
      return available ? undefined : 'Username is already taken'
    },
  }}
  children={(field) => (
    <div>
      <input
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      {field.state.meta.isValidating && <span>Checking...</span>}
      {!field.state.meta.isValid && <em>{field.state.meta.errors[0]}</em>}
    </div>
  )}
/>
```

### Debounced Async Validation

```typescript
<form.Field
  name="email"
  validators={{
    onChangeAsyncDebounceMs: 500,
    onChangeAsync: async ({ value }) => {
      const response = await fetch(`/api/emails/check?email=${value}`)
      const { exists } = await response.json()
      return exists ? 'Email is already registered' : undefined
    },
  }}
  children={(field) => (
    <div>
      <input
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      {field.state.meta.isValidating && <span className="text-gray-500">Validating...</span>}
    </div>
  )}
/>
```

### Combined Sync and Async

```typescript
<form.Field
  name="username"
  validators={{
    onChange: ({ value }) =>
      value.length < 3 ? 'At least 3 characters required' : undefined,
    onChangeAsync: async ({ value }) => {
      const available = await checkUsername(value)
      return available ? undefined : 'Username taken'
    },
  }}
  children={(field) => (
    <div>
      <input
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      {field.state.meta.isValidating && <Spinner />}
      {!field.state.meta.isValid && <em>{field.state.meta.errors.join(', ')}</em>}
    </div>
  )}
/>
```

## Form-Level Validation

### Validate Multiple Fields Together

```typescript
const form = useForm({
  defaultValues: {
    password: '',
    confirmPassword: '',
  },
  validators: {
    onSubmit: ({ value }) => {
      if (value.password !== value.confirmPassword) {
        return {
          form: 'Passwords do not match',
          fields: {
            confirmPassword: 'Does not match password',
          },
        }
      }
      return null
    },
  },
  onSubmit: async ({ value }) => {
    await api.createAccount(value)
  },
})
```

### Async Form-Level Validation

```typescript
const form = useForm({
  defaultValues: {
    username: '',
    age: 0,
  },
  validators: {
    onSubmitAsync: async ({ value }) => {
      const [isUsernameValid, isAgeValid] = await Promise.all([
        validateUsername(value.username),
        validateAge(value.age),
      ])
      
      if (!isUsernameValid || !isAgeValid) {
        return {
          form: 'Please fix the errors below',
          fields: {
            ...(!isUsernameValid && { username: 'Username is invalid' }),
            ...(!isAgeValid && { age: 'Age is invalid' }),
          },
        }
      }
      
      return null
    },
  },
})
```

## Custom Validation Functions

### Reusable Validators

```typescript
// validators.ts
export const required = (message = 'This field is required') => 
  ({ value }: { value: any }) => !value ? message : undefined

export const minLength = (min: number, message?: string) =>
  ({ value }: { value: string }) =>
    value.length < min ? (message || `Must be at least ${min} characters`) : undefined

export const email = (message = 'Invalid email address') =>
  ({ value }: { value: string }) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return !emailRegex.test(value) ? message : undefined
  }

export const match = (fieldName: string, message?: string) =>
  ({ value, fieldApi }: any) => {
    const otherValue = fieldApi.form.getFieldValue(fieldName)
    return value !== otherValue ? (message || `Must match ${fieldName}`) : undefined
  }

// Usage
<form.Field
  name="email"
  validators={{
    onChange: email(),
    onBlur: required(),
  }}
  children={(field) => <input {...field} />}
/>
```

## Validation State

### Check Field Validity

```typescript
<form.Field
  name="username"
  children={(field) => {
    const isValid = field.state.meta.isValid
    const isTouched = field.state.meta.isTouched
    const errors = field.state.meta.errors
    const isValidating = field.state.meta.isValidating
    
    return (
      <div>
        <input
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          className={!isValid && isTouched ? 'border-red-500' : ''}
        />
        {isValidating && <Spinner />}
        {!isValid && isTouched && <em>{errors.join(', ')}</em>}
      </div>
    )
  }}
/>
```

### Display Validation State

```typescript
function FieldWrapper({ field }: { field: FieldApi<any, any> }) {
  const { isValid, isTouched, errors, isValidating } = field.state.meta
  const showError = !isValid && isTouched
  
  return (
    <div className="field-wrapper">
      {field.children}
      <div className="field-status">
        {isValidating && (
          <span className="text-blue-500">Validating...</span>
        )}
        {showError && (
          <span className="text-red-500">{errors[0]}</span>
        )}
        {isValid && isTouched && (
          <span className="text-green-500">✓</span>
        )}
      </div>
    </div>
  )
}
```

## Conditional Validation

### Validate Based on Other Fields

```typescript
<form.Field
  name="otherIncome"
  validators={{
    onChange: ({ value, fieldApi }) => {
      const employmentStatus = fieldApi.form.getFieldValue('employmentStatus')
      
      if (employmentStatus === 'unemployed' && !value) {
        return 'Please specify other income sources'
      }
      
      return undefined
    },
  }}
  children={(field) => <input {...field} />}
/>
```

## Best Practices

1. **Use appropriate timing** - onChange for instant feedback, onBlur for less intrusive
2. **Debounce async validation** - Prevent excessive API calls
3. **Show validation state** - Display loading indicators
4. **Clear error messages** - Be specific and actionable
5. **Validate early** - Catch errors before submission when possible
6. **Handle async errors** - Always handle promise rejections
7. **Reuse validators** - Create reusable validation functions
8. **Type safety** - Use TypeScript for validation functions
