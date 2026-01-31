---
name: shadcn-component-installer
description: Install and verify shadcn/ui components using the official CLI. Use when the user requests to add shadcn components, needs UI components like button, dialog, table, form elements, or mentions installing shadcn components. Always use the CLI installation method - never manually create shadcn component code.
---

# shadcn/ui Component Installer

## Overview

This skill ensures proper installation and verification of shadcn/ui components using the official CLI. It prevents manual component creation and validates installations.

## Critical Rules

### ❌ NEVER Manually Create Components

**NEVER** write shadcn component code manually. Always use the CLI:

```bash
pnpm dlx shadcn@latest add <component-name>
```

### ✅ Always Use CLI Installation

shadcn/ui provides an official CLI that:
- Installs components with correct dependencies
- Adds required CSS variables
- Ensures proper configuration
- Maintains consistency

## Installation Process

### Step 1: Install Component

Use the shadcn CLI to install components:

```bash
# Single component
pnpm dlx shadcn@latest add button

# Multiple components
pnpm dlx shadcn@latest add button dialog card
```

**Common components:**
- `button` - Button component
- `dialog` - Dialog/modal component
- `input` - Input field
- `form` - Form components
- `select` - Select dropdown
- `table` - Data table
- `dropdown-menu` - Dropdown menu
- `popover` - Popover component
- `toast` - Toast notifications
- `sheet` - Sheet/drawer component
- `tabs` - Tabs component
- `card` - Card component
- `badge` - Badge component
- `avatar` - Avatar component
- `checkbox` - Checkbox input
- `radio-group` - Radio button group
- `switch` - Switch toggle
- `slider` - Slider input
- `textarea` - Textarea input
- `label` - Label component
- `separator` - Separator line

For complete list, see [references/component-list.md](references/component-list.md).

### Step 2: Verify Installation Location

After installation, verify the component is in the correct location:

```bash
# Check the component was installed to atoms/
ls -la src/components/atoms/<component-name>.tsx
```

**Expected location:**
- All shadcn components → `src/components/atoms/`
- File naming: `<component-name>.tsx` (kebab-case)

### Step 3: Check Dependencies

Verify all required dependencies were installed:

```bash
# Check package.json for new dependencies
cat package.json | grep -A 20 "dependencies"
```

**Common dependencies shadcn components need:**
- `@radix-ui/*` - Radix UI primitives
- `class-variance-authority` - CVA for variants
- `clsx` - Conditional classes
- `tailwind-merge` - Merge Tailwind classes
- `lucide-react` - Icons (if using icon components)

If missing dependencies, install them:

```bash
pnpm install
```

### Step 4: Verify CSS Variables

Check if required CSS variables are present in `src/styles/tailwind.css`:

```bash
# Check for CSS variables
cat src/styles/tailwind.css
```

**Required CSS variables structure:**

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 47.4% 11.2%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 47.4% 11.2%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 47.4% 11.2%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 47.4% 11.2%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... other dark mode variables */
  }
}
```

If CSS variables are missing, the shadcn CLI usually adds them automatically. If not, check the component documentation for required variables.

For complete CSS setup, see [references/css-setup.md](references/css-setup.md).

## Post-Installation Checklist

After installing a component, verify:

- [ ] Component file exists in `src/components/atoms/<component-name>.tsx`
- [ ] File uses kebab-case naming
- [ ] All dependencies are in `package.json`
- [ ] Run `pnpm install` if new dependencies were added
- [ ] CSS variables are present in `tailwind.css`
- [ ] Component imports without errors
- [ ] TypeScript compilation succeeds

## Verification Commands

Run these commands after installation:

```bash
# 1. Check component exists
ls src/components/atoms/ | grep <component-name>

# 2. Check dependencies
cat package.json | grep "@radix-ui"

# 3. Check CSS variables
cat src/styles/tailwind.css | grep "layer base"

# 4. Type check
pnpm type

# 5. Test import
# Create a test file or check in existing component
```

## Common Issues & Solutions

### Issue: Component not found after installation

**Solution:**
1. Check if installation completed successfully
2. Verify component is in `components.json` config
3. Re-run installation command

### Issue: Missing dependencies

**Solution:**
```bash
pnpm install
```

### Issue: CSS variables missing

**Solution:**
1. Check `tailwind.css` for `@layer base`
2. Manually add missing variables from shadcn docs
3. Restart dev server

### Issue: TypeScript errors

**Solution:**
1. Check all dependencies installed: `pnpm install`
2. Restart TypeScript server
3. Check import paths are correct

## Usage Examples

### Example 1: Installing Button Component

```bash
# 1. Install
pnpm dlx shadcn@latest add button

# 2. Verify location
ls src/components/atoms/button.tsx

# 3. Check dependencies
cat package.json | grep "class-variance-authority"

# 4. Use in code
import { Button } from '@/components/atoms/button'

<Button variant="default">Click me</Button>
```

### Example 2: Installing Form Components

```bash
# Install multiple form components
pnpm dlx shadcn@latest add form input label

# Verify all installed
ls src/components/atoms/ | grep -E "form|input|label"

# Use together
import { Form } from '@/components/atoms/form'
import { Input } from '@/components/atoms/input'
import { Label } from '@/components/atoms/label'
```

### Example 3: Installing Dialog Component

```bash
# Install dialog
pnpm dlx shadcn@latest add dialog

# Check @radix-ui/react-dialog dependency
cat package.json | grep "@radix-ui/react-dialog"

# If missing, install
pnpm install

# Use dialog
import { Dialog, DialogContent, DialogHeader } from '@/components/atoms/dialog'
```

## When Creating Molecule Components

After installing shadcn atoms, you may create molecule wrappers:

1. shadcn component installed in `src/components/atoms/`
2. Create custom wrapper in `src/components/molecules/<name>/`
3. Import and extend the atom component
4. Add business logic and custom behavior

**Example:**

```typescript
// src/components/molecules/user-avatar/index.tsx
import { Avatar } from '@/components/atoms/avatar'

export function UserAvatar({ user }: { user: User }) {
  return (
    <Avatar>
      <AvatarImage src={user.avatarUrl} />
      <AvatarFallback>{user.initials}</AvatarFallback>
    </Avatar>
  )
}
```

## Summary

**Key Points:**
1. ✅ Always use `pnpm dlx shadcn@latest add <component>`
2. ❌ Never manually create shadcn components
3. ✅ Verify installation in `src/components/atoms/`
4. ✅ Check dependencies and CSS variables
5. ✅ Run type check after installation
6. ✅ Test component import before using

For more details, see:
- [Component list](references/component-list.md)
- [CSS setup](references/css-setup.md)
- [Troubleshooting](references/troubleshooting.md)
