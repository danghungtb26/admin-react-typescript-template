# Advanced Patterns

Advanced form patterns and techniques for complex scenarios.

## Controlled vs Uncontrolled

### Controlled Form

```typescript
const [formData, setFormData] = useState({ name: '', email: '' })

const form = useForm({
  defaultValues: formData,
  onSubmit: async ({ value }) => {
    setFormData(value)
    await api.submit(value)
  },
})

// Update from external source
useEffect(() => {
  form.setFieldValue('name', externalData.name)
}, [externalData])
```

## Multi-Step Forms

### Wizard Form

```typescript
function WizardForm() {
  const [step, setStep] = useState(1)
  
  const form = useForm({
    defaultValues: {
      // Step 1
      firstName: '',
      lastName: '',
      // Step 2
      email: '',
      phone: '',
      // Step 3
      address: '',
      city: '',
    },
    onSubmit: async ({ value }) => {
      await api.submitRegistration(value)
    },
  })

  const nextStep = async () => {
    // Validate current step fields before proceeding
    const isValid = await validateStep(step)
    if (isValid) setStep(step + 1)
  }

  const validateStep = async (currentStep: number) => {
    if (currentStep === 1) {
      await form.validateField('firstName', 'change')
      await form.validateField('lastName', 'change')
      return form.state.fieldMeta.firstName?.isValid &&
             form.state.fieldMeta.lastName?.isValid
    }
    // ... other steps
    return true
  }

  return (
    <div>
      <div className="progress">Step {step} of 3</div>
      
      <form onSubmit={(e) => {
        e.preventDefault()
        if (step === 3) {
          form.handleSubmit()
        } else {
          nextStep()
        }
      }}>
        {step === 1 && (
          <div>
            <form.Field name="firstName" children={(field) => (
              <input {...field} />
            )} />
            <form.Field name="lastName" children={(field) => (
              <input {...field} />
            )} />
          </div>
        )}
        
        {step === 2 && (
          <div>
            <form.Field name="email" children={(field) => (
              <input {...field} type="email" />
            )} />
            <form.Field name="phone" children={(field) => (
              <input {...field} />
            )} />
          </div>
        )}
        
        {step === 3 && (
          <div>
            <form.Field name="address" children={(field) => (
              <input {...field} />
            )} />
            <form.Field name="city" children={(field) => (
              <input {...field} />
            )} />
          </div>
        )}
        
        <div className="buttons">
          {step > 1 && (
            <button type="button" onClick={() => setStep(step - 1)}>
              Back
            </button>
          )}
          <button type="submit">
            {step === 3 ? 'Submit' : 'Next'}
          </button>
        </div>
      </form>
    </div>
  )
}
```

## Dependent Fields

### Field Dependencies

```typescript
<form.Field
  name="country"
  children={(field) => (
    <select
      value={field.state.value}
      onChange={(e) => {
        field.handleChange(e.target.value)
        // Reset dependent field
        form.setFieldValue('state', '')
      }}
    >
      <option value="">Select Country</option>
      <option value="US">United States</option>
      <option value="CA">Canada</option>
    </select>
  )}
/>

<form.Subscribe
  selector={(state) => state.values.country}
  children={(country) => (
    country && (
      <form.Field
        name="state"
        children={(field) => (
          <select
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
          >
            <option value="">Select State</option>
            {getStatesForCountry(country).map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        )}
      />
    )
  )}
/>
```

## Conditional Fields

### Show/Hide Based on Values

```typescript
<form.Field
  name="hasMiddleName"
  children={(field) => (
    <label>
      <input
        type="checkbox"
        checked={field.state.value}
        onChange={(e) => field.handleChange(e.target.checked)}
      />
      I have a middle name
    </label>
  )}
/>

<form.Subscribe
  selector={(state) => state.values.hasMiddleName}
  children={(hasMiddleName) => (
    hasMiddleName && (
      <form.Field
        name="middleName"
        validators={{
          onChange: ({ value }) =>
            !value ? 'Middle name is required' : undefined,
        }}
        children={(field) => (
          <input
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
          />
        )}
      />
    )
  )}
/>
```

## Form Reset

### Reset to Initial Values

```typescript
<button
  type="button"
  onClick={() => form.reset()}
>
  Reset Form
</button>
```

### Reset to Specific Values

```typescript
<button
  type="button"
  onClick={() => {
    form.setFieldValue('email', '')
    form.setFieldValue('name', '')
  }}
>
  Clear Fields
</button>
```

## Dirty State Tracking

### Warn Before Leaving

```typescript
function MyForm() {
  const form = useForm({
    defaultValues: { name: '', email: '' },
  })

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (form.state.isDirty) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [form.state.isDirty])

  return <form>{/* Fields */}</form>
}
```

## Form Persistence

### Save to LocalStorage

```typescript
function MyForm() {
  const form = useForm({
    defaultValues: () => {
      const saved = localStorage.getItem('formData')
      return saved ? JSON.parse(saved) : { name: '', email: '' }
    },
    onSubmit: async ({ value }) => {
      await api.submit(value)
      localStorage.removeItem('formData')
    },
  })

  // Auto-save
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('formData', JSON.stringify(form.state.values))
    }, 1000)

    return () => clearTimeout(timer)
  }, [form.state.values])

  return <form>{/* Fields */}</form>
}
```

## File Upload

### Single File Upload

```typescript
<form.Field
  name="avatar"
  children={(field) => {
    const [preview, setPreview] = useState<string>()

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        field.handleChange(file)
        setPreview(URL.createObjectURL(file))
      }
    }

    return (
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        {preview && <img src={preview} alt="Preview" />}
      </div>
    )
  }}
/>
```

### Multiple File Upload

```typescript
<form.Field
  name="attachments"
  children={(field) => (
    <input
      type="file"
      multiple
      onChange={(e) => {
        const files = Array.from(e.target.files || [])
        field.handleChange(files)
      }}
    />
  )}
/>
```

## Dynamic Field Generation

### Generate Fields from Schema

```typescript
const fieldConfig = [
  { name: 'firstName', label: 'First Name', type: 'text', required: true },
  { name: 'lastName', label: 'Last Name', type: 'text', required: true },
  { name: 'age', label: 'Age', type: 'number', required: false },
]

function DynamicForm() {
  const form = useForm({
    defaultValues: fieldConfig.reduce((acc, field) => ({
      ...acc,
      [field.name]: '',
    }), {}),
  })

  return (
    <form>
      {fieldConfig.map((config) => (
        <form.Field
          key={config.name}
          name={config.name}
          validators={config.required ? {
            onChange: ({ value }) => !value ? 'Required' : undefined,
          } : {}}
          children={(field) => (
            <div>
              <label>{config.label}:</label>
              <input
                type={config.type}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        />
      ))}
    </form>
  )
}
```

## Optimistic Updates

### Show Success Before API Response

```typescript
const form = useForm({
  defaultValues: { name: '' },
  onSubmit: async ({ value }) => {
    // Show success immediately
    toast.success('Saved!')
    
    try {
      await api.submit(value)
    } catch (error) {
      // Revert on error
      toast.error('Failed to save')
    }
  },
})
```

## Integration with TanStack Query

### Fetch and Populate Form

```typescript
function EditUserForm({ userId }: { userId: string }) {
  const { data: user } = useQuery({
    queryKey: ['users', userId],
    queryFn: () => fetchUser(userId),
  })

  const form = useForm({
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
    },
    onSubmit: async ({ value }) => {
      await updateUser(userId, value)
      queryClient.invalidateQueries({ queryKey: ['users', userId] })
    },
  })

  // Update form when data loads
  useEffect(() => {
    if (user) {
      form.setFieldValue('name', user.name)
      form.setFieldValue('email', user.email)
    }
  }, [user])

  return <form>{/* Fields */}</form>
}
```

## Best Practices

1. **Validate progressively** - Start with onBlur, add onChange for critical fields
2. **Debounce expensive operations** - Especially async validation
3. **Track dirty state** - Warn users before losing unsaved changes
4. **Optimize re-renders** - Use form.Subscribe for selective updates
5. **Handle loading states** - Show spinners during submission
6. **Error boundaries** - Wrap forms in error boundaries
7. **Accessibility** - Add proper labels and ARIA attributes
8. **Type safety** - Use TypeScript for all form data
