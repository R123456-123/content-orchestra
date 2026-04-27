# Content Orchestra

A multi-agent AI pipeline that turns messy internal memos into polished, brand-safe marketing content — automatically.

You feed it raw company data, and three AI agents work together to research, write, and review the content until it's compliant and ready to publish.

## How It Works

```
                        ┌─────────────────────┐
                        │    Raw Internal      │
                        │       Data           │
                        └─────────┬───────────┘
                                  │
                                  ▼
                   ┌──────────────────────────┐
                   │   🔍 Knowledge Agent     │
                   │   Extracts key facts     │
                   │   into a structured      │
                   │   content brief          │
                   └─────────────┬────────────┘
                                 │
                                 ▼
               ┌─────────────────────────────────┐
               │       ✍️ Creator Agent           │
               │   Writes marketing copy from    │◄────────┐
               │   the brief                     │         │
               └────────────────┬────────────────┘         │
                                │                          │
                                ▼                          │
               ┌─────────────────────────────────┐         │
               │    🛡️ Evaluator Agent            │         │
               │   Checks for brand safety       │         │
               │   & compliance                  │         │
               └────────────────┬────────────────┘         │
                                │                          │
                         ┌──────┴──────┐                   │
                         │             │                   │
                    APPROVED     NEEDS_REVISION ───────────┘
                         │         (with feedback)
                         ▼
               ┌─────────────────────┐
               │  ✅ Final Output    │
               └─────────────────────┘
```

The Evaluator and Creator loop up to 3 times until the content passes all safety checks.

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Server:** Fastify
- **AI:** Vercel AI SDK + Google Gemini (`gemini-2.5-flash-lite`, `gemini-2.5-flash`)
- **Validation:** Zod (structured AI outputs + schema enforcement)

## Project Structure

```
src/
├── server.ts                 # Fastify server & orchestration loop
├── agents/
│   ├── knowledge.ts          # Extracts structured briefs from raw data
│   ├── creator.ts            # Writes marketing content
│   └── evaluator.ts          # Brand safety & compliance checks
└── schemas/
    └── compliance.ts         # Zod schema for evaluation results
```

## Quick Start

```bash
# Install dependencies
npm install

# Add your API key
echo GOOGLE_GENERATIVE_AI_API_KEY=your_key_here > .env

# Start the server
npx tsx src/server.ts
```

## Try It

```bash
curl -X POST http://localhost:3000/api/orchestrate \
  -H "Content-Type: application/json" \
  -d '{"rawData": "Project Phoenix launching Q3. Cloud DB with sub-10ms queries. Target enterprise CTOs."}'
```

The pipeline will run through all three agents and return the approved content (or tell you it couldn't get it compliant in 3 tries).

## What the Evaluator Catches

- 🚫 Blocks aggressive sales phrases (`"Buy now"`, `"Hurry"`, `"Limited offer"`)
- 🚫 Blocks unverified claims (`"best"`, `"fastest"`, `"revolutionize"`)
- 🚫 Blocks unprofessional tone (slang, hyperbole)
- ✅ Ensures clean, professional, corporate-ready copy

---
