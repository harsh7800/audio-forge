# Quick Start Guide

> Get AudioForge Frontend running in 5 minutes

---

## Step 1: Create Project

```bash
npx create-next-app@latest audioforge-frontend --typescript --tailwind --eslint --app --src-dir
cd audioforge-frontend
```

## Step 2: Install Dependencies

```bash
pnpm add @tanstack/react-query axios zustand clsx tailwind-merge lucide-react sonner
pnpm add -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom playwright msw
npx shadcn@latest init
```

## Step 3: Copy Docs Folder

Copy the `frontend-docs` folder into your project:

```bash
cp -r frontend-docs ./docs
```

## Step 4: Create Environment File

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Step 5: Set Up API Client

Create `src/api/client.ts`:

```typescript
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
});
```

Create `src/api/types.ts` with your types.

Create `src/api/books/books.service.ts`:

```typescript
import { apiClient } from '../client';
import type { Book, ApiResponse } from '../types';

export const booksService = {
  list: async () => {
    const response = await apiClient.get<ApiResponse<Book[]>>('/books');
    return response.data.data;
  },
  
  get: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Book>>(`/books/${id}`);
    return response.data.data;
  },
};
```

## Step 6: Create First Hook

Create `src/hooks/use-books.ts`:

```typescript
import { useQuery } from '@tanstack/react-query';
import { booksService } from '@/api/books/books.service';

export const useBooks = () => {
  return useQuery({
    queryKey: ['books'],
    queryFn: () => booksService.list(),
  });
};

export const useBook = (id: string) => {
  return useQuery({
    queryKey: ['book', id],
    queryFn: () => booksService.get(id),
    enabled: !!id,
  });
};
```

## Step 7: Create First Page

Create `src/app/upload/page.tsx`:

```tsx
'use client';

import { useUpload } from '@/hooks/use-upload';
import { FileDropzone } from '@/components/features/upload/file-dropzone';

export default function UploadPage() {
  const { mutate: upload, progress, isPending } = useUpload();

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Upload eBook</h1>
      <FileDropzone onFileSelect={(file) => upload({ file })} />
      {isPending && <div>Uploading: {progress}%</div>}
    </div>
  );
}
```

## Step 7: Run Development Server

```bash
pnpm dev
```

Open http://localhost:3000/upload

---

## Key API Endpoints

| Purpose | Method | Endpoint |
|---------|--------|----------|
| List books | GET | `/api/books` |
| Create book | POST | `/api/books` |
| Get book | GET | `/api/books/:id` |
| Get progress | GET | `/api/books/:id/progress` |
| Upload file | POST | `/api/files/confirm` |
| Get audio | GET | `/api/audio/:bookId` |

---

## Common Hooks

```tsx
// Fetch all books
const { data: books } = useBooks({ limit: 20 });

// Fetch single book
const { data: book } = useBook(id);

// Track processing progress
const { data: progress } = useBookProgress(id);

// Upload file
const { mutate: upload, progress } = useUpload();
```

---

## Project Structure

```
src/
├── app/                    # Next.js pages
│   ├── upload/
│   ├── library/
│   └── audiobook/[id]/
├── api/                    # API services (outside lib!)
│   ├── client.ts          # Axios instance
│   ├── types.ts           # TypeScript types
│   ├── query-keys.ts      # React Query keys
│   ├── books/
│   │   └── books.service.ts
│   ├── files/
│   │   └── files.service.ts
│   └── audio/
│       └── audio.service.ts
├── hooks/                  # React Query hooks (outside lib!)
│   ├── use-books.ts
│   ├── use-upload.ts
│   └── use-audio-player.ts
├── components/             # React components
│   ├── ui/                # shadcn/ui
│   ├── features/          # Feature components
│   └── layouts/           # Layout components
└── stores/                 # Zustand stores
    ├── player-store.ts
    └── ui-store.ts
```

---

## Useful Commands

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start development server |
| `pnpm build` | Create production build |
| `pnpm test` | Run unit tests |
| `pnpm test:e2e` | Run E2E tests |
| `pnpm lint` | Check code quality |

---

## Next Steps

1. Follow [implementation-plan.md](./implementation-plan.md) for detailed phases
2. Implement [api-integration.md](./api-integration.md) for backend communication
3. Build [component-architecture.md](./component-architecture.md) components
4. Add [state-management.md](./state-management.md) for data flow
5. Write tests per [testing-strategy.md](./testing-strategy.md)

---

## Need Help?

- Check [project-structure.md](./project-structure.md) for directory layout
- Read [environment-setup.md](./environment-setup.md) for configuration
- Refer to [api-integration.md](./api-integration.md) for API usage