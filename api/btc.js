const chrome = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");

export default async (req, res) => {
  let xpath =
    '//*[@id="__next"]/div[1]/div[1]/div[2]/div/div[1]/div[2]/div/div[2]/div[1]/div/span';

  const browser = await puppeteer.launch(
    process.env.AWS_EXECUTION_ENV
      ? {
          args: chrome.args,
          executablePath: await chrome.executablePath,
          headless: chrome.headless,
        }
      : {
          args: [],
          executablePath: process.env.CHROME_EXECUTABLE_PATH,
        }
  );

  const page = await browser.newPage();

  await page.goto("https://coinmarketcap.com/currencies/bitcoin/");

  const [btc] = await page.$x(xpath);
  const btcContenido = await btc.getProperty("textContent");
  const btcCrudo = await btcContenido.jsonValue();

  await browser.close();

  res.json({
    btcCrudo,
  });
};
