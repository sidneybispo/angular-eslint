import { browser, by, ElementFinder, promise } from 'protractor';

export class AppPage {
  navigateTo(): promise.Promise<any> {
    return browser.get(browser.baseUrl) as promise.Promise<any>;
  }

  getTitleText(): promise.Promise<string> {
    const titleElement: ElementFinder = element(by.css('app-root .content span'));
    return titleElement.getText() as promise.Promise<string>;
  }

  // Add any additional methods here as needed
}
