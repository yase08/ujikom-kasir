const puppeteer = require("puppeteer");

const exportHtmlToPdf = async (html) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html);
  const pdf = await page.pdf({ format: "a4" });
  await browser.close();
  return pdf;
};

module.exports = exportHtmlToPdf;
