import { chromium } from 'playwright';

export const extractContent = async (url: string) => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ ignoreHTTPSErrors: true });

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const title = await page.title();
    const content = await page.evaluate(() => {
      const paragraphs = Array.from(document.querySelectorAll('p'));
      return paragraphs.map(p => p.textContent).join('\\n');
    });

    return { title, content, url, date: new Date().toISOString() };
  } catch (error) {
    console.error(`Error when extracting content from ${url}`, error);
    return { title: 'Error', content: 'Error', url, date: new Date().toISOString() };
  } finally {
    await browser.close();
  }
};
