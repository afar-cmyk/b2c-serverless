import chromium from "chrome-aws-lambda";

export default async (req, res) => {
  let result = null;
  let browser = null;

  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath:
        process.env.CHROME_EXECUTABLE_PATH || (await chromium.executablePath),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

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
    resp: result,
  });
};
