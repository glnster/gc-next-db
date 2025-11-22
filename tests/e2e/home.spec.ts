import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/');

    // Check that the main heading is visible
    await expect(page.getByRole('heading', { name: /Welcome to GC Next.js + DB Scaffold/i })).toBeVisible();
  });

  test('should display the features list', async ({ page }) => {
    await page.goto('/');

    // Check that features section is visible
    const featuresHeading = page.getByRole('heading', { name: /Features/i });
    await expect(featuresHeading).toBeVisible();

    // Check for specific feature items
    await expect(page.getByText(/Docker containers/i)).toBeVisible();
    await expect(page.getByText(/Hot module replacement/i)).toBeVisible();
    await expect(page.getByText(/Tailwind CSS for styling/i)).toBeVisible();
    await expect(page.getByText(/TypeScript/i)).toBeVisible();
    await expect(page.getByText(/Playwright/i)).toBeVisible();
    await expect(page.getByText(/Storybook/i)).toBeVisible();
  });

  test('should be responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /Welcome to GC Next.js + DB Scaffold/i })).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.getByRole('heading', { name: /Welcome to GC Next.js + DB Scaffold/i })).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.getByRole('heading', { name: /Welcome to GC Next.js + DB Scaffold/i })).toBeVisible();
  });

  test('should have proper page title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/GC Next.js + DB Scaffold/i);
  });
});

