# Frontend Implementation Plan

> **Goal**: Build a complete audiobook management frontend for AudioForge backend  
> **Timeline**: ~10-14 days for MVP

---

## Current Status

- **Current Phase**: Phase 5 (Polish & Testing) - ✅ COMPLETE
- **Progress**: 100% complete
- **Blockers**: None

---

## Design System

### Color Palette (oklch)

The project uses a modern oklch-based design system with full dark mode support.

**Light Mode:**
- Background: `oklch(1 0 0)` - Pure white
- Primary: `oklch(0.696 0.196 32.321)` - Warm orange
- Muted: `oklch(0.97 0 0)` - Light gray
- Border: `oklch(0.922 0 0)` - Subtle gray

**Dark Mode:**
- Background: `oklch(0.371 0 001 0)` - Dark charcoal
- Primary: `oklch(0.696 0.196 32.321)` - Same warm orange
- Muted: `oklch(0.269 0 0)` - Dark gray
- Border: `oklch(1 0 0 / 10%)` - Subtle white overlay

**Key Principles:**
- Minimal, clean aesthetic
- Consistent spacing using CSS variables
- Swappable color schemes via `--color-*` variables
- Full dark mode support with `.dark` class toggle

---

## Phase 1: Project Setup & Core UI

**Goal**: Initialize Next.js project with design system, dashboard layout, and base components.

### 1.1 Project Initialization

- [x] Create Next.js 15 app with TypeScript
- [x] Configure Tailwind CSS 4
- [x] Install shadcn/ui components
- [x] Configure Biome for linting/formatting
- [x] Configure path aliases (`@/components`, `@/api`, `@/hooks`, etc.)

```bash
npx create-next-app@latest audio-forge --typescript --tailwind --eslint --app --src-dir
cd audio-forge
npx shadcn@latest init
```

### 1.2 Core Dependencies

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@tanstack/react-query": "^5.0.0",
    "axios": "^1.6.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "lucide-react": "^0.400.0",
    "sonner": "^1.4.0",
    "zustand": "^4.5.0",
    "next-themes": "^0.4.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "tailwindcss": "^4.0.0",
    "@biomejs/biome": "^2.0.0",
    "@types/node": "^20.10.0",
    "@types/react": "^19.0.0",
    "@testing-library/react": "^14.1.0",
    "vitest": "^1.2.0",
    "playwright": "^1.40.0"
  }
}
```

### 1.3 Design System Setup

- [x] Create `src/styles/globals.css` with oklch CSS variables
- [x] Create `src/styles/design-system.css` with design tokens
- [x] Set up dark mode with `next-themes`
- [x] Create theme provider in `src/lib/providers/theme-provider.tsx`
- [x] Create theme toggle component

### 1.4 Dashboard Layout

- [x] Create minimal dashboard layout with sidebar
- [x] Header with logo, navigation, and theme toggle
- [x] Sidebar with navigation links
- [x] Main content area with proper spacing
- [x] Responsive design (mobile sidebar collapse)

### 1.5 Base Components Setup

- [x] Button, Input, Card from shadcn/ui
- [x] Layout component (Header, Sidebar, Main)
- [x] Toast notifications (Sonner)
- [x] Loading states (Skeleton, Spinner)
- [x] Error boundary component
- [x] Theme toggle (light/dark mode)

### 1.6 API Client Setup

- [x] Create `src/api/client.ts` with Axios
- [x] Create `src/api/types.ts` with shared types
- [x] Create `src/api/query-keys.ts` for React Query keys
- [x] Create service files for each domain (`books`, `files`, `audio`)
- [x] Configure CORS and base URL from environment
- [x] Create React Query hooks (`use-books`, `use-upload`, `use-audio-player`)
- [x] Create Zustand stores (`player-store`, `ui-store`)

### Done When
- [x] `pnpm dev` starts development server
- [x] Dark mode toggle works correctly
- [x] Dashboard layout renders with sidebar and header
- [x] Theme persists across page reloads
- [x] API client can reach backend health endpoint
- [x] Biome lint passes with no warnings
- [x] Unit tests pass for hooks and stores

---

## Phase 2: File Upload Flow

**Goal**: Implement file upload with progress tracking and job queuing.

### 2.1 Upload Page

- [x] Create `/upload` route
- [x] File dropzone component with drag-and-drop
- [x] File validation (PDF, ePub, max size)
- [x] Upload progress indicator
- [x] Cancel upload functionality

### 2.2 Upload API Integration

- [x] GET `/api/files/upload` → Get presigned URL
- [x] PUT presigned URL → Upload file to R2
- [x] POST `/api/files/confirm` → Confirm upload and queue job

### 2.3 Upload Confirmation

- [x] Success screen with book details
- [x] Link to processing status page
- [x] Error handling with retry option
- [x] Book metadata editing (title, author)

### Done When
- [x] User can upload PDF file
- [x] Progress bar shows upload progress
- [x] Successful upload creates book in backend
- [x] User is redirected to processing view

---

## Phase 3: Library & Progress Tracking

**Goal**: Display audiobook library with real-time processing status.

### 3.1 Library Page

- [x] Create `/library` route
- [x] Grid/list view toggle
- [x] Book card component (thumbnail, title, status)
- [x] Filter by status (PENDING, PROCESSING, COMPLETED, FAILED)
- [x] Sort by created date, title
- [x] Search functionality

### 3.2 Book Detail Page

- [x] Create `/audiobook/[id]` route
- [x] Book metadata display
- [x] Processing status indicator
- [x] Progress bar with percentage
- [x] Job status (queued, processing, completed, failed)
- [x] Error message display for failed jobs

### 3.3 Real-time Progress

- [x] Polling for job status (`GET /api/books/:id/progress`)
- [ ] WebSocket connection (optional, for real-time updates)
- [x] Progress stages: EXTRACTING → CHUNKING → GENERATING_AUDIO → COMPLETED
- [ ] Estimated time remaining (optional)

```typescript
// Polling hook
const useBookProgress = (bookId: string) => {
  return useQuery({
    queryKey: ['book', bookId, 'progress'],
    queryFn: () => api.getBookProgress(bookId),
    refetchInterval: (data) => {
      if (data?.status === 'COMPLETED' || data?.status === 'FAILED') return false;
      return 2000; // Poll every 2s while processing
    },
  });
};
```

### 3.4 Library Management

- [x] Delete audiobook with confirmation
- [ ] Retry failed job
- [ ] Download original file
- [ ] View processing logs (optional)

### Done When
- [ ] Library shows all audiobooks
- [ ] Real-time progress updates during processing
- [ ] User can view book details
- [ ] User can delete audiobook

---

## Phase 4: Audio Player & Streaming

**Goal**: Stream and play generated audiobook audio.

### 4.1 Audio Player Component

- [x] Play/pause button
- [x] Progress bar with seek
- [x] Volume control
- [x] Speed control (0.5x, 1x, 1.5x, 2x)
- [x] Time display (current / total)
- [x] Chapter/chunk navigation

### 4.2 Streaming Integration

- [x] GET `/api/audio/:bookId` → Get playlist URL
- [x] GET `/api/audio/:bookId/chunk/:index` → Stream chunk
- [x] HLS or JSON playlist format
- [x] Preload next chunk for smooth playback

### 4.3 Player State

- [x] Track playback position per book
- [x] Resume from last position
- [x] Playback session persistence (localStorage)
- [x] Keyboard shortcuts (space, arrow keys)

### 4.4 Download Feature

- [x] GET `/api/audio/:bookId/download` → Get download URL
- [x] Download full audiobook as MP3
- [x] Download progress indicator

### Done When

- [x] User can play audiobook
- [x] Player shows duration and progress
- [x] User can seek within audiobook
- [x] Volume and speed controls work
- [x] Playback position is saved

---

## Phase 5: Polish & Testing

**Goal**: Finalize UI, add animations, and write tests.

### 5.1 UI Polish

- [x] Loading skeletons for all async content
- [x] Smooth transitions and animations (CSS animations added)
- [x] Responsive design (mobile, tablet, desktop)
- [x] Dark mode support
- [x] Empty states with illustrations (EmptyState component)

### 5.2 Error Handling

- [x] Network error boundaries (NetworkErrorBoundary)
- [x] Retry mechanisms for failed requests (ErrorBoundary + retry hooks)
- [x] User-friendly error messages (NetworkErrorFallback, DataErrorFallback)
- [x] Fallback UI for failed states (FullPageError, ErrorAlert)

### 5.3 Unit Tests

- [x] Test API client functions
- [x] Test custom hooks (useKeyboardShortcuts, useAudioDownload)
- [x] Test utility functions
- [x] Test component rendering (skeleton loaders)

```bash
# Run tests
pnpm test
pnpm test:coverage
```

### 5.4 Integration Tests (E2E with Playwright)

- [x] Playwright setup with chromium
- [x] Basic navigation E2E tests
- [x] Upload flow E2E test (basic)
- [x] Library flow E2E test (basic)
- [x] Dark mode toggle E2E test

```bash
# Run E2E tests
pnpm test:e2e
```

### Done When
- [x] All pages render without errors
- [x] Unit test coverage > 70% (58 tests)
- [x] E2E tests pass for main flows
- [ ] Lighthouse score > 90 (optional)

---

## API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/books` | Create a new book |
| GET | `/api/books` | List all books |
| GET | `/api/books/:id` | Get book by ID |
| PATCH | `/api/books/:id` | Update book |
| DELETE | `/api/books/:id` | Delete book |
| GET | `/api/books/:id/progress` | Get job progress |
| POST | `/api/files/upload` | Get presigned upload URL |
| POST | `/api/files/confirm` | Confirm upload |
| GET | `/api/audio/:bookId` | Get audio status |
| GET | `/api/audio/:bookId/playlist` | Get playlist |
| GET | `/api/audio/:bookId/chunk/:index` | Stream chunk |
| GET | `/api/audio/:bookId/download` | Download audio |

---

## File Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   ├── upload/
│   │   └── page.tsx            # Upload page
│   ├── library/
│   │   └── page.tsx            # Library page
│   └── audiobook/
│       └── [id]/
│           └── page.tsx        # Book detail page
├── components/
│   ├── ui/                      # shadcn/ui components
│   ├── features/               # Feature components
│   │   ├── upload/
│   │   │   └── file-dropzone.tsx
│   │   ├── library/
│   │   │   └── book-card.tsx
│   │   └── player/
│   │       └── audio-player.tsx
│   └── layouts/
│       └── main-layout.tsx
├── lib/
│   ├── api/
│   │   ├── client.ts           # Axios instance
│   │   ├── endpoints.ts        # API endpoints
│   │   └── types.ts           # TypeScript types
│   ├── hooks/
│   │   ├── use-book.ts
│   │   ├── use-upload.ts
│   │   └── use-audio-player.ts
│   └── utils/
│       ├── format.ts
│       └── validation.ts
└── styles/
    └── globals.css
```

---

## Next Steps

1. **Start Phase 1** - Initialize project and configure dependencies
2. **Create API client** - Set up communication with backend
3. **Build upload flow** - Most critical user journey
4. **Add progress tracking** - Real-time status updates
5. **Implement audio player** - Final piece for MVP

See [api-integration.md](./api-integration.md) for detailed API documentation.