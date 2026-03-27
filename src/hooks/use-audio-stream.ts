"use client";

import { useCallback, useEffect, useRef } from "react";
import { audioService } from "@/api/audio/audio.service";
import type { PlaylistItem } from "@/api/types";
import { usePlayerStore } from "@/stores/player-store";

interface UseAudioStreamOptions {
  bookId: string | null;
  playlist?: PlaylistItem[];
  autoPlay?: boolean;
  onChunkEnd?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for streaming audio with chunk-based playback
 * Manages HTMLAudioElement, chunk preloading, and player store sync
 */
export function useAudioStream({
  bookId,
  playlist = [],
  onChunkEnd,
  onError,
}: UseAudioStreamOptions) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const preloadedChunksRef = useRef<Set<number>>(new Set());

  const {
    isPlaying,
    currentTime,
    volume,
    playbackRate,
    currentChunkIndex,
    setBook,
    setCurrentTime,
    setDuration,
    play,
    pause,
    toggle,
    nextChunk,
    savePlaybackPosition,
  } = usePlayerStore();

  // Initialize book when bookId and playlist change
  useEffect(() => {
    if (bookId && playlist.length > 0) {
      setBook(bookId, playlist.length);
    }
  }, [bookId, playlist.length, setBook]);

  // Create audio element
  useEffect(() => {
    if (typeof window === "undefined") return;

    audioRef.current = new Audio();
    audioRef.current.preload = "auto";

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
      preloadedChunksRef.current.clear();
    };
  }, []);

  // Load chunk into audio element
  const loadChunk = useCallback(
    (chunkIndex: number) => {
      if (
        !audioRef.current ||
        !bookId ||
        chunkIndex < 0 ||
        chunkIndex >= playlist.length
      ) {
        return;
      }

      const chunkUrl = audioService.getChunkUrl(bookId, chunkIndex);

      // Don't reload if already playing this chunk
      if (audioRef.current.src === chunkUrl && !audioRef.current.paused) {
        return;
      }

      audioRef.current.src = chunkUrl;
      audioRef.current.load();
    },
    [bookId, playlist],
  );

  // Preload next chunk for smooth playback
  const preloadNextChunk = useCallback(() => {
    const nextIndex = currentChunkIndex + 1;
    if (
      bookId &&
      nextIndex < playlist.length &&
      !preloadedChunksRef.current.has(nextIndex)
    ) {
      const nextUrl = audioService.getChunkUrl(bookId, nextIndex);
      // Prefetch by creating a link element
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = nextUrl;
      document.head.appendChild(link);
      preloadedChunksRef.current.add(nextIndex);
    }
  }, [bookId, currentChunkIndex, playlist.length]);

  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleDurationChange = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      // Save position before moving to next chunk
      if (bookId) {
        savePlaybackPosition(bookId, currentTime * 1000);
      }

      // Move to next chunk or stop
      if (currentChunkIndex < playlist.length - 1) {
        nextChunk();
        onChunkEnd?.();
      } else {
        // End of audiobook
        pause();
        if (bookId) {
          savePlaybackPosition(bookId, 0);
        }
      }
    };

    const handleError = () => {
      const error = new Error("Audio playback error");
      onError?.(error);
    };

    const handleCanPlay = () => {
      if (isPlaying) {
        audio.play().catch(() => {
          // Autoplay might be blocked, that's ok
        });
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);
    audio.addEventListener("canplay", handleCanPlay);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("canplay", handleCanPlay);
    };
  }, [
    currentTime,
    currentChunkIndex,
    playlist.length,
    isPlaying,
    bookId,
    nextChunk,
    pause,
    setCurrentTime,
    setDuration,
    savePlaybackPosition,
    onChunkEnd,
    onError,
  ]);

  // Sync volume and playback rate
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.playbackRate = playbackRate;
    }
  }, [volume, playbackRate]);

  // Handle chunk changes - load new chunk
  useEffect(() => {
    if (currentChunkIndex >= 0 && currentChunkIndex < playlist.length) {
      loadChunk(currentChunkIndex);
      preloadNextChunk();
    }
  }, [currentChunkIndex, loadChunk, preloadNextChunk, playlist.length]);

  // Sync play/pause with audio element
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying && audioRef.current.src) {
      audioRef.current.play().catch(() => {
        // Autoplay might be blocked
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Seek to specific time
  const seekTo = useCallback(
    (time: number) => {
      if (audioRef.current) {
        audioRef.current.currentTime = time;
        setCurrentTime(time);
      }
    },
    [setCurrentTime],
  );

  // Get current audio element for external control
  const getAudioElement = useCallback(() => {
    return audioRef.current;
  }, []);

  // Save position periodically
  useEffect(() => {
    if (!bookId || !isPlaying) return;

    const interval = setInterval(() => {
      if (audioRef.current && bookId) {
        const positionMs = audioRef.current.currentTime * 1000;
        savePlaybackPosition(bookId, positionMs);
      }
    }, 10000); // Save every 10 seconds

    return () => clearInterval(interval);
  }, [bookId, isPlaying, savePlaybackPosition]);

  return {
    isPlaying,
    currentTime,
    volume,
    playbackRate,
    currentChunkIndex,
    totalChunks: playlist.length,
    play,
    pause,
    toggle,
    seekTo,
    getAudioElement,
    loadChunk,
  };
}
