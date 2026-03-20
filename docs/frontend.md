# AudioForge — Frontend Tech Stack

---

## 1. Overview

The frontend is responsible for:
- Accepting user inputs (PDF, text)
- Triggering backend processing jobs
- Displaying job status and progress
- Providing audio playback and download
- Handling user interactions cleanly

This system is designed to be:
- Simple (MVP-first)
- Responsive
- Testable
- Decoupled from backend logic

---

## 2. Core Frontend Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Framework | Next.js | 15.x | App Router, SSR, file uploads |
| Language | TypeScript | 5.x | End-to-end type safety |
| Styling | Tailwind CSS | 4.x | UI styling |
| UI Components | shadcn/ui | latest | Prebuilt, accessible components |
| Package Manager | pnpm | 10.x | Fast, efficient dependency management |

---

## 3. State Management

| Type | Tool | Purpose |
|------|------|--------|
| Server State | TanStack Query | API data fetching, caching, polling |
| Client State | Zustand (optional) | UI state management |

### Why TanStack Query?
- Built-in caching for API responses
- Automatic background refetching
- Loading/error state handling
- Perfect for async job polling

---

## 4. API Communication

| Layer | Tool | Purpose |
|------|------|---------|
| HTTP Client | fetch / axios | API calls |
| Data Fetching | TanStack Query | Manage async data |

### API Responsibilities
- Upload file / send text
- Trigger job creation
- Poll job status
- Fetch audio URL

---

## 5. Core Features (MVP)

### Input
- Upload PDF
- Paste text

### Mode Selection
- Audiobook
- Summary

### Output
- Audio player
- Download button
- Status indicator (processing, done, failed)

---

## 6. UI Components

### Core Components
- FileUpload
- TextInput
- ModeSelector
- GenerateButton
- JobStatus
- AudioPlayer
- DownloadButton

---

## 7. Page Structure

```
app/
  page.tsx          # Main UI
  layout.tsx        # Layout wrapper
```

### Main Page Flow
1. User uploads file / enters text
2. Selects mode
3. Clicks generate
4. API call triggered
5. Job status polled
6. Audio displayed

---

## 8. Data Flow

```
User Input → API Request → Job Created → Poll Status → Receive Audio → Play
```

---

## 9. Async Job Handling

### Flow
1. User submits request
2. API returns jobId
3. Frontend polls job status
4. Once completed → fetch audio

### Polling Strategy
- Interval: 2–5 seconds
- Stop when:
  - status = completed
  - status = failed

---

## 10. Audio Handling

| Feature | Implementation |
|--------|---------------|
| Playback | HTML5 Audio API |
| Controls | Play, Pause, Seek |
| Speed | Optional (future) |
| Download | Direct link |

---

## 11. Error Handling
- Show user-friendly error messages
- Handle:
  - upload failure
  - processing failure
  - network errors

---

## 12. Loading States
- File upload loading
- Processing spinner
- Audio loading

---

## 13. Test-Driven Development (TDD)

### Rule
Red → Green → Refactor
1. Write failing test
2. Implement minimal code
3. Refactor safely

---

## 14. Testing Stack

| Tool | Purpose |
|------|---------|
| Vitest | Unit tests |
| React Testing Library | Component tests |
| user-event | Simulate interactions |
| MSW | Mock API |
| Playwright | E2E tests |

---

## 15. Testing Strategy

| Layer | Tool | Notes |
|------|------|------|
| Components | React Testing Library | UI behavior |
| Hooks | Vitest | Logic testing |
| API | MSW | Mock backend |
| E2E | Playwright | Full flow |

---

## 16. Example Test

```ts
describe("Generate Flow", () => {
  it("uploads file and displays audio", async () => {
    // simulate upload
    // click generate
    // mock API
    // expect audio player
  })
})
```

---

## 17. Project Structure

```
frontend/
  src/
    app/            # Next.js App Router pages
    components/     # React components
    hooks/          # Custom React hooks
    lib/            # Utility functions
    services/       # API call handlers
  tests/
    components/     # Component tests
    e2e/            # End-to-end tests
```

---

## 18. Hooks Layer

Custom hooks:
- `useCreateJob`
- `useJobStatus`
- `useAudio`

---

## 19. Services Layer

Handles API calls:
- `createJob()`
- `getJobStatus()`
- `getAudio()`

---

## 20. Development Commands

```bash
pnpm dev                # Start frontend development server
pnpm build              # Build for production
pnpm test               # Run unit tests
pnpm test:e2e           # Run Playwright tests
```

---

## 21. Environment Variables

```env
# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Backend API
NEXT_PUBLIC_API_URL="http://localhost:4000"

# Storage (if handling direct uploads)
AWS_REGION=""
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_S3_BUCKET=""

# TTS (if using client-side)
OPENAI_API_KEY=""  # Optional, for direct client calls
```

---

## 22. Key Design Principles

- Keep UI simple and intuitive
- Avoid over-engineering
- Use hooks for logic separation
- Separate UI from data fetching
- Optimize for clarity and maintainability

---

## 23. Integration with Backend

Frontend depends on these backend endpoints:
- `POST /jobs` → create job
- `GET /jobs/:id` → job status
- `GET /jobs/:id/audio` → audio file

---

## 24. AI Development Workflow (Frontend)

### Pipeline
Spec → Tests → Implementation → Validation → Docs

### Rules
- No UI without tests
- No large components
- Keep logic in hooks
- Reuse components