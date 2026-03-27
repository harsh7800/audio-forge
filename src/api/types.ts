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
  mode: "audiobook" | "summary";
  userId: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export type ProcessStatus =
  | "PENDING"
  | "QUEUED"
  | "EXTRACTING"
  | "CHUNKING"
  | "GENERATING_AUDIO"
  | "STREAM_READY"
  | "COMPLETED"
  | "FAILED";

export interface BookProgress {
  bookId: string;
  processStatus: ProcessStatus;
  progress: number;
  queueJobId: string | null;
  jobState: "waiting" | "active" | "completed" | "failed" | "delayed" | null;
  queuePosition: number | null;
  errorMessage: string | null;
}

export interface CreateBookDto {
  title: string;
  mode: "audiobook" | "summary";
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
