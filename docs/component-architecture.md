# Component Architecture

> UI components and patterns for AudioForge Frontend

---

## Component Categories

### 1. UI Primitives (`components/ui/`)

Base components from shadcn/ui - do not modify directly.

```tsx
// Usage
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

// Available primitives
- Button, IconButton
- Card, CardHeader, CardContent, CardFooter
- Input, Textarea
- Progress
- Dialog, AlertDialog
- DropdownMenu
- Toast, Toaster
- Skeleton
- Badge
- Tabs
- Alert
- Tooltip
```

---

### 2. Feature Components (`components/features/`)

Domain-specific components grouped by feature.

#### Upload Components

**`components/features/upload/file-dropzone.tsx`**

```tsx
'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  className?: string;
}

export function FileDropzone({
  onFileSelect,
  accept = {
    'application/pdf': ['.pdf'],
    'application/epub+zip': ['.epub'],
    'text/plain': ['.txt'],
  },
  maxSize = 50 * 1024 * 1024, // 50MB
  className,
}: FileDropzoneProps) {
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop: (files) => {
      if (files[0]) {
        onFileSelect(files[0]);
      }
    },
    accept,
    maxSize,
    multiple: false,
  });

  return (
    <Card
      {...getRootProps()}
      className={cn(
        'border-dashed cursor-pointer transition-colors',
        isDragActive && 'border-primary bg-primary/5',
        isDragReject && 'border-destructive bg-destructive/5',
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center py-12">
        <Upload className="h-12 w-12 text-muted-foreground mb-4" />
        {isDragActive ? (
          <p className="text-lg font-medium">Drop your file here...</p>
        ) : (
          <>
            <p className="text-lg font-medium">Drag & drop your file here</p>
            <p className="text-sm text-muted-foreground mt-2">
              or click to browse
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              Supports: PDF, ePub, TXT (max 50MB)
            </p>
          </>
        )}
      </div>
    </Card>
  );
}
```

**`components/features/upload/upload-progress.tsx`**

```tsx
'use client';

import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

interface UploadProgressProps {
  progress: number;
  filename: string;
  onCancel?: () => void;
}

export function UploadProgress({ progress, filename, onCancel }: UploadProgressProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <div className="flex-1">
          <p className="font-medium">Uploading {filename}</p>
          <p className="text-sm text-muted-foreground">
            {Math.round(progress)}% complete
          </p>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
        )}
      </div>
      <Progress value={progress} />
    </div>
  );
}
```

**`components/features/upload/upload-success.tsx`**

```tsx
'use client';

import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Book } from '@/lib/api/types';

interface UploadSuccessProps {
  book: Book;
  onViewBook: () => void;
  onUploadAnother: () => void;
}

export function UploadSuccess({ book, onViewBook, onUploadAnother }: UploadSuccessProps) {
  return (
    <Card className="p-6">
      <div className="flex flex-col items-center text-center">
        <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Upload Complete!</h2>
        <p className="text-muted-foreground mb-6">
          "{book.title}" has been queued for processing.
        </p>
        <div className="flex gap-4">
          <Button onClick={onViewBook}>View Progress</Button>
          <Button variant="outline" onClick={onUploadAnother}>
            Upload Another
          </Button>
        </div>
      </div>
    </Card>
  );
}
```

---

#### Library Components

**`components/features/library/book-card.tsx`**

```tsx
'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreVertical, Play, Trash2 } from 'lucide-react';
import type { Book, ProcessStatus } from '@/lib/api/types';

interface BookCardProps {
  book: Book;
  onDelete?: (id: string) => void;
}

const statusColors: Record<ProcessStatus, string> = {
  PENDING: 'bg-gray-500',
  QUEUED: 'bg-blue-500',
  EXTRACTING: 'bg-yellow-500',
  CHUNKING: 'bg-yellow-500',
  GENERATING_AUDIO: 'bg-orange-500',
  STREAM_READY: 'bg-green-500',
  COMPLETED: 'bg-green-500',
  FAILED: 'bg-red-500',
};

export function BookCard({ book, onDelete }: BookCardProps) {
  return (
    <Card className="group relative overflow-hidden">
      <Link href={`/audiobook/${book.id}`}>
        <div className="aspect-[3/4] bg-muted flex items-center justify-center">
          {/* Placeholder for book cover */}
          <span className="text-4xl">📚</span>
        </div>
        <div className="p-4">
          <h3 className="font-semibold truncate">{book.title}</h3>
          {book.author && (
            <p className="text-sm text-muted-foreground truncate">
              {book.author}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <Badge className={statusColors[book.processStatus]}>
              {book.processStatus}
            </Badge>
            {book.progress > 0 && book.progress < 100 && (
              <span className="text-xs text-muted-foreground">
                {book.progress}%
              </span>
            )}
          </div>
        </div>
      </Link>
      
      {/* Actions */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {book.processStatus === 'COMPLETED' && (
              <DropdownMenuItem asChild>
                <Link href={`/audiobook/${book.id}`}>
                  <Play className="mr-2 h-4 w-4" />
                  Play
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => onDelete?.(book.id)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}
```

**`components/features/library/status-badge.tsx`**

```tsx
import { Badge } from '@/components/ui/badge';
import type { ProcessStatus } from '@/lib/api/types';

interface StatusBadgeProps {
  status: ProcessStatus;
}

const statusConfig: Record<ProcessStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  PENDING: { label: 'Pending', variant: 'secondary' },
  QUEUED: { label: 'Queued', variant: 'secondary' },
  EXTRACTING: { label: 'Extracting', variant: 'default' },
  CHUNKING: { label: 'Chunking', variant: 'default' },
  GENERATING_AUDIO: { label: 'Processing', variant: 'default' },
  STREAM_READY: { label: 'Ready', variant: 'default' },
  COMPLETED: { label: 'Completed', variant: 'default' },
  FAILED: { label: 'Failed', variant: 'destructive' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
```

---

#### Player Components

**`components/features/player/audio-player.tsx`**

```tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { useAudioPlayer } from '@/lib/hooks/use-audio-player';

interface AudioPlayerProps {
  bookId: string;
  chunks: Array<{ index: number; url: string; duration: number }>;
}

export function AudioPlayer({ bookId, chunks }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  const currentChunk = chunks[currentChunkIndex];
  const totalDuration = chunks.reduce((sum, c) => sum + c.duration, 0);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleChunkEnd = () => {
    if (currentChunkIndex < chunks.length - 1) {
      setCurrentChunkIndex(currentChunkIndex + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
    }
  };

  const handleSpeedChange = () => {
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackRate);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    setPlaybackRate(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  return (
    <div className="space-y-4">
      <audio
        ref={audioRef}
        src={currentChunk.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleChunkEnd}
      />

      {/* Progress */}
      <div className="space-y-2">
        <Progress
          value={(currentTime / currentChunk.duration) * 100}
          className="h-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(currentChunk.duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentChunkIndex(Math.max(0, currentChunkIndex - 1))}
          disabled={currentChunkIndex === 0}
        >
          <SkipBack className="h-5 w-5" />
        </Button>

        <Button size="lg" onClick={handlePlayPause}>
          {isPlaying ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentChunkIndex(Math.min(chunks.length - 1, currentChunkIndex + 1))}
          disabled={currentChunkIndex === chunks.length - 1}
        >
          <SkipForward className="h-5 w-5" />
        </Button>

        <Button variant="ghost" size="sm" onClick={handleSpeedChange}>
          {playbackRate}x
        </Button>
      </div>

      {/* Chapter selection */}
      <div className="flex flex-wrap gap-2">
        {chunks.map((chunk, index) => (
          <Button
            key={chunk.index}
            variant={currentChunkIndex === index ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCurrentChunkIndex(index)}
          >
            Chapter {index + 1}
          </Button>
        ))}
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
```

---

### 3. Layout Components (`components/layouts/`)

**`components/layouts/main-layout.tsx`**

```tsx
import { ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpen, Upload, Settings } from 'lucide-react';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            <span className="font-bold text-xl">AudioForge</span>
          </Link>
          
          <nav className="flex items-center gap-4">
            <Link href="/library">
              <Button variant="ghost">Library</Button>
            </Link>
            <Link href="/upload">
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t py-4">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} AudioForge
        </div>
      </footer>
    </div>
  );
}
```

---

## Component Testing

**`tests/unit/components/features/library/book-card.test.tsx`**

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BookCard } from '@/components/features/library/book-card';
import type { Book } from '@/lib/api/types';

const mockBook: Book = {
  id: 'test-id',
  title: 'Test Book',
  author: 'Test Author',
  processStatus: 'COMPLETED',
  progress: 100,
  language: 'en',
  mode: 'audiobook',
  playbackPositionMs: 0,
  metadata: {},
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
} as Book;

describe('BookCard', () => {
  it('renders book title and author', () => {
    render(<BookCard book={mockBook} />);
    expect(screen.getByText('Test Book')).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();
  });

  it('displays completed status badge', () => {
    render(<BookCard book={mockBook} />);
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('calls onDelete when delete is clicked', async () => {
    const onDelete = vi.fn();
    render(<BookCard book={mockBook} onDelete={onDelete} />);
    // ... test delete action
  });
});
```

---

## Styling Guidelines

### Use Tailwind utility classes

```tsx
// Good
<div className="flex items-center gap-4 p-4 bg-card rounded-lg border">

// Avoid inline styles
<div style={{ display: 'flex', gap: '1rem' }}> // ❌
```

### Use `cn()` for conditional classes

```tsx
import { cn } from '@/lib/utils';

<div className={cn(
  'base-classes',
  isActive && 'active-classes',
  isDisabled && 'disabled-classes'
)}>
```

### Color palette via CSS variables

```css
/* globals.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --secondary: 210 40% 96.1%;
  /* ... */
}
```