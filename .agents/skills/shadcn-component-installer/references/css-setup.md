# CSS Setup for shadcn/ui

Complete guide for shadcn/ui CSS variables and Tailwind configuration.

## Required CSS Structure

shadcn/ui components require CSS variables defined in your Tailwind CSS file.

### Location

`src/styles/tailwind.css`

### Complete CSS Variables

```css
@import "tailwindcss";

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
    
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

## CSS Variable Categories

### Color Variables

**Background:**
- `--background` - Main background color
- `--foreground` - Main text color

**Card:**
- `--card` - Card background
- `--card-foreground` - Card text

**Popover:**
- `--popover` - Popover background
- `--popover-foreground` - Popover text

**Primary:**
- `--primary` - Primary brand color
- `--primary-foreground` - Text on primary

**Secondary:**
- `--secondary` - Secondary brand color
- `--secondary-foreground` - Text on secondary

**Muted:**
- `--muted` - Muted background
- `--muted-foreground` - Muted text

**Accent:**
- `--accent` - Accent color
- `--accent-foreground` - Text on accent

**Destructive:**
- `--destructive` - Error/delete color
- `--destructive-foreground` - Text on destructive

**Borders & Inputs:**
- `--border` - Border color
- `--input` - Input border color
- `--ring` - Focus ring color

### Layout Variables

**Border Radius:**
- `--radius` - Default border radius (0.5rem)

## Tailwind Configuration

Ensure `tailwind.config.js` or `tailwind.config.ts` references these variables:

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
```

## Dark Mode Setup

shadcn uses `next-themes` for dark mode:

```typescript
// In your root layout or app component
import { ThemeProvider } from 'next-themes'

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {/* Your app */}
    </ThemeProvider>
  )
}
```

## Verification Checklist

After installing components, verify CSS setup:

- [ ] CSS variables defined in `tailwind.css`
- [ ] Both `:root` and `.dark` variants present
- [ ] All color variables defined
- [ ] `--radius` variable defined
- [ ] Tailwind config references variables
- [ ] Dark mode class strategy configured
- [ ] `tailwindcss-animate` plugin installed

## Common Issues

### Issue: Components have no styling

**Solution:** Ensure CSS variables are defined in `tailwind.css`

### Issue: Dark mode not working

**Solution:** 
1. Check `darkMode: ['class']` in Tailwind config
2. Verify `.dark` CSS variables are defined
3. Ensure theme provider is set up

### Issue: Border radius not applied

**Solution:** Check `--radius` variable is defined

### Issue: Colors not matching

**Solution:** Verify HSL values match your design system

## Customizing Colors

To customize the color scheme, modify the HSL values:

```css
:root {
  /* Example: Blue primary color */
  --primary: 221 83% 53%;  /* hsl(221, 83%, 53%) */
  --primary-foreground: 0 0% 100%;  /* white text */
}
```

Use HSL format without `hsl()` wrapper, space-separated values.

## Required Dependencies

Ensure these are installed:

```json
{
  "dependencies": {
    "tailwindcss-animate": "^1.0.7"
  }
}
```

Install if missing:

```bash
pnpm add tailwindcss-animate
```
