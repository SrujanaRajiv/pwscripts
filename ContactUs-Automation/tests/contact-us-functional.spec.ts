import { test, expect } from '@playwright/test';
import { ContactUsPage } from '../pages/ContactUsPage';
import { validContact, validEquivalenceContacts, boundaryCases } from '../test-data/contactUsData';

/**
 * Positive / structural Contact Us coverage.
 * Happy path, valid equivalence classes, and exploratory length boundaries.
 * After successful submit: thank-you → Back to Homepage → homepage URL + elements.
 */
test.describe('Contact Us functional', () => {
  // Open Contact Us before each test (setup only; no teardown).
  test.beforeEach(async ({ page }) => {
    const contactUs = new ContactUsPage(page);
    await contactUs.goto();
  });

  test('form structure exposes required controls', async ({ page }) => {
    const contactUs = new ContactUsPage(page);
    await contactUs.expectLoaded();

    // All primary fields and actions must be interactive.
    await expect(contactUs.firstName).toBeEditable();
    await expect(contactUs.lastName).toBeEditable();
    await expect(contactUs.email).toBeEditable();
    await expect(contactUs.comments).toBeEditable();
    await expect(contactUs.resetButton).toBeEnabled();
    await expect(contactUs.submitButton).toBeEnabled();
  });

  test('valid submission shows thank-you then returns to homepage', async ({ page }) => {
    const contactUs = new ContactUsPage(page);
    await contactUs.fillForm(validContact);
    await contactUs.submit();
    // Assert thank-you, click Back to Homepage, verify homepage URL + key elements.
    await contactUs.expectSuccessThenReturnHome();
  });

  // Data-driven: hyphen/apostrophe names, Unicode, multiline comments, etc.
  for (const scenario of validEquivalenceContacts) {
    test(`accepts valid equivalence class: ${scenario.name}`, async ({ page }) => {
      const contactUs = new ContactUsPage(page);
      await contactUs.fillForm(scenario.data);
      await contactUs.submit();
      await contactUs.expectSuccessThenReturnHome();
    });
  }

  // Data-driven: short, ~500, and ~2000 char comments (no HTML maxlength on the form).
  for (const scenario of boundaryCases) {
    test(`accepts boundary/exploratory length: ${scenario.name}`, async ({ page }) => {
      const contactUs = new ContactUsPage(page);
      await contactUs.fillForm(scenario.data);
      await contactUs.submit();
      await contactUs.expectSuccessThenReturnHome();
    });
  }
});
