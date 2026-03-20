# MVP Plan

## Goal
Build a simple, working system with:
- End-to-end pipeline
- Basic orchestration
- Full test coverage

---

## 1. Features

### Input
- Upload PDF OR paste text

### Modes
- Audiobook
- Summary

### Output
- Play audio
- Download audio

---

## 2. Architecture (MVP)

Frontend → API → Queue → Worker → Tools → TTS

---

## 3. Tools (MVP Scope)

- extractText
- cleanText
- chunkText
- summarizeText
- convertToSpeech

---

## 4. Orchestrator (Simple)

if (mode === "audiobook"):
  extract → clean → chunk → TTS

if (mode === "summary"):
  extract → clean → summarize → TTS

---

## 5. Testing Strategy

### Unit Tests
- All tools covered

### Integration Tests
- Full pipeline

### E2E Tests
- Upload → process → audio output

### Coverage Target
- 70–80%

---

## 6. Timeline

Day 1–2:
- Setup backend + queue
- extract + clean tools

Day 3:
- chunk + summarize + TTS

Day 4:
- orchestrator + integration tests

Day 5:
- frontend + E2E

---

## 7. Out of Scope (MVP)

- Multi-agent system
- Dynamic planning
- Voice intelligence
- Advanced chunking

---

## 8. Success Criteria

- End-to-end flow works
- Audio is generated
- Tests pass
- Logs are visible