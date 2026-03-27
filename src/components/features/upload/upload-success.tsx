"use client";

import { ArrowRight, BookOpen, CheckCircle } from "lucide-react";
import Link from "next/link";

interface UploadSuccessProps {
  bookId: string;
  title: string;
}

export function UploadSuccess({ bookId, title }: UploadSuccessProps) {
  return (
    <div className="flex flex-col items-center gap-6 p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
        <CheckCircle className="h-8 w-8 text-green-500" />
      </div>

      <div>
        <h2 className="text-xl font-semibold">Upload Complete!</h2>
        <p className="mt-2 text-muted-foreground">
          Your book <strong>&quot;{title}&quot;</strong> is now being processed.
          <br />
          This may take a few minutes depending on the file size.
        </p>
      </div>

      <div className="flex gap-4">
        <Link
          href="/library"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
        >
          <BookOpen className="h-4 w-4" />
          View Library
        </Link>
        <Link
          href={`/audiobook/${bookId}`}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          View Progress
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
