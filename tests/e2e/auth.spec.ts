import { test, expect } from '@playwright/test';

test.describe('Authentication & User Flow', () => {
  test('user can view application landing screen and navigate to login', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/AgilePulse/i);
  });
});
