"use client";

import { useCallback, useState } from "react";
import { audioService } from "@/api/audio/audio.service";

interface DownloadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

interface UseDownloadAudioReturn {
  download: (bookId: string, filename?: string) => Promise<void>;
  progress: DownloadProgress | null;
  isDownloading: boolean;
  error: Error | null;
  reset: () => void;
}

/**
 * Hook for downloading audiobooks with progress tracking
 */
export function useAudioDownload(): UseDownloadAudioReturn {
  const [progress, setProgress] = useState<DownloadProgress | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const download = useCallback(async (bookId: string, filename?: string) => {
    setIsDownloading(true);
    setError(null);
    setProgress({ loaded: 0, total: 0, percentage: 0 });

    return new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const url = audioService.getDownloadUrl(bookId);

      xhr.open("GET", url, true);
      xhr.responseType = "blob";

      xhr.onload = () => {
        setIsDownloading(false);
        if (xhr.status === 200) {
          // Create download link
          const blob = new Blob([xhr.response], { type: "audio/mpeg" });
          const downloadUrl = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = downloadUrl;
          link.download = filename || `${bookId}-audiobook.mp3`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(downloadUrl);

          setProgress({ loaded: 1, total: 1, percentage: 100 });
          resolve();
        } else {
          const err = new Error(`Download failed with status ${xhr.status}`);
          setError(err);
          reject(err);
        }
      };

      xhr.onerror = () => {
        setIsDownloading(false);
        const err = new Error("Network error during download");
        setError(err);
        reject(err);
      };

      xhr.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentage = Math.round((event.loaded / event.total) * 100);
          setProgress({
            loaded: event.loaded,
            total: event.total,
            percentage,
          });
        }
      };

      xhr.send();
    });
  }, []);

  const reset = useCallback(() => {
    setProgress(null);
    setIsDownloading(false);
    setError(null);
  }, []);

  return {
    download,
    progress,
    isDownloading,
    error,
    reset,
  };
}

/**
 * Simple download function that opens the URL directly
 * Use this when you don't need progress tracking
 */
export function downloadAudioUrl(bookId: string, filename?: string): void {
  const url = audioService.getDownloadUrl(bookId);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || `${bookId}-audiobook.mp3`;
  link.target = "_blank";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
