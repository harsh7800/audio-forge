import { apiClient } from "../client";
import type {
  ApiResponse,
  Book,
  BookProgress,
  CreateBookDto,
  PaginatedResponse,
  PaginationParams,
  UpdateBookDto,
} from "../types";

export const booksService = {
  /** Create a new book */
  create: async (data: CreateBookDto): Promise<Book> => {
    const response = await apiClient.post<ApiResponse<Book>>("/books", data);
    return response.data.data;
  },

  /** List all books with pagination */
  list: async (params?: PaginationParams): Promise<PaginatedResponse<Book>> => {
    const response = await apiClient.get<PaginatedResponse<Book>>("/books", {
      params,
    });
    return response.data;
  },

  /** Get book by ID */
  get: async (id: string): Promise<Book> => {
    const response = await apiClient.get<ApiResponse<Book>>(`/books/${id}`);
    return response.data.data;
  },

  /** Update book */
  update: async (id: string, data: UpdateBookDto): Promise<Book> => {
    const response = await apiClient.patch<ApiResponse<Book>>(
      `/books/${id}`,
      data,
    );
    return response.data.data;
  },

  /** Delete book */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/books/${id}`);
  },

  /** Get job progress */
  getProgress: async (id: string): Promise<BookProgress> => {
    const response = await apiClient.get<ApiResponse<BookProgress>>(
      `/books/${id}/progress`,
    );
    return response.data.data;
  },
};
