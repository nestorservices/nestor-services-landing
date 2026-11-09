import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { getEntityPage } from "../src/content/entityPages.js";

const page = getEntityPage("our-recruitment-approach");

test("recruitment approach has unique metadata, one H1 and a self canonical", async () => {
  const html = await readFile("dist/our-recruitment-approach/index.html", "utf8");
  assert.equal(page.metaTitle, "Our Recruitment Approach | Nestor Services");
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.match(html, /<title>Our Recruitment Approach \| Nestor Services<\/title>/);
  assert.match(html, /<meta name="description" content="Discover how Nestor Services works as an extension of your HR and talent acquisition team through collaborative recruitment, candidate discovery and structured evaluation\."\s*\/>/);
  assert.equal((html.match(/<link rel="canonical"/g) || []).length, 1);
  assert.match(html, /<link rel="canonical" href="https:\/\/www\.nestorservices\.in\/our-recruitment-approach"/);
  assert.doesNotMatch(html, /<meta[^>]+name="robots"[^>]+noindex/i);
});

test("rendered page contains the approved partnership sections and six FAQs", async () => {
  const html = await readFile("dist/our-recruitment-approach/index.html", "utf8");
  assert.match(html, /Your Extended HR &amp; Talent Acquisition Partner/);
  assert.match(html, /Recruitment Beyond Keywords\. Hiring Beyond Resumes\./);
  assert.equal((html.match(/class="recruitment-approach-stage"/g) || []).length, 5);
  assert.equal((html.match(/class="recruitment-approach-faq-item"/g) || []).length, 6);
  assert.match(html, /The employer makes the final selection and hiring decision\./);
  assert.match(html, /Not every candidate takes an assessment/);
  assert.match(html, /mailto:shashank@nestorservices\.in\?subject=Hiring%20requirement%20\(free%20first%20role\)/);
});

test("FAQPage schema mirrors the visible FAQ content", async () => {
  const html = await readFile("dist/our-recruitment-approach/index.html", "utf8");
  const schemaText = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  assert.ok(schemaText, "JSON-LD script exists");
  const schemas = JSON.parse(schemaText);
  const faqSchema = schemas.find((schema) => schema["@type"] === "FAQPage");
  assert.ok(faqSchema);
  assert.deepEqual(
    faqSchema.mainEntity.map(({ name, acceptedAnswer }) => [name, acceptedAnswer.text]),
    page.faqs.map(({ question, answer }) => [question, answer]),
  );
  assert.equal(schemas.filter((schema) => schema["@type"] === "Service").length, 1);
});

test("public navigation links and sitemap include the new page without removing recruitment services", async () => {
  const home = await readFile("dist/index.html", "utf8");
  const services = await readFile("dist/recruitment-services/index.html", "utf8");
  const sitemap = await readFile("public/sitemap.xml", "utf8");
  assert.match(home, /href="\/our-recruitment-approach"/);
  assert.match(services, /href="\/our-recruitment-approach"/);
  assert.match(services, /mailto:shashank@nestorservices\.in/);
  assert.equal((sitemap.match(/<loc>https:\/\/www\.nestorservices\.in\/our-recruitment-approach<\/loc>/g) || []).length, 1);
  const sitemapUrls = sitemap.match(/<loc>([^<]+)<\/loc>/g) || [];
  assert.equal(sitemapUrls.length, 15);
  assert.equal(new Set(sitemapUrls).size, sitemapUrls.length);
  assert.match(sitemap, /<loc>https:\/\/www\.nestorservices\.in\/recruitment-services<\/loc>/);
});

test("recruitment approach prerender reuses the site footer without adding it to other entity pages", async () => {
  const approach = await readFile("dist/our-recruitment-approach/index.html", "utf8");
  const assess = await readFile("dist/nestor-assess/index.html", "utf8");
  const home = await readFile("dist/index.html", "utf8");
  const footer = (html) => (html.match(/<footer class="landing-footer">/g) || []).length;

  assert.equal(footer(approach), 1);
  assert.match(approach, /<a href="https:\/\/hire\.nestorservices\.in\/jobs">Find a job<\/a>/);
  assert.match(approach, /<a href="\/nestor-assess">Nestor Assess<\/a>/);
  assert.equal(footer(home), 1);
  assert.equal(footer(assess), 0);
});
