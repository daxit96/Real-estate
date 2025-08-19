import express from "express";
import puppeteer from "puppeteer";

const router = express.Router();
router.post("/shortlist", async (req, res) => {
  const { properties, tenant } = req.body;
  const html = `<html><body><h1>Shortlist for ${tenant?.name || 'Tenant'}</h1>${(properties||[]).map(p=>`<div><h2>${p.title}</h2><p>${p.address||''}</p></div>`).join("")}</body></html>`;
  const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdf = await page.pdf({ format: 'A4' });
  await browser.close();
  res.setHeader('Content-Type','application/pdf');
  res.send(pdf);
});

export default router;
