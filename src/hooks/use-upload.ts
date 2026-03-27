import { useMutation } from "@tanstack/react-query";
import { filesService } from "@/api/files/files.service";

interface UploadOptions {
  file: File;
  metadata?: {
    title?: string;
    author?: string;
    language?: string;
  };
  onProgress?: (progress: number) => void;
}

interface UploadResult {
  bookId: string;
  fileId: string;
  queueJobId: string;
}

/** Upload a file and create a book (simplified 1-step flow) */
export const useUpload = () => {
  return useMutation<UploadResult, Error, UploadOptions>({
    mutationFn: async ({ file, metadata, onProgress }) => {
      // Simplified: single API call uploads file, creates book, and queues processing
      return filesService.uploadFile(file, metadata, onProgress);
    },
  });
};
