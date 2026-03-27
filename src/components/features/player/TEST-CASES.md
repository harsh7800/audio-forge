# Audio Player Test Cases

> **Module**: Audio Player
> **Source**: `src/components/features/player/SPEC.md`
> **Generated**: Phase 5 Setup

## Test Case ID Format

Format: `{layer}-{component}-{id}`
- Layer: `unit`, `integration`, `e2e`
- Component: `player`, `stream`, `shortcuts`, `download`
- ID: 3-digit sequential

---

## Unit Tests

### useKeyboardShortcuts

| ID | Test Case | Priority | Status |
|----|-----------|----------|--------|
| `unit-shortcuts-001` | Should not trigger when input is focused | P0 | ⏳ |
| `unit-shortcuts-002` | Space should toggle play/pause | P0 | ⏳ |
| `unit-shortcuts-003` | ArrowLeft should seek backward 10s | P0 | ⏳ |
| `unit-shortcuts-004` | ArrowRight should seek forward 10s | P0 | ⏳ |
| `unit-shortcuts-005` | ArrowUp should increase volume | P0 | ⏳ |
| `unit-shortcuts-006` | ArrowDown should decrease volume | P0 | ⏳ |
| `unit-shortcuts-007` | 0-9 keys should seek to percentage | P1 | ⏳ |
| `unit-shortcuts-008` | Should ignore when ctrl/meta/alt pressed | P1 | ⏳ |
| `unit-shortcuts-009` | ArrowLeft at start should go to prev chunk | P2 | ⏳ |
| `unit-shortcuts-010` | ArrowRight at end should go to next chunk | P2 | ⏳ |

### useAudioDownload

| ID | Test Case | Priority | Status |
|----|-----------|----------|--------|
| `unit-download-001` | download() should return Promise | P0 | ⏳ |
| `unit-download-002` | download() should set isDownloading during download | P0 | ⏳ |
| `unit-download-003` | download() should update progress on xhr progress | P0 | ⏳ |
| `unit-download-004` | download() should set progress to 100% on complete | P0 | ⏳ |
| `unit-download-005` | download() should call error callback on xhr error | P0 | ⏳ |
| `unit-download-006` | download() should use custom filename if provided | P1 | ⏳ |
| `unit-download-007` | reset() should clear progress and error | P1 | ⏳ |
| `unit-download-008` | downloadAudioUrl() should create link element | P2 | ⏳ |

### useAudioStream

| ID | Test Case | Priority | Status |
|----|-----------|----------|--------|
| `unit-stream-001` | Should create audio element on mount | P0 | ⏳ |
| `unit-stream-002` | Should call setBook when bookId and playlist provided | P0 | ⏳ |
| `unit-stream-003` | loadChunk should set audio.src to chunk URL | P0 | ⏳ |
| `unit-stream-004` | Should sync volume with audio element | P0 | ⏳ |
| `unit-stream-005` | Should sync playbackRate with audio element | P0 | ⏳ |
| `unit-stream-006` | handleEnded should call nextChunk | P0 | ⏳ |
| `unit-stream-007` | handleEnded should pause at last chunk | P0 | ⏳ |
| `unit-stream-008` | savePlaybackPosition should be called periodically | P1 | ⏳ |
| `unit-stream-009` | preloadNextChunk should prefetch next chunk URL | P1 | ⏳ |
| `unit-stream-010` | seekTo should update audio.currentTime | P1 | ⏳ |

### AudioPlayer Component

| ID | Test Case | Priority | Status |
|----|-----------|----------|--------|
| `unit-player-001` | Should render loading state when isLoading | P0 | ⏳ |
| `unit-player-002` | Should show bookTitle and chapter info | P0 | ⏳ |
| `unit-player-003` | Play button should call toggle | P0 | ⏳ |
| `unit-player-004` | Progress bar should call handleProgressClick on click | P0 | ⏳ |
| `unit-player-005` | Volume button should toggle mute | P0 | ⏳ |
| `unit-player-006` | Speed select should update playbackRate | P0 | ⏳ |
| `unit-player-007` | Prev/Next buttons should change chunk | P0 | ⏳ |
| `unit-player-008` | formatTime should format seconds correctly | P1 | ⏳ |

---

## Integration Tests

| ID | Test Case | Priority | Status |
|----|-----------|----------|--------|
| `integration-001` | Full playback flow: play → time updates → pause | P0 | ⏳ |
| `integration-002` | Chunk navigation: next → loads chunk → auto-play | P0 | ⏳ |
| `integration-003` | Keyboard shortcut triggers store update | P1 | ⏳ |
| `integration-004` | Download flow: click → progress → complete | P1 | ⏳ |

---

## E2E Tests (Playwright)

| ID | Test Case | Priority | Status |
|----|-----------|----------|--------|
| `e2e-001` | Upload flow: select file → upload → processing | P0 | ⏳ |
| `e2e-002` | Library view: navigate → see books → filter/sort | P0 | ⏳ |
| `e2e-003` | Audio playback: click play → audio plays | P0 | ⏳ |
| `e2e-004` | Progress tracking: upload → wait → see progress | P1 | ⏳ |
| `e2e-005` | Download: completed book → download → file saved | P1 | ⏳ |

---

## Summary

| Layer | Test Cases | Priority |
|-------|------------|----------|
| Unit | 28 | P0: 15, P1: 9, P2: 4 |
| Integration | 4 | P0: 2, P1: 2 |
| E2E | 5 | P0: 3, P1: 2 |
| **Total** | **37** | |

---

## Notes

- Tests marked ⏳ need implementation
- All unit tests use Vitest + React Testing Library
- E2E tests use Playwright
- Some tests require mocking HTML5 Audio API
