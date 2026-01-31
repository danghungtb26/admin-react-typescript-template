# Multi-Step Form Example

Complete implementation of a multi-step wizard form (e.g., user onboarding).

## Structure

```
┌────────────────────────────────┐
│ Header + Progress (Step 1/3)  │
├────────────────────────────────┤
│ Step Content                   │
│   [Current step fields]        │
├────────────────────────────────┤
│ Actions (Back, Next, Submit)   │
└────────────────────────────────┘
```

## Complete Example

```typescript
// pages/UserOnboardingPage.tsx
import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

// Step schemas
const step1Schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email'),
})

const step2Schema = z.object({
  company: z.string().min(1, 'Company is required'),
  department: z.string().min(1, 'Department is required'),
  role: z.string().min(1, 'Role is required'),
})

const step3Schema = z.object({
  notifications: z.boolean(),
  theme: z.enum(['light', 'dark']),
  language: z.string(),
})

// Combined schema
const fullSchema = z.object({
  ...step1Schema.shape,
  ...step2Schema.shape,
  ...step3Schema.shape,
})

export function UserOnboardingPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const totalSteps = 3
  
  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      navigate({ to: '/dashboard' })
      toast.success('Account created successfully!')
    },
  })
  
  const form = useForm({
    defaultValues: {
      // Step 1
      firstName: '',
      lastName: '',
      email: '',
      // Step 2
      company: '',
      department: '',
      role: '',
      // Step 3
      notifications: true,
      theme: 'light' as const,
      language: 'en',
    },
    validatorAdapter: zodValidator,
    onSubmit: async ({ value }) => {
      await createMutation.mutateAsync(value)
    },
  })
  
  // Validate current step
  const validateStep = async () => {
    let isValid = true
    
    if (step === 1) {
      await form.validateField('firstName', 'change')
      await form.validateField('lastName', 'change')
      await form.validateField('email', 'change')
      
      isValid =
        form.state.fieldMeta.firstName?.isValid &&
        form.state.fieldMeta.lastName?.isValid &&
        form.state.fieldMeta.email?.isValid
    } else if (step === 2) {
      await form.validateField('company', 'change')
      await form.validateField('department', 'change')
      await form.validateField('role', 'change')
      
      isValid =
        form.state.fieldMeta.company?.isValid &&
        form.state.fieldMeta.department?.isValid &&
        form.state.fieldMeta.role?.isValid
    }
    // Step 3 has no required fields
    
    return isValid
  }
  
  const handleNext = async () => {
    const isValid = await validateStep()
    if (isValid) {
      setStep(step + 1)
    }
  }
  
  const handleBack = () => {
    setStep(step - 1)
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step === totalSteps) {
      form.handleSubmit()
    } else {
      handleNext()
    }
  }
  
  const progress = Math.round((step / totalSteps) * 100)
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Welcome to App</h1>
          <p className="text-gray-600 mt-2">
            Let's set up your account in {totalSteps} easy steps
          </p>
        </div>
        
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">
              Step {step} of {totalSteps}
            </span>
            <span className="text-sm text-gray-500">{progress}% Complete</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Step indicators */}
          <div className="flex justify-between mt-4">
            <StepIndicator number={1} active={step === 1} completed={step > 1}>
              Basic Info
            </StepIndicator>
            <StepIndicator number={2} active={step === 2} completed={step > 2}>
              Company
            </StepIndicator>
            <StepIndicator number={3} active={step === 3} completed={step > 3}>
              Preferences
            </StepIndicator>
          </div>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6">Basic Information</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <form.Field
                    name="firstName"
                    children={(field) => (
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          className="w-full px-3 py-2 border rounded"
                          placeholder="John"
                        />
                        {!field.state.meta.isValid &&
                          field.state.meta.isTouched && (
                            <p className="text-red-500 text-sm mt-1">
                              {field.state.meta.errors[0]}
                            </p>
                          )}
                      </div>
                    )}
                  />
                  
                  <form.Field
                    name="lastName"
                    children={(field) => (
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          className="w-full px-3 py-2 border rounded"
                          placeholder="Doe"
                        />
                        {!field.state.meta.isValid &&
                          field.state.meta.isTouched && (
                            <p className="text-red-500 text-sm mt-1">
                              {field.state.meta.errors[0]}
                            </p>
                          )}
                      </div>
                    )}
                  />
                </div>
                
                <form.Field
                  name="email"
                  children={(field) => (
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        className="w-full px-3 py-2 border rounded"
                        placeholder="john@example.com"
                      />
                      {!field.state.meta.isValid &&
                        field.state.meta.isTouched && (
                          <p className="text-red-500 text-sm mt-1">
                            {field.state.meta.errors[0]}
                          </p>
                        )}
                    </div>
                  )}
                />
              </div>
            )}
            
            {/* Step 2: Company Info */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6">Company Information</h2>
                
                <form.Field
                  name="company"
                  children={(field) => (
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Company <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        className="w-full px-3 py-2 border rounded"
                        placeholder="Acme Inc."
                      />
                      {!field.state.meta.isValid &&
                        field.state.meta.isTouched && (
                          <p className="text-red-500 text-sm mt-1">
                            {field.state.meta.errors[0]}
                          </p>
                        )}
                    </div>
                  )}
                />
                
                <form.Field
                  name="department"
                  children={(field) => (
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Department <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        className="w-full px-3 py-2 border rounded"
                        placeholder="Engineering"
                      />
                      {!field.state.meta.isValid &&
                        field.state.meta.isTouched && (
                          <p className="text-red-500 text-sm mt-1">
                            {field.state.meta.errors[0]}
                          </p>
                        )}
                    </div>
                  )}
                />
                
                <form.Field
                  name="role"
                  children={(field) => (
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Role <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        className="w-full px-3 py-2 border rounded"
                      >
                        <option value="">Select a role</option>
                        <option value="developer">Developer</option>
                        <option value="designer">Designer</option>
                        <option value="manager">Manager</option>
                      </select>
                      {!field.state.meta.isValid &&
                        field.state.meta.isTouched && (
                          <p className="text-red-500 text-sm mt-1">
                            {field.state.meta.errors[0]}
                          </p>
                        )}
                    </div>
                  )}
                />
              </div>
            )}
            
            {/* Step 3: Preferences */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6">Preferences</h2>
                
                <form.Field
                  name="notifications"
                  children={(field) => (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={field.state.value}
                        onChange={(e) => field.handleChange(e.target.checked)}
                        className="mr-2"
                        id="notifications"
                      />
                      <label htmlFor="notifications">
                        Enable email notifications
                      </label>
                    </div>
                  )}
                />
                
                <form.Field
                  name="theme"
                  children={(field) => (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Theme
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            value="light"
                            checked={field.state.value === 'light'}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="mr-2"
                          />
                          Light
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            value="dark"
                            checked={field.state.value === 'dark'}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="mr-2"
                          />
                          Dark
                        </label>
                      </div>
                    </div>
                  )}
                />
                
                <form.Field
                  name="language"
                  children={(field) => (
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Language
                      </label>
                      <select
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                      </select>
                    </div>
                  )}
                />
              </div>
            )}
          </div>
          
          {/* Navigation buttons */}
          <div className="flex justify-between mt-6">
            {step > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={createMutation.isPending}
              >
                Back
              </Button>
            ) : (
              <div />
            )}
            
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="ml-auto"
            >
              {createMutation.isPending ? (
                <>
                  <Spinner className="mr-2" />
                  Submitting...
                </>
              ) : step === totalSteps ? (
                'Complete Setup'
              ) : (
                'Next'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Step indicator component
function StepIndicator({
  number,
  active,
  completed,
  children,
}: {
  number: number
  active: boolean
  completed: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
          completed
            ? 'bg-green-500 text-white'
            : active
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-500'
        }`}
      >
        {completed ? '✓' : number}
      </div>
      <span className="text-xs mt-2 text-center">{children}</span>
    </div>
  )
}
```

## Key Features

1. **Step Management**
   - Track current step in state
   - Progress bar and indicators
   - Navigate between steps

2. **Step Validation**
   - Validate current step before proceeding
   - Show errors immediately
   - Disable next button when invalid

3. **Data Persistence**
   - All form data in single form instance
   - Navigate back without losing data
   - Submit all data on final step

4. **UX Enhancements**
   - Visual progress indicator
   - Step completion checkmarks
   - Disable navigation during submit
   - Back button on steps 2+

5. **Accessibility**
   - Keyboard navigation
   - Clear labels and instructions
   - Error messages

## Simpler State-based Version

```typescript
function SimpleWizard() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState({
    firstName: '',
    company: '',
    notifications: true,
  })
  
  const handleNext = () => {
    // Validate current step
    if (step === 1 && !data.firstName) {
      alert('First name required')
      return
    }
    setStep(step + 1)
  }
  
  const handleSubmit = async () => {
    await createUser(data)
  }
  
  return (
    <>
      {step === 1 && (
        <input
          value={data.firstName}
          onChange={(e) => setData({ ...data, firstName: e.target.value })}
        />
      )}
      {step === 2 && (
        <input
          value={data.company}
          onChange={(e) => setData({ ...data, company: e.target.value })}
        />
      )}
      
      {step > 1 && <button onClick={() => setStep(step - 1)}>Back</button>}
      {step < 2 ? (
        <button onClick={handleNext}>Next</button>
      ) : (
        <button onClick={handleSubmit}>Submit</button>
      )}
    </>
  )
}
```

## Related Patterns

- [Form Screen](form-screen.md) - Single-step forms
- [Tabbed Form](tabbed-form-screen.md) - Multiple independent sections
- [TanStack Form Guide](../../tanstack-form-guide/SKILL.md) - Form validation
