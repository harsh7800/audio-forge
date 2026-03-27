"use client";

import { Grid, List, Search, Upload } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { BookCard } from "@/components/features/library/book-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useBooks } from "@/hooks";

type SortOrder = "newest" | "oldest" | "title_asc" | "title_desc";
type FilterStatus =
  | "all"
  | "PENDING"
  | "QUEUED"
  | "EXTRACTING"
  | "CHUNKING"
  | "GENERATING_AUDIO"
  | "STREAM_READY"
  | "COMPLETED"
  | "FAILED";

export default function LibraryPage() {
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [sortOrder, setSortOrder] = React.useState<SortOrder>("newest");
  const [filterStatus, setFilterStatus] = React.useState<FilterStatus>("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  const { data, isLoading, isError } = useBooks();

  // Filter and sort books
  const filteredBooks = React.useMemo(() => {
    if (!data?.data) return [];

    let books = [...data.data];

    // Filter by status
    if (filterStatus !== "all") {
      books = books.filter((book) => book.processStatus === filterStatus);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      books = books.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author?.toLowerCase().includes(query),
      );
    }

    // Sort
    switch (sortOrder) {
      case "oldest":
        books.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
        break;
      case "title_asc":
        books.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title_desc":
        books.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        books.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
    }

    return books;
  }, [data?.data, filterStatus, searchQuery, sortOrder]);

  // Calculate stats
  const stats = React.useMemo(() => {
    if (!data?.data) return { total: 0, completed: 0, processing: 0 };

    const books = data.data;
    return {
      total: books.length,
      completed: books.filter((b) => b.processStatus === "COMPLETED").length,
      processing: books.filter(
        (b) => b.processStatus !== "COMPLETED" && b.processStatus !== "FAILED",
      ).length,
    };
  }, [data?.data]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-48 mt-2" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static loading
            <Skeleton key={i} className="h-64 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-8">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Error Loading Library</h2>
          <p className="text-muted-foreground mt-2">
            Unable to load your books. Please try again later.
          </p>
        </div>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Library</h1>
          <p className="text-muted-foreground mt-1">
            {stats.total} books · {stats.completed} completed ·{" "}
            {stats.processing} processing
          </p>
        </div>
        <Button asChild>
          <Link href="/upload">
            <Upload className="mr-2 h-4 w-4" />
            Upload Book
          </Link>
        </Button>
      </div>

      {/* Filters & Controls */}
      <div className="flex flex-col gap-4 sm:flex-row">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filter */}
        <Select
          value={filterStatus}
          onValueChange={(value: string) =>
            setFilterStatus(value as FilterStatus)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="QUEUED">Queued</SelectItem>
            <SelectItem value="EXTRACTING">Extracting</SelectItem>
            <SelectItem value="CHUNKING">Chunking</SelectItem>
            <SelectItem value="GENERATING_AUDIO">Generating</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select
          value={sortOrder}
          onValueChange={(value: string) => setSortOrder(value as SortOrder)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="title_asc">Title A-Z</SelectItem>
            <SelectItem value="title_desc">Title Z-A</SelectItem>
          </SelectContent>
        </Select>

        {/* View Toggle */}
        <div className="flex rounded-lg border border-border">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
            className="rounded-r-none"
          >
            <Grid className="h-4 w-4" />
            <span className="sr-only">Grid view</span>
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("list")}
            className="rounded-l-none"
          >
            <List className="h-4 w-4" />
            <span className="sr-only">List view</span>
          </Button>
        </div>
      </div>

      {/* Book Grid/List */}
      {filteredBooks.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-8 text-center">
          <div className="text-muted-foreground">
            <p className="text-lg font-medium">No books found</p>
            {searchQuery || filterStatus !== "all" ? (
              <p className="mt-1 text-sm">
                Try adjusting your search or filters
              </p>
            ) : (
              <p className="mt-1 text-sm">
                Upload your first book to get started
              </p>
            )}
          </div>
          <Button asChild>
            <Link href="/upload">
              <Upload className="mr-2 h-4 w-4" />
              Upload Book
            </Link>
          </Button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} viewMode="grid" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} viewMode="list" />
          ))}
        </div>
      )}
    </div>
  );
}
