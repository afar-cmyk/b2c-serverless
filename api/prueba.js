const chrome = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

export default async (req, res) =>{

  const browser = await puppeteer.launch(process.env.AWS_EXECUTION_ENV ? {
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless
  } : {
    args: [],
    executablePath: process.env.CHROME_EXECUTABLE_PATH
  });


  let page = await browser.newPage();

  await page.goto("https://andresfelipe.netlify.app/");

  let result = await page.title();
  
  await browser.close();

  res.json({
    hola: "mundo",
    prueba: 2,
    resp: result,
  });
}

// async function getBrowserInstance() {
//   const executablePath = await chromium.executablePath;

//   if (!executablePath) {
//     const puppeteer = require("puppeteer");
//     return puppeteer.launch({
//       args: chromium.args,
//       executablePath: process.env.CHROME_EXECUTABLE_PATH,
//       headless: true,
//       ignoreHTTPSErrors: true,
//     });
//   }

//   return chromium.puppeteer.launch({
//     args: chromium.args,
//     defaultViewport: chromium.defaultViewport,
//     executablePath,
//     headless: chromium.headless,
//     ignoreHTTPSErrors: true,
//   });
// }

// export default async (req, res) => {
//   let result = null;
//   let browser = null;

//   try {
//     browser = await getBrowserInstance();

//     let page = await browser.newPage();

//     await page.goto("https://www.npmjs.com/package/chrome-aws-lambda");

//     result = await page.title();
//   } catch (error) {
//     return console.log(error);
//   } finally {
//     if (browser !== null) {
//       await browser.close();
//     }
//   }

//   res.json({
//     hola: "mundo",
//     prueba: 3,
//     resp: result,
//   });
// };
