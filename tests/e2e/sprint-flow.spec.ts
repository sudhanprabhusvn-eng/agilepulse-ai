import { test, expect } from '@playwright/test';

test.describe('Sprint Management Journey', () => {
  test('navigates through active sprint board', async ({ page }) => {
    await page.goto('/');
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
  });
});
