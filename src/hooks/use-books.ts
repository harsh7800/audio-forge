import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { booksService } from "@/api/books/books.service";
import { queryKeys } from "@/api/query-keys";
import type {
  CreateBookDto,
  PaginationParams,
  UpdateBookDto,
} from "@/api/types";

/** Fetch all books with pagination */
export const useBooks = (params?: PaginationParams) => {
  return useQuery({
    queryKey: queryKeys.books.list(params),
    queryFn: () => booksService.list(params),
  });
};

/** Fetch a single book by ID */
export const useBook = (id: string) => {
  return useQuery({
    queryKey: queryKeys.books.detail(id),
    queryFn: () => booksService.get(id),
    enabled: !!id,
  });
};

/** Fetch book processing progress */
export const useBookProgress = (id: string) => {
  return useQuery({
    queryKey: queryKeys.books.progress(id),
    queryFn: () => booksService.getProgress(id),
    enabled: !!id,
    // Poll every 2 seconds while processing
    refetchInterval: (query) => {
      const data = query.state.data;
      if (
        data?.processStatus === "COMPLETED" ||
        data?.processStatus === "FAILED"
      ) {
        return false;
      }
      return 2000;
    },
  });
};

/** Create a new book */
export const useCreateBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBookDto) => booksService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.books.lists() });
    },
  });
};

/** Update a book */
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

/** Delete a book */
export const useDeleteBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => booksService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.books.lists() });
    },
  });
};
