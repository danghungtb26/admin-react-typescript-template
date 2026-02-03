# shadcn/ui Component List

Complete list of available shadcn/ui components and their installation commands.

## Form Components

| Component | Command | Description |
|-----------|---------|-------------|
| Form | `pnpm dlx shadcn@latest add form` | Form wrapper with React Hook Form |
| Input | `pnpm dlx shadcn@latest add input` | Text input field |
| Textarea | `pnpm dlx shadcn@latest add textarea` | Multi-line text input |
| Select | `pnpm dlx shadcn@latest add select` | Dropdown select |
| Checkbox | `pnpm dlx shadcn@latest add checkbox` | Checkbox input |
| Radio Group | `pnpm dlx shadcn@latest add radio-group` | Radio button group |
| Switch | `pnpm dlx shadcn@latest add switch` | Toggle switch |
| Slider | `pnpm dlx shadcn@latest add slider` | Range slider |
| Label | `pnpm dlx shadcn@latest add label` | Form label |
| Combobox | `pnpm dlx shadcn@latest add combobox` | Searchable select |

## Button & Interactive

| Component | Command | Description |
|-----------|---------|-------------|
| Button | `pnpm dlx shadcn@latest add button` | Button component |
| Toggle | `pnpm dlx shadcn@latest add toggle` | Toggle button |
| Toggle Group | `pnpm dlx shadcn@latest add toggle-group` | Group of toggle buttons |

## Layout & Navigation

| Component | Command | Description |
|-----------|---------|-------------|
| Card | `pnpm dlx shadcn@latest add card` | Card container |
| Separator | `pnpm dlx shadcn@latest add separator` | Horizontal/vertical separator |
| Tabs | `pnpm dlx shadcn@latest add tabs` | Tab navigation |
| Navigation Menu | `pnpm dlx shadcn@latest add navigation-menu` | Navigation menu |
| Menubar | `pnpm dlx shadcn@latest add menubar` | Menu bar |
| Breadcrumb | `pnpm dlx shadcn@latest add breadcrumb` | Breadcrumb navigation |
| Accordion | `pnpm dlx shadcn@latest add accordion` | Collapsible accordion |
| Collapsible | `pnpm dlx shadcn@latest add collapsible` | Collapsible content |
| Resizable | `pnpm dlx shadcn@latest add resizable` | Resizable panels |
| Scroll Area | `pnpm dlx shadcn@latest add scroll-area` | Custom scrollable area |
| Aspect Ratio | `pnpm dlx shadcn@latest add aspect-ratio` | Aspect ratio container |

## Overlay & Modal

| Component | Command | Description |
|-----------|---------|-------------|
| Dialog | `pnpm dlx shadcn@latest add dialog` | Modal dialog |
| Sheet | `pnpm dlx shadcn@latest add sheet` | Slide-out sheet/drawer |
| Popover | `pnpm dlx shadcn@latest add popover` | Popover overlay |
| Hover Card | `pnpm dlx shadcn@latest add hover-card` | Hover card tooltip |
| Tooltip | `pnpm dlx shadcn@latest add tooltip` | Tooltip |
| Alert Dialog | `pnpm dlx shadcn@latest add alert-dialog` | Alert/confirm dialog |
| Drawer | `pnpm dlx shadcn@latest add drawer` | Mobile-friendly drawer |

## Data Display

| Component | Command | Description |
|-----------|---------|-------------|
| Table | `pnpm dlx shadcn@latest add table` | Data table |
| Data Table | `pnpm dlx shadcn@latest add data-table` | Advanced data table with features |
| Avatar | `pnpm dlx shadcn@latest add avatar` | User avatar |
| Badge | `pnpm dlx shadcn@latest add badge` | Badge label |
| Calendar | `pnpm dlx shadcn@latest add calendar` | Calendar picker |
| Carousel | `pnpm dlx shadcn@latest add carousel` | Image/content carousel |
| Command | `pnpm dlx shadcn@latest add command` | Command palette |
| Context Menu | `pnpm dlx shadcn@latest add context-menu` | Right-click context menu |

## Feedback

| Component | Command | Description |
|-----------|---------|-------------|
| Alert | `pnpm dlx shadcn@latest add alert` | Alert message |
| Toast | `pnpm dlx shadcn@latest add toast` | Toast notification |
| Progress | `pnpm dlx shadcn@latest add progress` | Progress bar |
| Skeleton | `pnpm dlx shadcn@latest add skeleton` | Loading skeleton |
| Sonner | `pnpm dlx shadcn@latest add sonner` | Toast notifications (Sonner) |

## Dropdown & Menu

| Component | Command | Description |
|-----------|---------|-------------|
| Dropdown Menu | `pnpm dlx shadcn@latest add dropdown-menu` | Dropdown menu |
| Select | `pnpm dlx shadcn@latest add select` | Select dropdown |
| Command | `pnpm dlx shadcn@latest add command` | Command menu |

## Date & Time

| Component | Command | Description |
|-----------|---------|-------------|
| Calendar | `pnpm dlx shadcn@latest add calendar` | Calendar component |
| Date Picker | `pnpm dlx shadcn@latest add date-picker` | Date picker (includes Calendar) |

## Input Components

| Component | Command | Description |
|-----------|---------|-------------|
| Input OTP | `pnpm dlx shadcn@latest add input-otp` | OTP input |
| Pagination | `pnpm dlx shadcn@latest add pagination` | Pagination controls |

## Installation Examples

### Install Multiple Components

```bash
# Form components
pnpm dlx shadcn@latest add form input label button

# Data display
pnpm dlx shadcn@latest add table badge avatar

# Overlay components
pnpm dlx shadcn@latest add dialog sheet popover
```

### Common Component Groups

**Basic Form:**
```bash
pnpm dlx shadcn@latest add form input textarea label button
```

**Data Table Setup:**
```bash
pnpm dlx shadcn@latest add table dropdown-menu checkbox
```

**Modal & Dialogs:**
```bash
pnpm dlx shadcn@latest add dialog alert-dialog sheet
```

**Navigation:**
```bash
pnpm dlx shadcn@latest add navigation-menu breadcrumb tabs
```

**User Profile:**
```bash
pnpm dlx shadcn@latest add avatar badge card separator
```

## Component Dependencies

Some components require others:

- **Data Table** → requires `table`, `dropdown-menu`, `checkbox`
- **Date Picker** → requires `calendar`, `popover`, `button`
- **Command** → requires `dialog` (for command palette)
- **Form** → requires `label`, form field components

The CLI usually handles these automatically, but verify all dependencies are installed.

## Finding Components

To see all available components:

```bash
pnpm dlx shadcn@latest add
# This will show an interactive list
```

Or visit: https://ui.shadcn.com/docs/components

## Notes

- All components install to `src/components/atoms/` by default
- Components follow project's kebab-case naming
- Each component comes with proper TypeScript types
- Dark mode support is built-in via CSS variables
- Accessible by default (using Radix UI primitives)
