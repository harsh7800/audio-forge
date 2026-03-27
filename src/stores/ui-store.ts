import { create } from "zustand";
import { persist } from "zustand/middleware";

type ViewMode = "grid" | "list";
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

interface UIState {
  // Sidebar
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;

  // Library view preferences
  viewMode: ViewMode;
  sortOrder: SortOrder;
  filterStatus: FilterStatus;

  // Search
  searchQuery: string;

  // Theme
  theme: "light" | "dark" | "system";

  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setViewMode: (mode: ViewMode) => void;
  setSortOrder: (order: SortOrder) => void;
  setFilterStatus: (status: FilterStatus) => void;
  setSearchQuery: (query: string) => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Initial state
      sidebarOpen: true,
      sidebarCollapsed: false,
      viewMode: "grid",
      sortOrder: "newest",
      filterStatus: "all",
      searchQuery: "",
      theme: "system",

      // Actions
      toggleSidebar: () =>
        set((state) => ({
          sidebarOpen: !state.sidebarOpen,
        })),

      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      setViewMode: (mode) => set({ viewMode: mode }),

      setSortOrder: (order) => set({ sortOrder: order }),

      setFilterStatus: (status) => set({ filterStatus: status }),

      setSearchQuery: (query) => set({ searchQuery: query }),

      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "audioforge-ui",
      partialize: (state) => ({
        viewMode: state.viewMode,
        sortOrder: state.sortOrder,
        filterStatus: state.filterStatus,
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
      }),
    },
  ),
);
