import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";

export default async function handler(req, res) {
  let xpath = '//*[@id="quote-page-strip"]/div[3]/div/div[2]/span[1]';

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath:
      process.env.CHROME_EXECUTABLE_PATH || (await chromium.executablePath),
    headless: true,
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage();

  await page.goto("https://www.cnbc.com/quotes/BTC.CB=");

  const [btc] = await page.$x(xpath);
  const btcContenido = await btc.getProperty("textContent");
  const btcCrudo = await btcContenido.jsonValue();

  await browser.close();
  res.json({
    btcCrudo,
  });
}
