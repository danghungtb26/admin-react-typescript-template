# API & Hook Naming Conventions

This project follows strict naming conventions for API core functions and React hooks to ensure consistency and discoverability.

## Directory Structure

```
src/apis/
  └── [resource-name]/
      ├── cores/          # Raw API functions (Promise-based)
      └── hooks/          # React Query hooks
```

## Naming Rules

### 1. Create

- **Action**: Creating a new resource.
- **Core File**: `create-[resource].ts`
- **Core Function**: `create[Resource]`
- **Hook File**: `use-create-[resource].ts`
- **Hook Name**: `useCreate[Resource]`

### 2. Update

- **Action**: Updating an existing resource.
- **Core File**: `update-[resource].ts`
- **Core Function**: `update[Resource]`
- **Hook File**: `use-update-[resource].ts`
- **Hook Name**: `useUpdate[Resource]`

### 3. Delete

- **Action**: Deleting a resource.
- **Core File**: `delete-[resource].ts`
- **Core Function**: `delete[Resource]`
- **Hook File**: `use-delete-[resource].ts`
- **Hook Name**: `useDelete[Resource]`

### 4. Get by ID

- **Action**: Fetching a single resource by its identifier.
- **Core File**: `get-[resource]-by-id.ts`
- **Core Function**: `get[Resource]ById`
- **Hook File**: `use-[resource]-by-id.ts`
- **Hook Name**: `use[Resource]ById`

### 5. Get List

- **Action**: Fetching a list of resources (with pagination/filtering).
- **Core File**: `get-[resource]s.ts` (Plural)
- **Core Function**: `get[Resource]s`
- **Hook File**: `use-[resource]s.ts` (Plural)
- **Hook Name**: `use[Resource]s`

## Examples (User Resource)

| Operation    | Core File           | Core Function | Hook File            | Hook Name       |
| ------------ | ------------------- | ------------- | -------------------- | --------------- |
| **Create**   | `create-user.ts`    | `createUser`  | `use-create-user.ts` | `useCreateUser` |
| **Update**   | `update-user.ts`    | `updateUser`  | `use-update-user.ts` | `useUpdateUser` |
| **Delete**   | `delete-user.ts`    | `deleteUser`  | `use-delete-user.ts` | `useDeleteUser` |
| **Get ID**   | `get-user-by-id.ts` | `getUserById` | `use-user-by-id.ts`  | `useUserById`   |
| **Get List** | `get-users.ts`      | `getUsers`    | `use-users.ts`       | `useUsers`      |
