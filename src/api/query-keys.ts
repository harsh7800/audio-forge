export const queryKeys = {
  // Books
  books: {
    all: ["books"] as const,
    lists: () => [...queryKeys.books.all, "list"] as const,
    list: (params?: { limit?: number; offset?: number; status?: string }) =>
      [...queryKeys.books.lists(), params] as const,
    details: () => [...queryKeys.books.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.books.details(), id] as const,
    progress: (id: string) =>
      [...queryKeys.books.detail(id), "progress"] as const,
  },

  // Audio
  audio: {
    all: ["audio"] as const,
    status: (bookId: string) =>
      [...queryKeys.audio.all, bookId, "status"] as const,
    playlist: (bookId: string) =>
      [...queryKeys.audio.all, bookId, "playlist"] as const,
  },
} as const;
