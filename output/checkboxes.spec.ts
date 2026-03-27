import { test, expect } from '@playwright/test';

test.describe('Checkboxes Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/checkboxes');
  });

  test('User can navigate to the checkboxes page', async ({ page }) => {
    expect(page.url()).toContain('/checkboxes');
  });

  test('User sees two checkboxes on the page', async ({ page }) => {
    const checkboxes = await page.locator('input[type="checkbox"]').count();
    expect(checkboxes).toBe(2);
  });

  test('Checkbox 1 is unchecked by default', async ({ page }) => {
    const checkbox1 = page.locator('input[type="checkbox"]:nth-of-type(1)');
    await expect(checkbox1).not.toBeChecked();
  });

  test('Checkbox 2 is checked by default', async ({ page }) => {
    const checkbox2 = page.locator('input[type="checkbox"]:nth-of-type(2)');
    await expect(checkbox2).toBeChecked();
  });

  test('User can check Checkbox 1 and it becomes checked', async ({ page }) => {
    const checkbox1 = page.locator('input[type="checkbox"]:nth-of-type(1)');
    await checkbox1.check();
    await expect(checkbox1).toBeChecked();
  });

  test('User can uncheck Checkbox 2 and it becomes unchecked', async ({ page }) => {
    const checkbox2 = page.locator('input[type="checkbox"]:nth-of-type(2)');
    await checkbox2.uncheck();
    await expect(checkbox2).not.toBeChecked();
  });

  test('Both checkboxes can be toggled independently without affecting each other', async ({ page }) => {
    const checkbox1 = page.locator('input[type="checkbox"]:nth-of-type(1)');
    const checkbox2 = page.locator('input[type="checkbox"]:nth-of-type(2)');

    // Initial state: checkbox1 unchecked, checkbox2 checked
    await expect(checkbox1).not.toBeChecked();
    await expect(checkbox2).toBeChecked();

    // Check checkbox1
    await checkbox1.check();
    await expect(checkbox1).toBeChecked();
    await expect(checkbox2).toBeChecked(); // checkbox2 should remain checked

    // Uncheck checkbox2
    await checkbox2.uncheck();
    await expect(checkbox1).toBeChecked(); // checkbox1 should remain checked
    await expect(checkbox2).not.toBeChecked();

    // Uncheck checkbox1
    await checkbox1.uncheck();
    await expect(checkbox1).not.toBeChecked();
    await expect(checkbox2).not.toBeChecked(); // checkbox2 should remain unchecked

    // Check checkbox2
    await checkbox2.check();
    await expect(checkbox1).not.toBeChecked(); // checkbox1 should remain unchecked
    await expect(checkbox2).toBeChecked();
  });
});
