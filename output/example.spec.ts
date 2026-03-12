import { test, expect } from '@playwright/test';

test.describe('Example Feature Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Setup before each test
    await page.goto('/');
  });

  test('should load the application successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/.*/);
  });

  test('should display main content', async ({ page }) => {
    const content = page.locator('main');
    await expect(content).toBeVisible();
  });
});
