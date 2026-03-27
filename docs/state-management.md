# State Management

> Data flow and state handling in AudioForge Frontend

---

## State Categories

| Type | Tool | Use Case |
|------|------|----------|
| Server State | React Query | API data, caching, synchronization |
| Client State | Zustand | UI state, player state |
| Form State | React Hook Form | Form validation and submission |
| URL State | Next.js Router | Page navigation, query params |

---

## Server State (React Query)

### Query Client Setup

**`lib/providers/query-provider.tsx`**

```tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### Query Keys

**`lib/api/query-keys.ts`**

```tsx
export const queryKeys = {
  // Books
  books: {
    all: ['books'] as const,
    lists: () => [...queryKeys.books.all, 'list'] as const,
    list: (params?: { limit?: number; offset?: number; status?: string }) =>
      [...queryKeys.books.lists(), params] as const,
    details: () => [...queryKeys.books.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.books.details(), id] as const,
    progress: (id: string) => [...queryKeys.books.detail(id), 'progress'] as const,
  },

  // Audio
  audio: {
    all: ['audio'] as const,
    status: (bookId: string) => [...queryKeys.audio.all, bookId, 'status'] as const,
    playlist: (bookId: string) => [...queryKeys.audio.all, bookId, 'playlist'] as const,
  },
} as const;
```

---

## Client State (Zustand)

### Player Store

**`lib/stores/player-store.ts`**

```tsx
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PlayerState {
  // Current track
  bookId: string | null;
  chunkIndex: number;
  currentTime: number;

  // Playback state
  isPlaying: boolean;
  volume: number;
  playbackRate: number;

  // Actions
  setBook: (bookId: string, chunks: number) => void;
  setChunkIndex: (index: number) => void;
  setCurrentTime: (time: number) => void;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
  reset: () => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      // Initial state
      bookId: null,
      chunkIndex: 0,
      currentTime: 0,
      isPlaying: false,
      volume: 1,
      playbackRate: 1,

      // Actions
      setBook: (bookId, chunks) =>
        set({
          bookId,
          chunkIndex: 0,
          currentTime: 0,
          isPlaying: false,
        }),

      setChunkIndex: (index) =>
        set({ chunkIndex: index, currentTime: 0 }),

      setCurrentTime: (time) =>
        set({ currentTime: time }),

      play: () => set({ isPlaying: true }),
      pause: () => set({ isPlaying: false }),
      toggle: () => set((state) => ({ isPlaying: !state.isPlaying })),

      setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
      setPlaybackRate: (rate) => set({ playbackRate: rate }),

      reset: () =>
        set({
          bookId: null,
          chunkIndex: 0,
          currentTime: 0,
          isPlaying: false,
        }),
    }),
    {
      name: 'audioforge-player',
      partialize: (state) => ({
        // Only persist these values
        volume: state.volume,
        playbackRate: state.playbackRate,
      }),
    }
  )
);
```

### UI Store

**`lib/stores/ui-store.ts`**

```tsx
import { create } from 'zustand';

type ViewMode = 'grid' | 'list';
type Theme = 'light' | 'dark' | 'system';

interface UIState {
  // Library view
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;

  // Sidebar
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Modals
  uploadModalOpen: boolean;
  setUploadModalOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  viewMode: 'grid',
  setViewMode: (mode) => set({ viewMode: mode }),

  theme: 'system',
  setTheme: (theme) => set({ theme: theme }),

  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  uploadModalOpen: false,
  setUploadModalOpen: (open) => set({ uploadModalOpen: open }),
}));
```

---

## Form State (React Hook Form)

### Upload Form

**`lib/hooks/use-upload-form.ts`**

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const uploadSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  author: z.string().max(100, 'Author name too long').optional(),
  language: z.enum(['en', 'es', 'fr', 'de', 'it']).default('en'),
  mode: z.enum(['audiobook', 'summary']).default('audiobook'),
});

type UploadFormData = z.infer<typeof uploadSchema>;

export const useUploadForm = () => {
  const form = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      title: '',
      author: '',
      language: 'en',
      mode: 'audiobook',
    },
  });

  return form;
};
```

### Usage in Component

```tsx
import { useUploadForm } from '@/lib/hooks/use-upload-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

function UploadForm() {
  const form = useUploadForm();

  const onSubmit = (data: UploadFormData) => {
    console.log('Form data:', data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit">Submit</button>
      </form>
    </Form>
  );
}
```

---

## URL State (Next.js Router)

### Query Parameters

```tsx
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

function LibraryFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const status = searchParams.get('status') || 'all';
  const page = searchParams.get('page') || '1';

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <select
      value={status}
      onChange={(e) => updateFilter('status', e.target.value)}
    >
      <option value="all">All</option>
      <option value="PENDING">Pending</option>
      <option value="PROCESSING">Processing</option>
      <option value="COMPLETED">Completed</option>
      <option value="FAILED">Failed</option>
    </select>
  );
}
```

---

## State Flow Diagrams

### Upload Flow

```
User drops file → FileDropzone
                    ↓
              File validated
                    ↓
         Upload mutation (React Query)
                    ↓
           Progress updates (state)
                    ↓
    Success → Redirect to /audiobook/:id
    Error   → Show error toast
```

### Audio Playback Flow

```
User clicks play → usePlayerStore.play()
                          ↓
               Audio component mounts
                          ↓
            Load audio chunks from API
                          ↓
           Play chunk → updateTime → save position
                          ↓
              Chunk ends → nextChunk
                          ↓
           Update book progress on server
```

### Real-time Progress Updates

```
BookProcessing component mounts
            ↓
    useBookProgress hook subscribes
            ↓
   Poll GET /api/books/:id/progress
            ↓
   Status === PROCESSING ? continue polling
   Status === COMPLETED ? stop polling, show player
   Status === FAILED ? stop polling, show error
```

---

## Best Practices

### 1. Use React Query for Server State

```tsx
// ✅ Good
const { data: books } = useQuery({
  queryKey: ['books'],
  queryFn: () => api.getBooks(),
});

// ❌ Bad - Don't use useState for server data
const [books, setBooks] = useState([]);
useEffect(() => {
  api.getBooks().then(setBooks);
}, []);
```

### 2. Use Zustand for Client State

```tsx
// ✅ Good - Zustand for UI state
const { volume, setVolume } = usePlayerStore();

// ❌ Bad - Prop drilling
<Player volume={volume} onVolumeChange={setVolume} />
```

### 3. Keep State Close to Where It's Used

```tsx
// ✅ Good - State near component
function AudioPlayer({ bookId }) {
  const [isPlaying, setIsPlaying] = useState(false);
  // ...
}

// ❌ Bad - Lifting state unnecessarily
function LibraryPage() {
  const [isPlaying, setIsPlaying] = useState(false); // No need here
  return <AudioPlayer isPlaying={isPlaying} />;
}
```

### 4. Persist Important State

```tsx
// Persist player settings across sessions
const usePlayerStore = create(
  persist(
    (set) => ({
      volume: 1,
      playbackRate: 1,
      // ...
    }),
    { name: 'player-settings' }
  )
);
```