import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PlaybackPosition {
  bookId: string;
  positionMs: number;
  lastPlayedAt: string;
}

interface PlayerState {
  // Current track
  bookId: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;

  // Chunk/playlist tracking
  currentChunkIndex: number;
  totalChunks: number;

  // Playback history (persisted)
  playbackPositions: Record<string, PlaybackPosition>;

  // Actions
  setBook: (bookId: string, totalChunks: number) => void;
  clearBook: () => void;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
  nextChunk: () => void;
  prevChunk: () => void;
  setChunkIndex: (index: number) => void;
  savePlaybackPosition: (bookId: string, positionMs: number) => void;
  getPlaybackPosition: (bookId: string) => PlaybackPosition | null;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      // Initial state
      bookId: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 1,
      playbackRate: 1,
      currentChunkIndex: 0,
      totalChunks: 0,
      playbackPositions: {},

      // Actions
      setBook: (bookId, totalChunks) =>
        set({
          bookId,
          totalChunks,
          currentChunkIndex: 0,
          currentTime: 0,
          isPlaying: false,
        }),

      clearBook: () =>
        set({
          bookId: null,
          totalChunks: 0,
          currentChunkIndex: 0,
          currentTime: 0,
          duration: 0,
          isPlaying: false,
        }),

      play: () => set({ isPlaying: true }),
      pause: () => set({ isPlaying: false }),
      toggle: () => set((state) => ({ isPlaying: !state.isPlaying })),

      setCurrentTime: (time) => set({ currentTime: time }),
      setDuration: (duration) => set({ duration }),

      setVolume: (volume) => set({ volume }),
      setPlaybackRate: (rate) => set({ playbackRate: rate }),

      nextChunk: () =>
        set((state) => {
          if (state.currentChunkIndex < state.totalChunks - 1) {
            return {
              currentChunkIndex: state.currentChunkIndex + 1,
              currentTime: 0,
            };
          }
          return state;
        }),

      prevChunk: () =>
        set((state) => {
          if (state.currentChunkIndex > 0) {
            return {
              currentChunkIndex: state.currentChunkIndex - 1,
              currentTime: 0,
            };
          }
          return state;
        }),

      setChunkIndex: (index) =>
        set((state) => {
          if (index >= 0 && index < state.totalChunks) {
            return { currentChunkIndex: index, currentTime: 0 };
          }
          return state;
        }),

      savePlaybackPosition: (bookId, positionMs) =>
        set((state) => ({
          playbackPositions: {
            ...state.playbackPositions,
            [bookId]: {
              bookId,
              positionMs,
              lastPlayedAt: new Date().toISOString(),
            },
          },
        })),

      getPlaybackPosition: (bookId) => {
        const state = get();
        return state.playbackPositions[bookId] || null;
      },
    }),
    {
      name: "audioforge-player",
      partialize: (state) => ({
        playbackPositions: state.playbackPositions,
        volume: state.volume,
        playbackRate: state.playbackRate,
      }),
    },
  ),
);
