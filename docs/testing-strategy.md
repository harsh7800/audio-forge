# Testing Strategy

> Unit tests, integration tests, and E2E tests for AudioForge Frontend

---

## Testing Stack

| Type | Tool | Purpose |
|------|------|---------|
| Unit Tests | Vitest + Testing Library | Test individual components and hooks |
| Integration Tests | Vitest + MSW | Test API integration |
| E2E Tests | Playwright | Test full user flows |
| Coverage | Vitest | Track test coverage |

---

## Setup

### Install Dependencies

```bash
pnpm add -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event @playwright/test msw
```

### Vitest Configuration

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'tests/'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### Test Setup

```ts
// tests/setup.ts
import '@testing-library/jest-dom';
import { server } from './mocks/server';

// Establish API mocking before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reset any request handlers that are declared during the tests
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished
afterAll(() => server.close());
```

### Package.json Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

---

## Unit Tests

### Component Tests

**`tests/unit/components/features/library/book-card.test.tsx`**

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BookCard } from '@/components/features/library/book-card';
import type { Book } from '@/lib/api/types';

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const mockBook: Book = {
  id: 'test-id',
  title: 'Test Book Title',
  author: 'Test Author',
  description: 'A test book for testing',
  processStatus: 'COMPLETED',
  progress: 100,
  originalStorageKey: null,
  originalFilename: 'test.pdf',
  originalFileSize: 1024,
  originalFileType: 'application/pdf',
  finalAudioKey: null,
  playlistKey: null,
  queueJobId: null,
  errorMessage: null,
  startedAt: '2024-01-01T00:00:00Z',
  completedAt: '2024-01-01T01:00:00Z',
  playbackPositionMs: 0,
  lastPlayedAt: null,
  language: 'en',
  voiceId: null,
  voiceProvider: null,
  mode: 'audiobook',
  userId: null,
  metadata: {},
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T01:00:00Z',
};

describe('BookCard', () => {
  it('renders book title and author', () => {
    render(<BookCard book={mockBook} />);
    
    expect(screen.getByText('Test Book Title')).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();
  });

  it('displays completed status badge', () => {
    render(<BookCard book={mockBook} />);
    
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('displays progress percentage for processing books', () => {
    const processingBook = { ...mockBook, processStatus: 'GENERATING_AUDIO' as const, progress: 75 };
    render(<BookCard book={processingBook} />);
    
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', async () => {
    const onDelete = vi.fn();
    render(<BookCard book={mockBook} onDelete={onDelete} />);
    
    // Open dropdown menu
    const menuButton = screen.getByRole('button', { name: /more/i });
    fireEvent.click(menuButton);
    
    // Click delete
    const deleteButton = screen.getByText(/delete/i);
    fireEvent.click(deleteButton);
    
    expect(onDelete).toHaveBeenCalledWith('test-id');
  });

  it('links to audiobook detail page', () => {
    render(<BookCard book={mockBook} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/audiobook/test-id');
  });
});
```

### Hook Tests

**`tests/unit/hooks/use-books.test.ts`**

```tsx
import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useBook, useBooks, useBookProgress } from '@/lib/hooks/use-books';
import { booksApi } from '@/lib/api/endpoints';

// Mock API
vi.mock('@/lib/api/endpoints', () => ({
  booksApi: {
    list: vi.fn(),
    get: vi.fn(),
    getProgress: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useBooks', () => {
  it('fetches list of books', async () => {
    const mockBooks = [{ id: '1', title: 'Book 1' }, { id: '2', title: 'Book 2' }];
    vi.mocked(booksApi.list).mockResolvedValue({
      data: mockBooks,
      meta: { total: 2, limit: 20, offset: 0, hasNext: false },
    });

    const { result } = renderHook(() => useBooks(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    
    expect(result.current.data?.data).toHaveLength(2);
    expect(booksApi.list).toHaveBeenCalled();
  });
});

describe('useBook', () => {
  it('fetches single book', async () => {
    const mockBook = { id: '1', title: 'Test Book' };
    vi.mocked(booksApi.get).mockResolvedValue(mockBook);

    const { result } = renderHook(() => useBook('1'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    
    expect(result.current.data).toEqual(mockBook);
    expect(booksApi.get).toHaveBeenCalledWith('1');
  });

  it('does not fetch when id is empty', () => {
    const { result } = renderHook(() => useBook(''), { wrapper: createWrapper() });

    expect(result.current.isFetching).toBe(false);
    expect(booksApi.get).not.toHaveBeenCalled();
  });
});

describe('useBookProgress', () => {
  it('polls while processing', async () => {
    const processingProgress = { bookId: '1', processStatus: 'GENERATING_AUDIO', progress: 50 };
    const completedProgress = { bookId: '1', processStatus: 'COMPLETED', progress: 100 };
    
    vi.mocked(booksApi.getProgress)
      .mockResolvedValueOnce(processingProgress)
      .mockResolvedValueOnce(completedProgress);

    const { result } = renderHook(() => useBookProgress('1'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.processStatus).toBe('GENERATING_AUDIO');
  });
});
```

---

## API Mocking with MSW

**`tests/mocks/server.ts`**

```tsx
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

**`tests/mocks/handlers.ts`**

```tsx
import { http, HttpResponse, delay } from 'msw';
import type { Book } from '@/lib/api/types';

const books: Book[] = [
  {
    id: 'book-1',
    title: 'Test Book 1',
    author: 'Author 1',
    processStatus: 'COMPLETED',
    progress: 100,
    language: 'en',
    mode: 'audiobook',
    playbackPositionMs: 0,
    metadata: {},
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T01:00:00Z',
  },
];

export const handlers = [
  // GET /api/books
  http.get('*/api/books', async () => {
    await delay(100);
    return HttpResponse.json({
      data: books,
      meta: { total: books.length, limit: 20, offset: 0, hasNext: false },
    });
  }),

  // GET /api/books/:id
  http.get('*/api/books/:id', async ({ params }) => {
    await delay(100);
    const book = books.find((b) => b.id === params.id);
    if (!book) {
      return HttpResponse.json(
        { error: { code: 'BOOK_NOT_FOUND', message: 'Book not found' } },
        { status: 200 }
      );
    }
    return HttpResponse.json({ data: book });
  }),

  // POST /api/books
  http.post('*/api/books', async ({ request }) => {
    await delay(100);
    const body = await request.json();
    const newBook = {
      id: `book-${Date.now()}`,
      ...body,
      processStatus: 'PENDING',
      progress: 0,
      language: 'en',
      mode: 'audiobook',
      playbackPositionMs: 0,
      metadata: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    books.push(newBook);
    return HttpResponse.json({ data: newBook }, { status: 201 });
  }),

  // POST /api/files/upload
  http.post('*/api/files/upload', async () => {
    await delay(100);
    return HttpResponse.json({
      data: {
        uploadUrl: 'https://storage.example.com/upload/presigned-url',
        fileKey: 'uploads/test-file.pdf',
        expiresIn: 3600,
      },
    });
  }),

  // POST /api/files/confirm
  http.post('*/api/files/confirm', async () => {
    await delay(100);
    return HttpResponse.json({
      data: {
        id: 'book-new',
        title: 'Uploaded Book',
        processStatus: 'QUEUED',
        progress: 0,
        queueJobId: 'job-123',
      },
    });
  }),
];
```

---

## E2E Tests (Playwright)

### Playwright Configuration

```ts
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
    {
      name: 'firefox',
      use: { browserName: 'firefox' },
    },
    {
      name: 'webkit',
      use: { browserName: 'webkit' },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### E2E Test: Upload Flow

**`tests/e2e/upload.spec.ts`**

```tsx
import { test, expect } from '@playwright/test';

test.describe('Upload Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should upload a PDF file', async ({ page }) => {
    // Navigate to upload page
    await page.goto('/upload');

    // Upload file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test-book.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('test pdf content'),
    });

    // Wait for upload to complete
    await expect(page.getByText('Upload Complete')).toBeVisible({ timeout: 10000 });

    // Verify book was created
    await expect(page.getByText('test-book')).toBeVisible();
  });

  test('should show upload progress', async ({ page }) => {
    await page.goto('/upload');

    // Upload larger file to see progress
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'large-book.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.alloc(1024 * 1024), // 1MB
    });

    // Check progress indicator
    const progressBar = page.locator('[role="progressbar"]');
    await expect(progressBar).toBeVisible();
  });

  test('should reject unsupported file types', async ({ page }) => {
    await page.goto('/upload');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test-image.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('test image'),
    });

    // Check for error message
    await expect(page.getByText(/unsupported file type/i)).toBeVisible();
  });

  test('should navigate to library after upload', async ({ page }) => {
    await page.goto('/upload');

    // Upload file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test-book.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('test'),
    });

    // Wait for success and click view progress
    await page.getByText('View Progress').click();

    // Verify navigation
    await expect(page).toHaveURL(/\/audiobook\/.+/);
  });
});
```

### E2E Test: Library

**`tests/e2e/library.spec.ts`**

```tsx
import { test, expect } from '@playwright/test';

test.describe('Library Page', () => {
  test('should display list of books', async ({ page }) => {
    await page.goto('/library');

    // Wait for books to load
    await expect(page.locator('[data-testid="book-card"]').first()).toBeVisible();
  });

  test('should filter books by status', async ({ page }) => {
    await page.goto('/library');

    // Click filter dropdown
    await page.getByLabel('Status').click();
    await page.getByText('Completed').click();

    // Verify URL updated
    await expect(page).toHaveURL(/status=COMPLETED/);
  });

  test('should navigate to book detail', async ({ page }) => {
    await page.goto('/library');

    // Click first book
    const firstBook = page.locator('[data-testid="book-card"]').first();
    await firstBook.click();

    // Verify navigation
    await expect(page).toHaveURL(/\/audiobook\/.+/);
  });

  test('should delete a book', async ({ page }) => {
    await page.goto('/library');

    // Open dropdown menu
    const bookCard = page.locator('[data-testid="book-card"]').first();
    await bookCard.getByRole('button', { name: /more/i }).click();

    // Click delete
    await page.getByText(/delete/i).click();

    // Confirm deletion
    await page.getByText(/confirm/i).click();

    // Verify book is removed
    await expect(bookCard).not.toBeVisible();
  });
});
```

### E2E Test: Audio Player

**`tests/e2e/player.spec.ts`**

```tsx
import { test, expect } from '@playwright/test';

test.describe('Audio Player', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a completed book
    await page.goto('/audiobook/book-1');
  });

  test('should play audio', async ({ page }) => {
    // Click play button
    await page.getByRole('button', { name: /play/i }).click();

    // Verify audio is playing
    await expect(page.getByRole('button', { name: /pause/i })).toBeVisible();
  });

  test('should change playback speed', async ({ page }) => {
    await page.goto('/audiobook/book-1');

    // Default is 1x
    await expect(page.getByText('1x')).toBeVisible();

    // Click to change speed
    await page.getByText('1x').click();

    // Should cycle through speeds
    await expect(page.getByText('1.25x')).toBeVisible();
  });

  test('should seek within audio', async ({ page }) => {
    await page.goto('/audiobook/book-1');

    // Get progress bar
    const progressBar = page.locator('[role="slider"]');

    // Click at 50% position
    await progressBar.click({ position: { x: 100, y: 0 } });

    // Verify time updated
    await expect(page.getByText(/\d+:\d+/)).toBeVisible();
  });

  test('should change chapters', async ({ page }) => {
    await page.goto('/audiobook/book-1');

    // Click chapter 2
    await page.getByRole('button', { name: /chapter 2/i }).click();

    // Verify chapter changed
    await expect(page.getByRole('button', { name: /chapter 2/i })).toHaveAttribute('aria-pressed', 'true');
  });
});
```

---

## Test Coverage Goals

| Category | Target | Notes |
|----------|--------|-------|
| Components | 80% | All UI components |
| Hooks | 90% | API hooks and custom hooks |
| Utils | 95% | Pure functions |
| E2E | Key flows | Upload, process, play |

---

## Running Tests

```bash
# Run all unit tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage

# Run E2E tests
pnpm test:e2e

# Run E2E tests with UI
pnpm test:e2e:ui
```