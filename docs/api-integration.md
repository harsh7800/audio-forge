# API Integration Guide

> Backend API Documentation for Frontend Integration  
> Base URL: `http://localhost:3080/api`

---

## Authentication

**Note**: No authentication for MVP. All endpoints are public.

Future: Add JWT or session-based auth.

---

## API Client Setup

### `src/api/client.ts`

```typescript
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use((config) => {
  // Add auth token here when implemented
  return config;
});

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response?.status === 404) {
      console.error('Resource not found');
    } else if (error.response?.status === 500) {
      console.error('Server error');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### `src/api/types.ts`

```typescript
// Book types
export interface Book {
  id: string;
  title: string;
  author: string | null;
  description: string | null;
  processStatus: ProcessStatus;
  progress: number;
  originalStorageKey: string | null;
  originalFilename: string | null;
  originalFileSize: number | null;
  originalFileType: string | null;
  finalAudioKey: string | null;
  playlistKey: string | null;
  queueJobId: string | null;
  errorMessage: string | null;
  startedAt: string | null;
  completedAt: string | null;
  playbackPositionMs: number;
  lastPlayedAt: string | null;
  language: string;
  voiceId: string | null;
  voiceProvider: string | null;
  mode: 'audiobook' | 'summary';
  userId: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export type ProcessStatus = 
  | 'PENDING'
  | 'QUEUED'
  | 'EXTRACTING'
  | 'CHUNKING'
  | 'GENERATING_AUDIO'
  | 'STREAM_READY'
  | 'COMPLETED'
  | 'FAILED';

export interface BookProgress {
  bookId: string;
  processStatus: ProcessStatus;
  progress: number;
  queueJobId: string | null;
  jobState: 'waiting' | 'active' | 'completed' | 'failed' | 'delayed' | null;
  queuePosition: number | null;
  errorMessage: string | null;
}

export interface CreateBookDto {
  title: string;
  mode: 'audiobook' | 'summary';
  language?: string;
  author?: string;
  description?: string;
}

export interface UpdateBookDto {
  title?: string;
  author?: string;
  description?: string;
  language?: string;
}

// File upload types
export interface UploadResult {
  bookId: string;
  fileId: string;
  queueJobId: string;
}

// Audio types
export interface AudioStatus {
  bookId: string;
  status: ProcessStatus;
  playlistUrl: string | null;
  audioUrl: string | null;
  chunkCount: number;
  totalDuration: number;
  chunks: ChunkStatus[];
}

export interface ChunkStatus {
  id: string;
  chunkIndex: number;
  audioDurationMs: number;
  audioUrl: string;
}

export interface PlaylistItem {
  index: number;
  url: string;
  duration: number;
}

// API response wrapper
export interface ApiResponse<T> {
  data: T;
  meta?: {
    total?: number;
    limit?: number;
    offset?: number;
    hasNext?: boolean;
  };
  error?: {
    code: string;
    message: string;
  };
}

// Pagination
export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    limit: number;
    offset: number;
    hasNext: boolean;
  };
}
```

### `src/api/query-keys.ts`

```typescript
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

### `src/api/books/books.service.ts`

```typescript
import { apiClient } from '../client';
import type { Book, BookProgress, CreateBookDto, UpdateBookDto } from '../types';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '../types';

export const booksService = {
  /** Create a new book */
  create: async (data: CreateBookDto): Promise<Book> => {
    const response = await apiClient.post<ApiResponse<Book>>('/books', data);
    return response.data.data;
  },

  /** List all books with pagination */
  list: async (params?: PaginationParams): Promise<PaginatedResponse<Book>> => {
    const response = await apiClient.get<PaginatedResponse<Book>>('/books', { params });
    return response.data;
  },

  /** Get book by ID */
  get: async (id: string): Promise<Book> => {
    const response = await apiClient.get<ApiResponse<Book>>(`/books/${id}`);
    return response.data.data;
  },

  /** Update book */
  update: async (id: string, data: UpdateBookDto): Promise<Book> => {
    const response = await apiClient.patch<ApiResponse<Book>>(`/books/${id}`, data);
    return response.data.data;
  },

  /** Delete book */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/books/${id}`);
  },

  /** Get job progress */
  getProgress: async (id: string): Promise<BookProgress> => {
    const response = await apiClient.get<ApiResponse<BookProgress>>(`/books/${id}/progress`);
    return response.data.data;
  },
};
```

### `src/api/files/files.service.ts`

```typescript
import { apiClient } from '../client';
import type { Book } from '../types';
import type { ApiResponse } from '../types';

export const filesService = {
  /**
   * Upload file and create book in one step (simplified flow)
   * POST /api/files/upload with multipart/form-data
   */
  uploadFile: async (
    file: File,
    metadata?: { title?: string; author?: string; language?: string },
    onProgress?: (progress: number) => void
  ): Promise<{ bookId: string; fileId: string; queueJobId: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    if (metadata?.title) formData.append('title', metadata.title);
    if (metadata?.author) formData.append('author', metadata.author);
    if (metadata?.language) formData.append('language', metadata.language);

    const response = await apiClient.post<ApiResponse<{
      bookId: string;
      fileId: string;
      queueJobId: string;
    }>>('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          onProgress(progress);
        }
      },
    });

    return response.data.data;
  },
};
```

### `src/api/audio/audio.service.ts`

```typescript
import { apiClient } from '../client';
import type { AudioStatus } from '../types';
import type { ApiResponse } from '../types';

export const audioService = {
  /** Get audio status */
  getStatus: async (bookId: string): Promise<AudioStatus> => {
    const response = await apiClient.get<ApiResponse<AudioStatus>>(`/audio/${bookId}`);
    return response.data.data;
  },

  /** Get playlist */
  getPlaylist: async (bookId: string, format: 'json' | 'm3u8' = 'json'): Promise<string> => {
    const response = await apiClient.get(`/audio/${bookId}/playlist`, {
      params: { format },
      responseType: 'text',
    });
    return response.data;
  },

  /** Get chunk URL */
  getChunkUrl: (bookId: string, chunkIndex: number): string => {
    return `${apiClient.defaults.baseURL}/audio/${bookId}/chunk/${chunkIndex}`;
  },

  /** Get download URL */
  getDownloadUrl: async (bookId: string): Promise<{ downloadUrl: string; triggered: boolean; message: string }> => {
    const response = await apiClient.get<ApiResponse<{ downloadUrl: string; triggered: boolean; message: string }>>(
      `/audio/${bookId}/download`
    );
    return response.data.data;
  },

  /** Trigger audio stitching manually */
  triggerStitch: async (bookId: string): Promise<{ message: string; outputPath: string; downloadUrl: string }> => {
    const response = await apiClient.post<ApiResponse<{ message: string; outputPath: string; downloadUrl: string }>>(
      `/audio/${bookId}/stitch`
    );
    return response.data.data;
  },
};
```

---

## React Query Hooks

### `src/hooks/use-books.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { booksService } from '@/api/books/books.service';
import { queryKeys } from '@/api/query-keys';
import type { CreateBookDto, UpdateBookDto, PaginationParams } from '@/api/types';

export const useBooks = (params?: PaginationParams) => {
  return useQuery({
    queryKey: queryKeys.books.list(params),
    queryFn: () => booksService.list(params),
  });
};

export const useBook = (id: string) => {
  return useQuery({
    queryKey: queryKeys.books.detail(id),
    queryFn: () => booksService.get(id),
    enabled: !!id,
  });
};

export const useBookProgress = (id: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.books.progress(id),
    queryFn: () => booksService.getProgress(id),
    enabled: !!id && enabled,
    refetchInterval: (data) => {
      // Stop polling when completed or failed
      if (data?.processStatus === 'COMPLETED' || data?.processStatus === 'FAILED') {
        return false;
      }
      return 2000; // Poll every 2 seconds
    },
  });
};

export const useCreateBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBookDto) => booksService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.books.all() });
    },
  });
};

export const useUpdateBook = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateBookDto) => booksService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.books.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.books.lists() });
    },
  });
};

export const useDeleteBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => booksService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.books.all() });
    },
  });
};
```

### `src/hooks/use-upload.ts`

```typescript
import { useMutation } from '@tanstack/react-query';
import { filesService } from '@/api/files/files.service';
import { useState } from 'react';

export const useUpload = () => {
  const [progress, setProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: async ({
      file,
      metadata,
    }: {
      file: File;
      metadata?: { title?: string; author?: string; language?: string };
    }) => {
      // Simplified: single call uploads file, creates book, and queues for processing
      // Returns { bookId, fileId, queueJobId }
      return filesService.uploadFile(file, metadata, (p) => setProgress(p));
    },
    onSuccess: () => {
      setProgress(100);
    },
    onError: () => {
      setProgress(0);
    },
  });

  return {
    ...mutation,
    progress,
    reset: () => {
      mutation.reset();
      setProgress(0);
    },
  };
};
```

### `src/hooks/use-audio-player.ts`

```typescript
import { useQuery } from '@tanstack/react-query';
import { audioService } from '@/api/audio/audio.service';
import { queryKeys } from '@/api/query-keys';

export const useAudioStatus = (bookId: string) => {
  return useQuery({
    queryKey: queryKeys.audio.status(bookId),
    queryFn: () => audioService.getStatus(bookId),
    enabled: !!bookId,
  });
};

export const usePlaylist = (bookId: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.audio.playlist(bookId),
    queryFn: () => audioService.getPlaylist(bookId),
    enabled: !!bookId && enabled,
  });
};
```

---

## Error Handling

### `src/api/errors.ts`

```typescript
import { AxiosError } from 'axios';

export interface ApiError {
  code: string;
  message: string;
  status: number;
}

export const parseApiError = (error: unknown): ApiError => {
  if (error instanceof AxiosError) {
    const response = error.response?.data;
    return {
      code: response?.error?.code || 'UNKNOWN_ERROR',
      message: response?.error?.message || error.message,
      status: error.response?.status || 500,
    };
  }

  if (error instanceof Error) {
    return {
      code: 'UNKNOWN_ERROR',
      message: error.message,
      status: 500,
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: 'An unknown error occurred',
    status: 500,
  };
};

// Error codes from backend (from new API guide)
export const ERROR_CODES = {
  NO_FILE: 'No file uploaded',
  UPLOAD_FAILED: 'Failed to upload file',
  BOOK_NOT_FOUND: 'Book does not exist',
  FILE_NOT_FOUND: 'File does not exist',
  VALIDATION_ERROR: 'Invalid request data',
  INVALID_CHUNK_INDEX: 'Chunk index out of range',
} as const;
```

---

## Usage Examples

### Upload a file

```tsx
import { useUpload } from '@/hooks/use-upload';

function UploadPage() {
  const { mutate: upload, progress, isPending } = useUpload();

  const handleFileSelect = (file: File) => {
    upload(
      { file, metadata: { title: 'My Book', author: 'John Doe', language: 'en' } },
      {
        onSuccess: (result) => {
          // result: { bookId, fileId, queueJobId }
          console.log('Uploaded book:', result.bookId);
          console.log('Queue job:', result.queueJobId);
          router.push(`/audiobook/${result.bookId}`);
        },
        onError: (error) => {
          console.error('Upload failed:', error);
        },
      }
    );
  };

  return (
    <div>
      <input type="file" onChange={(e) => handleFileSelect(e.target.files[0])} />
      {isPending && <progress value={progress} max="100" />}
    </div>
  );
}
```

### Track job progress

```tsx
import { useBookProgress } from '@/lib/hooks/use-books';

function ProcessingView({ bookId }: { bookId: string }) {
  const { data: progress, isLoading } = useBookProgress(bookId);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Status: {progress.processStatus}</h2>
      <progress value={progress.progress} max="100" />
      <p>{progress.progress}% complete</p>
      {progress.errorMessage && <p>Error: {progress.errorMessage}</p>}
    </div>
  );
}
```

### Stream audio

```tsx
import { usePlaylist } from '@/hooks/use-audio-player';
import { audioService } from '@/api/audio/audio.service';

function AudioPlayer({ bookId }: { bookId: string }) {
  const { data: playlist } = usePlaylist(bookId);

  const audioUrls = playlist?.items.map((item) => audioService.getChunkUrl(bookId, item.index));

  return (
    <audio controls>
      {audioUrls?.map((url, i) => (
        <source key={i} src={url} type="audio/mpeg" />
      ))}
    </audio>
  );
}
```

---

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3080
```

Create `.env.production`:

```env
NEXT_PUBLIC_API_URL=https://api.audioforge.com
```