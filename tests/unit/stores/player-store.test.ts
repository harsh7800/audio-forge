import { act } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { usePlayerStore } from "@/stores/player-store";

describe("Player Store", () => {
  beforeEach(() => {
    // Reset store between tests
    usePlayerStore.setState({
      bookId: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 1,
      playbackRate: 1,
      currentChunkIndex: 0,
      totalChunks: 0,
      playbackPositions: {},
    });
  });

  describe("setBook", () => {
    it("should set book and reset playback state", () => {
      act(() => {
        usePlayerStore.getState().setBook("book-123", 10);
      });

      const state = usePlayerStore.getState();
      expect(state.bookId).toBe("book-123");
      expect(state.totalChunks).toBe(10);
      expect(state.currentChunkIndex).toBe(0);
      expect(state.currentTime).toBe(0);
      expect(state.isPlaying).toBe(false);
    });
  });

  describe("clearBook", () => {
    it("should clear book and reset state", () => {
      act(() => {
        usePlayerStore.getState().setBook("book-123", 10);
        usePlayerStore.getState().play();
      });

      act(() => {
        usePlayerStore.getState().clearBook();
      });

      const state = usePlayerStore.getState();
      expect(state.bookId).toBeNull();
      expect(state.totalChunks).toBe(0);
      expect(state.isPlaying).toBe(false);
    });
  });

  describe("play/pause/toggle", () => {
    it("should play", () => {
      act(() => {
        usePlayerStore.getState().play();
      });

      expect(usePlayerStore.getState().isPlaying).toBe(true);
    });

    it("should pause", () => {
      act(() => {
        usePlayerStore.getState().play();
        usePlayerStore.getState().pause();
      });

      expect(usePlayerStore.getState().isPlaying).toBe(false);
    });

    it("should toggle play state", () => {
      act(() => {
        usePlayerStore.getState().toggle();
      });

      expect(usePlayerStore.getState().isPlaying).toBe(true);

      act(() => {
        usePlayerStore.getState().toggle();
      });

      expect(usePlayerStore.getState().isPlaying).toBe(false);
    });
  });

  describe("setters", () => {
    it("should set current time", () => {
      act(() => {
        usePlayerStore.getState().setCurrentTime(120);
      });

      expect(usePlayerStore.getState().currentTime).toBe(120);
    });

    it("should set duration", () => {
      act(() => {
        usePlayerStore.getState().setDuration(300);
      });

      expect(usePlayerStore.getState().duration).toBe(300);
    });

    it("should set volume", () => {
      act(() => {
        usePlayerStore.getState().setVolume(0.5);
      });

      expect(usePlayerStore.getState().volume).toBe(0.5);
    });

    it("should set playback rate", () => {
      act(() => {
        usePlayerStore.getState().setPlaybackRate(1.5);
      });

      expect(usePlayerStore.getState().playbackRate).toBe(1.5);
    });
  });

  describe("chunk navigation", () => {
    beforeEach(() => {
      act(() => {
        usePlayerStore.getState().setBook("book-123", 5);
      });
    });

    it("should go to next chunk", () => {
      act(() => {
        usePlayerStore.getState().nextChunk();
      });

      expect(usePlayerStore.getState().currentChunkIndex).toBe(1);
    });

    it("should not go beyond total chunks", () => {
      act(() => {
        usePlayerStore.getState().setChunkIndex(4);
        usePlayerStore.getState().nextChunk();
      });

      expect(usePlayerStore.getState().currentChunkIndex).toBe(4);
    });

    it("should go to previous chunk", () => {
      act(() => {
        usePlayerStore.getState().setChunkIndex(2);
        usePlayerStore.getState().prevChunk();
      });

      expect(usePlayerStore.getState().currentChunkIndex).toBe(1);
    });

    it("should not go below 0", () => {
      act(() => {
        usePlayerStore.getState().prevChunk();
      });

      expect(usePlayerStore.getState().currentChunkIndex).toBe(0);
    });

    it("should set specific chunk index", () => {
      act(() => {
        usePlayerStore.getState().setChunkIndex(3);
      });

      expect(usePlayerStore.getState().currentChunkIndex).toBe(3);
    });

    it("should reset time when changing chunk", () => {
      act(() => {
        usePlayerStore.getState().setCurrentTime(100);
        usePlayerStore.getState().nextChunk();
      });

      expect(usePlayerStore.getState().currentTime).toBe(0);
    });
  });

  describe("playback positions", () => {
    it("should save playback position", () => {
      act(() => {
        usePlayerStore.getState().savePlaybackPosition("book-123", 45000);
      });

      const position = usePlayerStore
        .getState()
        .getPlaybackPosition("book-123");
      expect(position).not.toBeNull();
      expect(position?.positionMs).toBe(45000);
      expect(position?.bookId).toBe("book-123");
    });

    it("should return null for non-existent position", () => {
      const position = usePlayerStore
        .getState()
        .getPlaybackPosition("non-existent");
      expect(position).toBeNull();
    });

    it("should update existing playback position", () => {
      act(() => {
        usePlayerStore.getState().savePlaybackPosition("book-123", 10000);
        usePlayerStore.getState().savePlaybackPosition("book-123", 20000);
      });

      const position = usePlayerStore
        .getState()
        .getPlaybackPosition("book-123");
      expect(position?.positionMs).toBe(20000);
    });
  });
});
