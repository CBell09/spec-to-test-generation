import { test, expect } from '@playwright/test';

test.describe('User Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('User can navigate to the login page', async ({ page }) => {
    expect(page.url()).toContain('/login');
  });

  test('User sees email field on login page', async ({ page }) => {
    const emailField = page.locator('input[type="email"], input[name="email"]');
    await expect(emailField).toBeVisible();
  });

  test('User sees password field on login page', async ({ page }) => {
    const passwordField = page.locator('input[type="password"], input[name="password"]');
    await expect(passwordField).toBeVisible();
  });

  test('User sees Sign In button on login page', async ({ page }) => {
    const signInButton = page.locator('button:has-text("Sign In"), button[type="submit"]');
    await expect(signInButton).toBeVisible();
  });

  test('User is redirected to dashboard with valid credentials', async ({ page }) => {
    const emailField = page.locator('input[type="email"], input[name="email"]');
    const passwordField = page.locator('input[type="password"], input[name="password"]');
    const signInButton = page.locator('button:has-text("Sign In"), button[type="submit"]');

    await emailField.fill('valid@example.com');
    await passwordField.fill('correctpassword');
    await signInButton.click();

    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('User sees error message with invalid credentials', async ({ page }) => {
    const emailField = page.locator('input[type="email"], input[name="email"]');
    const passwordField = page.locator('input[type="password"], input[name="password"]');
    const signInButton = page.locator('button:has-text("Sign In"), button[type="submit"]');

    await emailField.fill('user@example.com');
    await passwordField.fill('wrongpassword');
    await signInButton.click();

    const errorMessage = page.locator('text=Invalid email or password');
    await expect(errorMessage).toBeVisible();
  });

  test('Email field validates proper email format', async ({ page }) => {
    const emailField = page.locator('input[type="email"], input[name="email"]');
    const passwordField = page.locator('input[type="password"], input[name="password"]');
    const signInButton = page.locator('button:has-text("Sign In"), button[type="submit"]');

    await emailField.fill('invalidemail');
    await passwordField.fill('password123');
    await signInButton.click();

    const validationError = page.locator('text=/invalid|email|format/i');
    await expect(validationError).toBeVisible();
  });

  test('User sees validation error when email field is empty', async ({ page }) => {
    const passwordField = page.locator('input[type="password"], input[name="password"]');
    const signInButton = page.locator('button:has-text("Sign In"), button[type="submit"]');

    await passwordField.fill('password123');
    await signInButton.click();

    const validationError = page.locator('text=/required|empty|email/i');
    await expect(validationError).toBeVisible();
  });

  test('User sees validation error when password field is empty', async ({ page }) => {
    const emailField = page.locator('input[type="email"], input[name="email"]');
    const signInButton = page.locator('button:has-text("Sign In"), button[type="submit"]');

    await emailField.fill('user@example.com');
    await signInButton.click();

    const validationError = page.locator('text=/required|empty|password/i');
    await expect(validationError).toBeVisible();
  });

  test('User sees validation errors when both fields are empty', async ({ page }) => {
    const signInButton = page.locator('button:has-text("Sign In"), button[type="submit"]');

    await signInButton.click();

    const validationErrors = page.locator('text=/required|empty/i');
    await expect(validationErrors).toHaveCount(2);
  });
});
