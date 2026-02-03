# Command: Generate Frontend Spec from design / requirements

## Purpose

Generate a frontend spec document following the standard template, based on **at least one** of: UI screenshot, Figma link, requirement description, or documentation link. If no valid input is provided, **reject** and do not proceed.

**Output language:** The generated spec file must **always be in English**. If the requester writes in Vietnamese (or any other language), translate the requirements and all spec content into English in the output.

---

## Step 1: Validate input

**Requirement:** The requester must provide **at least one** of the following:

| Input type | Description |
|------------|-------------|
| **Screenshot** | Screenshot of the UI to be developed (attached or path) |
| **Figma link** | URL to Figma file / frame |
| **Requirement description** | Text description of the feature / screen / UI |
| **Documentation link** | URL to spec, PRD, or reference documentation |

**Action:**

- If **none** of the above are provided:
  - Reply: **"Insufficient input to generate spec. Please provide at least one of: UI screenshot, Figma link, requirement description, or documentation link."**
  - **Stop** — do not execute further steps.
- If **at least one** input is provided → proceed to **Step 2**.

---

## Step 2: What to do — Read and gather information

Execute **for each input type** the requester provided:

### 2.1. If **Figma link** is provided

- Read / analyze the Figma link (via Figma MCP if available, or from requester description).
- **If read fails:**
  - Notify requester: **"Unable to read Figma link (access / permission / format error). Please check the link or provide a screenshot / description instead."**
  - **Stop** — do not proceed.

### 2.2. If **screenshot** is provided

- Read and analyze the screenshot (attached image or file path) to understand layout, UI elements, and states.

### 2.3. If **documentation link** is provided

- Read the documentation (fetch URL or follow requester instructions) to understand functional and UI requirements.

### 2.4. If **description** is provided

- Analyze the description to understand feature, screen, and business flow requirements.

### 2.5. When only **documentation + description** (no Figma / screenshot)

- After reading: If concrete implementation (component, pattern) is needed, **research** (in skill or codebase) and suggest how to implement.

---

## Step 3: Load skills and analyze

- **Frontend Design Patterns:** Read and internalize **`.agents/skills/frontend-design-patterns/SKILL.md`** — understand how to **read and analyze design** into code components (screen type, filter/table/form, data flow, component breakdown).
- **UI/UX Pro Max:** Read and apply **`.agents/skills/ui-ux-pro-max/SKILL.md`** (under `.agents`) — use for style, layout, typography, color, accessibility, interaction, responsive, loading/error UI.
- Combine both skills with results from Step 2 for a complete UI/UX and code structure picture.

---

## Step 4: Questions for requester (if any)

- If during read/analysis there is **missing information** or **ambiguity** to clarify:
  - List questions clearly and **ask the requester** at this step.
  - **Note** the questions (and later the answers) into **section 3 (Questions for requester)** of the spec template.
  - **Do not proceed** (do not write the spec) until answers are sufficient to complete the spec.

---

## Step 5: Read template and output spec

- Execute only when all information is available (and Step 4 questions have been answered, if any).
- Read template: **`.agents/docs/templates/spec-fe-template.md`**
- **Output language:** Write the spec **in English only**. If the requester used Vietnamese or another language, translate requirements and all content into English.
- **Output location:**
  - Base path: **`docs/specs/`**
  - **Folder name:** `<number>-<unique-name>` where:
    - **Number:** Zero-padded 3 digits, incrementing from the count of existing folders in `docs/specs/` (e.g. if there are 001, 002 → use 003).
    - **Unique name:** Short, kebab-case, derived from the feature/screen (e.g. `user-list`, `dashboard`, `order-form`). Must be unique among existing folders.
  - **File:** Create the folder if it does not exist, then write the spec to **`fe.md`** inside it.
  - **Example:** `docs/specs/001-first-design/fe.md`, `docs/specs/002-user-list/fe.md`, `docs/specs/003-order-form/fe.md`.
- **Output:** Produce a complete frontend spec following the template structure (sections 1–10), filled with:
  - Design inputs (Figma / screenshot / documentation / description)
  - Analysis from frontend-design-patterns (screen type, component breakdown, data flow)
  - Analysis from ui-ux-pro-max (style, a11y, responsive, interaction)
  - Section 3: Questions for requester (questions asked + answers when received)
  - Functional requirements and acceptance criteria

---

## Flow summary

```
Input present? (screenshot / Figma / description / documentation)
  → No: Reject, notify missing input, stop.
  → Yes: Step 2 — Read inputs (Figma / screenshot / doc / description; Figma fail → notify and stop)
       → Step 3 — Load frontend-design-patterns + ui-ux-pro-max and analyze
       → If questions remain: ask requester, wait for answers
       → Determine output folder: docs/specs/<NNN>-<unique-name>/ (NNN = next number, name = unique kebab-case)
       → Create folder if needed, write spec to fe.md
       → Read spec-fe-template.md and output spec per template → docs/specs/<folder>/fe.md
```
