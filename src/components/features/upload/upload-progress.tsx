"use client";

import { X } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils/cn";

interface UploadProgressProps {
  filename: string;
  progress: number;
  status: "uploading" | "processing" | "complete" | "error";
  error?: string;
  onCancel?: () => void;
}

export function UploadProgress({
  filename,
  progress,
  status,
  error,
  onCancel,
}: UploadProgressProps) {
  const statusLabels = {
    uploading: "Uploading...",
    processing: "Processing...",
    complete: "Complete",
    error: "Upload failed",
  };

  return (
    <div className="w-full rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
          {status === "uploading" || status === "processing" ? (
            <Spinner size="sm" />
          ) : status === "complete" ? (
            <svg
              className="h-5 w-5 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              role="img"
              aria-label="Complete"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="h-5 w-5 text-destructive"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              role="img"
              aria-label="Error"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{filename}</p>
          <p className="text-sm text-muted-foreground">
            {statusLabels[status]}
            {status === "uploading" && ` (${Math.round(progress)}%)`}
          </p>
        </div>

        {onCancel && (status === "uploading" || status === "processing") && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Cancel upload</span>
          </button>
        )}
      </div>

      {(status === "uploading" || status === "processing") && (
        <div className="mt-3">
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-300",
                status === "processing"
                  ? "bg-primary animate-pulse"
                  : "bg-primary",
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="mt-3 rounded-lg bg-destructive/10 p-3">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
    </div>
  );
}
