"use client";

import { useCallback, useEffect } from "react";
import { usePlayerStore } from "@/stores/player-store";

interface UseKeyboardShortcutsOptions {
  /** Whether shortcuts are enabled (e.g., when player is focused) */
  enabled?: boolean;
  /** Seek amount in seconds for arrow keys */
  seekAmount?: number;
  /** Volume change amount (0-1) */
  volumeStep?: number;
  /** Element to attach listeners to (defaults to document) */
  element?: HTMLElement | Document;
}

/**
 * Hook for keyboard shortcuts in the audio player
 * - Space: play/pause
 * - ArrowLeft: seek backward
 * - ArrowRight: seek forward
 * - ArrowUp: volume up
 * - ArrowDown: volume down
 * - Number keys (1-9): seek to percentage (1 = 10%, 2 = 20%, etc.)
 */
export function useKeyboardShortcuts({
  enabled = true,
  seekAmount = 10,
  volumeStep = 0.1,
  element = typeof document !== "undefined" ? document : undefined,
}: UseKeyboardShortcutsOptions = {}) {
  const {
    currentTime,
    duration,
    volume,
    toggle,
    setCurrentTime,
    setVolume,
    nextChunk,
    prevChunk,
    currentChunkIndex,
    totalChunks,
  } = usePlayerStore();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      // Don't trigger if modifier keys are pressed
      if (e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }

      switch (e.key) {
        case " ": // Space - play/pause
          e.preventDefault();
          toggle();
          break;

        case "ArrowLeft": // Seek backward
          e.preventDefault();
          if (currentTime > 0) {
            setCurrentTime(Math.max(0, currentTime - seekAmount));
          } else if (currentChunkIndex > 0) {
            // Go to previous chunk
            prevChunk();
          }
          break;

        case "ArrowRight": // Seek forward
          e.preventDefault();
          if (currentTime < duration - 1) {
            setCurrentTime(Math.min(duration, currentTime + seekAmount));
          } else if (currentChunkIndex < totalChunks - 1) {
            // Go to next chunk
            nextChunk();
          }
          break;

        case "ArrowUp": // Volume up
          e.preventDefault();
          setVolume(Math.min(1, volume + volumeStep));
          break;

        case "ArrowDown": // Volume down
          e.preventDefault();
          setVolume(Math.max(0, volume - volumeStep));
          break;

        // Number keys 1-9 for percentage seeking
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          if (duration > 0) {
            e.preventDefault();
            const percent = parseInt(e.key, 10) * 0.1;
            setCurrentTime(duration * percent);
          }
          break;

        case "0":
          // 0 goes to beginning
          if (duration > 0) {
            e.preventDefault();
            setCurrentTime(0);
          }
          break;
      }
    },
    [
      toggle,
      currentTime,
      duration,
      volume,
      seekAmount,
      volumeStep,
      setCurrentTime,
      setVolume,
      nextChunk,
      prevChunk,
      currentChunkIndex,
      totalChunks,
    ],
  );

  useEffect(() => {
    if (!enabled || !element) return;

    const handler = (e: Event) => handleKeyDown(e as KeyboardEvent);
    element.addEventListener("keydown", handler);
    return () => {
      element.removeEventListener("keydown", handler);
    };
  }, [enabled, element, handleKeyDown]);
}
