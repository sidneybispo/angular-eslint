import { browser, by, ElementFinder, ElementArrayFinder, promise } from 'protractor';

export class AppPage {
  navigateTo(): promise.Promise<any> {
    return browser.get(browser.baseUrl) as promise.Promise<any>;
  }

  getTitleText(): promise.Promise<string> {
    return element(by.css('app-root .content span')).getText() as promise.Promise<string>;
  }

  // Added helper method to wait for an element to be visible
  waitForElementVisible(locator: by | ElementFinder, timeout?: number): promise.Promise<void> {
    const endTime = timeout == null ? browser.params.timeouts.defaultTimeout : timeout;
    const startTime = new Date().getTime();
    const condition = () => element(locator).isDisplayed();

    return browser.wait(condition, endTime - startTime, 'Element still not visible after ' + (endTime - startTime) + 'ms');
  }

  // Added helper method to wait for an element to be clickable
  waitForElementClickable(locator: by | ElementFinder, timeout?: number): promise.Promise<void> {
    const endTime = timeout == null ? browser.params.timeouts.defaultTimeout : timeout;
    const startTime = new Date().getTime();
    const condition = () => element(locator).isEnabled();

    return browser.wait(condition, endTime - startTime, 'Element still not clickable after ' + (endTime - startTime) + 'ms');
  }

  // Added helper method to get an element text
  getElementText(locator: by | ElementFinder): promise.Promise<string> {
    return element(locator).getText();
  }

  // Added helper method to get an element
  getElement(locator: by | ElementFinder): ElementFinder {
    return element(locator);
  }

  // Added helper method to get elements
  getElements(locator: by | ElementFinder): ElementArrayFinder {
    return element.all(locator);

