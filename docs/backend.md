# AudioForge — Backend Tech Stack

---

## 1. Overview

The backend is responsible for:
- Handling user requests
- Managing asynchronous processing
- Executing tool-based pipelines
- Integrating AI services (TTS, summarization)
- Supporting future agent-based workflows

This system is designed to be:
- Async-first
- Modular
- Test-driven
- Agent-extensible

---

## 2. Core Backend Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Runtime | Node.js | 20.x LTS | Backend runtime |
| Framework | Fastify | 4.x | High-performance API |
| Language | TypeScript | 5.x | Type safety |
| Package Manager | pnpm | 10.x | Dependency management |

---

## 3. API Layer

| Component | Tool | Purpose |
|----------|------|---------|
| HTTP Server | Fastify | REST APIs |
| Validation | Zod | Input validation |
| Testing | Supertest | API testing |

---

## 4. Database Layer

| Component | Technology | Purpose |
|----------|------------|---------|
| Primary DB | PostgreSQL (optional MVP) | Persistent storage |
| ORM | Prisma | Type-safe queries |
| Cache / Queue DB | Redis | Queue + caching |

### What We Store
- Jobs (id, status, mode)
- Input metadata
- Output audio URL
- Processing logs (future)

---

## 5. Queue & Async Processing (CRITICAL)

| Component | Technology | Purpose |
|----------|------------|---------|
| Queue | BullMQ | Job handling |
| Broker | Redis | Queue backend |
| Workers | Node.js | Background processing |

### Flow
```
API → Job Created → Redis Queue → Worker → Tools → TTS → Storage
```

### Responsibilities
- Retry failed jobs
- Track progress
- Scale workers independently

---

## 6. Worker Layer

Workers execute the pipeline.

### Responsibilities
- Process jobs
- Call tools sequentially
- Handle retries
- Stitch audio

### Rules
- Stateless
- Idempotent
- Retry-safe

---

## 7. Storage Layer

| Component | Technology | Purpose |
|----------|------------|---------|
| File Storage | AWS S3 / Local | Store audio |
| Temp Storage | Local FS | Intermediate files |

---

## 8. AI & Processing Layer

| Category | Tool | Purpose |
|----------|------|---------|
| TTS | OpenAI TTS / ElevenLabs | Audio generation |
| Summarization | OpenAI (GPT-4o-mini) | Summaries |
| PDF Parsing | pdf-parse | Extract text |
| Text Processing | Custom utils | Clean + chunk |

---

## 9. Tool Layer (Core Logic)

All business logic is implemented as tools.

### Tools
- extractText
- cleanText
- chunkText
- summarizeText
- convertToSpeech
- stitchAudio

### Rules
- Stateless
- Independently testable
- No side effects
- Small, modular functions

---

## 10. Logging & Observability

| Tool | Purpose |
|------|---------|
| Pino | Structured logging |
| Console | Debugging |

### Logs Must Include
- Job ID
- Steps executed
- Errors
- Execution time

---

## 11. Error Handling

- Centralized error handling
- Retry logic (BullMQ)
- Fail-safe job handling
- Future: Dead-letter queue

---

## 12. Test-Driven Development (TDD)

### Rule
Red → Green → Refactor
1. Write failing test
2. Implement minimal code
3. Refactor safely
4. Commit both

---

## 13. TDD Priority

| Layer | Priority |
|-------|----------|
| Tools | Critical |
| Pipeline | Critical |
| Queue | High |
| Services | High |
| API | Medium |

---

## 14. Testing Stack

| Tool | Purpose |
|------|---------|
| Vitest / Jest | Unit + integration |
| Supertest | API testing |
| Playwright | E2E testing |
| MSW | API mocking |

---

## 15. Testing Strategy

| Layer | Tool | Notes |
|-------|------|-------|
| Tools | Vitest | No mocks |
| Services | Vitest | Mock APIs |
| Workers | Vitest | Mock TTS |
| API | Supertest | Validate contracts |
| E2E | Playwright | Full flow |

---

## 16. Queue Testing

- Test job lifecycle
- Test retries
- Mock Redis where needed

---

## 17. Project Structure

```
backend/
  src/
    agents/         # Agent orchestration (Phase 2+)
    tools/          # Stateless processing functions
    services/       # Business logic
    queue/          # BullMQ job definitions
    workers/        # Background job processors
    controllers/    # API route handlers
    lib/            # Shared utilities
  tests/
    unit/           # Unit tests
    integration/    # Integration tests
    e2e/            # End-to-end tests
```

---

## 18. Development Commands

```bash
pnpm dev              # Start backend
pnpm worker           # Start worker
pnpm test             # Run tests
pnpm test:coverage    # Coverage
pnpm test:e2e         # E2E tests
```

---

## 19. Environment Variables

```env
# Server
PORT=4000

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/audioforge"

# Redis
REDIS_URL="redis://localhost:6379"

# AWS S3
AWS_REGION=""
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_S3_BUCKET=""

# AI APIs
OPENAI_API_KEY=""
ELEVENLABS_API_KEY=""
```

---

## 20. AI Development Workflow

### Pipeline
Spec → Tests → Implementation → Validation → Docs

### Rules
- No code without tests
- Must include edge cases
- Must validate output
- Must be modular

---

## 21. Key Design Principles

- Async-first architecture
- Queue-driven system
- Tool-based modular design
- Test-first development
- Agent layer is pluggable
- Keep MVP simple, scale in phases