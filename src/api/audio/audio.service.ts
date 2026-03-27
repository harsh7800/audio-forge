import { apiClient } from "../client";
import type { ApiResponse, AudioStatus, PlaylistItem } from "../types";

export const audioService = {
  /** Get audio status for a book */
  getStatus: async (bookId: string): Promise<AudioStatus> => {
    const response = await apiClient.get<ApiResponse<AudioStatus>>(
      `/audio/${bookId}`,
    );
    return response.data.data;
  },

  /** Get playlist for streaming */
  getPlaylist: async (bookId: string): Promise<PlaylistItem[]> => {
    const response = await apiClient.get<ApiResponse<PlaylistItem[]>>(
      `/audio/${bookId}/playlist`,
    );
    return response.data.data;
  },

  /** Get chunk URL for streaming */
  getChunkUrl: (bookId: string, chunkIndex: number): string => {
    return `${apiClient.defaults.baseURL}/audio/${bookId}/chunk/${chunkIndex}`;
  },

  /** Get download URL for full audiobook */
  getDownloadUrl: (bookId: string): string => {
    return `${apiClient.defaults.baseURL}/audio/${bookId}/download`;
  },

  /** Download full audiobook */
  downloadAudio: async (bookId: string): Promise<Blob> => {
    const response = await apiClient.get(`/audio/${bookId}/download`, {
      responseType: "blob",
    });
    return response.data;
  },
};
