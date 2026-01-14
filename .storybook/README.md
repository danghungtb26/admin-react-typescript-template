# Storybook Setup

This project uses [Storybook](https://storybook.js.org/) for developing and documenting UI components in isolation.

## Getting Started

### Run Storybook

```bash
pnpm run storybook
```

This will start Storybook on [http://localhost:6006](http://localhost:6006)

### Build Storybook

```bash
pnpm run build-storybook
```

This will build a static version of Storybook in the `storybook-static` folder.

## Project Structure

Stories are located next to their components:

```
src/components/molecules/
├── avatar.tsx
├── avatar.stories.tsx
├── select.tsx
├── select.stories.tsx
├── tooltip.tsx
├── tooltip.stories.tsx
├── dropdown-menu.tsx
├── dropdown-menu.stories.tsx
├── popover.tsx
├── popover.stories.tsx
├── context-menu.tsx
├── context-menu.stories.tsx
├── data-table.tsx
└── data-table.stories.tsx
```

## Available Stories

### Molecule Components

- **Avatar** - Customizable avatar component with image and fallback support
- **Select** - Dropdown select component
- **Tooltip** - Tooltip component with multiple positions
- **Dropdown Menu** - Advanced dropdown menu with nested items
- **Popover** - Popover component with hover/click triggers
- **Context Menu** - Right-click context menu
- **Data Table** - Full-featured data table with sorting, pagination, and selection

## Configuration

### Storybook Config

- **Main Config**: `.storybook/main.ts` - Storybook framework and addon configuration
- **Preview Config**: `.storybook/preview.ts` - Global decorators, parameters, and styles

### ESLint Integration

The project uses ESLint v9 flat config with Storybook plugin for linting story files.

Key rules:

- `storybook/default-exports` - Ensures stories have default exports
- `storybook/story-exports` - Validates story exports
- `storybook/use-storybook-expect` - Uses Storybook's expect for tests

## Writing Stories

Create a new story file next to your component:

```tsx
// component.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { YourComponent } from './component'

const meta = {
  title: 'Category/YourComponent',
  component: YourComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof YourComponent>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    // your props
  },
}
```

## Features

- ✅ Vite builder for fast development
- ✅ Hot module replacement
- ✅ TypeScript support
- ✅ Tailwind CSS integration
- ✅ ESLint integration with v9 flat config
- ✅ Auto-generated documentation
- ✅ Interactive controls
- ✅ Accessibility testing
