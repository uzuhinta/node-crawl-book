const fs = require('fs');

const scraperObject = {
  url: 'https://www.yumpu.com/en/document/read/65607316/dive-into-design-patterns',
  async scraper(browser) {
    if (!fs.existsSync('screenshots')) {
      fs.mkdirSync('screenshots');
    }

    let pageNumber = 0;

    let page = await browser.newPage();
    // block ads
    await page.setRequestInterception(true);
    const rejectRequestPattern = [
      'googlesyndication.com',
      '/*.doubleclick.net',
      '/*.amazon-adsystem.com',
      '/*.adnxs.com',
    ];
    const blockList = [];

    page.on('request', (request) => {
      if (
        rejectRequestPattern.find((pattern) => request.url().match(pattern))
      ) {
        blockList.push(request.url());
        request.abort();
      } else request.continue();
    });
    // await page.setViewport({ width: 1920, height: 1080 });
    console.log(`Navigating to ${this.url}...`);
    await page.goto(this.url);

    await page.waitForSelector('#onetrust-accept-btn-handler');
    await sleep();
    await page.click('#onetrust-accept-btn-handler');

    let nextSelector;

    const container = await page.waitForSelector('.eagle-page-container');

    while (
      (nextSelector = await page.waitForSelector(
        '.eagle-arrows__right--visible'
      ))
    ) {
      await sleep(3000, 7000);

      const existBanner = (await page.$('#yp-cover-ad-layer-close')) || '';

      console.log(`${pageNumber}: ${existBanner}`);

      if (existBanner) {
        await page.click('#yp-cover-ad-layer-close');
      }

      //Capture here
      await container.screenshot({ path: `screenshots/${pageNumber}.jpeg` });
      console.log(`✅ ${pageNumber}`);
      await sleep(1000, 1000);
      //

      await page.click('.eagle-arrows__right--visible');
      pageNumber++;
    }

    if (blockList.length > 0) {
      console.log(blockList);
    }
  },
};

function sleep(min = 1000, max = 4000) {
  const ms = Math.random() * (max - min) + min;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = scraperObject;
