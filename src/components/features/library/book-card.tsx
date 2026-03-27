"use client";

import {
  AlertCircle,
  BookOpen,
  CheckCircle,
  Clock,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import type { Book } from "@/api/types";
import { cn } from "@/lib/utils/cn";

interface BookCardProps {
  book: Book;
  viewMode?: "grid" | "list";
}

const statusConfig = {
  PENDING: {
    label: "Pending",
    icon: Clock,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  QUEUED: {
    label: "Queued",
    icon: Clock,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  EXTRACTING: {
    label: "Extracting",
    icon: Loader2,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  CHUNKING: {
    label: "Chunking",
    icon: Loader2,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  GENERATING_AUDIO: {
    label: "Generating",
    icon: Loader2,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  STREAM_READY: {
    label: "Processing",
    icon: Loader2,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  COMPLETED: {
    label: "Completed",
    icon: CheckCircle,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  FAILED: {
    label: "Failed",
    icon: AlertCircle,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
} as const;

export function BookCard({ book, viewMode = "grid" }: BookCardProps) {
  const status = statusConfig[book.processStatus];
  const StatusIcon = status.icon;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDuration = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (viewMode === "list") {
    return (
      <Link
        href={`/audiobook/${book.id}`}
        className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent"
      >
        {/* Thumbnail placeholder */}
        <div className="flex h-16 w-12 items-center justify-center rounded-lg bg-muted">
          <BookOpen className="h-6 w-6 text-muted-foreground" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">{book.title}</h3>
          {book.author && (
            <p className="text-sm text-muted-foreground truncate">
              {book.author}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div
            className={cn("flex items-center gap-1.5 text-sm", status.color)}
          >
            <StatusIcon className="h-4 w-4" />
            <span>{status.label}</span>
          </div>

          {book.completedAt && (
            <span className="text-sm text-muted-foreground">
              {formatDuration(book.playbackPositionMs)} /{" "}
              {formatDuration(book.playbackPositionMs)}
            </span>
          )}
        </div>

        <div className="text-right">
          <p className="text-sm text-muted-foreground">
            {formatDate(book.createdAt)}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/audiobook/${book.id}`}
      className="group flex flex-col rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent"
    >
      {/* Thumbnail placeholder */}
      <div className="flex aspect-[3/4] w-full items-center justify-center rounded-lg bg-muted mb-4">
        <BookOpen className="h-12 w-12 text-muted-foreground" />
      </div>

      {/* Title & Author */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium truncate mb-1">{book.title}</h3>
        {book.author && (
          <p className="text-sm text-muted-foreground truncate mb-2">
            {book.author}
          </p>
        )}
      </div>

      {/* Status */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className={cn("flex items-center gap-1.5 text-sm", status.color)}>
          <StatusIcon className="h-4 w-4" />
          <span>{status.label}</span>
        </div>

        {book.completedAt && (
          <span className="text-sm text-muted-foreground">
            {formatDuration(book.playbackPositionMs)}
          </span>
        )}
      </div>
    </Link>
  );
}
