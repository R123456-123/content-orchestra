# 🎵 Content Orchestra

> *When your content needs more than one brain — let three AI agents handle it.*

Content Orchestra is a **multi-agent AI content platform** that takes rough internal data — memos, notes, product briefs — and transforms it into polished, brand-safe marketing content. No prompt engineering required. Just paste and go.

What makes it different from a typical ChatGPT wrapper? **Three specialized AI agents collaborate in a feedback loop.** One researches, one writes, one reviews — and they iterate until the content passes strict compliance standards. Think of it as a tiny content team that never sleeps.

---

## ✨ What It Does

- **Paste raw data** — internal memos, product specs, rough notes — anything messy.
- **Three AI agents take over** — they research, write, and review your content automatically.
- **Get publish-ready copy** — brand-safe, professionally written, compliant with your guidelines.
- **Iterative refinement** — if the Governance Agent finds issues, the Creator rewrites. Up to 3 revision cycles.
- **Real-time pipeline visualization** — watch each agent activate, process, and complete.

---

## 🧠 The Pipeline

```
    📥 Raw Data (memos, notes, docs)
         │
         ▼
   ┌──────────────┐
   │  🔍 Knowledge │  Reads your raw data and extracts a
   │     Agent     │  structured brief: message, audience, features.
   └──────┬───────┘
          │
          ▼
   ┌──────────────┐
   │  ✍️  Creator   │  Writes professional marketing copy
   │     Agent     │◄─── from the brief. Controlled creativity.
   └──────┬───────┘     │
          │             │  🔄 Feedback loop
          ▼             │  (up to 3 cycles)
   ┌──────────────┐     │
   │  🛡️ Governance│  Reviews for brand safety, tone,
   │     Agent     │  and compliance. Flags specific issues.
   └──────┬───────┘
          │
    ┌─────┴─────┐
    │           │
  ✅ APPROVED  🔄 REVISION → Creator rewrites with feedback
    │
    ▼
  📤 Final Output — brand-safe, publish-ready
```

The Governance Agent doesn't just say "try again" — it gives the Creator **specific, actionable feedback** (e.g., *"Remove the phrase 'industry-leading' — unverified superlative"*). This is what makes the loop genuinely useful, not just a retry mechanism.

---

## 🚀 Getting Started

### What You'll Need

- **Node.js** v18 or later — [download here](https://nodejs.org/)
- **Google AI API key** — [get one free](https://aistudio.google.com/apikey) (Gemini API)

### Setup

```bash
# Clone and install
git clone https://github.com/your-username/content-orchestra.git
cd content-orchestra

# Backend dependencies
npm install

# Frontend dependencies
cd client && npm install && cd ..

# Add your API key
echo GOOGLE_GENERATIVE_AI_API_KEY=your_key_here > .env
```

### Run Locally

Open **two terminals**:

```bash
# Terminal 1 — Backend (Fastify on port 3000)
npm run dev

# Terminal 2 — Frontend (Vite on port 5173)
cd client
npm run dev
```

Open **http://localhost:5173** and you're ready to go.

---

## 🎨 Features

### Core Pipeline
- **Multi-agent AI orchestration** — Knowledge → Creator → Governance with iterative feedback
- **Structured AI outputs** — all agent responses enforced via Zod schemas (not freeform text)
- **Compliance evaluation** — automated brand safety checks with confidence scoring
- **Up to 3 revision cycles** — Creator and Governance iterate until content passes

### Frontend Experience
- **Live pipeline visualizer** — watch each agent activate and complete in real-time
- **Prompt suggestions** — 4 pre-built scenarios (Product Launch, EdTech, Health, E-Commerce)
- **Copy-to-clipboard** — one click to copy your generated content
- **Toast notifications** — proper success, error, and info feedback (no ugly alerts)
- **Animated stats counter** — key metrics animate into view
- **"How It Works" flow** — visual 3-step explainer for new users
- **Developer hover cards** — hover over team avatars in the navbar for details
- **Coming soon roadmap** — Phase 2 & Phase 3 feature previews with animated cards
- **Tech stack showcase** — animated pills in the footer
- **Dark glassmorphism UI** — Solana-inspired color scheme with blur effects and micro-animations
- **Fully responsive** — works on desktop, tablet, and mobile

---

## 🛡️ Governance Rules

The Governance Agent enforces these rules automatically:

| Rule | What Gets Flagged |
|------|--------------------|
| 🚫 Aggressive sales language | "Buy now!", "Hurry!", "Limited offer", "Act fast" |
| 🚫 Unverified superlatives | "best", "fastest", "revolutionary", "unprecedented" |
| 🚫 Unprofessional tone | Slang, hyperbole, extreme exaggeration |
| ✅ Quantifiable claims | "sub-10ms queries", "99.9% uptime" — these are allowed |

---

## 🧪 API Reference

You can use the backend directly without the frontend:

```bash
# Health check
curl http://localhost:3000/

# Run the pipeline
curl -X POST http://localhost:3000/api/orchestrate \
  -H "Content-Type: application/json" \
  -d '{"rawData": "Project Phoenix launching Q3. Cloud DB with sub-10ms queries. Target enterprise CTOs."}'
```

<details>
<summary>PowerShell equivalent</summary>

```powershell
Invoke-RestMethod -Uri http://localhost:3000/api/orchestrate `
  -Method Post -ContentType "application/json" `
  -Body '{"rawData": "Project Phoenix launching Q3. Cloud DB with sub-10ms queries."}'
```

</details>

---

## 📁 Project Structure

```
Content Orchestra/
│
├── .env                          # API key (not committed)
├── package.json                  # Backend dependencies & scripts
├── tsconfig.json                 # TypeScript strict mode, ES2022
├── render.yaml                   # Render.com deployment config (IaC)
│
├── src/                          # ── Backend (Fastify + TypeScript) ──
│   ├── server.ts                 # API server & orchestration loop
│   ├── agents/
│   │   ├── knowledge.ts          # Raw data → structured content brief
│   │   ├── creator.ts            # Brief → professional marketing copy
│   │   └── evaluator.ts          # Draft → compliance review & scoring
│   └── schemas/
│       └── compliance.ts         # Zod schema for governance output
│
└── client/                       # ── Frontend (React 19 + Vite 8) ──
    ├── package.json
    ├── index.html
    ├── vite.config.ts
    └── src/
        ├── main.tsx              # App entry point
        ├── App.tsx               # Full application with pipeline UI
        └── index.css             # Dark glassmorphism design system
```

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Runtime** | Node.js + TypeScript | Type safety, industry standard |
| **Backend** | Fastify | ~2x faster than Express, built-in validation |
| **Frontend** | React 19 + Vite 8 | Latest React, fastest dev server |
| **AI Model** | Google Gemini 3.1 Flash Lite | Free tier, fast, great structured output |
| **AI SDK** | Vercel AI SDK (`ai` package) | Clean `generateObject` / `generateText` API |
| **Validation** | Zod v4 | Runtime type safety for AI outputs |
| **Deployment** | Render.com (backend) + Vercel (frontend) | Free tier, easy setup |

---

## 🗺️ Roadmap

### Phase 1 — Foundation ✅ *Complete*
Three-agent pipeline, dark glassmorphism UI, deployed on Render.

### Phase 2 — Content Studio 🔨 *In Progress*
8+ specialized agents, multi-platform content generation, SSE streaming, AI image generation, content ideas, and a full dashboard UI.

### Phase 3 — SaaS Platform 📋 *Planned*
Authentication (Clerk), database (Supabase), content calendar, platform integrations, analytics dashboard, and CI/CD.

See [`PROJECT_TRACKER.md`](./PROJECT_TRACKER.md) for the full breakdown with checklists.

---

## 👥 Team

| | Name | Role |
|---|------|------|
| **YC** | Yash Choudhary | Frontend Developer |
| **RRT** | Rishiraj Tanwar | AI / Backend Engineer |

**B.Tech Final Year Major Project — 2026**

---

## 📄 License

ISC
