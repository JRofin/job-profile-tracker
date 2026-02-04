# Job Profile Tracker

Unified system to manage Job Profile requests in Workday, with AI-assisted management level assessment based on Welo Global's Career Framework.

---

## Documentation — Reading Order

**To understand what to build and in what order to read the docs**, start here:

- **[docs/00-READING-ORDER.md](docs/00-READING-ORDER.md)** — Summary of deliverables, recommended reading order for all docs, code reading order, folder map, and build sequence.

Then follow the numbered docs in `docs/`:

| Step | Document | Purpose |
|------|----------|---------|
| 1 | [00-READING-ORDER.md](docs/00-READING-ORDER.md) | What to build + reading order |
| 2 | [01-SHAREPOINT_LISTS_SETUP.md](docs/01-SHAREPOINT_LISTS_SETUP.md) | Create lists first |
| 3 | [02-POWER_AUTOMATE_FLOWS.md](docs/02-POWER_AUTOMATE_FLOWS.md) | Flows (after lists exist) |
| 4 | [03-COPILOT_AGENT.md](docs/03-COPILOT_AGENT.md) | Optional Copilot in Teams |

---

## Features

- **New request form** with minimal steps
- **Inline AI assessment** — "Suggest level with AI" button analyzes title + description and suggests the appropriate management level
- **Interactive dashboard** — list/cards of requests with status filters, search, and quick actions
- **Career Framework integration** — reuses logic from [CF/](../CF/) for leveling

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React 18, Tailwind CSS, shadcn/ui components
- **Leveling API:** Next.js API Route calling OpenAI with Career Framework logic
- **Data:** SharePoint Lists (requires setup) or local demo

## Quick Start

### 1. Activate Node (if using nvm)

In a **new terminal**, `npm` is not in PATH until you load nvm. Options:

**Option A – Startup script (recommended):**
```bash
cd Job-Profile-Tracker
./start.sh
```
(First time: run `npm install` inside the project; then `./start.sh` starts the server.)

**Option B – Load nvm manually each time:**
```bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"
nvm use 18
cd Job-Profile-Tracker
npm install
npm run dev
```

### 2. Install dependencies

```bash
cd Job-Profile-Tracker
# Load nvm first (see above), then:
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
OPENAI_API_KEY=sk-your-api-key-here
```

### 4. Run in development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Note:** If you see "Failed to load SWC binary" (common for projects inside OneDrive), the project includes `babel.config.js` to use Babel instead of SWC. Clear the cache and start again: `rm -rf .next && npm run dev`.

## Project Structure

```
Job-Profile-Tracker/
├── app/
│   ├── page.tsx              # Main dashboard
│   ├── new/page.tsx          # New request form
│   ├── layout.tsx            # Layout with header
│   ├── globals.css           # Global styles
│   └── api/
│       └── leveling/route.ts # Leveling API (OpenAI)
├── components/
│   ├── Dashboard.tsx         # Dashboard component
│   ├── NewRequestForm.tsx    # Form with inline AI
│   ├── RequestCard.tsx       # Request card
│   ├── LevelingResult.tsx    # AI result
│   └── ui/                   # Base components (button, card, etc.)
├── lib/
│   ├── types.ts              # TypeScript types
│   ├── cf-leveling.ts        # Leveling logic (adapted from CF/)
│   └── utils.ts              # Utilities
└── docs/
    ├── 00-READING-ORDER.md      # Start here: what to build + reading order
    ├── 01-SHAREPOINT_LISTS_SETUP.md
    ├── 02-POWER_AUTOMATE_FLOWS.md
    └── 03-COPILOT_AGENT.md
```

## User Flow

### New Request (2–3 steps)

1. Fill in job title and description
2. (Optional) Click **"Suggest level with AI"** — shows suggested level + rationale inline
3. Accept or change level, or leave "I don't know / Let the team decide"
4. Click **"Submit Request"**

### Dashboard

- View all requests with status filters
- Search by title, description, or department
- Click a card to view details

## SharePoint Integration

See [docs/01-SHAREPOINT_LISTS_SETUP.md](docs/01-SHAREPOINT_LISTS_SETUP.md) for list configuration:

- **JobProfileRequests** — Main requests list
- **JobProfileGrades** — Grades per country per request

## Power Automate Flows

See [docs/02-POWER_AUTOMATE_FLOWS.md](docs/02-POWER_AUTOMATE_FLOWS.md) to configure:

- Flow 1: New request → Post to Teams
- Flow 2: Reminders (pending grades, mgmt level)
- Flow 3: Auto-assignment
- Flow 4: Escalation

## Copilot Agent (Optional)

See [docs/03-COPILOT_AGENT.md](docs/03-COPILOT_AGENT.md) to create a conversational agent in Teams for creating requests and getting level suggestions via chat.

## Development

### UI Components

UI components are based on [shadcn/ui](https://ui.shadcn.com/) and can be customized or extended:

```bash
npx shadcn-ui@latest add [component-name]
```

### Leveling API

The API at `/api/leveling` uses the Career Framework logic to analyze job profiles. You can adjust the prompt in `lib/cf-leveling.ts`.

## Next Steps

1. Connect to live SharePoint (Microsoft Graph)
2. Add Microsoft Entra ID authentication
3. Implement request detail page
4. Deploy to Vercel / Azure

## License

Internal use at Welo Global.
