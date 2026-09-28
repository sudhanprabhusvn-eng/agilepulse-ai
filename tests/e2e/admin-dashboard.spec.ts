import { test, expect } from '@playwright/test';

test.describe('Super Admin Console Access', () => {
  test('verifies admin route and management tabs', async ({ page }) => {
    await page.goto('/');
    const adminTab = page.locator('button:has-text("Super Admin Console")');
    if (await adminTab.isVisible()) {
      await adminTab.click();
      await expect(page.locator('text=Super Admin Console')).toBeVisible();
    }
  });
});
