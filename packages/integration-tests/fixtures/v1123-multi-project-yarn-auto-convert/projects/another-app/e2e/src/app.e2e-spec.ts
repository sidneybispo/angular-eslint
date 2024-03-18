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
    expect(titleText).toEqual('another-app app is running!', `Expected title to be 'another-app app is running!', but got '${titleText}'`);
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    logs.forEach(entry => {
      if (entry.level === logging.Level.SEVERE) {
        fail(`Browser error: ${JSON.stringify(entry)}`);
      }
    });
  });
});
