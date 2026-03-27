"use client";

import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import type { PlaylistItem } from "@/api/types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { usePlayerStore } from "@/stores/player-store";

interface AudioPlayerProps {
  bookTitle?: string;
  playlist?: PlaylistItem[];
  isLoading?: boolean;
  onPlayPause?: () => void;
  onSeek?: (time: number) => void;
  onVolumeChange?: (volume: number) => void;
  onSpeedChange?: (speed: number) => void;
  onChunkChange?: (chunkIndex: number) => void;
}

function formatTime(seconds: number): string {
  if (!seconds || !Number.isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function AudioPlayer({
  bookTitle,
  playlist = [],
  isLoading = false,
  onPlayPause,
  onSeek,
  onVolumeChange,
  onSpeedChange,
  onChunkChange,
}: AudioPlayerProps) {
  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    playbackRate,
    currentChunkIndex,
    totalChunks,
    toggle,
    setCurrentTime,
    setVolume,
    setPlaybackRate,
    nextChunk,
    prevChunk,
    setChunkIndex,
  } = usePlayerStore();

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    setCurrentTime(newTime);
    onSeek?.(newTime);
  };

  const handleVolumeChange = (values: number[]) => {
    const newVolume = values[0] ?? 1;
    setVolume(newVolume);
    onVolumeChange?.(newVolume);
  };

  const handleSpeedChange = (value: string) => {
    const newSpeed = parseFloat(value);
    setPlaybackRate(newSpeed);
    onSpeedChange?.(newSpeed);
  };

  const handlePrevChunk = () => {
    if (currentChunkIndex > 0) {
      setChunkIndex(currentChunkIndex - 1);
      onChunkChange?.(currentChunkIndex - 1);
    } else {
      prevChunk();
      onChunkChange?.(currentChunkIndex - 1);
    }
  };

  const handleNextChunk = () => {
    if (currentChunkIndex < totalChunks - 1) {
      setChunkIndex(currentChunkIndex + 1);
      onChunkChange?.(currentChunkIndex + 1);
    } else {
      nextChunk();
      onChunkChange?.(currentChunkIndex + 1);
    }
  };

  const handleTogglePlay = () => {
    toggle();
    onPlayPause?.();
  };

  const isMuted = volume === 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-border bg-card p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Loading audio...</span>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-4">
      {/* Book title */}
      {bookTitle && (
        <div className="text-center">
          <h3 className="font-medium text-foreground truncate">{bookTitle}</h3>
          {playlist.length > 0 && (
            <p className="text-sm text-muted-foreground truncate">
              Chapter {currentChunkIndex + 1}
            </p>
          )}
        </div>
      )}

      {/* Progress bar */}
      <div
        className="cursor-pointer group"
        onClick={handleProgressClick}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            setCurrentTime(Math.min(currentTime + 10, duration));
          } else if (e.key === "ArrowLeft") {
            setCurrentTime(Math.max(currentTime - 10, 0));
          }
        }}
        role="slider"
        tabIndex={0}
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={currentTime}
      >
        <Progress
          value={progressPercent}
          className="h-2 cursor-pointer group-hover:h-3 transition-all"
        />
        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Main controls */}
      <div className="flex items-center justify-center gap-4">
        {/* Chunk navigation */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevChunk}
            disabled={currentChunkIndex === 0 && currentTime === 0}
            aria-label="Previous chapter"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          {/* Play/Pause button */}
          <Button
            variant="default"
            size="icon"
            onClick={handleTogglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="h-12 w-12 rounded-full"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-1" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextChunk}
            disabled={currentChunkIndex === totalChunks - 1}
            aria-label="Next chapter"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Secondary controls */}
      <div className="flex items-center justify-between gap-4">
        {/* Volume control */}
        <div className="flex items-center gap-2 flex-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setVolume(isMuted ? 1 : 0)}
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
          <Slider
            value={[isMuted ? 0 : volume]}
            min={0}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="w-24"
            aria-label="Volume"
          />
        </div>

        {/* Chunk indicator */}
        <div className="text-sm text-muted-foreground">
          {totalChunks > 0 && (
            <span>
              {currentChunkIndex + 1} / {totalChunks}
            </span>
          )}
        </div>

        {/* Speed control */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <span className="text-sm text-muted-foreground">Speed</span>
          <Select
            value={playbackRate.toString()}
            onValueChange={handleSpeedChange}
          >
            <SelectTrigger className="w-20" aria-label="Playback speed">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0.5">0.5x</SelectItem>
              <SelectItem value="0.75">0.75x</SelectItem>
              <SelectItem value="1">1x</SelectItem>
              <SelectItem value="1.25">1.25x</SelectItem>
              <SelectItem value="1.5">1.5x</SelectItem>
              <SelectItem value="1.75">1.75x</SelectItem>
              <SelectItem value="2">2x</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

/** Compact audio player for inline use */
export function AudioPlayerCompact({
  bookTitle,
  isLoading = false,
  onPlayPause,
}: Omit<AudioPlayerProps, "playlist">) {
  const { isPlaying, toggle } = usePlayerStore();

  const handleTogglePlay = () => {
    toggle();
    onPlayPause?.();
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="default"
        size="icon"
        onClick={handleTogglePlay}
        aria-label={isPlaying ? "Pause" : "Play"}
        className="h-8 w-8 rounded-full"
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4 ml-0.5" />
        )}
      </Button>
      {bookTitle && (
        <span className="text-sm font-medium truncate">{bookTitle}</span>
      )}
    </div>
  );
}
