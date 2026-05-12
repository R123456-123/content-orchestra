# 🎵 Content Orchestra

**Turn messy internal memos into polished, brand-safe marketing content — automatically.**

Content Orchestra is a multi-agent AI pipeline where three specialized AI agents collaborate to research, write, and review content until it meets enterprise compliance standards. You feed it raw company data, and it hands back publish-ready copy.

---

## 🧠 How It Works

Three AI agents work together in a feedback loop:

```
                    ┌──────────────────────────┐
                    │   📥  Raw Internal Data   │
                    │   (memos, docs, notes)    │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │   🔍 Knowledge Agent      │
                    │                           │
                    │   Reads your raw data     │
                    │   and extracts a clean,   │
                    │   structured brief.       │
                    └────────────┬─────────────┘
                                 │
                                 ▼
               ┌────────────────────────────────────┐
               │   ✍️  Creator Agent                 │
               │                                     │
               │   Writes professional marketing     │◄──────────┐
               │   copy from the brief.              │           │
               └──────────────────┬──────────────────┘           │
                                  │                              │
                                  ▼                              │
               ┌────────────────────────────────────┐            │
               │   🛡️  Governance Agent              │            │
               │                                     │            │
               │   Reviews the draft for brand       │            │
               │   safety, compliance, and tone.     │            │
               └──────────────────┬──────────────────┘            │
                                  │                              │
                         ┌────────┴────────┐                     │
                         │                 │                     │
                    ✅ APPROVED       🔄 NEEDS_REVISION ─────────┘
                         │              (sends feedback
                         ▼               to Creator)
               ┌──────────────────┐
               │  📤 Final Output  │
               │  Brand-safe,     │
               │  publish-ready   │
               └──────────────────┘
```

The Governance Agent and Creator loop up to **3 times** until the content passes all safety checks. If it can't get compliant, it reports exactly what failed.

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- A [Google AI API key](https://aistudio.google.com/apikey)

### Setup

```bash
# 1. Install dependencies
npm install
cd client && npm install && cd ..

# 2. Add your API key
echo GOOGLE_GENERATIVE_AI_API_KEY=your_key_here > .env
```

### Run

You need **two terminals**:

```bash
# Terminal 1 — Backend (port 3000)
npm run dev

# Terminal 2 — Frontend (port 5173)
cd client
npm run dev
```

Then open **http://localhost:5173** in your browser.

---

## 🧪 API Usage

You can also hit the backend directly:

```bash
# Health check
curl http://localhost:3000/

# Run the pipeline
curl -X POST http://localhost:3000/api/orchestrate \
  -H "Content-Type: application/json" \
  -d '{"rawData": "Project Phoenix launching Q3. Cloud DB with sub-10ms queries. Target enterprise CTOs."}'
```

**PowerShell:**
```powershell
Invoke-RestMethod -Uri http://localhost:3000/api/orchestrate `
  -Method Post -ContentType "application/json" `
  -Body '{"rawData": "Project Phoenix launching Q3. Cloud DB with sub-10ms queries. Target enterprise CTOs."}'
```

---

## 🛡️ What the Governance Agent Catches

| Rule | Examples Blocked |
|------|-----------------|
| 🚫 Aggressive sales language | "Buy now", "Hurry", "Limited offer", "Act now" |
| 🚫 Unverified superlatives | "best", "fastest", "revolutionary", "unprecedented" |
| 🚫 Unprofessional tone | Slang, hyperbole, extreme exaggeration |
| ✅ Quantifiable claims allowed | "sub-10ms queries", "99.9% uptime" |

---

## 📁 Project Structure

```
Content Orchestra/
├── .env                          # API key (not committed)
├── package.json                  # Backend dependencies & scripts
├── tsconfig.json                 # TypeScript configuration
│
├── src/                          # ── Backend (Fastify) ──
│   ├── server.ts                 # API server & orchestration loop
│   ├── agents/
│   │   ├── knowledge.ts          # Extracts structured briefs from raw data
│   │   ├── creator.ts            # Writes marketing content
│   │   └── evaluator.ts          # Brand safety & compliance checks
│   └── schemas/
│       └── compliance.ts         # Zod schema for evaluation results
│
└── client/                       # ── Frontend (Vite + React) ──
    ├── package.json
    ├── index.html
    ├── vite.config.ts
    └── src/
        ├── main.tsx              # Entry point
        ├── App.tsx               # Pipeline UI with agent visualizer
        └── index.css             # Dark theme with glassmorphism
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js + TypeScript |
| **Backend** | Fastify |
| **Frontend** | React + Vite |
| **AI** | Vercel AI SDK + Google Gemini (`gemini-3.1-flash-lite`) |
| **Validation** | Zod (structured AI outputs & schema enforcement) |

---

## 📝 How the Pipeline Works (Step by Step)

1. **You submit raw data** — an internal memo, product notes, or any unstructured text.
2. **Knowledge Agent** reads it and extracts a structured brief: core message, target audience, and key features.
3. **Creator Agent** takes that brief and writes a short, professional social media post.
4. **Governance Agent** reviews the draft against strict brand safety rules and returns a verdict:
   - **APPROVED** → The content is clean. Pipeline returns the final draft.
   - **NEEDS_REVISION** → Specific issues are flagged. The Creator rewrites with the feedback.
   - **REJECTED** → Content is fundamentally unsuitable (rare).
5. Steps 3–4 repeat up to **3 times** until the content passes or the pipeline reports failure.

---

## 📄 License

ISC
