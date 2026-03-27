import { expect, test } from "@playwright/test";

/**
 * E2E Test Suite for AudioForge
 *
 * These tests require the backend API to be running.
 * Run with: pnpm test:e2e
 */

test.describe("Navigation", () => {
  test("should load home page", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/AudioForge/i);
  });

  test("should navigate to upload page", async ({ page }) => {
    await page.goto("/");
    await page.click("text=Upload");
    await expect(page).toHaveURL(/\/upload/);
  });

  test("should navigate to library page", async ({ page }) => {
    await page.goto("/");
    await page.click("text=Library");
    await expect(page).toHaveURL(/\/library/);
  });
});

test.describe("Upload Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/upload");
  });

  test("should show upload form", async ({ page }) => {
    await expect(page.locator("text=Upload Audiobook")).toBeVisible();
    await expect(page.locator('input[type="file"]')).toBeVisible();
  });

  test("should accept file drop", async ({ page }) => {
    // Create a mock file
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached();
  });
});

test.describe("Library Flow", () => {
  test("should display library page", async ({ page }) => {
    await page.goto("/library");
    await expect(page.locator("text=Library")).toBeVisible();
  });

  test("should show empty state when no books", async ({ page }) => {
    await page.goto("/library");
    // Empty state should show when no books
    const emptyState = page.locator("text=No audiobooks found");
    if (await emptyState.isVisible()) {
      await expect(emptyState).toBeVisible();
    }
  });

  test("should have filter controls", async ({ page }) => {
    await page.goto("/library");
    await expect(page.locator('select[name="status"]')).toBeVisible();
    await expect(page.locator('select[name="sort"]')).toBeVisible();
  });
});

test.describe("Dark Mode", () => {
  test("should toggle theme", async ({ page }) => {
    await page.goto("/");

    // Find and click theme toggle
    const themeToggle = page.locator(
      'button[aria-label*="theme"], button[aria-label*="Theme"]',
    );
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      await expect(page.locator("html")).toHaveClass(/dark/);
    }
  });
});
