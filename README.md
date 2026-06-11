# Content Orchestra

*A multi-agent AI orchestration platform for brand-safe content generation.*

**B.Tech Major Project — 2026**

---

## Overview

Content Orchestra transforms raw internal data—such as memos, product specifications, and rough notes—into polished, compliant marketing content. Rather than relying on a single large language model prompt, the platform utilizes a sophisticated multi-agent architecture. 

Multiple specialized AI agents collaborate, review, and iterate on the content in an automated feedback loop, ensuring the final output meets strict brand safety and quality guidelines.

---

## Architecture

The system operates in two distinct modes, allowing flexibility based on processing requirements.

### Classic Mode (3-Agent Pipeline)
A streamlined pipeline for rapid, brand-compliant copy generation.
1. **Knowledge Agent**: Extracts structured briefs from raw, unstructured data.
2. **Creator Agent**: Drafts professional marketing copy based on the brief.
3. **Governance Agent**: Reviews the draft against strict compliance rules. If it fails, the draft is sent back to the Creator for revision (up to 3 iterative cycles).

### Pro Mode (8-Agent Studio)
A comprehensive content studio for multi-platform campaigns.
- **Researcher Agent**: Analyzes industry context and market trends.
- **Knowledge Agent**: Formulates the core messaging strategy.
- **Creator Agent**: Generates the primary marketing copy.
- **SEO Agent**: Optimizes the copy for search engines and social algorithms.
- **Governance Agent**: Enforces brand safety and tonal compliance.
- **Idea Generator**: Brainstorms follow-up campaigns and content concepts.
- **Image Prompt Agent**: Designs specific visual assets and styling prompts.
- **Video Script Agent**: Adapts the core message into short-form vertical video scripts.

---

## Technical Implementation

### Tech Stack
- **Runtime**: Node.js & TypeScript
- **Backend Framework**: Fastify
- **Frontend Framework**: React 19 & Vite 8
- **AI Integration**: Google Gemini 3.1 Flash Lite via Vercel AI SDK
- **Data Validation**: Zod v4 for rigorous schema enforcement

### Design System
The frontend utilizes a custom **Anthropic-inspired minimalist aesthetic**. It prioritizes readability, high-contrast typography (utilizing the *Newsreader* serif for academic authority), and fluid micro-animations over heavy UI elements, providing a sophisticated "AI Research Lab" experience.

---

## Getting Started

### Prerequisites
- Node.js v18 or higher
- Google AI API Key (Gemini API)

### Installation

```bash
# Clone the repository
git clone https://github.com/R123456-123/content-orchestra.git
cd content-orchestra

# Install backend dependencies
npm install

# Install frontend dependencies
cd client && npm install && cd ..

# Configure environment variables
echo "GOOGLE_GENERATIVE_AI_API_KEY=your_key_here" > .env
```

### Local Development

Open two terminal instances to run both servers concurrently.

**Terminal 1 (Backend API):**
```bash
npm run dev
```

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
```

Navigate to `http://localhost:5173` to access the application.

---

## Development Roadmap

**Phase 1: Foundation (Complete)**
- Implementation of the 3-agent iterative pipeline.
- Zod schema enforcement for LLM JSON outputs.
- Fastify server configuration.

**Phase 2: Content Studio Expansion (Complete)**
- Implementation of the 8-agent Pro Mode.
- Anthropic-style UI redesign and live pipeline visualizer.
- Integration of `AbortController` for graceful pipeline termination and advanced error handling.

**Phase 3: On the Horizon (Planned)**
- **Authentication**: Secure user accounts (Clerk).
- **Persistent Storage**: Database integration for saving outputs (Supabase).
- **Platform Integrations**: Direct publishing to LinkedIn and Twitter via OAuth.

---

## Team

- **Yash Choudhary** — Frontend Developer
- **Rishiraj Tanwar** — AI / Backend Engineer

---

## License
ISC
