# AudioForge — Complete System Design (All Scenarios)

## Overview

This document explains all 8 scenarios covered in the AudioForge system design diagram. Each scenario represents a distinct workflow or behavior in the system.

---

## Scenario 1: PDF Upload Flow

### Trigger
User selects and uploads a PDF file through the frontend interface.

### Step-by-Step Process

| Step | Component | Action | Details |
|------|-----------|--------|---------|
| 1 | User | Selects PDF file | User clicks upload button and selects a PDF from their device |
| 2 | Frontend | Validates file | Checks file type (PDF only) and size limit (e.g., 10MB) |
| 3 | Frontend | Sends request | `POST /jobs` with `multipart/form-data` containing the PDF |
| 4 | Backend API | Receives file | Fastify parses the multipart form data |
| 5 | Backend API | Validates input | Zod schema validates file type and metadata |
| 6 | Backend API | Creates job | Generates unique `jobId`, sets initial status to `pending` |
| 7 | Backend API | Queues job | Pushes job to Redis queue via BullMQ |
| 8 | Backend API | Returns response | Returns `{ jobId, status: "pending" }` to frontend |

### Request/Response Schema

```typescript
// Request
POST /jobs
Content-Type: multipart/form-data

{
  file: File,           // PDF file
  mode: "audiobook" | "summary"
}

// Response
{
  jobId: "uuid-1234",
  status: "pending",
  estimatedTime: 120    // seconds
}
```

---

## Scenario 2: Text Input Flow

### Trigger
User pastes or types raw text content into the text input field.

### Step-by-Step Process

| Step | Component | Action | Details |
|------|-----------|--------|---------|
| 1 | User | Enters text | User pastes or types content into textarea |
| 2 | Frontend | Validates text | Checks minimum length (e.g., 100 chars) and maximum (e.g., 50,000 chars) |
| 3 | Frontend | Sends request | `POST /jobs` with JSON body containing text |
| 4 | Backend API | Receives body | Fastify parses JSON payload |
| 5 | Backend API | Validates input | Zod schema validates text content and mode |
| 6 | Backend API | Creates job | Generates unique `jobId`, stores text reference |
| 7 | Backend API | Queues job | Pushes job to Redis queue via BullMQ |
| 8 | Backend API | Returns response | Returns `{ jobId, status: "pending" }` to frontend |

### Request/Response Schema

```typescript
// Request
POST /jobs
Content-Type: application/json

{
  text: string,         // Raw text content
  mode: "audiobook" | "summary"
}

// Response
{
  jobId: "uuid-5678",
  status: "pending",
  estimatedTime: 90
}
```

---

## Scenario 3: Job Processing Core

### Trigger
Worker picks up a job from the Redis queue.

### Step-by-Step Process

| Step | Component | Action | Details |
|------|-----------|--------|---------|
| 1 | BullMQ | Dispatches job | Worker receives job from queue |
| 2 | Worker | Updates status | Sets job status to `processing` |
| 3 | Worker | Logs start | Records start timestamp for metrics |
| 4 | Worker | Executes pipeline | Runs tools in sequence based on job type |
| 5 | Worker | Handles errors | Catches and processes any tool failures |
| 6 | Worker | Updates status | Sets job to `completed` or `failed` |
| 7 | Worker | Stores result | Saves audio URL to job metadata |

### Job States

```
pending → processing → completed
                 ↓
              failed (with retry possibility)
```

### State Transition Details

| From | To | Trigger |
|------|----|---------|
| pending | processing | Worker picks up job |
| processing | completed | All tools execute successfully |
| processing | failed | Tool execution error or timeout |
| failed | pending | Retry mechanism triggered |

---

## Scenario 4: Audiobook Mode Pipeline

### Trigger
Job with `mode: "audiobook"` is being processed.

### Pipeline Steps

```
extractText → cleanText → chunkText → convertToSpeech → stitchAudio
```

### Detailed Tool Execution

| Tool | Input | Output | Duration | External API |
|------|-------|--------|----------|--------------|
| extractText | PDF file or raw text | Extracted text string | 1-5s | pdf-parse (local) |
| cleanText | Raw text | Cleaned, formatted text | <1s | None (local) |
| chunkText | Cleaned text | Array of text chunks | <1s | None (local) |
| convertToSpeech | Text chunks[] | Audio chunks[] | 10-60s | OpenAI TTS / ElevenLabs |
| stitchAudio | Audio chunks[] | Final audio file | 2-5s | FFmpeg (local) |

### Tool Specifications

#### extractText
```typescript
function extractText(input: { file?: Buffer; text?: string }): Promise<string>
```
- If PDF: Uses pdf-parse to extract text
- If text: Returns directly
- Handles OCR for scanned PDFs (future)

#### cleanText
```typescript
function cleanText(text: string): Promise<string>
```
- Removes special characters
- Fixes encoding issues
- Normalizes whitespace
- Handles headers/footers

#### chunkText
```typescript
function chunkText(text: string, options?: { maxChunkSize?: number }): Promise<string[]>
```
- Splits text into chunks (default: 4000 chars)
- Respects sentence boundaries
- Ensures chunks don't break mid-word

#### convertToSpeech
```typescript
function convertToSpeech(chunks: string[], options: { voice?: string }): Promise<Buffer[]>
```
- Calls OpenAI TTS API or ElevenLabs
- Handles rate limiting
- Returns audio buffers for each chunk

#### stitchAudio
```typescript
function stitchAudio(audioChunks: Buffer[]): Promise<Buffer>
```
- Concatenates audio segments
- Adds brief pauses between chunks
- Returns single audio file (MP3)

---

## Scenario 5: Summary Mode Pipeline

### Trigger
Job with `mode: "summary"` is being processed.

### Pipeline Steps

```
extractText → summarizeText → chunkText → convertToSpeech → stitchAudio
```

### Key Difference from Audiobook

The `summarizeText` tool is added to condense content before TTS conversion.

### Tool Specifications

#### summarizeText
```typescript
function summarizeText(text: string, options?: { ratio?: number }): Promise<string>
```
- Uses OpenAI GPT-4o-mini
- Default compression ratio: 30% of original
- Preserves key information
- Maintains coherent narrative

### Summary Modes

| Ratio | Description | Use Case |
|-------|-------------|----------|
| 0.3 | 30% of original | Quick overview |
| 0.5 | 50% of original | Balanced summary |
| 0.7 | 70% of original | Detailed summary |

---

## Scenario 6: Job Status Polling

### Trigger
Frontend needs to check job status after initial submission.

### Step-by-Step Process

| Step | Component | Action | Details |
|------|-----------|--------|---------|
| 1 | Frontend | Starts polling | Begins periodic status checks (2-5s interval) |
| 2 | Frontend | Sends request | `GET /jobs/:id` |
| 3 | Backend API | Receives request | Parses job ID from URL |
| 4 | Backend API | Queries Redis | Fetches job data from Redis |
| 5 | Backend API | Returns status | Returns current job state |
| 6 | Frontend | Updates UI | Shows progress, loading, or completion |

### Polling Logic

```typescript
async function pollJobStatus(jobId: string): Promise<JobStatus> {
  const POLL_INTERVAL = 2000; // 2 seconds
  const MAX_ATTEMPTS = 300;   // 10 minutes max
  
  let attempts = 0;
  
  while (attempts < MAX_ATTEMPTS) {
    const status = await fetch(`/api/jobs/${jobId}`);
    
    if (status === 'completed' || status === 'failed') {
      return status;
    }
    
    await sleep(POLL_INTERVAL);
    attempts++;
  }
  
  throw new Error('Polling timeout');
}
```

### Response Schema

```typescript
interface JobStatusResponse {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;        // 0-100 percentage
  estimatedTimeRemaining?: number;
  audioUrl?: string;        // Only when completed
  error?: string;           // Only when failed
  createdAt: string;
  updatedAt: string;
}
```

### Frontend Polling States

| Status | UI Display |
|--------|------------|
| pending | "Queued - Waiting to start..." |
| processing (0-30%) | "Extracting text..." |
| processing (30-50%) | "Processing content..." |
| processing (50-80%) | "Generating audio..." |
| processing (80-99%) | "Finalizing..." |
| completed | Audio player + download button |
| failed | Error message + retry button |

---

## Scenario 7: Error Handling & Retry

### Trigger
An error occurs during job processing.

### Error Types

| Error | Source | Retryable | Description |
|-------|--------|-----------|-------------|
| VALIDATION_ERROR | API | No | Invalid input data |
| EXTRACTION_ERROR | extractText | Yes | PDF parsing failure |
| TTS_ERROR | convertToSpeech | Yes | API rate limit or timeout |
| STORAGE_ERROR | S3 upload | Yes | Network or permission issue |
| UNKNOWN_ERROR | Worker | Yes | Unexpected errors |

### Retry Mechanism

```typescript
interface RetryConfig {
  maxRetries: 3;
  backoffStrategy: 'exponential';
  initialDelay: 1000;      // 1 second
  maxDelay: 60000;         // 60 seconds
}
```

### Retry Flow

```
Error Occurs → Check Retry Count → 
  If retry < max: Requeue with delay → Retry
  If retry >= max: Mark as Failed → Notify user
```

### Exponential Backoff

| Retry # | Delay | Cumulative Wait |
|---------|-------|-----------------|
| 1 | 1s | 1s |
| 2 | 2s | 3s |
| 3 | 4s | 7s |
| 4 (max) | 8s | 15s |

### BullMQ Retry Configuration

```typescript
const jobOptions = {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 1000
  },
  removeOnComplete: 100,    // Keep last 100 completed jobs
  removeOnFail: 1000        // Keep last 1000 failed jobs
};
```

---

## Scenario 8: Output & Completion

### Trigger
Job processing completes successfully.

### Step-by-Step Process

| Step | Component | Action | Details |
|------|-----------|--------|---------|
| 1 | Worker | Uploads audio | Saves final audio to S3 |
| 2 | Worker | Updates job | Sets status to `completed`, stores audio URL |
| 3 | Redis | Stores result | Job data updated with audio URL |
| 4 | Frontend | Polls status | Receives `completed` status |
| 5 | Frontend | Fetches audio | Gets pre-signed S3 URL |
| 6 | Frontend | Displays player | Shows HTML5 audio player |
| 7 | User | Plays/Downloads | Interacts with audio output |

### Audio Storage

```typescript
interface AudioMetadata {
  jobId: string;
  s3Key: string;            // e.g., "audio/uuid-1234.mp3"
  s3Url: string;            // Pre-signed URL (expires in 1 hour)
  duration: number;         // Audio duration in seconds
  size: number;             // File size in bytes
  format: 'mp3';           // Audio format
}
```

### Audio Player Features

| Feature | Implementation |
|---------|----------------|
| Play/Pause | HTML5 Audio API |
| Seek | Range input slider |
| Time display | Current / Total duration |
| Download | Direct link to S3 |
| Speed control | playbackRate (future) |

### Download Flow

```
User clicks Download → 
Frontend requests fresh pre-signed URL → 
Backend generates new URL (expires in 1 hour) → 
Browser initiates download
```

---

## Complete Data Flow Diagram

```
┌─────────┐     ┌───────────┐     ┌─────────┐     ┌──────────┐     ┌─────────┐
│  User   │────▶│ Frontend  │────▶│ Backend │────▶│  Queue   │────▶│ Worker  │
│         │     │ (Next.js) │     │  (API)  │     │ (BullMQ) │     │         │
└─────────┘     └───────────┘     └─────────┘     └──────────┘     └─────────┘
     │                │                 │                               │
     │                │                 │                               ▼
     │                │                 │                         ┌───────────┐
     │                │                 │                         │   Tools   │
     │                │                 │                         │ (Pipeline)│
     │                │                 │                         └───────────┘
     │                │                 │                               │
     │                │                 │                               ▼
     │                │                 │                         ┌───────────┐
     │                │                 │                         │   S3      │
     │                │                 │                         │ (Storage) │
     │                │                 │                         └───────────┘
     │                │                 │                               │
     │                │◀────────────────┴───────────────────────────────┘
     │                │
     │◀───────────────┘
     │
     ▼
┌─────────┐
│  Audio  │
│  Output │
└─────────┘
```

---

## Key Design Decisions

### 1. Asynchronous Processing
- Jobs are processed in background workers
- Frontend polls for status updates
- Prevents API timeouts on long operations

### 2. Queue-Based Architecture
- BullMQ + Redis for reliable job handling
- Automatic retries with exponential backoff
- Job priority and rate limiting support

### 3. Modular Tool Design
- Each tool is stateless and testable
- Tools can be reused across modes
- Easy to add new processing steps

### 4. Separation of Concerns
- Frontend: UI and user interaction
- API: Input validation and job creation
- Worker: Business logic execution
- Tools: Pure functions with no side effects

---

## Environment Variables

```bash
# Redis
REDIS_URL="redis://localhost:6379"

# AWS S3
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_S3_BUCKET="audioforge-audio"

# AI Services
OPENAI_API_KEY=""
ELEVENLABS_API_KEY=""

# Application
PORT=4000
NODE_ENV="production"
```

---

## Performance Considerations

| Metric | Target | Notes |
|--------|--------|-------|
| Job creation | < 100ms | API response time |
| Text extraction | < 5s | For typical PDFs |
| TTS generation | 10-60s | Depends on content length |
| Total processing | < 5min | For most inputs |
| Polling interval | 2-5s | Balance responsiveness vs load |

---

## Security Considerations

1. **File Upload**: Validate file types, limit sizes
2. **Pre-signed URLs**: Temporary S3 access (1 hour expiry)
3. **Rate Limiting**: Prevent API abuse
4. **Input Sanitization**: Clean text before processing
5. **Error Messages**: Don't expose internal details
