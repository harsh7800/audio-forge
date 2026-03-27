"use client";

import { ArrowRight, BookOpen, Library, Upload } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome to AudioForge
        </h1>
        <p className="text-muted-foreground mt-2">
          Convert your eBooks into audiobooks with AI-powered text-to-speech.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/upload"
          className="group relative flex flex-col rounded-lg border border-border bg-card p-6 transition-colors hover:bg-accent"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Upload className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-semibold">Upload Book</h2>
              <p className="text-sm text-muted-foreground">
                Upload a PDF or ePub file to convert
              </p>
            </div>
          </div>
          <ArrowRight className="absolute right-6 top-1/2 h-4 w-4 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100" />
        </Link>

        <Link
          href="/library"
          className="group relative flex flex-col rounded-lg border border-border bg-card p-6 transition-colors hover:bg-accent"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Library className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-semibold">Library</h2>
              <p className="text-sm text-muted-foreground">
                View and manage your audiobooks
              </p>
            </div>
          </div>
          <ArrowRight className="absolute right-6 top-1/2 h-4 w-4 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100" />
        </Link>

        <Link
          href="/library"
          className="group relative flex flex-col rounded-lg border border-border bg-card p-6 transition-colors hover:bg-accent"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-semibold">Recent Audiobooks</h2>
              <p className="text-sm text-muted-foreground">
                Continue where you left off
              </p>
            </div>
          </div>
          <ArrowRight className="absolute right-6 top-1/2 h-4 w-4 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100" />
        </Link>
      </div>

      {/* Stats Section */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Total Audiobooks
          </h3>
          <p className="text-2xl font-bold mt-1">0</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Processing
          </h3>
          <p className="text-2xl font-bold mt-1">0</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Completed
          </h3>
          <p className="text-2xl font-bold mt-1">0</p>
        </div>
      </div>
    </div>
  );
}
