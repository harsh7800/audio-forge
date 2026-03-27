"use client";

import {
  ArrowLeft,
  BookOpen,
  Clock,
  Download,
  Loader2,
  Play,
  RotateCcw,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useBook, useBookProgress, useDeleteBook } from "@/hooks";
import { cn } from "@/lib/utils/cn";

const statusConfig = {
  PENDING: {
    label: "Pending",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  QUEUED: {
    label: "Queued",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  EXTRACTING: {
    label: "Extracting text...",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  CHUNKING: {
    label: "Splitting into chunks...",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  GENERATING_AUDIO: {
    label: "Generating audio...",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  STREAM_READY: {
    label: "Finalizing...",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  COMPLETED: {
    label: "Completed",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  FAILED: {
    label: "Failed",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
} as const;

export default function AudiobookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.id as string;

  const { data: book, isLoading, isError } = useBook(bookId);
  const { data: progress } = useBookProgress(bookId);
  const deleteBook = useDeleteBook();

  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  const status = book ? statusConfig[book.processStatus] : null;

  const handleDelete = async () => {
    try {
      await deleteBook.mutateAsync(bookId);
      router.push("/library");
    } catch (error) {
      console.error("Failed to delete book:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
    );
  }

  if (isError || !book) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-8">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Error Loading Book</h2>
          <p className="text-muted-foreground mt-2">
            Unable to load book details. Please try again.
          </p>
        </div>
        <Button onClick={() => router.push("/library")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Library
        </Button>
      </div>
    );
  }

  const isProcessing =
    book.processStatus !== "COMPLETED" && book.processStatus !== "FAILED";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/library">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to library</span>
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold tracking-tight truncate">
            {book.title}
          </h1>
          {book.author && (
            <p className="text-muted-foreground">{book.author}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {book.processStatus === "COMPLETED" && (
            <Button>
              <Play className="mr-2 h-4 w-4" />
              Play
            </Button>
          )}
          <AlertDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
          >
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Audiobook</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete &quot;{book.title}&quot;? This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Status Card */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-lg",
                status?.bgColor,
              )}
            >
              {isProcessing ? (
                <Loader2
                  className={cn("h-6 w-6 animate-spin", status?.color)}
                />
              ) : book.processStatus === "COMPLETED" ? (
                <BookOpen className={cn("h-6 w-6", status?.color)} />
              ) : (
                <Clock className={cn("h-6 w-6", status?.color)} />
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold">{status?.label}</h2>
              {progress && isProcessing && (
                <p className="text-sm text-muted-foreground">
                  {progress.jobState === "waiting" &&
                    `Queue position: ${progress.queuePosition}`}
                  {progress.jobState === "active" && "Processing..."}
                  {progress.jobState === "delayed" && "Waiting..."}
                </p>
              )}
            </div>
          </div>

          {book.processStatus === "FAILED" && book.errorMessage && (
            <div className="text-right">
              <p className="text-sm text-destructive">{book.errorMessage}</p>
              <Button variant="outline" size="sm" className="mt-2">
                <RotateCcw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </div>
          )}
        </div>

        {/* Progress bar */}
        {isProcessing && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{book.progress}%</span>
            </div>
            <Progress value={book.progress} className="h-2" />
          </div>
        )}
      </div>

      {/* Book Info */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-semibold mb-4">Book Details</h3>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Language</dt>
              <dd className="font-medium capitalize">{book.language}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Mode</dt>
              <dd className="font-medium capitalize">{book.mode}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Voice</dt>
              <dd className="font-medium">{book.voiceId || "Default"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Created</dt>
              <dd className="font-medium">
                {new Date(book.createdAt).toLocaleDateString()}
              </dd>
            </div>
            {book.completedAt && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Completed</dt>
                <dd className="font-medium">
                  {new Date(book.completedAt).toLocaleDateString()}
                </dd>
              </div>
            )}
          </dl>
        </div>

        {book.processStatus === "COMPLETED" && (
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-4">Playback</h3>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Position</dt>
                <dd className="font-medium">
                  {Math.floor(book.playbackPositionMs / 60000)}m{" "}
                  {Math.floor((book.playbackPositionMs % 60000) / 1000)}s
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Last Played</dt>
                <dd className="font-medium">
                  {book.lastPlayedAt
                    ? new Date(book.lastPlayedAt).toLocaleDateString()
                    : "Never"}
                </dd>
              </div>
            </dl>
            <div className="mt-4 flex gap-2">
              <Button className="flex-1">
                <Play className="mr-2 h-4 w-4" />
                Continue Listening
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
