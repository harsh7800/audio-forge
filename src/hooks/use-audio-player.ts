import { useQuery } from "@tanstack/react-query";
import { audioService } from "@/api/audio/audio.service";
import { queryKeys } from "@/api/query-keys";

/** Fetch audio status for a book */
export const useAudioStatus = (bookId: string) => {
  return useQuery({
    queryKey: queryKeys.audio.status(bookId),
    queryFn: () => audioService.getStatus(bookId),
    enabled: !!bookId,
  });
};

/** Fetch playlist for streaming */
export const usePlaylist = (bookId: string) => {
  return useQuery({
    queryKey: queryKeys.audio.playlist(bookId),
    queryFn: () => audioService.getPlaylist(bookId),
    enabled: !!bookId,
    // Don't refetch on window focus for audio
    refetchOnWindowFocus: false,
  });
};

/** Get chunk URL for streaming */
export const getChunkUrl = (bookId: string, chunkIndex: number): string => {
  return audioService.getChunkUrl(bookId, chunkIndex);
};

/** Get download URL */
export const getDownloadUrl = (bookId: string): string => {
  return audioService.getDownloadUrl(bookId);
};

/** Download audiobook */
export const useDownloadAudio = () => {
  return useQuery({
    // This is intentionally disabled - use mutation instead for downloads
    queryKey: ["audio", "download"],
    enabled: false,
  });
};
