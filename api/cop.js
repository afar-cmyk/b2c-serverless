const chrome = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");

export default async (req, res) => {
  let xpath = '//input[@id="answer"]';

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

  await page.goto("https://www.currency.me.uk/convert/usd/cop");

  const [cop] = await page.$x(xpath);
  const copContenido = await cop.getProperty("value");
  const copCrudo = await copContenido.jsonValue();

  await browser.close();

  const tratarValores = (valores) => {
    let convertirNumero = parseFloat(valores);
    return convertirNumero;
  };

  let valorFinal = tratarValores(copCrudo);

  // Para ver el valor en pesos colombianos usar:
  // console.log(
  //   new Intl.NumberFormat("CO", {
  //     style: "currency",
  //     currency: "COP",
  //   }).format(valorFinal)
  // );

  res.json({
    cop: valorFinal,
  });
};
