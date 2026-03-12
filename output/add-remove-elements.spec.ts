import { test, expect } from '@playwright/test';

test.describe('Add/Remove Elements', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/add_remove_elements/');
  });

  test('User can navigate to the add/remove elements page', async ({ page }) => {
    await expect(page).toHaveURL(/\/add_remove_elements\/?$/);
  });

  test('User sees an Add Element button on the page', async ({ page }) => {
    const addButton = page.locator('button:has-text("Add Element")');
    await expect(addButton).toBeVisible();
  });

  test('No Delete buttons are visible on page load', async ({ page }) => {
    const deleteButtons = page.locator('button.added-manually');
    await expect(deleteButtons).toHaveCount(0);
  });

  test('When user clicks Add Element, a Delete button appears', async ({ page }) => {
    const addButton = page.locator('button:has-text("Add Element")');
    const deleteButtons = page.locator('button.added-manually');

    await expect(deleteButtons).toHaveCount(0);
    await addButton.click();
    await expect(deleteButtons).toHaveCount(1);
    await expect(deleteButtons.first()).toHaveText('Delete');
  });

  test('When user clicks Add Element multiple times, multiple Delete buttons appear', async ({ page }) => {
    const addButton = page.locator('button:has-text("Add Element")');
    const deleteButtons = page.locator('button.added-manually');

    await addButton.click();
    await expect(deleteButtons).toHaveCount(1);

    await addButton.click();
    await expect(deleteButtons).toHaveCount(2);

    await addButton.click();
    await expect(deleteButtons).toHaveCount(3);

    for (let i = 0; i < 3; i++) {
      await expect(deleteButtons.nth(i)).toHaveText('Delete');
    }
  });

  test('When user clicks a Delete button, that button is removed from the page', async ({ page }) => {
    const addButton = page.locator('button:has-text("Add Element")');
    const deleteButtons = page.locator('button.added-manually');

    await addButton.click();
    await addButton.click();
    await expect(deleteButtons).toHaveCount(2);

    await deleteButtons.first().click();
    await expect(deleteButtons).toHaveCount(1);
  });

  test('After removing all added elements, no Delete buttons remain on the page', async ({ page }) => {
    const addButton = page.locator('button:has-text("Add Element")');
    const deleteButtons = page.locator('button.added-manually');

    await addButton.click();
    await addButton.click();
    await expect(deleteButtons).toHaveCount(2);

    await deleteButtons.nth(0).click();
    await expect(deleteButtons).toHaveCount(1);

    await deleteButtons.nth(0).click();
    await expect(deleteButtons).toHaveCount(0);
  });

  test('Multiple add and remove operations work correctly in sequence', async ({ page }) => {
    const addButton = page.locator('button:has-text("Add Element")');
    const deleteButtons = page.locator('button.added-manually');

    await addButton.click();
    await addButton.click();
    await addButton.click();
    await expect(deleteButtons).toHaveCount(3);

    await deleteButtons.nth(1).click();
    await expect(deleteButtons).toHaveCount(2);

    await addButton.click();
    await expect(deleteButtons).toHaveCount(3);

    await deleteButtons.first().click();
    await deleteButtons.first().click();
    await expect(deleteButtons).toHaveCount(1);

    await deleteButtons.first().click();
    await expect(deleteButtons).toHaveCount(0);
  });
});
