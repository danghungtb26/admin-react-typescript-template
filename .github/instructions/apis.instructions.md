---
applyTo: src/apis/**
---

# API Layer Instructions

**See [`.projects/shared/rules/apis.md`](../../.projects/shared/rules/apis.md) for complete API and hook naming conventions.**

## Quick Summary

### Directory Structure

```
src/apis/<domain>/
├── cores/      # Core API functions
├── hooks/      # React Query hooks
└── mock-data.ts
```

### Model Decorators

```typescript
import { field } from '@/decorators/field'
import { model } from '@/decorators/model'

@model()
export class User extends Base {
  @field('user_name')
  name?: string
}
```

### React Query Hooks

```typescript
export const useUsers = (params?: ListUsersParams) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => getUsers(params || {}),
    placeholderData: keepPreviousData,
  })
}
```

Refer to the shared rules for detailed patterns and conventions.
