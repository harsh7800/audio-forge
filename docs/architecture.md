# System Architecture

## 1. High-Level Flow

Frontend → Backend API → Queue → Worker → Tools → TTS → Storage → Response

## 2. Components

### Frontend
- Next.js
- Upload interface
- Audio player

### Backend
- Node.js (Express/Fastify)
- Handles API requests
- Creates jobs

### Queue System
- BullMQ + Redis
- Handles async processing

### Worker
- Executes processing pipeline
- Calls tools sequentially

### Agent Layer (Phase 2+)
- Decides pipeline dynamically
- Uses tool-based execution

### Tool Layer
Reusable stateless functions:
- extractText
- cleanText
- chunkText
- summarizeText
- convertToSpeech
- stitchAudio

### Storage
- Local / AWS S3
- Stores audio files

### Database (optional MVP)
- Job status tracking
- Metadata storage

## 3. Data Flow

1. User uploads file
2. Backend creates job
3. Job pushed to queue
4. Worker processes:
   - extract → clean → process → TTS
5. Audio stored
6. Response returned

## 4. Future Architecture (Agentic)

PM Agent → Planner Agent → Engineering Agent → Test Agent → Critic Agent

## 5. Key Design Principles
- Modular tools
- Async-first processing
- Test-first development
- Replaceable components