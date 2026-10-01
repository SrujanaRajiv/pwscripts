import { Locator, Page, expect } from '@playwright/test';
import { HomePage } from './HomePage';

export type ContactUsFormValues = {
  firstName?: string;
  lastName?: string;
  email?: string;
  comments?: string;
};

export class ContactUsPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly email: Locator;
  readonly comments: Locator;
  readonly resetButton: Locator;
  readonly submitButton: Locator;
  readonly brandLink: Locator;
  /** Success-page link (static thank-you UI). */
  readonly backToHomepageLink: Locator;
  /** Error-page link (body replaced after failed validation). */
  readonly errorHomeLink: Locator;

  static readonly CONTACT_US_PATH = '/Contact-Us/contactus.html';
  static readonly SUCCESS_MESSAGE = 'Thank You for your Message!';
  static readonly ERROR_REQUIRED = 'Error: all fields are required';
  static readonly ERROR_INVALID_EMAIL = 'Error: Invalid email address';

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'CONTACT US' });
    this.firstName = page.getByPlaceholder('First Name');
    this.lastName = page.getByPlaceholder('Last Name');
    this.email = page.getByPlaceholder('Email Address');
    this.comments = page.getByPlaceholder('Comments');
    this.resetButton = page.getByRole('button', { name: 'RESET' });
    this.submitButton = page.getByRole('button', { name: 'SUBMIT' });
    this.brandLink = page.getByRole('link', { name: /WebdriverUniversity\.com/i });
    this.backToHomepageLink = page.getByRole('link', { name: /Back to Homepage/i });
    // Exact "Home" — do not match "Back to Homepage" on the success view.
    this.errorHomeLink = page.getByRole('link', { name: 'Home', exact: true });
  }

  async goto(): Promise<void> {
    await this.page.goto(ContactUsPage.CONTACT_US_PATH);
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/Contact-Us\/contactus\.html$/);
    await expect(this.heading).toBeVisible();
    await expect(this.firstName).toBeVisible();
    await expect(this.lastName).toBeVisible();
    await expect(this.email).toBeVisible();
    await expect(this.comments).toBeVisible();
    await expect(this.resetButton).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  async fillForm(values: ContactUsFormValues): Promise<void> {
    if (values.firstName !== undefined) {
      await this.firstName.fill(values.firstName);
    }
    if (values.lastName !== undefined) {
      await this.lastName.fill(values.lastName);
    }
    if (values.email !== undefined) {
      await this.email.fill(values.email);
    }
    if (values.comments !== undefined) {
      await this.comments.fill(values.comments);
    }
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  async reset(): Promise<void> {
    await this.resetButton.click();
  }

  async getFieldValues(): Promise<Required<ContactUsFormValues>> {
    return {
      firstName: await this.firstName.inputValue(),
      lastName: await this.lastName.inputValue(),
      email: await this.email.inputValue(),
      comments: await this.comments.inputValue(),
    };
  }

  async expectSuccess(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: ContactUsPage.SUCCESS_MESSAGE })).toBeVisible();
    // Client-side success keeps the same Contact Us URL (body is replaced in place).
    await expect(this.page).toHaveURL(/\/Contact-Us\/contactus\.html$/);
  }

  async clickBackToHomepage(): Promise<void> {
    await this.backToHomepageLink.click();
  }

  async clickErrorHome(): Promise<void> {
    await this.errorHomeLink.click();
  }

  /** After leaving Contact Us via Home / Back to Homepage. */
  async expectReturnedToHomepage(): Promise<void> {
    const home = new HomePage(this.page);
    await home.expectLoaded();
  }

  async expectSuccessThenReturnHome(): Promise<void> {
    await this.expectSuccess();
    await this.clickBackToHomepage();
    await this.expectReturnedToHomepage();
  }

  async expectRequiredErrorOnly(): Promise<void> {
    await expect(this.page.getByText(ContactUsPage.ERROR_REQUIRED)).toBeVisible();
    await expect(this.page.getByText(ContactUsPage.ERROR_INVALID_EMAIL)).toHaveCount(0);
  }

  async expectInvalidEmailErrorOnly(): Promise<void> {
    await expect(this.page.getByText(ContactUsPage.ERROR_INVALID_EMAIL)).toBeVisible();
    await expect(this.page.getByText(ContactUsPage.ERROR_REQUIRED)).toHaveCount(0);
  }

  async expectBothErrors(): Promise<void> {
    await expect(this.page.getByText(ContactUsPage.ERROR_REQUIRED)).toBeVisible();
    await expect(this.page.getByText(ContactUsPage.ERROR_INVALID_EMAIL)).toBeVisible();
  }

  /**
   * Asserts the given error state, clicks error-page Home, then verifies homepage URL + key elements.
   */
  async expectErrorThenReturnHome(
    expected: 'required' | 'both' | 'invalid-email',
  ): Promise<void> {
    if (expected === 'required') {
      await this.expectRequiredErrorOnly();
    } else if (expected === 'both') {
      await this.expectBothErrors();
    } else {
      await this.expectInvalidEmailErrorOnly();
    }

    // Still on Contact Us path until Home is clicked (error UI is in-page).
    await expect(this.page).toHaveURL(/\/Contact-Us\/contactus\.html$/);
    await this.clickErrorHome();
    await this.expectReturnedToHomepage();
  }

  async expectNoScriptExecution(): Promise<void> {
    const alertFired = await this.page.evaluate(() => {
      return Boolean((window as unknown as { __xssFired?: boolean }).__xssFired);
    });
    expect(alertFired).toBeFalsy();
  }
}
