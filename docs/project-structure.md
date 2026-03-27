# Project Structure

> Recommended directory structure for AudioForge Frontend

---

## Directory Overview

```
audioforge-frontend/
├── .env.local                  # Local environment variables
├── .env.example               # Example environment config
├── .eslintrc.json            # ESLint configuration
├── .prettierrc               # Prettier configuration
├── .gitignore
├── next.config.js            # Next.js configuration
├── package.json
├── pnpm-lock.yaml
├── tailwind.config.ts        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
├── components.json           # shadcn/ui configuration
│
├── public/                   # Static assets
│   ├── favicon.ico
│   └── images/
│       ├── logo.svg
│       └── placeholder.png
│
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page (/)
│   │   ├── globals.css      # Global styles + design system
│   │   │
│   │   ├── upload/          # Upload flow pages
│   │   │   └── page.tsx    # /upload
│   │   │
│   │   ├── library/         # Library pages
│   │   │   └── page.tsx    # /library
│   │   │
│   │   └── audiobook/       # Audiobook detail pages
│   │       └── [id]/
│   │           └── page.tsx  # /audiobook/:id
│   │
│   ├── api/                    # API Services (outside lib!)
│   │   ├── client.ts           # Axios instance
│   │   ├── types.ts            # TypeScript types
│   │   ├── query-keys.ts       # React Query keys
│   │   ├── errors.ts           # Error handling
│   │   │
│   │   ├── books/              # Books domain
│   │   │   └── books.service.ts
│   │   │
│   │   ├── files/              # Files domain
│   │   │   └── files.service.ts
│   │   │
│   │   └── audio/              # Audio domain
│   │       └── audio.service.ts
│   │
│   ├── hooks/                  # React Query Hooks (outside lib!)
│   │   ├── use-books.ts        # Queries/mutations for books
│   │   ├── use-upload.ts       # Upload mutation
│   │   └── use-audio-player.ts  # Audio player queries
│   │
│   ├── stores/                 # Zustand stores (outside lib!)
│   │   ├── player-store.ts     # Audio player state
│   │   └── ui-store.ts         # UI state
│   │
│   ├── components/             # React components
│   │   ├── ui/                # shadcn/ui primitives
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── progress.tsx
│   │   │   └── ...
│   │   │
│   │   ├── features/          # Feature-specific components
│   │   │   ├── upload/
│   │   │   │   ├── file-dropzone.tsx
│   │   │   │   ├── upload-progress.tsx
│   │   │   │   └── upload-success.tsx
│   │   │   │
│   │   │   ├── library/
│   │   │   │   ├── book-card.tsx
│   │   │   │   ├── book-grid.tsx
│   │   │   │   ├── book-list.tsx
│   │   │   │   └── status-badge.tsx
│   │   │   │
│   │   │   ├── player/
│   │   │   │   ├── audio-player.tsx
│   │   │   │   ├── player-controls.tsx
│   │   │   │   ├── progress-bar.tsx
│   │   │   │   └── volume-control.tsx
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── sidebar.tsx
│   │   │   │   ├── header.tsx
│   │   │   │   └── theme-toggle.tsx
│   │   │   │
│   │   │   └── common/
│   │   │       ├── loading-skeleton.tsx
│   │   │       ├── error-boundary.tsx
│   │   │       └── empty-state.tsx
│   │   │
│   │   └── layouts/           # Layout components
│   │       ├── main-layout.tsx
│   │       ├── header.tsx
│   │       ├── sidebar.tsx
│   │       └── footer.tsx
│   │
│   ├── styles/                # Design system
│   │   ├── globals.css        # CSS variables + base styles
│   │   └── README.md          # Design system documentation
│   │
│   ├── lib/                   # Utilities only
│   │   ├── utils/            # Utility functions
│   │   │   ├── format.ts
│   │   │   ├── validation.ts
│   │   │   └── constants.ts
│   │   │
│   │   └── providers/        # React context providers
│   │       ├── query-provider.tsx
│   │       └── theme-provider.tsx
│   │
│   └── types/                 # Global TypeScript types
│       ├── book.ts
│       ├── upload.ts
│       └── audio.ts
│
└── tests/                     # Test files
    ├── unit/
    │   ├── components/
    │   ├── hooks/
    │   └── api/
    │
    └── e2e/
        ├── upload.spec.ts
        ├── library.spec.ts
        └── player.spec.ts
```

---

## Key Files Explained

### `src/app/layout.tsx`

Root layout wraps all pages with providers:

```tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { QueryProvider } from '@/lib/providers/query-provider';
import { Toaster } from '@/components/ui/toaster';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AudioForge',
  description: 'Convert your eBooks into audiobooks',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
```

### `src/api/client.ts`

Axios instance with interceptors:

```tsx
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

### `src/api/books/books.service.ts`

Domain service pattern:

```tsx
import { apiClient } from '../client';
import type { Book, CreateBookDto, UpdateBookDto } from '../types';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '../types';

export const booksService = {
  list: async (params?: PaginationParams): Promise<PaginatedResponse<Book>> => {
    const response = await apiClient.get<PaginatedResponse<Book>>('/books', { params });
    return response.data;
  },

  get: async (id: string): Promise<Book> => {
    const response = await apiClient.get<ApiResponse<Book>>(`/books/${id}`);
    return response.data.data;
  },

  create: async (data: CreateBookDto): Promise<Book> => {
    const response = await apiClient.post<ApiResponse<Book>>('/books', data);
    return response.data.data;
  },

  update: async (id: string, data: UpdateBookDto): Promise<Book> => {
    const response = await apiClient.patch<ApiResponse<Book>>(`/books/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/books/${id}`);
  },

  getProgress: async (id: string): Promise<BookProgress> => {
    const response = await apiClient.get<ApiResponse<BookProgress>>(`/books/${id}/progress`);
    return response.data.data;
  },
};
```

### `src/hooks/use-books.ts`

React Query hooks using services:

```tsx
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

export const useCreateBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBookDto) => booksService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.books.all() });
    },
  });
};
```

### `src/lib/providers/query-provider.tsx`

React Query provider setup:

```tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

### `src/app/page.tsx`

Home page redirects to library or upload:

```tsx
import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to library by default
  redirect('/library');
}
```

---

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `BookCard.tsx` |
| Hooks | camelCase with `use` prefix | `useBookProgress.ts` |
| Utilities | camelCase | `formatDuration.ts` |
| Types | PascalCase | `Book`, `AudioStatus` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_FILE_SIZE` |
| CSS classes | Tailwind classes | `className="bg-primary text-white"` |

---

## Import Aliases

Configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/types/*"]
    }
  }
}
```

Usage:

```tsx
// API Services
import { booksService } from '@/api/books/books.service';
import { filesService } from '@/api/files/files.service';
import { audioService } from '@/api/audio/audio.service';

// React Query Hooks
import { useBooks, useCreateBook } from '@/hooks/use-books';
import { useUpload } from '@/hooks/use-upload';
import { useAudioStatus } from '@/hooks/use-audio-player';

// Components
import { Button } from '@/components/ui/button';
import { BookCard } from '@/components/features/library/book-card';

// Types
import type { Book, CreateBookDto } from '@/api/types';
```

---

## shadcn/ui Setup

After initializing shadcn, add components:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add progress
npx shadcn@latest add toast
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add skeleton
npx shadcn@latest add badge
npx shadcn@latest add tabs
npx shadcn@latest add alert
```

---

## Next.js Configuration

`next.config.js`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',
  
  // Experimental features
  experimental: {
    // Enable typed routes
    typedRoutes: true,
  },
  
  // Environment variables exposed to browser
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  
  // Images from external domains
  images: {
    domains: ['storage.your-domain.com'],
  },
};

module.exports = nextConfig;
```