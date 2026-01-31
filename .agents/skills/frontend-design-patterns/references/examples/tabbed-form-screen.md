# Tabbed Form Screen Example

Complete implementation of settings page with multiple independent form sections.

## Structure

```
┌────────────────────────────────┐
│ Header                         │
├────────────────────────────────┤
│ [Tab 1] [Tab 2] [Tab 3]       │
├────────────────────────────────┤
│ Tab Content (Form)             │
│   [Fields for active tab]     │
├────────────────────────────────┤
│ Actions (Save)                 │
└────────────────────────────────┘
```

## Complete Example

```typescript
// pages/UserSettingsPage.tsx
import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { z } from 'zod'
import { zodValidator } from '@tanstack/zod-form-adapter'

type TabId = 'profile' | 'security' | 'notifications'

export function UserSettingsPage() {
  const navigate = useNavigate()
  const search = useSearch({ from: '/settings' })
  const queryClient = useQueryClient()
  
  // Get active tab from URL, default to 'profile'
  const [activeTab, setActiveTab] = useState<TabId>(
    (search.tab as TabId) || 'profile'
  )
  
  // Update URL when tab changes
  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab)
    navigate({ search: { tab }, replace: true })
  }
  
  // Load current user settings
  const { data: settings } = useQuery({
    queryKey: ['user', 'settings'],
    queryFn: fetchUserSettings,
  })
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      {/* Tab navigation */}
      <div className="border-b mb-6">
        <div className="flex gap-6">
          <TabButton
            active={activeTab === 'profile'}
            onClick={() => handleTabChange('profile')}
          >
            Profile
          </TabButton>
          <TabButton
            active={activeTab === 'security'}
            onClick={() => handleTabChange('security')}
          >
            Security
          </TabButton>
          <TabButton
            active={activeTab === 'notifications'}
            onClick={() => handleTabChange('notifications')}
          >
            Notifications
          </TabButton>
        </div>
      </div>
      
      {/* Tab content */}
      {activeTab === 'profile' && <ProfileTab settings={settings} />}
      {activeTab === 'security' && <SecurityTab />}
      {activeTab === 'notifications' && <NotificationsTab settings={settings} />}
    </div>
  )
}

// Tab button component
function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`pb-3 border-b-2 font-medium transition-colors ${
        active
          ? 'border-blue-500 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-700'
      }`}
    >
      {children}
    </button>
  )
}

// Profile Tab
function ProfileTab({ settings }: { settings?: UserSettings }) {
  const queryClient = useQueryClient()
  
  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'settings'] })
      toast.success('Profile updated successfully')
    },
  })
  
  const form = useForm({
    defaultValues: {
      name: settings?.name || '',
      email: settings?.email || '',
      avatar: settings?.avatar || '',
      bio: settings?.bio || '',
      location: settings?.location || '',
    },
    validatorAdapter: zodValidator,
    validators: {
      onChange: z.object({
        name: z.string().min(1, 'Name is required'),
        email: z.string().email('Invalid email'),
        avatar: z.string().url().optional(),
        bio: z.string().max(160, 'Bio must be 160 characters or less').optional(),
        location: z.string().optional(),
      }),
    },
    onSubmit: async ({ value }) => {
      await updateMutation.mutateAsync(value)
    },
  })
  
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="bg-white p-6 rounded-lg shadow"
    >
      <h2 className="text-xl font-bold mb-6">Profile Information</h2>
      
      <div className="space-y-6">
        {/* Avatar upload */}
        <form.Field
          name="avatar"
          children={(field) => (
            <div>
              <label className="block text-sm font-medium mb-2">Avatar</label>
              <div className="flex items-center gap-4">
                <img
                  src={field.state.value || '/default-avatar.png'}
                  alt="Avatar"
                  className="w-16 h-16 rounded-full"
                />
                <Button type="button" variant="outline">
                  Upload New
                </Button>
              </div>
            </div>
          )}
        />
        
        {/* Name */}
        <form.Field
          name="name"
          children={(field) => (
            <div>
              <label className="block text-sm font-medium mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
              {!field.state.meta.isValid && (
                <p className="text-red-500 text-sm mt-1">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </div>
          )}
        />
        
        {/* Email */}
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
                className="w-full px-3 py-2 border rounded"
              />
              {!field.state.meta.isValid && (
                <p className="text-red-500 text-sm mt-1">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </div>
          )}
        />
        
        {/* Bio */}
        <form.Field
          name="bio"
          children={(field) => (
            <div>
              <label className="block text-sm font-medium mb-1">Bio</label>
              <textarea
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border rounded"
                placeholder="Tell us about yourself..."
              />
              <p className="text-xs text-gray-500 mt-1">
                {field.state.value.length}/160 characters
              </p>
              {!field.state.meta.isValid && (
                <p className="text-red-500 text-sm mt-1">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </div>
          )}
        />
        
        {/* Location */}
        <form.Field
          name="location"
          children={(field) => (
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                placeholder="City, Country"
              />
            </div>
          )}
        />
      </div>
      
      <div className="flex gap-2 mt-6 pt-6 border-t">
        <Button
          type="submit"
          disabled={!form.state.canSubmit || updateMutation.isPending}
        >
          {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
        
        {form.state.isDirty && (
          <p className="text-sm text-amber-600 ml-4 self-center">
            You have unsaved changes
          </p>
        )}
      </div>
    </form>
  )
}

// Security Tab
function SecurityTab() {
  const updatePasswordMutation = useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      toast.success('Password updated successfully')
      form.reset()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
  
  const form = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validatorAdapter: zodValidator,
    validators: {
      onChange: z
        .object({
          currentPassword: z.string().min(1, 'Current password is required'),
          newPassword: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(/[A-Z]/, 'Must contain uppercase letter')
            .regex(/[0-9]/, 'Must contain number'),
          confirmPassword: z.string(),
        })
        .refine((data) => data.newPassword === data.confirmPassword, {
          message: "Passwords don't match",
          path: ['confirmPassword'],
        }),
    },
    onSubmit: async ({ value }) => {
      await updatePasswordMutation.mutateAsync({
        currentPassword: value.currentPassword,
        newPassword: value.newPassword,
      })
    },
  })
  
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="bg-white p-6 rounded-lg shadow"
    >
      <h2 className="text-xl font-bold mb-6">Change Password</h2>
      
      <div className="space-y-6 max-w-md">
        <form.Field
          name="currentPassword"
          children={(field) => (
            <div>
              <label className="block text-sm font-medium mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
              {!field.state.meta.isValid && (
                <p className="text-red-500 text-sm mt-1">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </div>
          )}
        />
        
        <form.Field
          name="newPassword"
          children={(field) => (
            <div>
              <label className="block text-sm font-medium mb-1">
                New Password
              </label>
              <input
                type="password"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
              {!field.state.meta.isValid && (
                <p className="text-red-500 text-sm mt-1">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </div>
          )}
        />
        
        <form.Field
          name="confirmPassword"
          children={(field) => (
            <div>
              <label className="block text-sm font-medium mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
              {!field.state.meta.isValid && (
                <p className="text-red-500 text-sm mt-1">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </div>
          )}
        />
      </div>
      
      <div className="flex gap-2 mt-6 pt-6 border-t">
        <Button
          type="submit"
          disabled={!form.state.canSubmit || updatePasswordMutation.isPending}
        >
          {updatePasswordMutation.isPending ? 'Updating...' : 'Update Password'}
        </Button>
      </div>
    </form>
  )
}

// Notifications Tab
function NotificationsTab({ settings }: { settings?: UserSettings }) {
  const queryClient = useQueryClient()
  
  const updateMutation = useMutation({
    mutationFn: updateNotificationSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'settings'] })
      toast.success('Notification settings updated')
    },
  })
  
  const form = useForm({
    defaultValues: {
      emailNotifications: settings?.emailNotifications ?? true,
      pushNotifications: settings?.pushNotifications ?? false,
      smsNotifications: settings?.smsNotifications ?? false,
      weeklyDigest: settings?.weeklyDigest ?? true,
    },
    onSubmit: async ({ value }) => {
      await updateMutation.mutateAsync(value)
    },
  })
  
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="bg-white p-6 rounded-lg shadow"
    >
      <h2 className="text-xl font-bold mb-6">Notification Preferences</h2>
      
      <div className="space-y-6">
        <form.Field
          name="emailNotifications"
          children={(field) => (
            <div className="flex items-start">
              <input
                type="checkbox"
                id="emailNotifications"
                checked={field.state.value}
                onChange={(e) => field.handleChange(e.target.checked)}
                className="mt-1 mr-3"
              />
              <div>
                <label htmlFor="emailNotifications" className="font-medium">
                  Email Notifications
                </label>
                <p className="text-sm text-gray-500">
                  Receive notifications via email
                </p>
              </div>
            </div>
          )}
        />
        
        <form.Field
          name="pushNotifications"
          children={(field) => (
            <div className="flex items-start">
              <input
                type="checkbox"
                id="pushNotifications"
                checked={field.state.value}
                onChange={(e) => field.handleChange(e.target.checked)}
                className="mt-1 mr-3"
              />
              <div>
                <label htmlFor="pushNotifications" className="font-medium">
                  Push Notifications
                </label>
                <p className="text-sm text-gray-500">
                  Receive push notifications on your devices
                </p>
              </div>
            </div>
          )}
        />
        
        <form.Field
          name="smsNotifications"
          children={(field) => (
            <div className="flex items-start">
              <input
                type="checkbox"
                id="smsNotifications"
                checked={field.state.value}
                onChange={(e) => field.handleChange(e.target.checked)}
                className="mt-1 mr-3"
              />
              <div>
                <label htmlFor="smsNotifications" className="font-medium">
                  SMS Notifications
                </label>
                <p className="text-sm text-gray-500">
                  Receive important updates via SMS
                </p>
              </div>
            </div>
          )}
        />
        
        <div className="border-t pt-6">
          <h3 className="font-medium mb-4">Digest Settings</h3>
          
          <form.Field
            name="weeklyDigest"
            children={(field) => (
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="weeklyDigest"
                  checked={field.state.value}
                  onChange={(e) => field.handleChange(e.target.checked)}
                  className="mt-1 mr-3"
                />
                <div>
                  <label htmlFor="weeklyDigest" className="font-medium">
                    Weekly Digest
                  </label>
                  <p className="text-sm text-gray-500">
                    Receive a weekly summary of your activity
                  </p>
                </div>
              </div>
            )}
          />
        </div>
      </div>
      
      <div className="flex gap-2 mt-6 pt-6 border-t">
        <Button
          type="submit"
          disabled={!form.state.canSubmit || updateMutation.isPending}
        >
          {updateMutation.isPending ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </form>
  )
}
```

## Key Features

1. **Tab Management**
   - Tab state stored in URL
   - Direct linking to specific tab
   - Persistent state across navigation

2. **Independent Forms**
   - Separate form instance per tab
   - Independent validation
   - Individual save actions

3. **Form Types**
   - Profile: Text inputs, textarea, file upload
   - Security: Password change with confirmation
   - Notifications: Checkbox preferences

4. **UX Enhancements**
   - Unsaved changes warning
   - Loading states
   - Success/error notifications
   - Disabled submit when invalid

## Related Patterns

- [Form Screen](form-screen.md) - Single form patterns
- [Multi-Step Form](multi-step-form-screen.md) - Sequential forms
- [Data Flow](../data-flow.md) - State management
