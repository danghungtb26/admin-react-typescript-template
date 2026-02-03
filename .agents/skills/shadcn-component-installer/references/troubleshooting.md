# Troubleshooting shadcn/ui Components

Common issues and solutions when installing and using shadcn/ui components.

## Installation Issues

### Component Not Installing

**Symptoms:**
- CLI command completes but component not found
- "Component not found" error

**Solutions:**

1. **Verify components.json exists:**
```bash
cat components.json
```

If missing, initialize shadcn:
```bash
pnpm dlx shadcn@latest init
```

2. **Check component name spelling:**
```bash
# Correct
pnpm dlx shadcn@latest add button

# Wrong
pnpm dlx shadcn@latest add btn
```

3. **Verify internet connection** - CLI needs to download from registry

4. **Clear cache and retry:**
```bash
rm -rf node_modules/.cache
pnpm dlx shadcn@latest add <component>
```

### Component Installed to Wrong Location

**Symptoms:**
- Component not in `src/components/atoms/`
- Import paths broken

**Solutions:**

1. **Check components.json configuration:**
```json
{
  "aliases": {
    "components": "@/components/atoms",
    "utils": "@/lib/utils"
  }
}
```

2. **Manually move component if needed:**
```bash
mv src/components/<component>.tsx src/components/atoms/
```

3. **Update import paths** in the moved component

## Dependency Issues

### Missing @radix-ui Dependencies

**Symptoms:**
- TypeScript errors about missing modules
- Runtime errors about undefined exports

**Solutions:**

1. **Install all dependencies:**
```bash
pnpm install
```

2. **Check specific Radix dependency:**
```bash
cat package.json | grep "@radix-ui/react-<component>"
```

3. **Manually install if missing:**
```bash
pnpm add @radix-ui/react-dialog @radix-ui/react-popover
```

### Missing Utility Dependencies

**Symptoms:**
- Errors about `cn`, `cva`, or class utilities
- TypeScript errors in component files

**Solutions:**

Install required utilities:
```bash
pnpm add class-variance-authority clsx tailwind-merge
```

Verify `lib/utils.ts` exists:
```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## Styling Issues

### Component Has No Styles

**Symptoms:**
- Component renders but looks unstyled
- Missing colors or borders

**Solutions:**

1. **Check CSS variables in tailwind.css:**
```bash
cat src/styles/tailwind.css | grep "layer base"
```

If missing, add required CSS variables (see [css-setup.md](css-setup.md))

2. **Verify Tailwind is processing the file:**
```bash
# Check tailwind.css is imported in main entry
cat src/main.tsx | grep "tailwind.css"
```

3. **Restart dev server:**
```bash
pnpm dev
```

### Dark Mode Not Working

**Symptoms:**
- Dark mode colors not applying
- Theme toggle doesn't work

**Solutions:**

1. **Check Tailwind config:**
```typescript
// tailwind.config.ts
export default {
  darkMode: ['class'],  // Must be 'class', not 'media'
  // ...
}
```

2. **Verify dark mode CSS variables:**
```bash
cat src/styles/tailwind.css | grep ".dark"
```

3. **Check theme provider setup:**
```typescript
import { ThemeProvider } from 'next-themes'

<ThemeProvider attribute="class" defaultTheme="system">
  {children}
</ThemeProvider>
```

4. **Ensure `next-themes` is installed:**
```bash
pnpm add next-themes
```

### Wrong Colors

**Symptoms:**
- Colors don't match design
- Components use default gray instead of brand colors

**Solutions:**

1. **Update CSS variables:**
```css
:root {
  --primary: 221 83% 53%;  /* Your brand color */
  --primary-foreground: 0 0% 100%;
}
```

2. **Use HSL format without `hsl()` wrapper**

3. **Restart dev server after CSS changes**

## TypeScript Issues

### Type Errors After Installation

**Symptoms:**
- Red squiggly lines in component files
- "Cannot find module" errors

**Solutions:**

1. **Restart TypeScript server** (in VSCode: Cmd+Shift+P → "TypeScript: Restart TS Server")

2. **Check tsconfig.json paths:**
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

3. **Run type check:**
```bash
pnpm type
```

### Missing Type Definitions

**Symptoms:**
- Types not found for component props
- `any` type warnings

**Solutions:**

1. **Install type dependencies:**
```bash
pnpm add -D @types/react @types/react-dom
```

2. **Check component exports:**
```typescript
// Should have proper type exports
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline'
}
```

## Import Issues

### Cannot Import Component

**Symptoms:**
- Import statement shows error
- Component not found at import path

**Solutions:**

1. **Verify correct import path:**
```typescript
// Correct
import { Button } from '@/components/atoms/button'

// Wrong
import { Button } from '@/components/button'
import { Button } from 'shadcn/button'
```

2. **Check component export:**
```typescript
// Component file should export
export { Button }
```

3. **Verify file exists:**
```bash
ls src/components/atoms/button.tsx
```

### Barrel Import Issues

**Symptoms:**
- `index.ts` imports not working
- Circular dependency warnings

**Solutions:**

Don't create barrel exports for shadcn components. Import directly:

```typescript
// Correct
import { Button } from '@/components/atoms/button'
import { Dialog } from '@/components/atoms/dialog'

// Wrong - don't create index.ts
import { Button, Dialog } from '@/components/atoms'
```

## Runtime Issues

### Component Crashes on Render

**Symptoms:**
- White screen
- React error boundary triggered

**Solutions:**

1. **Check console for errors**

2. **Verify all props are passed correctly:**
```typescript
// Some components require specific props
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    {/* content */}
  </DialogContent>
</Dialog>
```

3. **Check for missing required children**

### Component Behavior Not Working

**Symptoms:**
- Dropdown doesn't open
- Dialog doesn't close
- Form doesn't submit

**Solutions:**

1. **Verify controlled state:**
```typescript
// Dialog needs controlled state
const [open, setOpen] = useState(false)

<Dialog open={open} onOpenChange={setOpen}>
  {/* ... */}
</Dialog>
```

2. **Check event handlers:**
```typescript
// Button needs proper click handler
<Button onClick={() => console.log('clicked')}>
  Click me
</Button>
```

3. **Ensure proper component composition:**
```typescript
// Dropdown needs proper structure
<DropdownMenu>
  <DropdownMenuTrigger>Open</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Item</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## Build Issues

### Build Fails After Adding Component

**Symptoms:**
- `pnpm build` fails
- Compilation errors

**Solutions:**

1. **Check for TypeScript errors:**
```bash
pnpm type
```

2. **Verify all dependencies installed:**
```bash
pnpm install
```

3. **Check for CSS issues:**
```bash
# Ensure Tailwind processes correctly
pnpm build
```

4. **Clear build cache:**
```bash
rm -rf dist .vite
pnpm build
```

## Prevention Best Practices

1. **Always use CLI for installation** - Never manually create components
2. **Install dependencies immediately** - Run `pnpm install` after adding components
3. **Verify CSS variables** - Check tailwind.css has all required variables
4. **Test component** - Create simple test before using in production
5. **Check TypeScript** - Run `pnpm type` after installation
6. **Commit working state** - Commit after successful installation before modifications

## Getting More Help

If issues persist:

1. **Check shadcn documentation:** https://ui.shadcn.com/docs
2. **Review component examples:** Each component has usage examples
3. **Check Radix UI docs:** Many components wrap Radix primitives
4. **Verify project configuration:** Ensure Tailwind, TypeScript, and Vite are properly configured
