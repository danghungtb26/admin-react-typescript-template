# Detail/View Screen Example

Complete implementation of a read-only detail screen.

## Structure

```
┌────────────────────────────────┐
│ Header + Actions (Edit)        │
├────────────────────────────────┤
│ Info Sections                  │
│   [Section 1: Basic Info]     │
│   [Section 2: Details]        │
│   [Section 3: Activity]       │
└────────────────────────────────┘
```

## Complete Example

```typescript
// pages/UserDetailPage.tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from '@tanstack/react-router'
import { PageHeader } from '@/components/atoms/page-header'
import { Button } from '@/components/atoms/button'
import { Badge } from '@/components/atoms/badge'
import { Avatar } from '@/components/atoms/avatar'
import { fetchUser, deleteUser } from '@/apis/user'

export function UserDetailPage() {
  const navigate = useNavigate()
  const { userId } = useParams({ from: '/users/$userId' })
  const queryClient = useQueryClient()
  
  // Fetch user data
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['users', userId],
    queryFn: () => fetchUser(userId),
  })
  
  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      navigate({ to: '/users' })
      toast.success('User deleted successfully')
    },
  })
  
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this user?')) {
      deleteMutation.mutate(userId)
    }
  }
  
  if (isLoading) {
    return <DetailSkeleton />
  }
  
  if (error || !user) {
    return (
      <div className="p-6">
        <ErrorState
          title="User not found"
          message="The user you're looking for doesn't exist or has been deleted."
          action={
            <Button onClick={() => navigate({ to: '/users' })}>
              Back to Users
            </Button>
          }
        />
      </div>
    )
  }
  
  return (
    <div className="max-w-5xl mx-auto p-6">
      <PageHeader
        title={user.name}
        breadcrumb={['Users', user.name]}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate({ to: `/users/${userId}/edit` })}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        }
      />
      
      <div className="mt-6 space-y-6">
        {/* Profile section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-start gap-6 mb-6">
            <Avatar src={user.avatar} size="lg" />
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant={user.status === 'active' ? 'success' : 'default'}>
                  {user.status}
                </Badge>
                <Badge>{user.role}</Badge>
              </div>
            </div>
          </div>
          
          {user.bio && (
            <div className="border-t pt-4">
              <p className="text-gray-700">{user.bio}</p>
            </div>
          )}
        </div>
        
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoRow label="Full Name" value={user.name} />
            <InfoRow label="Email" value={user.email} />
            <InfoRow label="Phone" value={user.phone || 'Not provided'} />
            <InfoRow label="Location" value={user.location || 'Not provided'} />
            <InfoRow
              label="Role"
              value={<Badge variant="outline">{user.role}</Badge>}
            />
            <InfoRow
              label="Status"
              value={
                <Badge
                  variant={user.status === 'active' ? 'success' : 'default'}
                >
                  {user.status}
                </Badge>
              }
            />
            <InfoRow label="Department" value={user.department || 'N/A'} />
            <InfoRow label="Employee ID" value={user.employeeId || 'N/A'} />
          </div>
        </div>
        
        {/* Account Details */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4">Account Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoRow
              label="Created At"
              value={formatDate(user.createdAt, 'PPP')}
            />
            <InfoRow
              label="Last Login"
              value={
                user.lastLoginAt
                  ? formatDate(user.lastLoginAt, 'PPP p')
                  : 'Never'
              }
            />
            <InfoRow
              label="Updated At"
              value={formatDate(user.updatedAt, 'PPP')}
            />
            <InfoRow
              label="Email Verified"
              value={
                user.emailVerified ? (
                  <span className="text-green-600">✓ Verified</span>
                ) : (
                  <span className="text-amber-600">Not verified</span>
                )
              }
            />
          </div>
        </div>
        
        {/* Permissions */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4">Permissions</h3>
          <div className="flex flex-wrap gap-2">
            {user.permissions?.map((permission) => (
              <Badge key={permission} variant="outline">
                {permission}
              </Badge>
            ))}
            {(!user.permissions || user.permissions.length === 0) && (
              <p className="text-gray-500">No special permissions</p>
            )}
          </div>
        </div>
        
        {/* Activity Timeline */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
          <ActivityTimeline userId={userId} />
        </div>
        
        {/* Related Data - Teams */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4">Teams</h3>
          <UserTeams userId={userId} />
        </div>
      </div>
    </div>
  )
}

// Info row component
function InfoRow({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div>
      <dt className="text-sm font-medium text-gray-500 mb-1">{label}</dt>
      <dd className="text-base">{value || '-'}</dd>
    </div>
  )
}

// Activity timeline component
function ActivityTimeline({ userId }: { userId: string }) {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['users', userId, 'activities'],
    queryFn: () => fetchUserActivities(userId),
  })
  
  if (isLoading) {
    return <TimelineSkeleton />
  }
  
  if (!activities || activities.length === 0) {
    return <p className="text-gray-500">No recent activity</p>
  }
  
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <div className="w-0.5 h-full bg-gray-200 mt-1" />
          </div>
          <div className="flex-1 pb-4">
            <p className="font-medium">{activity.action}</p>
            <p className="text-sm text-gray-500">{activity.description}</p>
            <p className="text-xs text-gray-400 mt-1">
              {formatDate(activity.createdAt, 'PPP p')}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

// User teams component
function UserTeams({ userId }: { userId: string }) {
  const { data: teams, isLoading } = useQuery({
    queryKey: ['users', userId, 'teams'],
    queryFn: () => fetchUserTeams(userId),
  })
  
  if (isLoading) {
    return <div>Loading teams...</div>
  }
  
  if (!teams || teams.length === 0) {
    return <p className="text-gray-500">Not a member of any team</p>
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {teams.map((team) => (
        <div
          key={team.id}
          className="border rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors"
          onClick={() => navigate({ to: `/teams/${team.id}` })}
        >
          <h4 className="font-medium">{team.name}</h4>
          <p className="text-sm text-gray-500 mt-1">{team.description}</p>
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-gray-500">
              {team.memberCount} members
            </span>
            <Badge variant="outline">{team.role}</Badge>
          </div>
        </div>
      ))}
    </div>
  )
}

// Skeleton loaders
function DetailSkeleton() {
  return (
    <div className="max-w-5xl mx-auto p-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-6" />
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="h-20 bg-gray-200 rounded" />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="h-40 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  )
}
```

## Key Features

1. **Read-only Display**
   - No editable fields
   - Clear data presentation
   - Organized into logical sections

2. **Navigation Actions**
   - Edit button to edit screen
   - Delete with confirmation
   - Breadcrumb navigation
   - Back to list

3. **Data Organization**
   - Profile header with avatar
   - Basic info in grid layout
   - Account details
   - Permissions list
   - Activity timeline
   - Related data (teams)

4. **Loading States**
   - Skeleton during load
   - Loading for nested data
   - Error state with recovery action

5. **Related Data**
   - Lazy load related data
   - Separate queries for each section
   - Interactive elements for navigation

## Simplified Version

```typescript
function SimpleUserDetail({ userId }: { userId: string }) {
  const { data: user } = useQuery({
    queryKey: ['users', userId],
    queryFn: () => fetchUser(userId),
  })
  
  if (!user) return <div>Loading...</div>
  
  return (
    <div>
      <h1>{user.name}</h1>
      <Button onClick={() => navigate(`/users/${userId}/edit`)}>Edit</Button>
      
      <div>
        <h2>Basic Info</h2>
        <p>Email: {user.email}</p>
        <p>Role: {user.role}</p>
        <p>Status: {user.status}</p>
      </div>
      
      <div>
        <h2>Activity</h2>
        <ActivityTimeline userId={userId} />
      </div>
    </div>
  )
}
```

## Related Patterns

- [List Screen](list-screen.md) - List view before detail
- [Form Screen](form-screen.md) - Edit mode
- [Data Flow](../data-flow.md) - Loading related data
