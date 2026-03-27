import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type * as React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the files service
vi.mock("@/api/files/files.service", () => ({
  filesService: {
    uploadFile: vi.fn(),
  },
}));

import { filesService } from "@/api/files/files.service";
import { useUpload } from "@/hooks/use-upload";

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

describe("useUpload Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should upload file", async () => {
    const mockResponse = {
      bookId: "book-123",
      fileId: "file-456",
      queueJobId: "job-789",
    };

    vi.mocked(filesService.uploadFile).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useUpload(), {
      wrapper: createWrapper(),
    });

    // Create a mock file
    const mockFile = new File(["content"], "test.pdf", {
      type: "application/pdf",
    });

    await waitFor(() => {
      expect(result.current.mutate).toBeDefined();
    });

    result.current.mutate({
      file: mockFile,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(filesService.uploadFile).toHaveBeenCalledWith(
      mockFile,
      undefined,
      undefined,
    );

    expect(result.current.data).toEqual(mockResponse);
  });

  it("should handle upload errors", async () => {
    vi.mocked(filesService.uploadFile).mockRejectedValue(
      new Error("Upload failed"),
    );

    const { result } = renderHook(() => useUpload(), {
      wrapper: createWrapper(),
    });

    const mockFile = new File(["content"], "test.pdf", {
      type: "application/pdf",
    });

    result.current.mutate({
      file: mockFile,
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe("Upload failed");
  });

  it("should track upload progress", async () => {
    const mockResponse = {
      bookId: "book-123",
      fileId: "file-456",
      queueJobId: "job-789",
    };

    vi.mocked(filesService.uploadFile).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useUpload(), {
      wrapper: createWrapper(),
    });

    const mockFile = new File(["content"], "test.pdf", {
      type: "application/pdf",
    });

    const onProgress = vi.fn();

    result.current.mutate({
      file: mockFile,
      onProgress,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(filesService.uploadFile).toHaveBeenCalledWith(
      mockFile,
      undefined,
      onProgress,
    );
  });
});
