# Frontend Spec Template

> Fill in each section below. Use "N/A" or omit sections that do not apply.

---

## 1. Overview

- **Feature / screen name:**
- **Short description:**
- **Created at:**
- **Route (if known):** *(Leave empty or "TBD" when the spec is design-only and the route is not decided yet.)*
- **Requirement source:** (check all that apply)
  - [ ] Figma
  - [ ] Screenshot
  - [ ] Documentation
  - [ ] Description

---

## 2. In scope / Out of scope

*(Define what this spec covers and what it does not. Reduces scope creep and cross-spec confusion.)*

- **In scope:** *(What this spec covers — screen(s), routes, user flows, APIs called from this screen, components.)*
  - 
  - 
- **Out of scope:** *(What this spec does not cover — other pages/flows, future features, backend-only. Document in a separate spec when needed.)*
  - 
  - 

---

## 3. Design inputs

- **Figma link:**
- **Screenshot attached:** (description or path)
- **Reference documentation:**
- **Design notes:** (layout, breakpoints, states)

### 3.1 Design element analysis

*(Describe every major UI block so implementation is unambiguous. Use the sub-sections that apply: Layout blocks (structure of the page), Table (columns), Form (fields + input types), Other elements (buttons, cards, etc.). Link to section 6.4 for component names. Remove this note when generating the spec.)*

#### 3.1.1 Layout blocks

*(Describe the structure of the screen: what blocks exist, what’s inside each, layout type, spacing. Omit if the screen has no distinct blocks.)*

| Block name | Structure (what’s inside) | Layout | Spacing | Responsive | Component(s) (→ 6.4) |
|------------|---------------------------|--------|---------|------------|----------------------|
| *(e.g. Page header)* | Title, description, primary button (Create) | Flex row, space-between, align center | padding 16px 24px, gap 16px | Stacks to column &lt; 768px | PageLayout (title, description, actions) |
| *(e.g. Filter bar)* | Search input, Species select, Status select, Reset button | Flex wrap, gap 12px | padding 16px, gap 12px | Wrap below 768px | FilterBar, SearchInput, Select |
| *(e.g. Main content)* | Table only, or table + pagination | Full width, block | mb-6 for table | Horizontal scroll table on small | DataTable, Pagination |
|  |  |  |  |  |  |

#### 3.1.2 Table (columns)

*(Fill when the screen has a data table. Define every column: key, header, cell type, sortable, width/align. Omit if no table.)*

| Column key | Header label | Cell type | Sortable? | Width / align | Component(s) (→ 6.4) |
|------------|--------------|-----------|-----------|---------------|----------------------|
| *(e.g. select)* | Checkbox (select all) | Checkbox | No | fixed, center | Checkbox |
| *(e.g. name)* | Name | avatar + primary text + secondary text | Yes | auto, left | Avatar, text |
| *(e.g. email)* | Email | text | Yes | 200px, left | — |
| *(e.g. status)* | Status | badge (map value → variant) | Yes | 100px, left | Badge |
| *(e.g. actions)* | — | icon buttons (Edit, Delete) | No | fixed, right | Button (icon) |
|  |  |  |  |  |  |

**Cell type** — use one of: `text` | `avatar + text` | `badge` | `link` | `actions` (buttons) | `custom` (describe in note). For badge/link/custom, describe mapping or behavior in a short note below the table if needed.

#### 3.1.3 Form (fields)

*(Fill when the screen has a form. Define every field: key, label, input type, required, options/placeholder, validation. Omit if no form.)*

| Field key | Label | Input type | Required? | Options / placeholder | Validation | Component(s) (→ 6.4) |
|-----------|-------|------------|-----------|------------------------|------------|----------------------|
| *(e.g. name)* | Name | text | Yes | placeholder "Enter name" | min 2, max 100 chars | Input |
| *(e.g. email)* | Email | email | Yes | placeholder "you@example.com" | valid email | Input |
| *(e.g. role)* | Role | select | Yes | options from API or [Admin, User] | one of options | Select |
| *(e.g. birthDate)* | Birth date | date | No | — | date in past | DatePicker |
| *(e.g. active)* | Active | checkbox | No | — | — | Checkbox |
|  |  |  |  |  |  |  |

**Input type** — use one of: `text` | `number` | `email` | `password` | `tel` | `textarea` | `select` | `multiselect` | `date` | `datetime` | `checkbox` | `radio` | `file` | `money` (if applicable). For select/multiselect, specify options source (static list or API).

#### 3.1.4 Other elements

*(Buttons, cards, modals, badges, alerts, etc. that are not part of a table column or form field. Layout, spacing, typography, colors, states, responsive.)*

| Element | Layout | Spacing | Typography | Colors | States | Responsive | Component(s) (→ 6.4) |
|---------|--------|---------|------------|--------|--------|------------|----------------------|
| *(e.g. Primary button)* | inline-flex, center, gap 8px | px-4 py-2 | 14px medium | primary bg, white text; hover darker | hover, focus ring, disabled opacity, loading | Full width on mobile if needed | Button |
| *(e.g. Delete icon button)* | icon only 32×32 | — | Icon 16px | ghost, destructive on hover | hover, focus ring | — | Button (icon) |
| *(e.g. Empty state)* | flex column, center | padding 24px | title 16px, body 14px muted | — | — | — | EmptyState |
|  |  |  |  |  |  |  |  |

---

## 4. Questions for requester

*(Note here the questions raised in the "ask requester" step and the answers once received. Add QA2, QA3, … as needed.)*

**QA1**
- **question:**
- **answers:**
  +
  +

**QA2**
- **question:**
- **answers:**
  +
  +

---

## 5. Functional requirements

*(Remove this note when generating the spec.)*

### 5.1 User stories / Use cases

- Who does what and why. Example: "As a [role], I want [action/feature] so that [outcome]." Or list concrete use cases (e.g. "User can filter list by status and date range").
- 

### 5.2 Main business flows

(Step-by-step user journeys for key scenarios.)

- Step 1:
- Step 2:
- Step 3:
- *(add more steps as needed)*

### 5.3 Validation / edge conditions

**Field-level validation** — list each field that has rules. *(Remove this note when generating the spec.)*

| Field | Required | Type / format | Min / max | Allowed values | Error message (invalid) |
|-------|----------|---------------|-----------|----------------|-------------------------|
| *(e.g. email)* | Yes / No | email, text, number, date, phone | *(e.g. 2–100 chars)* | *(e.g. active, inactive)* | *(e.g. "Invalid email format")* |
|  |  |  |  |  |  |
|  |  |  |  |  |  |

**Error handling (non-field)** — what to show and what action the user can take:

| Scenario | Message / behavior | User action |
|----------|-------------------|-------------|
| Invalid input (client-side) | Show message near field or toast | Fix field, resubmit |
| Duplicate (e.g. duplicate key from API) | Message from API or fixed copy | Change value or go back |
| Permission denied (403) | "You don't have permission…" | Go back / contact admin |
| Network / server error (5xx) | "Something went wrong. Please try again." | Retry button or go back |
| Not found (404) | "Item not found" | Go back to list |

### 5.4 Screen states

- **Loading:** skeleton / spinner / disabled state (where, when).
- **Empty:** no data yet or no results (message, CTA if any).
- **Error:** API or validation failure (message, retry/back action).
- **Success:** confirmation message or redirect after submit.

---

## 6. UI analysis → Components

*(Apply frontend-design-patterns skill: screen type, filter/table/form, data flow.)*

### 6.1 Type of addition

- **Route** — new page/screen. Choose pattern: List/Table | Form | Wizard | Tabbed Form | Detail | Dashboard.  
  *(Route path can be TBD when the spec is design-only; fill in "Overview → Route" when it is known.)*
- **Section** — new block within an existing page (e.g. sidebar panel, filter bar, tab content). Describe what it is (e.g. "Filter bar", "Detail drawer", "Tab: Settings").
- 

### 6.2 Main sections

- List the major UI blocks (e.g. header, filters, table, pagination; or form steps, sidebar).
- 
- 

### 6.3 Data needed per section

**Naming rule:** Use **domain-specific names** for each data (e.g. `PetList`, `PetFilters`, `Order`, `User`) — not generic names like `listItems`, `filterPayload`, or `data`. *(Remove this note when generating the spec.)*

| Data name | Source (API / props / local) | Used in (section or component) |
|-----------|-----------------------------|---------------------------------|
| *(e.g. PetList or OrderList)* | API | Table body |
| *(e.g. PetFilters or OrderFilters)* | local (URL sync) | Filter bar |
|  |  |  |
|  |  |  |

---

#### 6.3.1 *(data name — use domain name, e.g. PetList)*

- **Where used:** *(e.g. Table body; passed as `data` to DataTable.)*
- **Structure:**

| Property | Type | Note |
|----------|------|------|
| *(e.g. id)* | `string` |  |
| *(e.g. name)* | `string` |  |
| *(e.g. status)* | `'active' \| 'inactive'` |  |
|  |  |  |

---

#### 6.3.2 *(data name — use domain name, e.g. PetFilters)*

- **Where used:** *(e.g. Filter bar; local state, synced to URL.)*
- **Structure:**

| Property | Type | Note |
|----------|------|------|
| *(e.g. search)* | `string` |  |
| *(e.g. status)* | `string \| undefined` |  |
|  |  |  |

---

#### 6.3.3 *(data name — use domain name; add more as needed)*

- **Where used:**
- **Structure:**

| Property | Type | Note |
|----------|------|------|
|  |  |  |

---

### 6.4 Component breakdown (atoms/molecules/organisms)

*(Remove this note when generating the spec. Type = atom | molecule | organism. Design ref = which element(s) in section 3.1 this component implements — so visual spec is in 3.1. Location = folder path + file name.)*

| Component | Type | Design ref (→ 3.1) | Note (new/derived, where used, shadcn vs custom) | Expected props | Expected prop types | Location (folder, file name) |
|-----------|------|-------------------|--------------------------------------------------|----------------|---------------------|------------------------------|
| *(e.g. SearchInput)* | molecule | Filter bar | New. Used in filter bar. Use shadcn Input + Search icon. | `value`, `onChange`, `placeholder` | `string`, `(v: string) => void`, `string` | `src/components/molecules/`, `search-input.tsx` |
| *(e.g. StatusBadge)* | atom | Table row / cell | New. Used in table cell. Custom (map status → color). | `status` | `'active' \| 'inactive'` | `src/components/atoms/`, `status-badge.tsx` |
|  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |

---

### 6.5 User actions

*(Remove this note when generating the spec. List each user action: what they click (row, button, tab, link), submit (form), filter/sort/paginate, expand/collapse, and what happens (navigation, API call, state update).)*

- List actions: click (row, button, tab), submit (form), filter, sort, paginate, expand/collapse.
- 

---

## 7. Data flow & API

*(Remove this note when generating the spec. State = where data lives; API = endpoints and request/response shape; URL sync = what is reflected in the URL.)*

### 7.1 State management

- Choose per concern: **local** (useState), **URL** (search params), **React Query** (server cache), **Context** (shared tree).
- *(e.g. Filters → URL; list data → React Query; modal open → local.)*

### 7.2 API endpoints

**Rule — only APIs used by this screen:** List only endpoints that **this screen** actually calls. Do **not** list Create/Update (POST/PUT/PATCH) or other APIs that are used on different pages (e.g. create form, edit form) — document those in the spec for that page. *(Remove this note when generating the spec.)*

| API (name or purpose) | Method | URL | Used for |
|-----------------------|--------|-----|----------|
| *(e.g. fetch list)* | GET | `/api/items` | Table data |
| *(e.g. delete item — only if this screen has delete)* | DELETE | `/api/items/:id` | Row delete |
| *(add only APIs this screen calls)* |  |  |  |

**Add one subsection (7.2.1, 7.2.2, …) per API row above.** Omit subsections for APIs used on other screens.

---

#### 7.2.1 *(API name, e.g. fetch list)*

- **URL:** `GET /api/items` *(or with path param e.g. GET /api/items/:id)*
- **Param:** *(path params, if any)*

| Name | Type | Note |
|------|------|------|
| *(e.g. id)* | `string` |  |
|  |  |  |

- **Query:** *(query params)*

| Name | Type | Note |
|------|------|------|
| *(e.g. search)* | `string` | optional |
| *(e.g. page)* | `number` |  |
| *(e.g. pageSize)* | `number` |  |
|  |  |  |

- **Response:** *(name only — structure is in section 6.3)*  
  - *(e.g. listItems + total, or "ListResponse")*

---

#### 7.2.2 *(API name — only if this screen uses it; e.g. delete item)*

- **URL:** `DELETE /api/items/:id` *(or GET/POST/PATCH as needed)*
- **Param:** *(path params, if any)*

| Name | Type | Note |
|------|------|------|
| *(e.g. id)* | `string` |  |
|  |  |  |

- **Query:** *(query params, if any)*

| Name | Type | Note |
|------|------|------|
|  |  |  |

- **Body:** *(only for POST/PUT/PATCH)*

| Name | Type | Note |
|------|------|------|
|  |  |  |

- **Response:** *(name only — see section 6.3)*  
  - *(e.g. 204 No Content or response body)*

---

#### 7.2.3 *(API name — add only if this screen has more APIs)*

- **URL:**
- **Param:**

| Name | Type | Note |
|------|------|------|
|  |  |  |

- **Query:**

| Name | Type | Note |
|------|------|------|
|  |  |  |

- **Body:** *(if POST/PUT/PATCH)*

| Name | Type | Note |
|------|------|------|
|  |  |  |

- **Response:** *(name only — see section 6.3)*
  -

---

### 7.3 URL sync

*(URL as source of truth: read query (search params) from the URL as the default state; when state changes, update the URL so the page is shareable and back/forward works.)*

- **Sync to URL:** yes / no.
- If yes: list what is synced (each key comes from URL as default, and writes back to URL on change):
  - *(e.g. filters: `search`, `status`; pagination: `page`, `pageSize`; tab: `tab`.)*
- 

---

## 8. UI/UX guidelines (from ui-ux-pro-max)

*(Color, typography, accessibility, interaction, responsive.)*

- **Style / pattern:**
- **Accessibility:**
- **Responsive:**
- **Loading / error UI:**

---

## 9. Open questions / constraints

- **Technical constraints:** (browser, performance, i18n)
- **Other open points:** (if any)

---

## 10. Acceptance criteria

- [ ]
- [ ]
- [ ]

---

## 11. Attachments

- Figma link:
- Documentation link:
- Screenshot / attached files:
