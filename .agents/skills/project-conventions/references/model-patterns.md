# Model Patterns

Guide for defining data models using decorator pattern.

## Overview

Models are TypeScript classes that:
- Use decorators for field mapping
- Extend from `Base` class for common functionality
- Provide serialization/deserialization (`toJson`/`fromJson`)
- Support nested models and arrays
- Map snake_case API fields to camelCase properties

## Base Model Class

All models extend from `Base` which provides:

```typescript
// src/models/base.ts
export abstract class Base {
  @field('created_at')
  createdAt?: string
  
  @field('updated_at')
  updatedAt?: string
  
  @field('deleted_at')
  deletedAt?: string
  
  @field()
  id?: string
  
  @field()
  order?: number
  
  // Convert instance to JSON (for API requests)
  toJson() { ... }
  
  // Create instance from JSON (from API responses)
  static fromJson<T>(json?: unknown): T
  
  // Clone instance
  static clone<T>(d?: T): T
  
  // Format dates
  createdAtFormatted(): string
  updatedAtFormatted(): string
}
```

**Key Features:**
- Common timestamp fields
- Serialization methods
- Date formatting helpers
- Field mapping with decorators

## Creating a Simple Model

### Step 1: Define the Model Class

```typescript
// src/models/category.ts
import { field } from '@/decorators/field'
import { model } from '@/decorators/model'
import { Base } from './base'

@model()
export class Category extends Base {
  @field()
  name!: string              // Required field
  
  @field()
  description?: string       // Optional field
}
```

**Pattern:**
- Use `@model()` decorator on class
- Use `@field()` decorator on each property
- Extend `Base` for common fields
- Use `!` for required fields, `?` for optional

### Step 2: Usage

```typescript
// Create from API response
const category = Category.fromJson({
  id: '1',
  name: 'Electronics',
  description: 'Electronic devices',
  created_at: '2024-01-01',  // Auto-mapped to createdAt
})

// Access properties
console.log(category.name)        // 'Electronics'
console.log(category.createdAt)   // '2024-01-01'

// Convert to JSON for API request
const json = category.toJson()
// { id: '1', name: 'Electronics', description: '...', created_at: '2024-01-01' }
```

## Field Mapping (snake_case ↔ camelCase)

### Basic Mapping

```typescript
@model()
export class Account extends Base {
  @field('user_id')         // API field: user_id
  userId?: string           // Property: userId
  
  @field('username')        // API field: username
  username?: string         // Property: username (same name, explicit mapping)
}
```

**When to use explicit field name:**
- API uses snake_case: `@field('user_id')` → `userId`
- Different naming: `@field('email_address')` → `email`
- Same name: `@field('username')` → `username` (optional but explicit)

### Without @field Decorator

```typescript
@model()
export class User extends Base {
  // Properties without @field are not mapped to/from JSON
  password?: string         // Not sent to/from API
  avatar?: string = ''      // Local-only with default value
  name?: string = ''        // Local-only field
}
```

**Use cases:**
- Temporary UI state
- Computed properties
- Sensitive data (passwords)
- Local-only fields

## Nested Models

### Single Nested Model

```typescript
// src/models/user.ts
import { Address } from './address'

@model()
export class User extends Base {
  @field()
  name?: string
  
  @field('address', Address)    // Nested model
  address?: Address
}

// Usage
const user = User.fromJson({
  name: 'John',
  address: {
    detail: '123 Main St',
    lat: 10.12,
    lng: 106.34,
  }
})

console.log(user.address?.detail)  // '123 Main St'
```

**Pattern:**
```typescript
@field('api_field_name', NestedModelClass)
property?: NestedModelClass
```

### Array of Nested Models

```typescript
// src/models/role.ts
import { Permission } from './permission'

@model()
export class Role extends Base {
  @field()
  name?: string
  
  @field('permissions', [Permission])   // Array of models
  permissions?: Permission[]
}

// Usage
const role = Role.fromJson({
  name: 'Admin',
  permissions: [
    { id: '1', name: 'read' },
    { id: '2', name: 'write' },
  ]
})

console.log(role.permissions?.length)  // 2
console.log(role.permissions?.[0].name)  // 'read'
```

**Pattern:**
```typescript
@field('api_field_name', [NestedModelClass])
property?: NestedModelClass[]
```

## Complex Field Types

### Literal Types

```typescript
@model()
export class User extends Base {
  @field()
  gender?: 'male' | 'female' | 'other'
  
  @field()
  status?: 'Online' | 'Offline'
}
```

### Object Types

```typescript
@model()
export class User extends Base {
  @field()
  company?: { name: string; logo: string }
}
```

### Array Types

```typescript
@model()
export class Role extends Base {
  @field()
  scopes?: string[]        // Array of primitives
}
```

## Default Values

### Static Default Method

```typescript
@model()
export class Pagination {
  @field('current_page')
  current: number = 0
  
  @field('total_page')
  max: number = 10
  
  @field()
  total: number = 0
  
  static get default() {
    return this.fromJson({
      current_page: 0,
      total_page: 10,
      total: 0,
    })
  }
}

// Usage
const pagination = Pagination.default
```

### Property Defaults

```typescript
@model()
export class Address extends Base {
  detail: string = ''       // Default empty string
  lat: number = 0          // Default 0
  lng: number = 0          // Default 0
  url: string = ''         // Default empty string
}
```

## Custom Methods

### Serialization Methods

```typescript
@model()
export class User extends Base {
  // Custom JSON output for creating
  public toAddJson() {
    return {
      ...this.toJson(),
      // Add or modify fields
    }
  }
  
  // Custom JSON output for updating
  public toUpdateJson() {
    return {
      ...this.toJson(),
      // Remove fields that shouldn't be updated
    }
  }
}

// Usage
const json = user.toAddJson()    // For POST requests
const json = user.toUpdateJson() // For PUT/PATCH requests
```

### Computed Properties

```typescript
@model()
export class User extends Base {
  @field()
  name?: string
  
  // Computed property
  get displayName(): string {
    return this.name || 'Anonymous'
  }
  
  // Method
  isActive(): boolean {
    return this.status === 'Online'
  }
}
```

## Complete Example

```typescript
// src/models/user.ts
import { field } from '@/decorators/field'
import { model } from '@/decorators/model'
import { Base } from './base'
import { Address } from './address'

@model()
export class User extends Base {
  // Basic fields
  @field()
  name?: string
  
  @field()
  email?: string
  
  @field()
  phone?: string
  
  @field()
  avatar?: string
  
  @field()
  birthday?: string
  
  // Literal type
  @field()
  gender?: 'male' | 'female' | 'other'
  
  @field()
  status?: 'Online' | 'Offline'
  
  // Nested model
  @field('address', Address)
  address?: Address
  
  // Object type
  @field()
  company?: { name: string; logo: string }
  
  // Custom serialization
  public toAddJson() {
    return {
      ...this.toJson(),
      // Customize for POST request
    }
  }
  
  // Computed property
  get displayName(): string {
    return this.name || this.email || 'Anonymous'
  }
}

// src/models/address.ts
import { model } from '@/decorators/model'
import { Base } from './base'

@model()
export class Address extends Base {
  detail: string = ''
  lat: number = 0
  lng: number = 0
  url: string = ''
  
  country?: string
  province?: string
  district?: string
  ward?: string
}
```

## Usage in API Cores

```typescript
// src/apis/user/cores/get-users.ts
import { httpClient } from '@/libs/http-client'
import { User } from '@/models/user'

export async function getUsers(): Promise<User[]> {
  const response = await httpClient.get('/users')
  
  // Convert API response to model instances
  return response.data.map(item => User.fromJson(item))
}

// src/apis/user/cores/create-user.ts
import { httpClient } from '@/libs/http-client'
import { User } from '@/models/user'

export async function createUser(user: User): Promise<User> {
  // Convert model to JSON for API
  const json = user.toAddJson()
  
  const response = await httpClient.post('/users', json)
  
  // Convert response to model
  return User.fromJson(response.data)
}
```

## Best Practices

### 1. One Model Per File
```
src/models/
├── user.ts          # User model
├── address.ts       # Address model
├── role.ts          # Role model
└── permission.ts    # Permission model
```

### 2. Always Extend Base
```typescript
// ✅ Good
@model()
export class Category extends Base { ... }

// ❌ Bad - missing Base
@model()
export class Category { ... }
```

### 3. Use @field for API Fields
```typescript
// ✅ Good - will be serialized
@field()
name?: string

// ⚠️ Use carefully - won't be serialized (local-only)
temporaryValue?: string
```

### 4. Explicit Field Mapping
```typescript
// ✅ Good - explicit mapping
@field('user_id')
userId?: string

// ⚠️ OK but less clear
@field()
userId?: string  // Works if API also uses userId
```

### 5. Required vs Optional
```typescript
// Required field (must have value)
@field()
name!: string

// Optional field
@field()
description?: string
```

### 6. Default Values for Pagination
```typescript
@model()
export class Pagination {
  @field('current_page')
  current: number = 0    // Always provide defaults
  
  static get default() {
    return this.fromJson({ current_page: 0, ... })
  }
}
```

## Common Patterns

### Pattern 1: Entity Model
```typescript
@model()
export class User extends Base {
  @field()
  name!: string
  
  @field()
  email!: string
}
```

### Pattern 2: With Nested Relations
```typescript
@model()
export class User extends Base {
  @field()
  name!: string
  
  @field('role', Role)
  role?: Role
  
  @field('permissions', [Permission])
  permissions?: Permission[]
}
```

### Pattern 3: With Custom Methods
```typescript
@model()
export class User extends Base {
  @field()
  name?: string
  
  public toAddJson() {
    return { ...this.toJson() }
  }
  
  static get default() {
    return this.fromJson({})
  }
}
```

### Pattern 4: Pagination/Utility Models
```typescript
@model()
export class Pagination {
  @field('current_page')
  current: number = 0
  
  @field('total_page')
  max: number = 10
  
  static get default() {
    return this.fromJson({ current_page: 0, total_page: 10 })
  }
}
```

## Quick Reference

| Decorator | Usage | Example |
|-----------|-------|---------|
| `@model()` | Class decorator | `@model() export class User` |
| `@field()` | Simple field | `@field() name?: string` |
| `@field('api_name')` | Map field name | `@field('user_id') userId?: string` |
| `@field('name', Type)` | Nested model | `@field('address', Address) address?: Address` |
| `@field('name', [Type])` | Array of models | `@field('items', [Item]) items?: Item[]` |

## Summary

✅ **Do:**
- Always extend `Base`
- Use `@model()` decorator on class
- Use `@field()` for API-mapped properties
- Provide explicit field names for snake_case
- Create static `default` getter for common defaults
- Add custom `toAddJson`/`toUpdateJson` when needed

❌ **Don't:**
- Create models without extending `Base`
- Forget `@model()` decorator
- Mix API and UI-only fields without consideration
- Use models without proper field decorators

**➡️ See also:**
- [API Patterns](api-patterns.md) - How to use models in API cores
- [Naming Conventions](naming-conventions.md) - Model and field naming rules
