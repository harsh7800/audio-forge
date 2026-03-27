"use client";

import { AlertCircle, Loader2, RefreshCw, WifiOff } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface FallbackProps {
  error: Error;
  resetError: () => void;
}

/**
 * Network error fallback for ErrorBoundary
 */
export function NetworkErrorFallback({ error, resetError }: FallbackProps) {
  const isNetworkError =
    error?.message?.includes("Network Error") ||
    error?.message?.includes("Failed to fetch") ||
    error?.message?.includes("ECONNREFUSED");

  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="rounded-full bg-destructive/10 p-4">
        <WifiOff className="h-8 w-8 text-destructive" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-foreground">
          Connection Lost
        </h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          {isNetworkError
            ? "Unable to reach the server. Please check your internet connection."
            : "Something went wrong. Please try again."}
        </p>
      </div>
      <Button onClick={resetError}>
        <RefreshCw className="mr-2 h-4 w-4" />
        Try Again
      </Button>
    </div>
  );
}

/**
 * Data loading error fallback
 */
export function DataErrorFallback({ error, resetError }: FallbackProps) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="rounded-full bg-destructive/10 p-4">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-foreground">
          Failed to Load
        </h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          {error?.message || "We couldn't load this data. Please try again."}
        </p>
      </div>
      <Button onClick={resetError}>
        <RefreshCw className="mr-2 h-4 w-4" />
        Try Again
      </Button>
    </div>
  );
}

/**
 * Full page error state
 */
export function FullPageError({
  title = "Something Went Wrong",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <div className="rounded-full bg-destructive/10 p-6">
        <AlertCircle className="h-12 w-12 text-destructive" />
      </div>
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="mt-2 max-w-md text-muted-foreground">{message}</p>
      </div>
      {onRetry && (
        <Button size="lg" onClick={onRetry}>
          <RefreshCw className="mr-2 h-5 w-5" />
          Reload Page
        </Button>
      )}
    </div>
  );
}

/**
 * Inline error alert
 */
export function ErrorAlert({
  error,
  onDismiss,
  className,
}: {
  error: Error | null;
  onDismiss?: () => void;
  className?: string;
}) {
  if (!error) return null;

  const isNetworkError =
    error.message.includes("Network Error") ||
    error.message.includes("Failed to fetch") ||
    error.message.includes("ECONNREFUSED");

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-4",
        className,
      )}
    >
      <AlertCircle className="h-5 w-5 flex-shrink-0 text-destructive" />
      <div className="flex-1 text-sm">
        <p className="font-medium text-foreground">
          {isNetworkError ? "Connection Error" : "Error"}
        </p>
        <p className="mt-1 text-muted-foreground">
          {isNetworkError
            ? "Please check your internet connection."
            : error.message || "An unexpected error occurred."}
        </p>
      </div>
      {onDismiss && (
        <Button variant="ghost" size="sm" onClick={onDismiss}>
          Dismiss
        </Button>
      )}
    </div>
  );
}
