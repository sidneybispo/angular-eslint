import { AppPage } from './app.po';
import { browser, logging } from 'protractor';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(async () => {
    page = new AppPage();
    await page.navigateTo();
  });

  it('should display welcome message', async () => {
    const titleText = await page.getTitleText();
    expect(titleText).toEqual('websites-system app is running!');
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    logs.forEach(log => {
      expect(log.level.valueOf()).not.toEqual(logging.Level.SEVERE);
    });
  });

  // Add an additional test to check if the page title is visible
  it('should display a visible title', async () => {
    const titleElement = await page.getTitleElement();
    expect(titleElement.isDisplayed()).toBeTruthy();
  });

  // Add an additional test to check if the page URL is correct
  it('should navigate to the correct URL', async () => {
    const currentUrl = await page.getCurrentUrl();
    expect(currentUrl).toContain('/');
  });
});
