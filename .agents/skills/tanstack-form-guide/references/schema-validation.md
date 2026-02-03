# Schema Validation

Integration with popular schema validation libraries.

## Zod Integration

### Install Zod

```bash
pnpm add zod
```

### Form-Level Validation

```typescript
import { z } from 'zod'
import { useForm } from '@tanstack/react-form'

const userSchema = z.object({
  firstName: z.string().min(3, 'At least 3 characters'),
  lastName: z.string().min(3, 'At least 3 characters'),
  email: z.string().email('Invalid email'),
  age: z.number().min(18, 'Must be 18 or older'),
  website: z.string().url().optional().or(z.literal('')),
})

type UserForm = z.infer<typeof userSchema>

function RegistrationForm() {
  const form = useForm<UserForm>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      age: 0,
      website: '',
    },
    validators: {
      onChange: userSchema,
    },
    onSubmit: async ({ value }) => {
      // value is typed as UserForm
      await api.register(value)
    },
  })

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      form.handleSubmit()
    }}>
      <form.Field
        name="email"
        children={(field) => (
          <div>
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
    onBlur: z.string().min(1, 'Email is required'),
  }}
  children={(field) => (
    <div>
      <input
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      {!field.state.meta.isValid && (
        <em>{field.state.meta.errors[0]}</em>
      )}
    </div>
  )}
/>
```

### Async Zod Validation

```typescript
<form.Field
  name="username"
  validators={{
    onChangeAsyncDebounceMs: 500,
    onChangeAsync: z.string().refine(
      async (value) => {
        const response = await fetch(`/api/users/check?username=${value}`)
        const { available } = await response.json()
        return available
      },
      { message: 'Username is already taken' }
    ),
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

### Complex Zod Schemas

```typescript
const passwordSchema = z
  .string()
  .min(8, 'At least 8 characters')
  .regex(/[A-Z]/, 'At least one uppercase letter')
  .regex(/[a-z]/, 'At least one lowercase letter')
  .regex(/[0-9]/, 'At least one number')
  .regex(/[^A-Za-z0-9]/, 'At least one special character')

const formSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }
)
```

## Valibot Integration

### Install Valibot

```bash
pnpm add valibot
```

### Form-Level Valibot Validation

```typescript
import * as v from 'valibot'
import { useForm } from '@tanstack/react-form'

const UserSchema = v.object({
  firstName: v.pipe(
    v.string(),
    v.minLength(3, 'At least 3 characters')
  ),
  email: v.pipe(
    v.string(),
    v.email('Invalid email address')
  ),
  age: v.pipe(
    v.number(),
    v.minValue(18, 'Must be 18 or older')
  ),
})

type User = v.InferOutput<typeof UserSchema>

function MyForm() {
  const form = useForm<User>({
    defaultValues: {
      firstName: '',
      email: '',
      age: 0,
    },
    validators: {
      onChange: UserSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value)
    },
  })

  return <form>{/* Fields */}</form>
}
```

### Field-Level Valibot

```typescript
<form.Field
  name="email"
  validators={{
    onChange: v.pipe(
      v.string(),
      v.email('Invalid email'),
      v.minLength(1, 'Email is required')
    ),
  }}
  children={(field) => (
    <div>
      <input
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      {!field.state.meta.isValid && <em>{field.state.meta.errors[0]}</em>}
    </div>
  )}
/>
```

## Yup Integration

### Install Yup

```bash
pnpm add yup
```

### Form-Level Yup Validation

```typescript
import * as yup from 'yup'
import { useForm } from '@tanstack/react-form'

const userSchema = yup.object({
  firstName: yup.string().required('First name is required').min(3),
  email: yup.string().email('Invalid email').required('Email is required'),
  age: yup.number().min(18, 'Must be 18 or older').required(),
})

type UserForm = yup.InferType<typeof userSchema>

function MyForm() {
  const form = useForm<UserForm>({
    defaultValues: {
      firstName: '',
      email: '',
      age: 0,
    },
    validators: {
      onChange: userSchema,
    },
    onSubmit: async ({ value }) => {
      await api.submit(value)
    },
  })

  return <form>{/* Fields */}</form>
}
```

## Schema with Nested Objects

### Zod Nested Schema

```typescript
const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().length(2, 'Use 2-letter state code'),
  zipCode: z.string().regex(/^\d{5}$/, 'Must be 5 digits'),
})

const userSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  address: addressSchema,
})

type UserForm = z.infer<typeof userSchema>

// In form
<form.Field
  name="address.street"
  children={(field) => (
    <input
      value={field.state.value}
      onChange={(e) => field.handleChange(e.target.value)}
    />
  )}
/>
```

## Schema with Arrays

### Zod Array Schema

```typescript
const hobbySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  years: z.number().min(0).max(100),
})

const formSchema = z.object({
  name: z.string(),
  hobbies: z.array(hobbySchema).min(1, 'At least one hobby required'),
})

type FormData = z.infer<typeof formSchema>

// In form
<form.Field
  name="hobbies"
  mode="array"
  children={(field) => (
    <div>
      {field.state.value.map((_, i) => (
        <form.Field
          key={i}
          name={`hobbies[${i}].name`}
          children={(subField) => (
            <input
              value={subField.state.value}
              onChange={(e) => subField.handleChange(e.target.value)}
            />
          )}
        />
      ))}
    </div>
  )}
/>
```

## Multiple Schemas

### Switch Between Schemas

```typescript
import { z } from 'zod'
import * as v from 'valibot'

const zodSchema = z.object({
  email: z.string().email(),
})

const valibotSchema = v.object({
  email: v.pipe(v.string(), v.email()),
})

function MyForm() {
  const [useZod, setUseZod] = useState(true)
  
  const form = useForm({
    defaultValues: {
      email: '',
    },
    validators: {
      onChange: useZod ? zodSchema : valibotSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value)
    },
  })

  return (
    <div>
      <button onClick={() => setUseZod(!useZod)}>
        Switch to {useZod ? 'Valibot' : 'Zod'}
      </button>
      <form>{/* Fields */}</form>
    </div>
  )
}
```

## Custom Error Messages

### Override Schema Messages

```typescript
const schema = z.object({
  email: z.string().email(),
})

<form.Field
  name="email"
  validators={{
    onChange: schema.shape.email.or(
      z.string().transform(() => {
        throw new Error('Please enter a valid email address')
      })
    ),
  }}
  children={(field) => <input {...field} />}
/>
```

## Best Practices

1. **Define schemas separately** - Keep schemas in separate files
2. **Type inference** - Use schema types for form data
3. **Validate early** - Use onChange for real-time validation
4. **Clear messages** - Provide helpful error messages
5. **Reuse schemas** - Share schemas between client and server
6. **Test schemas** - Unit test complex validation logic
7. **Performance** - Use field-level validation for large forms
