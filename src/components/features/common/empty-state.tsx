"use client";

import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  BookOpen,
  FileAudio,
  FolderOpen,
  Loader2,
} from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

type EmptyStateVariant = "books" | "files" | "general" | "loading" | "error";

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const variantIcons: Record<EmptyStateVariant, LucideIcon> = {
  books: FileAudio,
  files: FolderOpen,
  general: BookOpen,
  loading: Loader2,
  error: AlertCircle,
};

function BooksIllustration() {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-muted-foreground"
      aria-labelledby="books-title"
    >
      <title id="books-title">Audiobook illustration</title>
      {/* Book stack */}
      <rect
        x="20"
        y="50"
        width="80"
        height="50"
        rx="4"
        className="fill-muted stroke-border"
        strokeWidth="2"
      />
      <rect
        x="25"
        y="45"
        width="75"
        height="50"
        rx="4"
        className="fill-background stroke-border"
        strokeWidth="2"
      />
      <rect
        x="30"
        y="40"
        width="70"
        height="50"
        rx="4"
        className="fill-card stroke-border"
        strokeWidth="2"
      />
      {/* Sound waves */}
      <path
        d="M60 25C60 25 70 15 80 25C90 35 90 45 80 55C70 65 60 55 60 55"
        className="stroke-primary"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M55 20C55 20 65 10 75 20C85 30 85 40 75 50C65 60 55 50 55 50"
        className="stroke-primary opacity-60"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M65 30C65 30 72 23 79 30"
        className="stroke-primary opacity-30"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function FolderIllustration() {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-muted-foreground"
      aria-labelledby="folder-title"
    >
      <title id="folder-title">Folder illustration</title>
      {/* Folder */}
      <path
        d="M15 35L25 25H50L55 30H105V90H15V35Z"
        className="fill-primary/20 stroke-primary"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Document lines */}
      <line
        x1="35"
        y1="50"
        x2="85"
        y2="50"
        className="stroke-muted-foreground"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="35"
        y1="60"
        x2="75"
        y2="60"
        className="stroke-muted-foreground"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="35"
        y1="70"
        x2="65"
        y2="70"
        className="stroke-muted-foreground"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GeneralIllustration() {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-muted-foreground"
      aria-labelledby="general-title"
    >
      <title id="general-title">General illustration</title>
      <circle
        cx="60"
        cy="60"
        r="45"
        className="fill-muted stroke-border"
        strokeWidth="2"
      />
      <path
        d="M60 30V60L80 75"
        className="stroke-primary"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LoadingIllustration() {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-primary animate-spin"
      aria-labelledby="loading-title"
    >
      <title id="loading-title">Loading</title>
      <circle
        cx="60"
        cy="60"
        r="45"
        className="fill-muted stroke-border"
        strokeWidth="4"
      />
      <path
        d="M60 15C60 15 90 30 105 60"
        className="stroke-primary"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function ErrorIllustration() {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-destructive"
      aria-labelledby="error-title"
    >
      <title id="error-title">Error illustration</title>
      <circle
        cx="60"
        cy="60"
        r="45"
        className="fill-destructive/10"
        strokeWidth="2"
      />
      <line
        x1="40"
        y1="40"
        x2="80"
        y2="80"
        className="stroke-destructive"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <line
        x1="80"
        y1="40"
        x2="40"
        y2="80"
        className="stroke-destructive"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

const illustrations: Record<EmptyStateVariant, React.FC> = {
  books: BooksIllustration,
  files: FolderIllustration,
  general: GeneralIllustration,
  loading: LoadingIllustration,
  error: ErrorIllustration,
};

export function EmptyState({
  variant = "general",
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const Icon = variantIcons[variant];
  const Illustration = illustrations[variant];
  const isLoading = variant === "loading";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center",
        className,
      )}
    >
      <div className="relative mb-6">
        {/* Background decoration */}
        <div className="absolute -inset-4 rounded-full bg-muted/50 blur-xl" />
        {/* Illustration */}
        <div className="relative">
          {isLoading ? (
            <Illustration />
          ) : (
            <div className="mb-4">
              <Illustration />
            </div>
          )}
        </div>
      </div>

      {/* Icon (optional additional indicator) */}
      {!isLoading && (
        <div className="mb-4 rounded-full bg-muted p-3">
          <Icon className="h-6 w-6 text-muted-foreground" />
        </div>
      )}

      {/* Text */}
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      )}

      {/* Action */}
      {action && (
        <Button onClick={action.onClick} className="mt-6" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {action.label}
        </Button>
      )}
    </div>
  );
}

/**
 * Animated container for list items with staggered entrance
 */
export function AnimatedList({
  children,
  className,
  itemClassName,
}: {
  children: React.ReactNode;
  className?: string;
  itemClassName?: string;
}) {
  return (
    <div className={cn("space-y-4", className)}>
      {React.Children.map(children, (child, index) => {
        const childKey = React.isValidElement(child)
          ? child.key
          : `animated-item-${index}`;
        return (
          <div
            key={childKey ?? `animated-item-${index}`}
            className={cn(
              "animate-in fade-in slide-in-from-bottom-2 duration-300",
              itemClassName,
            )}
            style={{
              animationDelay: `${index * 50}ms`,
              animationFillMode: "both",
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Skeleton for list items
 */
export function ListItemSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("flex items-center gap-4 rounded-lg border p-4", className)}
    >
      <div className="h-12 w-12 rounded-lg bg-muted animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
        <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
      </div>
      <div className="h-8 w-8 rounded bg-muted animate-pulse" />
    </div>
  );
}
