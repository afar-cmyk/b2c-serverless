const chrome = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

export default async (req, res) =>{

  let xpath = '//input[@id="answer"]';

  const browser = await puppeteer.launch(process.env.AWS_EXECUTION_ENV ? {
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless
  } : {
    args: [],
    executablePath: process.env.CHROME_EXECUTABLE_PATH
  });


  const page = await browser.newPage();

  await page.goto("https://www.currency.me.uk/convert/usd/cop");

  const [cop] = await page.$x(xpath);
  const copContenido = await cop.getProperty("value");
  const copCrudo = await copContenido.jsonValue();

  await browser.close();

  res.json({
    copCrudo,
  });
}


