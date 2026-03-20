# AudioForge — System Workflow

## Flow Overview

```
User → Frontend → API → Queue → Worker → Tools → Decision → TTS → Stitch → Storage → Complete → Polling Loop → User
```

## Flow Sequence

### 1. Input Submission
User submits PDF or text through Frontend → `POST /jobs` to Backend API

### 2. Job Creation
API validates input → Creates job in Redis (status: `pending`) → Enqueues to BullMQ → Returns `jobId`

### 3. Async Processing
Worker dequeues job → Updates status to `processing` → Executes tool pipeline

### 4. Tool Pipeline (Sequential)
```
extractText → cleanText → chunkText → [Decision: Mode?]
```

### 5. Mode Branch
- **Audiobook**: chunkText → convertToSpeech → stitchAudio
- **Summary**: chunkText → summarizeText → convertToSpeech → stitchAudio

### 6. AI Integration
- TTS calls: OpenAI TTS / ElevenLabs
- Summarization calls: OpenAI GPT-4o-mini

### 7. Storage & Completion
Upload audio to S3 → Update job status to `completed` → Store audio URL in Redis

### 8. Status Polling Loop
Frontend polls `GET /jobs/:id` every 2-5 seconds until `completed` or `failed`

### 9. Output Delivery
Frontend displays audio player → User plays or downloads

## Components

| Layer | Component | Purpose |
|-------|-----------|---------|
| Input | User | Provides PDF/text input |
| Input | Frontend (Next.js) | UI, file upload, polling |
| API | Backend (Fastify) | Job creation, validation |
| Storage | Redis | Job state, queue |
| Queue | BullMQ | Async job dispatch |
| Worker | Node.js | Pipeline orchestration |
| Tools | Stateless functions | Text processing |
| AI | OpenAI / ElevenLabs | TTS, summarization |
| Storage | AWS S3 | Audio file storage |

## Job Lifecycle

```
pending → processing → completed
                 ↓
              failed (retry ≤ 3x)
```

## Key Patterns

- **Async-first**: All processing via queue + worker
- **Polling feedback**: Frontend polls until job completes
- **Mode branching**: Single pipeline with conditional step
- **External AI**: TTS and LLM calls are isolated to specific tools
