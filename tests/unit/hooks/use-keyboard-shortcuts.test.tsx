import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { usePlayerStore } from "@/stores/player-store";

// Mock the player store
vi.mock("@/stores/player-store", () => ({
  usePlayerStore: vi.fn(),
}));

describe("useKeyboardShortcuts", () => {
  const mockToggle = vi.fn();
  const mockSetCurrentTime = vi.fn();
  const mockSetVolume = vi.fn();
  const mockNextChunk = vi.fn();
  const mockPrevChunk = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(usePlayerStore).mockReturnValue({
      isPlaying: false,
      currentTime: 30,
      duration: 300,
      volume: 0.5,
      toggle: mockToggle,
      setCurrentTime: mockSetCurrentTime,
      setVolume: mockSetVolume,
      nextChunk: mockNextChunk,
      prevChunk: mockPrevChunk,
      currentChunkIndex: 0,
      totalChunks: 10,
    } as ReturnType<typeof usePlayerStore>);
  });

  it("unit-shortcuts-002: Space should toggle play/pause", () => {
    const { unmount } = renderHook(() => useKeyboardShortcuts());

    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: " " }));
    });

    expect(mockToggle).toHaveBeenCalledTimes(1);
    unmount();
  });

  it("unit-shortcuts-003: ArrowLeft should seek backward 10s", () => {
    const { unmount } = renderHook(() => useKeyboardShortcuts());

    act(() => {
      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowLeft" }),
      );
    });

    expect(mockSetCurrentTime).toHaveBeenCalledWith(20); // 30 - 10
    unmount();
  });

  it("unit-shortcuts-004: ArrowRight should seek forward 10s", () => {
    const { unmount } = renderHook(() => useKeyboardShortcuts());

    act(() => {
      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowRight" }),
      );
    });

    expect(mockSetCurrentTime).toHaveBeenCalledWith(40); // 30 + 10
    unmount();
  });

  it("unit-shortcuts-005: ArrowUp should increase volume", () => {
    const { unmount } = renderHook(() => useKeyboardShortcuts());

    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
    });

    expect(mockSetVolume).toHaveBeenCalledWith(0.6); // 0.5 + 0.1
    unmount();
  });

  it("unit-shortcuts-006: ArrowDown should decrease volume", () => {
    const { unmount } = renderHook(() => useKeyboardShortcuts());

    act(() => {
      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown" }),
      );
    });

    expect(mockSetVolume).toHaveBeenCalledWith(0.4); // 0.5 - 0.1
    unmount();
  });

  it("unit-shortcuts-007: Number keys should seek to percentage", () => {
    const { unmount } = renderHook(() => useKeyboardShortcuts());

    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "5" }));
    });

    expect(mockSetCurrentTime).toHaveBeenCalledWith(150); // 300 * 0.5
    unmount();
  });

  it("unit-shortcuts-008: Should ignore when ctrl/meta/alt pressed", () => {
    const { unmount } = renderHook(() => useKeyboardShortcuts());

    act(() => {
      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: " ", ctrlKey: true }),
      );
    });

    expect(mockToggle).not.toHaveBeenCalled();
    unmount();
  });

  it("unit-shortcuts-009: ArrowLeft at start should go to prev chunk", () => {
    // Reset mock with different state
    vi.mocked(usePlayerStore).mockReturnValue({
      isPlaying: false,
      currentTime: 0,
      duration: 300,
      volume: 0.5,
      toggle: mockToggle,
      setCurrentTime: mockSetCurrentTime,
      setVolume: mockSetVolume,
      nextChunk: mockNextChunk,
      prevChunk: mockPrevChunk,
      currentChunkIndex: 1,
      totalChunks: 10,
    } as ReturnType<typeof usePlayerStore>);

    const { unmount } = renderHook(() => useKeyboardShortcuts());

    act(() => {
      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowLeft" }),
      );
    });

    expect(mockPrevChunk).toHaveBeenCalledTimes(1);
    unmount();
  });

  it("unit-shortcuts-010: ArrowRight at end should go to next chunk", () => {
    // Reset mock with different state - set currentTime = duration so condition triggers
    // For else branch: currentChunkIndex must be < totalChunks - 1
    vi.mocked(usePlayerStore).mockReturnValue({
      isPlaying: false,
      currentTime: 300, // duration = 300, so currentTime < duration-1 = 300 < 299 = false
      duration: 300,
      volume: 0.5,
      toggle: mockToggle,
      setCurrentTime: mockSetCurrentTime,
      setVolume: mockSetVolume,
      nextChunk: mockNextChunk,
      prevChunk: mockPrevChunk,
      currentChunkIndex: 8, // 8 < 10-1 = 9 = true, so nextChunk called
      totalChunks: 10,
    } as ReturnType<typeof usePlayerStore>);

    const { unmount } = renderHook(() => useKeyboardShortcuts());

    act(() => {
      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowRight" }),
      );
    });

    expect(mockNextChunk).toHaveBeenCalledTimes(1);
    unmount();
  });

  it("should not trigger when disabled", () => {
    const { unmount } = renderHook(() =>
      useKeyboardShortcuts({ enabled: false }),
    );

    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: " " }));
    });

    expect(mockToggle).not.toHaveBeenCalled();
    unmount();
  });

  it("0 key should go to beginning", () => {
    const { unmount } = renderHook(() => useKeyboardShortcuts());

    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "0" }));
    });

    expect(mockSetCurrentTime).toHaveBeenCalledWith(0);
    unmount();
  });

  it("should respect custom seekAmount", () => {
    const { unmount } = renderHook(() =>
      useKeyboardShortcuts({ seekAmount: 30 }),
    );

    act(() => {
      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowLeft" }),
      );
    });

    expect(mockSetCurrentTime).toHaveBeenCalledWith(0); // 30 - 30 = 0
    unmount();
  });

  it("should respect custom volumeStep", () => {
    const { unmount } = renderHook(() =>
      useKeyboardShortcuts({ volumeStep: 0.2 }),
    );

    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
    });

    expect(mockSetVolume).toHaveBeenCalledWith(0.7); // 0.5 + 0.2
    unmount();
  });
});
