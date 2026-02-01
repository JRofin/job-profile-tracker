# Job Profile Tracker — Reading Order

Use this order to understand **what to build** and **in what sequence** to read the docs and code.

---

## What We Are Building (Summary)

| # | Deliverable | Purpose |
|---|-------------|--------|
| 1 | **Web app** (Next.js) | Dashboard + New Request form; users submit Job Profile requests and get AI level suggestions. |
| 2 | **SharePoint lists** | Store requests (JobProfileRequests) and grades per country (JobProfileGrades). |
| 3 | **Power Automate flows** | Notify Teams on new request, send reminders, auto-assign, escalate overdue. |
| 4 | **Copilot in Teams** (optional) | Create requests and get level suggestions via chat. |

**Dependencies:**  
- App can run with **demo data** without SharePoint.  
- Power Automate flows require **SharePoint lists** to exist.  
- Copilot requires **leveling API** (and optionally Power Automate) to be available.

---

## Recommended Reading Order

### Step 1 — Overview and run the app

| Order | Document / Location | What you get |
|-------|--------------------|--------------|
| 1.1 | **[README.md](../README.md)** (project root) | Product summary, features, tech stack, **Quick Start** to run the app locally. |
| 1.2 | **Project structure** (see README “Project Structure”) | Where pages, components, API, and docs live. |

**Outcome:** You can run the app and see the dashboard + new request form with demo data.

---

### Step 2 — Data layer (what to create first)

| Order | Document | What you get |
|-------|----------|--------------|
| 2.1 | **[01-SHAREPOINT_LISTS_SETUP.md](01-SHAREPOINT_LISTS_SETUP.md)** | How to create **JobProfileRequests** and **JobProfileGrades**, columns, permissions, views, and how the app connects (Power Automate HTTP or Microsoft Graph). |

**Outcome:** You know exactly which SharePoint lists and columns to create before automation or app integration.

---

### Step 3 — Automation (after lists exist)

| Order | Document | What you get |
|-------|----------|--------------|
| 3.1 | **[02-POWER_AUTOMATE_FLOWS.md](02-POWER_AUTOMATE_FLOWS.md)** | Five flows: New Request → Teams, Reminders, Auto-Assignment, Escalation, and HTTP trigger for the app. |

**Outcome:** You can implement and test each flow in order; all assume the lists from Step 2 exist.

---

### Step 4 — Optional: Copilot in Teams

| Order | Document | What you get |
|-------|----------|--------------|
| 4.1 | **[03-COPILOT_AGENT.md](03-COPILOT_AGENT.md)** | How to build the “Job Profile Assistant” in Copilot Studio: topics, trigger phrases, Leveling API and Power Automate actions, publish to Teams. |

**Outcome:** Optional chat path for creating requests and getting level suggestions.

---

## Code Reading Order (to understand the build)

Read in this order to follow data → API → UI:

| Order | File | Purpose |
|-------|------|--------|
| C.1 | **lib/types.ts** | Data model: request, status, leveling types, constants (departments, levels, countries). |
| C.2 | **lib/cf-leveling.ts** | Career Framework leveling logic and OpenAI prompt (used by the API). |
| C.3 | **app/api/leveling/route.ts** | Leveling API: receives title/description, returns suggested level and rationale. |
| C.4 | **components/NewRequestForm.tsx** | New request form: fields, “Suggest level with AI” button, submit. |
| C.5 | **components/LevelingResult.tsx** | Displays AI suggestion and “Accept this level”. |
| C.6 | **components/RequestCard.tsx** | Single request card on the dashboard. |
| C.7 | **components/Dashboard.tsx** | Dashboard: list of requests, filters, search. |
| C.8 | **app/page.tsx** | Home page (renders Dashboard). |
| C.9 | **app/new/page.tsx** | New request page (renders NewRequestForm). |
| C.10 | **app/layout.tsx** | Global layout and navigation. |

---

## Folder and Document Map

```
Job-Profile-Tracker/
├── README.md                    ← Start here: overview + Quick Start
├── docs/
│   ├── 00-READING-ORDER.md      ← This file (reading order + what to build)
│   ├── 01-SHAREPOINT_LISTS_SETUP.md   ← Step 2: create lists first
│   ├── 02-POWER_AUTOMATE_FLOWS.md     ← Step 3: flows after lists
│   └── 03-COPILOT_AGENT.md            ← Step 4: optional Copilot
├── app/
│   ├── layout.tsx
│   ├── page.tsx                  (dashboard)
│   ├── new/page.tsx              (new request)
│   └── api/leveling/route.ts     (AI leveling API)
├── components/
│   ├── Dashboard.tsx
│   ├── NewRequestForm.tsx
│   ├── RequestCard.tsx
│   ├── LevelingResult.tsx
│   └── ui/                       (buttons, cards, inputs, etc.)
└── lib/
    ├── types.ts                  (data model + constants)
    ├── cf-leveling.ts            (leveling logic + prompt)
    └── utils.ts
```

---

## Build Sequence (implementation order)

1. **Run the app** (README Quick Start) with demo data.  
2. **Create SharePoint lists** (01-SHAREPOINT_LISTS_SETUP.md).  
3. **Configure Power Automate flows** (02-POWER_AUTOMATE_FLOWS.md).  
4. **Connect app to SharePoint** (Graph or HTTP flow; both described in 01 and 02).  
5. **Optionally** add Copilot (03-COPILOT_AGENT.md).

This order keeps dependencies clear: lists → flows → app connection → optional Copilot.
