import { apiClient } from "../client";
import type { ApiResponse } from "../types";

export const filesService = {
  /**
   * Upload file and create book in one step
   * POST /api/files/upload with multipart/form-data
   *
   * @param file - The file to upload (PDF, EPUB, or TXT)
   * @param metadata - Optional metadata (title, author, language)
   * @param onProgress - Optional progress callback
   * @returns { bookId, fileId, queueJobId }
   */
  uploadFile: async (
    file: File,
    metadata?: {
      title?: string;
      author?: string;
      language?: string;
    },
    onProgress?: (progress: number) => void,
  ): Promise<{ bookId: string; fileId: string; queueJobId: string }> => {
    const formData = new FormData();
    formData.append("file", file);

    if (metadata?.title) {
      formData.append("title", metadata.title);
    }
    if (metadata?.author) {
      formData.append("author", metadata.author);
    }
    if (metadata?.language) {
      formData.append("language", metadata.language);
    }

    const response = await apiClient.post<
      ApiResponse<{ bookId: string; fileId: string; queueJobId: string }>
    >("/files/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100,
          );
          onProgress(progress);
        }
      },
    });

    return response.data.data;
  },
};
