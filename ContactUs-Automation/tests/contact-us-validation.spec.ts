import { test } from '@playwright/test';
import { ContactUsPage } from '../pages/ContactUsPage';
import {
  validContact,
  requiredFieldOmissions,
  invalidEmails,
  whitespaceCases,
} from '../test-data/contactUsData';

/**
 * Routes outcome handling after Submit:
 * - success → thank-you → Back to Homepage → homepage checks
 * - error   → error text → Home → homepage checks
 */
async function assertExpected(
  contactUs: ContactUsPage,
  expected: 'required' | 'both' | 'invalid-email' | 'success',
): Promise<void> {
  if (expected === 'success') {
    await contactUs.expectSuccessThenReturnHome();
    return;
  }
  await contactUs.expectErrorThenReturnHome(expected);
}

/**
 * Negative and edge validation for Contact Us.
 * Covers required-field rules, invalid email partitions, and whitespace behavior.
 */
test.describe('Contact Us validation', () => {
  // Setup only: land on the form before each case.
  test.beforeEach(async ({ page }) => {
    const contactUs = new ContactUsPage(page);
    await contactUs.goto();
  });

  // Missing fields: "required only" vs "required + invalid email" (blank email).
  for (const scenario of requiredFieldOmissions) {
    test(`required-field rule: ${scenario.name}`, async ({ page }) => {
      const contactUs = new ContactUsPage(page);
      await contactUs.fillForm(scenario.data);
      await contactUs.submit();
      await assertExpected(contactUs, scenario.expected);
    });
  }

  // Malformed emails with other fields valid → Invalid email only, then Home.
  for (const scenario of invalidEmails) {
    test(`invalid email partition: ${scenario.name}`, async ({ page }) => {
      const contactUs = new ContactUsPage(page);
      await contactUs.fillForm({ ...validContact, email: scenario.email });
      await contactUs.submit();
      await contactUs.expectErrorThenReturnHome('invalid-email');
    });
  }

  // Whitespace-only fails (trim); padded valid values succeed after trim.
  for (const scenario of whitespaceCases) {
    test(`whitespace handling: ${scenario.name}`, async ({ page }) => {
      const contactUs = new ContactUsPage(page);
      await contactUs.fillForm(scenario.data);
      await contactUs.submit();
      await assertExpected(contactUs, scenario.expected);
    });
  }
});
