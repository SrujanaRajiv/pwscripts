import { test, expect } from '@playwright/test';
import { ContactUsPage } from '../pages/ContactUsPage';
import { validContact } from '../test-data/contactUsData';

/**
 * Reset control and error-page Home navigation.
 * Native Reset clears fields; after a validation error the form DOM is replaced,
 * so Reset disappears and Home is used to leave the error view.
 */
test.describe('Contact Us reset', () => {
  test.beforeEach(async ({ page }) => {
    const contactUs = new ContactUsPage(page);
    await contactUs.goto();
  });

  test('clears all fields without submitting or navigating away', async ({ page }) => {
    const contactUs = new ContactUsPage(page);

    // Populate so we can prove Reset emptied every field.
    await contactUs.fillForm(validContact);
    const before = await contactUs.getFieldValues();
    expect(before).toEqual({
      firstName: validContact.firstName,
      lastName: validContact.lastName,
      email: validContact.email,
      comments: validContact.comments,
    });

    await contactUs.reset();

    const after = await contactUs.getFieldValues();
    expect(after).toEqual({
      firstName: '',
      lastName: '',
      email: '',
      comments: '',
    });

    // Still on Contact Us; no thank-you (Reset must not submit).
    await expect(page).toHaveURL(/\/Contact-Us\/contactus\.html$/);
    await expect(contactUs.heading).toBeVisible();
    await expect(page.getByText(ContactUsPage.SUCCESS_MESSAGE)).toHaveCount(0);
  });

  test('after validation error, Home returns to homepage (Reset is gone)', async ({ page }) => {
    const contactUs = new ContactUsPage(page);

    // Trigger error UI (blank email → both required + invalid email messages).
    await contactUs.fillForm({ ...validContact, email: '' });
    await contactUs.submit();
    await contactUs.expectBothErrors();

    // Error path replaces the document body; native Reset is gone.
    await expect(page.getByRole('button', { name: 'RESET' })).toHaveCount(0);
    await expect(page.getByRole('link', { name: /Try Again/i })).toBeVisible();
    await expect(page).toHaveURL(/\/Contact-Us\/contactus\.html$/);

    // Error-page Home → homepage URL + landmarks.
    await contactUs.clickErrorHome();
    await contactUs.expectReturnedToHomepage();
  });
});
