import type {Browser, Page, ScreenshotOptions, Viewport} from 'puppeteer-core';

/**
 * Extends Puppeteer's ScreenshotOptions to include an optional viewport setting
 * and a selector for element-specific screenshots.
 */
export interface RenderOptions extends ScreenshotOptions {
  /**
   * Sets the viewport of the page.
   */
  viewport?: Viewport;
  /**
   * A CSS selector for an element to screenshot. If provided, the output
   * will be a screenshot of just this element.
   */
  selector?: string;
  /**
   * The maximum time in milliseconds to wait for the selector to appear.
   * If the element is not found within this time, an error will be thrown.
   * Defaults to Puppeteer's default (usually 30000ms).
   */
  timeout?: number;
}

/**
 * Core rendering function that handles the common logic for taking a screenshot.
 * It's designed to be called by the public-facing wrapper functions.
 * @private
 */
async function _renderPageToBuffer(
  browser:  Browser | (() => Promise<Browser>),
  options: RenderOptions | undefined,
  loadContent: (page: Page) => Promise<any>,
  defaultScreenshotOptions: ScreenshotOptions,
  defaultViewport: Viewport,
  errorContext?: string,
): Promise<Buffer> {
  let page: Page | undefined;
  try {
    let b : Browser
    if(typeof browser === "function") {
      b = await browser()
    }
    page = await b.newPage();

    const viewport = options?.viewport ?? defaultViewport;
    await page.setViewport(viewport);

    // The content loading strategy is passed in as a callback.
    await loadContent(page);

    const {viewport: _, selector, timeout, ...screenshotOptions} = options || {};

    if (selector) {
      const element = await page.waitForSelector(selector, {timeout});
      if (!element) {
        const timeoutMsg = `within the ${timeout || 'default'}ms timeout.`;
        const contextMsg = errorContext ? ` on ${errorContext}` : '';
        throw new Error(`Could not find element with selector: "${selector}"${contextMsg} ${timeoutMsg}`);
      }
      return Buffer.from(await element.screenshot(screenshotOptions));
    }

    return Buffer.from(await page.screenshot({
      ...defaultScreenshotOptions,
      ...screenshotOptions,
    }))
  } finally {
    if (page) {
      await page.close();
    }
  }
}

/**
 * Renders an HTML string into an image buffer using a provided Puppeteer browser instance.
 *
 * @param browser The active Puppeteer Browser instance.
 * @param html The HTML content to render.
 * @param options Configuration for the rendering process.
 * @returns A Promise that resolves to a Buffer containing the screenshot image.
 */
export async function html2imgBuffer(
  browser: Browser | (() => Promise<Browser>),
  html: string,
  options?: RenderOptions,
): Promise<Buffer> {
  return _renderPageToBuffer(
    browser,
    options,
    (page) => page.setContent(html, {waitUntil: 'networkidle0'}),
    {fullPage: true},
    {width: 800, height: 600, deviceScaleFactor: 2},
  );
}

/**
 * Captures a screenshot of a given URL and returns it as an image buffer.
 *
 * @param browser The active Puppeteer Browser instance.
 * @param url The URL of the webpage to capture.
 * @param options Configuration for the rendering process.
 * @returns A Promise that resolves to a Buffer containing the screenshot image.
 */
export async function url2imgBuffer(
  browser:  Browser | (() => Promise<Browser>),
  url: string,
  options?: RenderOptions,
): Promise<Buffer> {
  return _renderPageToBuffer(
    browser,
    options,
    (page) => page.goto(url, {waitUntil: 'networkidle0'}),
    {fullPage: false},
    {width: 1280, height: 720, deviceScaleFactor: 2},
    `page: ${url}`,
  );
}
