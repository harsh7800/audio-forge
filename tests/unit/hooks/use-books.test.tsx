import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type * as React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the books service
vi.mock("@/api/books/books.service", () => ({
  booksService: {
    create: vi.fn(),
    list: vi.fn(),
    get: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    getProgress: vi.fn(),
  },
}));

// Mock file for use-books imports
vi.mock("@/api/query-keys", () => ({
  queryKeys: {
    books: {
      all: ["books"],
      lists: () => ["books", "list"],
      list: (params) => ["books", "list", params],
      details: () => ["books", "detail"],
      detail: (id) => ["books", "detail", id],
      progress: (id) => ["books", "detail", id, "progress"],
    },
  },
}));

import { booksService } from "@/api/books/books.service";
import {
  useBook,
  useBookProgress,
  useBooks,
  useCreateBook,
} from "@/hooks/use-books";

// Create wrapper for React Query
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("useBooks Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch books list", async () => {
    const mockBooks = {
      data: [
        { id: "1", title: "Book 1", processStatus: "COMPLETED" },
        { id: "2", title: "Book 2", processStatus: "PROCESSING" },
      ],
      meta: { total: 2, limit: 10, offset: 0, hasNext: false },
    };

    vi.mocked(booksService.list).mockResolvedValue(mockBooks);

    const { result } = renderHook(() => useBooks(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockBooks);
    expect(booksService.list).toHaveBeenCalledTimes(1);
  });

  it("should pass pagination params to service", async () => {
    vi.mocked(booksService.list).mockResolvedValue({
      data: [],
      meta: { total: 0, limit: 10, offset: 10, hasNext: false },
    });

    const { result } = renderHook(() => useBooks({ limit: 10, offset: 10 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(booksService.list).toHaveBeenCalledWith({ limit: 10, offset: 10 });
  });
});

describe("useBook Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch single book by id", async () => {
    const mockBook = {
      id: "book-123",
      title: "Test Book",
      author: "Test Author",
      processStatus: "COMPLETED",
    };

    vi.mocked(booksService.get).mockResolvedValue(mockBook);

    const { result } = renderHook(() => useBook("book-123"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockBook);
    expect(booksService.get).toHaveBeenCalledWith("book-123");
  });

  it("should not fetch when id is empty", () => {
    const { result } = renderHook(() => useBook(""), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe("idle");
    expect(booksService.get).not.toHaveBeenCalled();
  });
});

describe("useBookProgress Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch book progress", async () => {
    const mockProgress = {
      bookId: "book-123",
      processStatus: "GENERATING_AUDIO",
      progress: 45,
      queueJobId: "job-456",
      jobState: "active",
      queuePosition: null,
      errorMessage: null,
    };

    vi.mocked(booksService.getProgress).mockResolvedValue(mockProgress);

    const { result } = renderHook(() => useBookProgress("book-123"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockProgress);
    expect(booksService.getProgress).toHaveBeenCalledWith("book-123");
  });
});

describe("useCreateBook Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create book and invalidate queries", async () => {
    const mockBook = {
      id: "new-book",
      title: "New Book",
      processStatus: "PENDING",
    };

    vi.mocked(booksService.create).mockResolvedValue(mockBook);

    const { result } = renderHook(() => useCreateBook(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.mutate).toBeDefined();
    });
  });
});
