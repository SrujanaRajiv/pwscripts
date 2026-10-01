import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ContactUsPage } from '../pages/ContactUsPage';

/**
 * Navigation from homepage → Contact Us.
 * Intentionally does NOT use page.goto(Contact Us); it clicks the tile and
 * captures the new tab (real user path).
 */
test.describe('Contact Us navigation', () => {
  test('opens Contact Us in a new tab from the homepage', async ({ page }) => {
    // Edge can be slower under load; allow extra time for popup + load.
    test.setTimeout(120_000);

    const home = new HomePage(page);
    await home.goto();
    await home.expectLoaded();

    // Click Contact Us and wait for the popup tab.
    const pagesBefore = page.context().pages().length;
    const contactUsTab = await home.openContactUsInNewTab();
    const contactUs = new ContactUsPage(contactUsTab);

    // Original tab stays on homepage; new tab shows Contact Us form.
    await expect(page.context().pages().length).toBe(pagesBefore + 1);
    await expect(page).toHaveURL(/webdriveruniversity\.com\/?$/);
    await contactUs.expectLoaded();
    await expect(contactUsTab).toHaveTitle(/Contact Us/i);
  });
});
