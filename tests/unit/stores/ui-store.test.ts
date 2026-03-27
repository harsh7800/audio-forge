import { act } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useUIStore } from "@/stores/ui-store";

describe("UI Store", () => {
  beforeEach(() => {
    // Reset store between tests
    useUIStore.setState({
      sidebarOpen: true,
      sidebarCollapsed: false,
      viewMode: "grid",
      sortOrder: "newest",
      filterStatus: "all",
      searchQuery: "",
      theme: "system",
    });
  });

  describe("sidebar", () => {
    it("should toggle sidebar", () => {
      act(() => {
        useUIStore.getState().toggleSidebar();
      });

      expect(useUIStore.getState().sidebarOpen).toBe(false);

      act(() => {
        useUIStore.getState().toggleSidebar();
      });

      expect(useUIStore.getState().sidebarOpen).toBe(true);
    });

    it("should set sidebar open state", () => {
      act(() => {
        useUIStore.getState().setSidebarOpen(false);
      });

      expect(useUIStore.getState().sidebarOpen).toBe(false);
    });

    it("should set sidebar collapsed state", () => {
      act(() => {
        useUIStore.getState().setSidebarCollapsed(true);
      });

      expect(useUIStore.getState().sidebarCollapsed).toBe(true);
    });
  });

  describe("view preferences", () => {
    it("should set view mode", () => {
      act(() => {
        useUIStore.getState().setViewMode("list");
      });

      expect(useUIStore.getState().viewMode).toBe("list");
    });

    it("should set sort order", () => {
      act(() => {
        useUIStore.getState().setSortOrder("title_asc");
      });

      expect(useUIStore.getState().sortOrder).toBe("title_asc");
    });

    it("should set filter status", () => {
      act(() => {
        useUIStore.getState().setFilterStatus("COMPLETED");
      });

      expect(useUIStore.getState().filterStatus).toBe("COMPLETED");
    });
  });

  describe("search", () => {
    it("should set search query", () => {
      act(() => {
        useUIStore.getState().setSearchQuery("test book");
      });

      expect(useUIStore.getState().searchQuery).toBe("test book");
    });

    it("should clear search query", () => {
      act(() => {
        useUIStore.getState().setSearchQuery("test");
        useUIStore.getState().setSearchQuery("");
      });

      expect(useUIStore.getState().searchQuery).toBe("");
    });
  });

  describe("theme", () => {
    it("should set theme to light", () => {
      act(() => {
        useUIStore.getState().setTheme("light");
      });

      expect(useUIStore.getState().theme).toBe("light");
    });

    it("should set theme to dark", () => {
      act(() => {
        useUIStore.getState().setTheme("dark");
      });

      expect(useUIStore.getState().theme).toBe("dark");
    });

    it("should set theme to system", () => {
      act(() => {
        useUIStore.getState().setTheme("dark");
        useUIStore.getState().setTheme("system");
      });

      expect(useUIStore.getState().theme).toBe("system");
    });
  });
});
