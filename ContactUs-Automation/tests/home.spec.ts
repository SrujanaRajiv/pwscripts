import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

/**
 * Homepage smoke checks.
 * Confirms the landing page is usable and the Contact Us challenge tile is ready
 * (correct href + opens in a new tab via target=_blank).
 */
test.describe('Homepage', () => {
  test('loads and exposes Contact Us within Test Automation Challenges', async ({ page }) => {
    const home = new HomePage(page);

    // Open the public homepage and verify core landmarks are visible.
    await home.goto();
    await home.expectLoaded();

    // Contact Us must be clickable and configured to open a new tab.
    await expect(home.brandLink).toBeEnabled();
    await expect(home.contactUsTile).toBeEnabled();
    await expect(home.contactUsTile).toHaveAttribute('href', /Contact-Us\/contactus\.html$/);
    await expect(home.contactUsTile).toHaveAttribute('target', '_blank');
  });
});
