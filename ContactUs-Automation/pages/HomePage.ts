import { Locator, Page, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly brandLink: Locator;
  readonly challengesHeading: Locator;
  readonly contactUsTile: Locator;

  constructor(page: Page) {
    this.page = page;
    this.brandLink = page.getByRole('link', { name: 'WebdriverUniversity.com', exact: true });
    this.challengesHeading = page.getByRole('heading', { name: 'Test Automation Challenges' });
    this.contactUsTile = page.locator('#contact-us');
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async expectLoaded(): Promise<void> {
    // Accept `/`, `/index.html`, and trailing slash variants.
    await expect(this.page).toHaveURL(/^https:\/\/www\.webdriveruniversity\.com\/(index\.html)?\/?$/);
    await expect(this.brandLink).toBeVisible();
    await expect(this.challengesHeading).toBeVisible();
    await expect(this.contactUsTile).toBeVisible();
  }

  async openContactUsInNewTab(): Promise<Page> {
    await this.contactUsTile.scrollIntoViewIfNeeded();
    const popupPromise = this.page.waitForEvent('popup');
    await this.contactUsTile.click();
    const contactUsPage = await popupPromise;
    await contactUsPage.waitForURL(/\/Contact-Us\/contactus\.html$/);
    return contactUsPage;
  }
}
