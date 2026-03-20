# Tech Stack & Setup

## Core Framework

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Frontend | Next.js | 15.x | App Router, UI, file uploads |
| Backend | Node.js (Fastify/Express) | Latest LTS | API + agent orchestration |
| Language | TypeScript | 5.x | End-to-end type safety |
| Styling | Tailwind CSS | 4.x | UI styling |
| Package Manager | pnpm | 10.x | Fast, efficient dependency management |

---

## Backend Architecture

| Component | Technology | Purpose |
|----------|------------|---------|
| API Layer | Fastify (preferred) | High-performance API handling |
| Queue | BullMQ + Redis | Async job processing |
| Workers | Node.js workers | Execute pipelines |
| Storage | AWS S3 / Local | Store generated audio |
| Logging | Pino / Winston | Structured logs |

---

## AI & Processing Stack

| Category | Tool | Purpose |
|----------|------|---------|
| TTS | OpenAI TTS / ElevenLabs | Audio generation |
| Text Processing | Custom utils | Cleaning, chunking |
| PDF Parsing | pdf-parse / pdfplumber | Extract text |
| Summarization | OpenAI (GPT-4o-mini) | Summary generation |
| Agent Framework (Phase 2+) | LangGraph / Custom | Tool orchestration |

---

## Frontend Stack

| Category | Library | Purpose |
|----------|---------|---------|
| UI Components | shadcn/ui | Prebuilt UI components |
| Forms | React Hook Form + Zod | Input validation |
| State | Zustand / React Query | Client state |
| Audio | HTML5 Audio API | Playback |
| Uploads | Native / presigned URLs | File handling |

---

## Test-Driven Development (TDD)

This project strictly follows TDD.

### Rule

Red → Green → Refactor
1. Write failing test
2. Implement minimal code
3. Refactor safely
4. Commit both

---

## TDD Priority (CRITICAL FOR THIS PROJECT)

| Layer | Priority | Reason |
|------|--------|--------|
| Tools (`extractText`, `cleanText`, etc.) | **Critical** | Core logic, must be deterministic |
| Pipeline execution | **Critical** | Ensures flow correctness |
| Agent planning (future) | **High** | Validates decision-making |
| Services | **High** | Business logic |
| API routes | **Medium** | Contract validation |
| Frontend | **Low** | Only key flows |

---

## Testing Stack

| Tool | Purpose |
|------|---------|
| Vitest / Jest | Unit + integration tests |
| Supertest | API testing |
| Playwright | End-to-end testing |
| MSW | Mock API calls |
| BullMQ test utils | Queue testing |

---

## Testing Strategy

| Layer | Tool | Mocking |
|-------|------|---------|
| Tools | Vitest/Jest | None (pure functions) |
| Services | Vitest/Jest | Mock dependencies |
| API | Supertest | Mock services |
| Queue Workers | Vitest | Mock TTS |
| E2E | Playwright | Real flow |

---

## Example — Tool TDD

```ts
describe("cleanText", () => {
  it("removes page numbers", () => {})
  it("removes headers", () => {})
  it("handles empty input", () => {})
})
```

## Agent Development (IMPORTANT)

AI development follows structured workflow:

### Pipeline
Spec → Tests → Implementation → Validation → Docs

### Rules
- No implementation without tests
- Must include edge cases
- Must produce structured output

### Project Structure
```
backend/
  src/
    agents/
    tools/
    services/
    queue/
    controllers/
  tests/
    unit/
    integration/
    e2e/

frontend/
  src/
    app/
    components/
    hooks/
    lib/
```

### Queue Flow
API → Job Created → Queue → Worker → Tools → TTS → Storage

### Development Commands
```
pnpm dev                # Start frontend + backend
pnpm test               # Run tests
pnpm test:coverage      # Coverage report
pnpm test:e2e           # Run Playwright tests
```

### Environment Variables
```env
# Redis
REDIS_URL="redis://localhost:6379"

# Storage
AWS_REGION=""
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_S3_BUCKET=""

# TTS
OPENAI_API_KEY=""
ELEVENLABS_API_KEY=""

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Key Design Principles
- Tools must be stateless and testable
- Agent logic must be observable
- Async processing is mandatory
- Keep MVP simple, scale in phases

---

# 💥 What I Changed (Important Insight)

Your original file was:
> product-focused (billing system)

This one is:
> **AI-system + agent + pipeline-focused**

Key upgrades:
- Added **queue + worker architecture**
- Added **AI workflow rules**
- Added **agent development discipline**
- Adjusted TDD priorities to match your system

---

# ⚡ Final Advice

This file will act as:
- your **team contract**
- your **AI instruction base**
- your **architecture guardrail**