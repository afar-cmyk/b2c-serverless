import chromium from "chrome-aws-lambda";

async function getBrowserInstance() {
  const executablePath = await chromium.executablePath;

  if (!executablePath) {
    const puppeteer = require("puppeteer");
    return puppeteer.launch({
      args: chromium.args,
      executablePath: process.env.CHROME_EXECUTABLE_PATH,
      headless: true,
      ignoreHTTPSErrors: true,
    });
  }

  return chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath,
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });
}

export default async (req, res) => {
  let result = null;
  let browser = null;

  try {
    browser = await getBrowserInstance();

    let page = await browser.newPage();

    await page.goto("https://www.npmjs.com/package/chrome-aws-lambda");

    result = await page.title();
  } catch (error) {
    return console.log(error);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }

  res.json({
    hola: "mundo",
    prueba: 1,
    resp: result,
  });
};
