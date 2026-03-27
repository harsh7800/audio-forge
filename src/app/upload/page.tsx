"use client";

import * as React from "react";
import { FileDropzone } from "@/components/features/upload/file-dropzone";
import { UploadProgress } from "@/components/features/upload/upload-progress";
import { UploadSuccess } from "@/components/features/upload/upload-success";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpload } from "@/hooks";

type UploadStep = "select" | "metadata" | "uploading" | "success" | "error";

interface MetadataFormData {
  title: string;
  author: string;
  language: string;
  mode: "audiobook" | "summary";
}

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese" },
  { value: "pl", label: "Polish" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "zh", label: "Chinese" },
];

export default function UploadPage() {
  const [step, setStep] = React.useState<UploadStep>("select");
  const [file, setFile] = React.useState<File | null>(null);
  const [progress, setProgress] = React.useState(0);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [createdBookId, setCreatedBookId] = React.useState<string | null>(null);
  const [metadata, setMetadata] = React.useState<MetadataFormData>({
    title: "",
    author: "",
    language: "en",
    mode: "audiobook",
  });

  const upload = useUpload();

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    // Auto-fill title from filename
    const fileNameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, "");
    setMetadata((prev) => ({
      ...prev,
      title: prev.title || fileNameWithoutExt,
    }));
    setStep("metadata");
  };

  const handleMetadataSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setStep("uploading");
    setProgress(0);

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 500);

    upload.mutate(
      {
        file,
        metadata: {
          title: metadata.title,
          author: metadata.author,
          language: metadata.language,
        },
      },
      {
        onSuccess: (data) => {
          clearInterval(progressInterval);
          setProgress(100);
          setCreatedBookId(data.bookId);
          setStep("success");
        },
        onError: (error) => {
          clearInterval(progressInterval);
          setUploadError(error.message || "Upload failed. Please try again.");
          setStep("error");
        },
      },
    );
  };

  const handleCancel = () => {
    if (upload.isPending) {
      upload.reset();
    }
    setStep("select");
    setFile(null);
    setProgress(0);
    setUploadError(null);
  };

  const handleRetry = () => {
    setUploadError(null);
    setStep("metadata");
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Upload Book</h1>
        <p className="text-muted-foreground mt-2">
          Upload a PDF or ePub file to convert it into an audiobook
        </p>
      </div>

      {step === "select" && <FileDropzone onFileSelect={handleFileSelect} />}

      {step === "metadata" && file && (
        <form onSubmit={handleMetadataSubmit} className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <FileIcon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCancel}
              >
                Remove
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={metadata.title}
                  onChange={(e) =>
                    setMetadata((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Enter book title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={metadata.author}
                  onChange={(e) =>
                    setMetadata((prev) => ({ ...prev, author: e.target.value }))
                  }
                  placeholder="Enter author name (optional)"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={metadata.language}
                    onValueChange={(value) =>
                      setMetadata((prev) => ({ ...prev, language: value }))
                    }
                  >
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mode">Processing Mode</Label>
                  <Select
                    value={metadata.mode}
                    onValueChange={(value: "audiobook" | "summary") =>
                      setMetadata((prev) => ({ ...prev, mode: value }))
                    }
                  >
                    <SelectTrigger id="mode">
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="audiobook">
                        Audiobook (Full content)
                      </SelectItem>
                      <SelectItem value="summary">
                        Summary (Condensed)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Start Upload
            </Button>
          </div>
        </form>
      )}

      {step === "uploading" && file && (
        <div className="space-y-6">
          <UploadProgress
            filename={file.name}
            progress={progress}
            status={progress < 100 ? "uploading" : "processing"}
            onCancel={handleCancel}
          />
          <p className="text-center text-sm text-muted-foreground">
            Please wait while your book is being uploaded and processed...
          </p>
        </div>
      )}

      {step === "success" && createdBookId && metadata.title && (
        <UploadSuccess bookId={createdBookId} title={metadata.title} />
      )}

      {step === "error" && (
        <div className="space-y-6">
          <UploadProgress
            filename={file?.name || "File"}
            progress={progress}
            status="error"
            error={uploadError || "Upload failed"}
          />
          <div className="flex gap-4">
            <Button variant="outline" onClick={handleCancel}>
              Start Over
            </Button>
            <Button onClick={handleRetry}>Try Again</Button>
          </div>
        </div>
      )}
    </div>
  );
}

function FileIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      role="img"
      aria-label="File icon"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}
