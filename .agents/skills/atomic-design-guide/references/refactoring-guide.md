# Refactoring Guide

How to reorganize components when requirements or usage patterns change.

## When to Refactor

### Signals for Refactoring Up (Feature → Shared)

1. **Same component used in 2+ features**
   - Clear sign of reusability

2. **Copy-pasting component between features**
   - DRY violation

3. **Feature component becoming generic**
   - Losing feature-specific logic
   - Props becoming more generic

4. **Request to use in another feature**
   - Actual need demonstrated

### Signals for Refactoring Down (Shared → Feature)

1. **Organism only used in one feature**
   - No reusability achieved

2. **Props becoming feature-specific**
   - Tight coupling to one domain

3. **Conditional logic for one feature**
   - Special cases for specific use

4. **No other features adopted it**
   - Premature abstraction

### Signals for Refactoring Between Levels

**Molecule → Organism:**
- Added data fetching
- Complex state management needed
- Significant business logic added

**Organism → Molecule:**
- Data fetching moved to parent
- Simplified to presentation only
- Lost complex internal logic

## Refactoring Patterns

### Pattern 1: Feature Component → Molecule

**When:** Component used in second feature, no data fetching.

**Steps:**

1. **Identify the component**
```typescript
// Currently at:
src/containers/users/components/user-card/index.tsx
```

2. **Analyze dependencies**
   - Check for feature-specific imports
   - Identify tight coupling
   - List required generalization

3. **Remove feature coupling**

**Before:**
```typescript
// src/containers/users/components/user-card/index.tsx
import { UserBadge } from '../user-badge'
import { USER_ROLES } from '@/containers/users/constants'

export function UserCard({ user }: Props) {
  return (
    <Card>
      <Avatar src={user.avatar} />
      <h3>{user.name}</h3>
      <UserBadge role={user.role} /> {/* Feature-specific */}
    </Card>
  )
}
```

**After:**
```typescript
// src/components/molecules/entity-card/index.tsx
import { Badge } from '@/components/atoms/badge'

export function EntityCard({ 
  image, 
  title, 
  subtitle, 
  badge 
}: Props) {
  return (
    <Card>
      <Avatar src={image} />
      <h3>{title}</h3>
      {subtitle && <p>{subtitle}</p>}
      {badge && <Badge>{badge}</Badge>}
    </Card>
  )
}
```

4. **Create molecule**
```bash
mkdir -p src/components/molecules/entity-card
touch src/components/molecules/entity-card/index.tsx
touch src/components/molecules/entity-card/entity-card.stories.tsx
```

5. **Update original feature to use molecule**
```typescript
// src/containers/users/components/user-card/index.tsx
import { EntityCard } from '@/components/molecules/entity-card'

export function UserCard({ user }: Props) {
  return (
    <EntityCard
      image={user.avatar}
      title={user.name}
      subtitle={user.email}
      badge={user.role}
    />
  )
}
```

6. **Update second feature**
```typescript
// src/containers/projects/components/project-card/index.tsx
import { EntityCard } from '@/components/molecules/entity-card'

export function ProjectCard({ project }: Props) {
  return (
    <EntityCard
      image={project.logo}
      title={project.name}
      subtitle={project.description}
      badge={project.status}
    />
  )
}
```

7. **Add Storybook story**

8. **Add tests**

9. **Update imports across codebase**

---

### Pattern 2: Feature Component → Organism

**When:** Component used in second feature, HAS data fetching.

**Steps:**

1. **Extract data fetching logic**

**Before:**
```typescript
// src/containers/teams/components/user-list/index.tsx
export function UserList({ teamId }: Props) {
  const { data: users } = useTeamUsers(teamId) // Feature-specific hook
  
  return (
    <div>
      {users?.map(user => (
        <UserItem key={user.id} user={user} />
      ))}
    </div>
  )
}
```

**After:**
```typescript
// src/components/organisms/user-list/index.tsx
export function UserList({ 
  filter, 
  onSelect 
}: Props) {
  const { data: users } = useUsers(filter) // Generic hook
  
  return (
    <div>
      {users?.map(user => (
        <UserItem 
          key={user.id} 
          user={user}
          onSelect={() => onSelect(user)}
        />
      ))}
    </div>
  )
}
```

2. **Make data fetching configurable**

3. **Move to organisms/**

4. **Update original feature**
```typescript
// src/containers/teams/components/team-users/index.tsx
import { UserList } from '@/components/organisms/user-list'

export function TeamUsers({ teamId }: Props) {
  return (
    <UserList
      filter={{ teamId }}
      onSelect={handleUserSelect}
    />
  )
}
```

---

### Pattern 3: Molecule → Organism

**When:** Molecule needs to fetch its own data.

**Steps:**

1. **Identify data dependency**

**Before:**
```typescript
// src/components/molecules/user-selector/index.tsx
export function UserSelector({ users, value, onChange }: Props) {
  return (
    <Select value={value} onValueChange={onChange}>
      {users.map(user => (
        <SelectItem key={user.id} value={user.id}>
          {user.name}
        </SelectItem>
      ))}
    </Select>
  )
}
```

2. **Add data fetching**

**After:**
```typescript
// src/components/organisms/user-selector/index.tsx
export function UserSelector({ value, onChange, filter }: Props) {
  const { data: users, isLoading } = useUsers(filter)
  
  if (isLoading) return <SelectSkeleton />
  
  return (
    <Select value={value} onValueChange={onChange}>
      {users?.map(user => (
        <SelectItem key={user.id} value={user.id}>
          {user.name}
        </SelectItem>
      ))}
    </Select>
  )
}
```

3. **Move from molecules/ to organisms/**

4. **Update imports**

5. **Simplify parent components** (no longer pass data)

---

### Pattern 4: Organism → Molecule

**When:** Data fetching moved to parent (e.g., for caching/coordination).

**Steps:**

1. **Extract data fetching to parent**

**Before:**
```typescript
// src/components/organisms/comment-list/index.tsx
export function CommentList({ postId }: Props) {
  const { data: comments } = useComments(postId)
  
  return (
    <div>
      {comments?.map(comment => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  )
}
```

2. **Convert to presentation component**

**After:**
```typescript
// src/components/molecules/comment-list/index.tsx
export function CommentList({ comments, isLoading }: Props) {
  if (isLoading) return <Skeleton />
  
  return (
    <div>
      {comments?.map(comment => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  )
}
```

3. **Move from organisms/ to molecules/**

4. **Update parent to fetch data**

---

### Pattern 5: Shared → Feature-Specific

**When:** Organism only used in one feature after all.

**Steps:**

1. **Verify single feature usage**
```bash
# Search for imports
rg "from '@/components/organisms/order-processor'"
```

2. **Move to feature folder**
```bash
mv src/components/organisms/order-processor \
   src/containers/orders/components/
```

3. **Update imports in feature**
```typescript
// Before
import { OrderProcessor } from '@/components/organisms/order-processor'

// After
import { OrderProcessor } from '../components/order-processor'
```

4. **Add feature-specific logic if needed**

5. **Remove from shared folder**

---

## Refactoring Checklist

### Before Refactoring

- [ ] Identify all usages of the component
- [ ] Check for feature-specific dependencies
- [ ] Plan new structure and location
- [ ] Consider impact on existing code
- [ ] Have tests in place

### During Refactoring

- [ ] Create new component structure
- [ ] Remove tight coupling
- [ ] Make props more generic
- [ ] Add/update Storybook story (if shared)
- [ ] Add/update tests
- [ ] Update all imports
- [ ] Update documentation

### After Refactoring

- [ ] Verify all tests pass
- [ ] Check TypeScript compilation
- [ ] Test in browser
- [ ] Update related components
- [ ] Remove old component
- [ ] Update team documentation

## Common Pitfalls

### Pitfall 1: Premature Abstraction

**Symptom:** Creating shared component "for future use"

**Problem:** 
- Harder to maintain
- Unclear requirements
- Wrong abstraction

**Solution:** Keep feature-specific until actually reused

---

### Pitfall 2: Over-Generalization

**Symptom:** Component with 20+ props to handle all cases

**Problem:**
- Complex API
- Hard to use
- Difficult to maintain

**Solution:** 
- Split into multiple components
- Use composition
- Keep specific variants

---

### Pitfall 3: Incomplete Refactoring

**Symptom:** Component moved but still has feature coupling

**Problem:**
- Not truly reusable
- Hidden dependencies
- Breaks in other features

**Solution:**
- Complete dependency analysis
- Remove all feature-specific code
- Make fully generic

---

### Pitfall 4: Not Updating All Usages

**Symptom:** Some files still import from old location

**Problem:**
- Duplicate code
- Inconsistent behavior
- Confusion

**Solution:**
- Use IDE refactor tools
- Search all imports: `rg "from.*old-component"`
- Update systematically

---

## Best Practices

1. **Move when proven, not predicted**
   - Wait for actual reuse
   - Don't anticipate "might need"

2. **One step at a time**
   - Move first, then optimize
   - Don't combine multiple changes

3. **Maintain backward compatibility**
   - Create wrapper if needed
   - Deprecate gradually
   - Update in phases

4. **Document the move**
   - Add migration notes
   - Update team docs
   - Comment on why moved

5. **Test thoroughly**
   - Run all tests
   - Manual testing
   - Check all features

6. **Use git effectively**
   - Separate commit for move
   - Clear commit message
   - Easy to revert

## Example Refactoring Session

### Scenario: UserAvatar used in second feature

**Current state:**
```
src/containers/users/components/user-avatar/index.tsx
```

**Used in:**
- User management (original)
- Team management (new request)

**Refactoring steps:**

1. **Analyze current component**
```typescript
// Feature-specific, but generic enough
export function UserAvatar({ user }: { user: User }) {
  return (
    <Avatar>
      <AvatarImage src={user.avatar} />
      <AvatarFallback>{user.initials}</AvatarFallback>
    </Avatar>
  )
}
```

2. **Create molecule version**
```bash
mkdir -p src/components/molecules/entity-avatar
```

```typescript
// src/components/molecules/entity-avatar/index.tsx
export function EntityAvatar({ 
  src, 
  fallback, 
  size = 'md' 
}: Props) {
  return (
    <Avatar size={size}>
      <AvatarImage src={src} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  )
}
```

3. **Add story**
```typescript
// entity-avatar.stories.tsx
export default {
  title: 'Molecules/EntityAvatar',
  component: EntityAvatar,
}
```

4. **Update user management**
```typescript
// src/containers/users/components/user-avatar/index.tsx
import { EntityAvatar } from '@/components/molecules/entity-avatar'

export function UserAvatar({ user }: { user: User }) {
  return (
    <EntityAvatar
      src={user.avatar}
      fallback={user.initials}
    />
  )
}
```

5. **Use in team management**
```typescript
// src/containers/teams/components/team-member-list/index.tsx
import { EntityAvatar } from '@/components/molecules/entity-avatar'

export function TeamMemberList({ members }: Props) {
  return (
    <div>
      {members.map(member => (
        <div key={member.id}>
          <EntityAvatar
            src={member.avatar}
            fallback={member.name[0]}
          />
          {member.name}
        </div>
      ))}
    </div>
  )
}
```

6. **Test and verify**

Done! Component is now properly shared and reusable.
