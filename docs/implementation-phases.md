# Implementation Phases

## Phase 1: Core Backend & Tools (Day 1–2)
- [ ] Set up backend with Express/Fastify and BullMQ queue
- [ ] Implement `extractText` tool (PDF and text input)
- [ ] Implement `cleanText` tool (normalize whitespace, remove artifacts)
- [ ] Write unit tests for `extractText` and `cleanText`
- [ ] Set up basic API endpoints for job creation

## Phase 2: Processing Tools (Day 3)
- [ ] Implement `chunkText` tool (split text into processable chunks)
- [ ] Implement `summarizeText` tool (generate summary from text)
- [ ] Implement `convertToSpeech` tool (TTS integration)
- [ ] Write unit tests for each new tool
- [ ] Integration test: text → chunk → TTS pipeline

## Phase 3: Orchestrator & Integration (Day 4)
- [ ] Create orchestrator logic for "audiobook" mode (extract → clean → chunk → TTS)
- [ ] Create orchestrator logic for "summary" mode (extract → clean → summarize → TTS)
- [ ] Integrate orchestrator with worker queue
- [ ] Write integration tests for full pipeline (both modes)
- [ ] Set up job status tracking (in-memory or simple DB)

## Phase 4: Frontend & E2E (Day 5)
- [ ] Build frontend upload interface (PDF/text input)
- [ ] Build audio player component
- [ ] Implement API client for job submission and status polling
- [ ] Write E2E tests: upload → processing → audio output
- [ ] Ensure test coverage reaches 70–80%

## Phase 5: Polish & Observability
- [ ] Add logging for each tool execution
- [ ] Add error handling and retry logic
- [ ] Create monitoring dashboard (optional)
- [ ] Documentation for API and tool usage

---
*Note: Each task should have a SPEC.md and TEST-CASES.md created before implementation.*