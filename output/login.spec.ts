import { test, expect } from '@playwright/test';

test.describe('User Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('User can navigate to the login page at /login', async ({ page }) => {
    expect(page.url()).toContain('/login');
    await expect(page).toHaveTitle('The Internet');
  });

  test('User sees a username field and a password field', async ({ page }) => {
    const usernameField = page.locator('input#username');
    const passwordField = page.locator('input#password');
    
    await expect(usernameField).toBeVisible();
    await expect(passwordField).toBeVisible();
    await expect(usernameField).toHaveAttribute('type', 'text');
    await expect(passwordField).toHaveAttribute('type', 'password');
  });

  test('User sees a Login button', async ({ page }) => {
    const loginButton = page.locator('button[type="submit"]');
    await expect(loginButton).toBeVisible();
    await expect(loginButton).toContainText('Login');
  });

  test('Valid credentials redirect to /secure with success message', async ({ page }) => {
    await page.locator('input#username').fill('tomsmith');
    await page.locator('input#password').fill('SuperSecretPassword!');
    await page.locator('button[type="submit"]').click();
    
    await expect(page).toHaveURL(/\/secure/);
    
    const flashMessage = page.locator('.flash.success');
    await expect(flashMessage).toBeVisible();
    await expect(flashMessage).toContainText('You logged into a secure area!');
  });

  test('Invalid username shows error message', async ({ page }) => {
    await page.locator('input#username').fill('invaliduser');
    await page.locator('input#password').fill('SuperSecretPassword!');
    await page.locator('button[type="submit"]').click();
    
    const flashMessage = page.locator('.flash.error');
    await expect(flashMessage).toBeVisible();
    await expect(flashMessage).toContainText('Your username is invalid!');
    
    expect(page.url()).toContain('/login');
  });

  test('Invalid password with valid username shows error message', async ({ page }) => {
    await page.locator('input#username').fill('tomsmith');
    await page.locator('input#password').fill('WrongPassword');
    await page.locator('button[type="submit"]').click();
    
    const flashMessage = page.locator('.flash.error');
    await expect(flashMessage).toBeVisible();
    await expect(flashMessage).toContainText('Your password is invalid!');
    
    expect(page.url()).toContain('/login');
  });

  test('Empty username field shows invalid username error', async ({ page }) => {
    await page.locator('input#password').fill('SuperSecretPassword!');
    await page.locator('button[type="submit"]').click();
    
    const flashMessage = page.locator('.flash.error');
    await expect(flashMessage).toBeVisible();
    await expect(flashMessage).toContainText('Your username is invalid!');
    
    expect(page.url()).toContain('/login');
  });

  test('Empty password field shows invalid password error', async ({ page }) => {
    await page.locator('input#username').fill('tomsmith');
    await page.locator('button[type="submit"]').click();
    
    const flashMessage = page.locator('.flash.error');
    await expect(flashMessage).toBeVisible();
    await expect(flashMessage).toContainText('Your password is invalid!');
    
    expect(page.url()).toContain('/login');
  });

  test('Both fields empty shows invalid username error', async ({ page }) => {
    await page.locator('button[type="submit"]').click();
    
    const flashMessage = page.locator('.flash.error');
    await expect(flashMessage).toBeVisible();
    await expect(flashMessage).toContainText('Your username is invalid!');
    
    expect(page.url()).toContain('/login');
  });
});
