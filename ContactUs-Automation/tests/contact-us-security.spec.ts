import { test, expect } from '@playwright/test';
import { ContactUsPage } from '../pages/ContactUsPage';
import { securityPayloads } from '../test-data/contactUsData';

/**
 * Non-destructive security-oriented input checks.
 * Goal: confirm HTML/XSS/SQL-like/special payloads that still validate
 * do not execute script and are not reflected as markup on the success UI.
 * Then leave via Back to Homepage like other success flows.
 */
test.describe('Contact Us security-oriented input handling', () => {
  test.beforeEach(async ({ page }) => {
    // If any injected script calls alert(), set a flag we can assert against.
    await page.addInitScript(() => {
      window.alert = () => {
        (window as unknown as { __xssFired?: boolean }).__xssFired = true;
      };
    });

    const contactUs = new ContactUsPage(page);
    await contactUs.goto();
  });

  // HTML, XSS-like, SQL-like, special chars, URL/protocol-looking comments.
  for (const scenario of securityPayloads) {
    test(`treats ${scenario.name} as non-executing form input`, async ({ page }) => {
      const contactUs = new ContactUsPage(page);
      await contactUs.fillForm(scenario.data);
      await contactUs.submit();
      await contactUs.expectSuccess();

      // Success page is static — payloads must not appear as live markup/scripts.
      await expect(page.locator('script')).toHaveCount(0);
      await expect(page.getByRole('heading', { name: ContactUsPage.SUCCESS_MESSAGE })).toBeVisible();
      await contactUs.expectNoScriptExecution();

      const bodyHtml = await page.locator('body').innerHTML();
      expect(bodyHtml).not.toContain('<script>window.__xssFired=true</script>');
      expect(bodyHtml).not.toContain('<img src=x onerror=');

      await contactUs.clickBackToHomepage();
      await contactUs.expectReturnedToHomepage();
    });
  }

  test('XSS-like first name that still validates does not execute', async ({ page }) => {
    const contactUs = new ContactUsPage(page);

    // Script-like first name still passes the site's loose name rules.
    await contactUs.fillForm({
      firstName: '<script>alert(1)</script>',
      lastName: 'Tester',
      email: 'xss.probe@example.com',
      comments: 'probe',
    });
    await contactUs.submit();
    await contactUs.expectSuccess();
    await contactUs.expectNoScriptExecution();

    await contactUs.clickBackToHomepage();
    await contactUs.expectReturnedToHomepage();
  });
});
