# Audio Player Module Specification

> **Last Updated**: Phase 4 Complete (2026-03-27)

## Overview

The Audio Player module provides streaming audio playback for audiobooks with chunk-based streaming, keyboard shortcuts, and download functionality.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Components                              │
│  src/components/features/player/audio-player.tsx             │
│  - AudioPlayer (full player)                                │
│  - AudioPlayerCompact (inline player)                        │
└─────────────────────┬───────────────────────────────────────┘
                      │ uses
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    Hooks                                    │
│  src/hooks/use-audio-stream.ts     - HTML5 audio streaming  │
│  src/hooks/use-keyboard-shortcuts.ts - Keyboard controls    │
│  src/hooks/use-download-audio.ts   - Download with progress│
└─────────────────────┬───────────────────────────────────────┘
                      │ uses
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    Stores                                   │
│  src/stores/player-store.ts     - Zustand with persistence │
└─────────────────────┬───────────────────────────────────────┘
                      │ uses
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Services                              │
│  src/api/audio/audio.service.ts                            │
└─────────────────────────────────────────────────────────────┘
```

## Components

### AudioPlayer

Full-featured audio player with:
- **Play/Pause button** - Toggle playback
- **Progress bar** - Click to seek, shows current/total time
- **Volume control** - Slider + mute toggle
- **Speed control** - Select dropdown (0.5x to 2x)
- **Chapter navigation** - Previous/Next chunk buttons
- **Chunk indicator** - Shows current chunk / total chunks

#### Props

```typescript
interface AudioPlayerProps {
  bookTitle?: string;
  playlist?: PlaylistItem[];
  isLoading?: boolean;
  onPlayPause?: () => void;
  onSeek?: (time: number) => void;
  onVolumeChange?: (volume: number) => void;
  onSpeedChange?: (speed: number) => void;
  onChunkChange?: (chunkIndex: number) => void;
}
```

### AudioPlayerCompact

Minimal inline player for lists/cards.

#### Props

```typescript
interface AudioPlayerCompactProps {
  bookTitle?: string;
  isLoading?: boolean;
  onPlayPause?: () => void;
}
```

## Hooks

### useAudioStream

Manages HTML5 Audio element for chunk-based streaming.

```typescript
interface UseAudioStreamOptions {
  bookId: string | null;
  playlist?: PlaylistItem[];
  autoPlay?: boolean;
  onChunkEnd?: () => void;
  onError?: (error: Error) => void;
}
```

**Returns:**
```typescript
{
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  playbackRate: number;
  currentChunkIndex: number;
  totalChunks: number;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  seekTo: (time: number) => void;
  getAudioElement: () => HTMLAudioElement | null;
  loadChunk: (chunkIndex: number) => void;
}
```

**Behavior:**
- Creates HTMLAudioElement on mount
- Loads chunks via `GET /api/audio/:bookId/chunk/:index`
- Preloads next chunk using prefetch links
- Syncs play/pause, volume, playback rate with player store
- Auto-advances to next chunk when current ends
- Saves playback position every 10 seconds

### useKeyboardShortcuts

Global keyboard shortcuts for audio player.

```typescript
interface UseKeyboardShortcutsOptions {
  enabled?: boolean;
  seekAmount?: number;      // Default: 10
  volumeStep?: number;     // Default: 0.1
  element?: HTMLElement | Document;
}
```

**Keyboard Shortcuts:**

| Key | Action |
|-----|--------|
| Space | Play/Pause |
| ArrowLeft | Seek backward (or prev chunk at start) |
| ArrowRight | Seek forward (or next chunk at end) |
| ArrowUp | Volume up |
| ArrowDown | Volume down |
| 0-9 | Jump to percentage (0=start, 1=10%, etc.) |

**Behavior:**
- Ignores shortcuts when focus is on input fields
- Respects modifier keys (ctrl, meta, alt)

### useAudioDownload

Download audiobook with progress tracking.

```typescript
{
  download: (bookId: string, filename?: string) => Promise<void>;
  progress: { loaded: number; total: number; percentage: number } | null;
  isDownloading: boolean;
  error: Error | null;
  reset: () => void;
}
```

**Behavior:**
- Uses XMLHttpRequest for progress tracking
- Creates blob URL and triggers download
- Auto-names file as `{bookId}-audiobook.mp3`

## Store

### playerStore

Zustand store with localStorage persistence.

**State:**
```typescript
{
  bookId: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  currentChunkIndex: number;
  totalChunks: number;
  playbackPositions: Record<string, PlaybackPosition>;
}
```

**Persisted (localStorage):**
- `playbackPositions` - Position per book
- `volume` - User's preferred volume
- `playbackRate` - User's preferred speed

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/audio/:bookId` | Get audio status with playlist URL |
| `GET /api/audio/:bookId/playlist` | Get playlist (JSON) |
| `GET /api/audio/:bookId/chunk/:index` | Stream chunk |
| `GET /api/audio/:bookId/download` | Download full audiobook |

## Types

```typescript
interface PlaylistItem {
  index: number;
  url: string;
  duration: number;
}

interface PlaybackPosition {
  bookId: string;
  positionMs: number;
  lastPlayedAt: string;
}
```

## Acceptance Criteria

- [x] AudioPlayer renders with all controls
- [x] Play/pause toggles isPlaying state
- [x] Progress bar shows current time and allows seeking
- [x] Volume slider changes volume
- [x] Speed select changes playbackRate
- [x] Chapter nav buttons change currentChunkIndex
- [x] useAudioStream manages HTMLAudioElement
- [x] useKeyboardShortcuts responds to keyboard events
- [x] useAudioDownload triggers file download with progress
- [x] Player store persists position/volume/rate to localStorage

## Files

| File | Description |
|------|-------------|
| `src/components/features/player/audio-player.tsx` | Player UI components |
| `src/hooks/use-audio-stream.ts` | Audio streaming hook |
| `src/hooks/use-keyboard-shortcuts.ts` | Keyboard shortcuts hook |
| `src/hooks/use-download-audio.ts` | Download hook |
| `src/stores/player-store.ts` | Zustand store with persistence |
| `src/api/audio/audio.service.ts` | API client |
