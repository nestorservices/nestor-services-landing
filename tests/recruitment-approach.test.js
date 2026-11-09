import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import React from "react";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "vite";
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
  assert.equal(sitemapUrls.length, 16);
  assert.equal(new Set(sitemapUrls).size, sitemapUrls.length);
  assert.match(sitemap, /<loc>https:\/\/www\.nestorservices\.in\/recruitment-services<\/loc>/);
});

test("recruitment approach prerender reuses the site footer without adding it to other entity pages", async () => {
  const approach = await readFile("dist/our-recruitment-approach/index.html", "utf8");
  const assess = await readFile("dist/nestor-assess/index.html", "utf8");
  const home = await readFile("dist/index.html", "utf8");
  const footer = (html) => (html.match(/<footer class="landing-footer">/g) || []).length;

  assert.equal(footer(approach), 1);
  assert.doesNotMatch(approach, /<main[^>]+data-prerendered=/);
  assert.match(approach, /<a href="https:\/\/hire\.nestorservices\.in\/jobs">Find a job<\/a>/);
  assert.match(approach, /<a href="\/nestor-assess">Nestor Assess<\/a>/);
  assert.equal(footer(home), 1);
  assert.equal(footer(assess), 0);
});

test("hydrated route labels use the same text nodes as prerendered HTML", async () => {
  const source = await readFile("src/components/EntityPage.jsx", "utf8");

  assert.match(source, /String\(index \+ 1\)\.padStart\(2, "0"\)/);
  assert.match(source, /\{`\$\{product\.linkLabel\} →`\}/);
  assert.match(source, /\{`\$\{page\.approachLink\.label\} →`\}/);
  assert.doesNotMatch(source, />0\{index \+ 1\}<\/span>/);
  assert.doesNotMatch(source, />\{page\.approachLink\.label\} →/);
});

test("prerendered entity root matches the initial React navbar, page, and footer", async () => {
  const vite = await createServer({
    configFile: "./vite.config.js",
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
    logLevel: "silent",
  });

  try {
    const [{ default: Navbar }, { default: EntityPage }] = await Promise.all([
      vite.ssrLoadModule("/src/components/Navbar.jsx"),
      vite.ssrLoadModule("/src/components/EntityPage.jsx"),
    ]);
    const html = await readFile("dist/our-recruitment-approach/index.html", "utf8");
    const staticNavbar = html.match(/<nav class="navbar[^"]*">[\s\S]*?<\/nav>/)?.[0];
    const staticMain = html.match(/<main class="entity-page recruitment-approach-page">[\s\S]*?<\/main>/)?.[0];
    const staticFooter = html.match(/<footer class="landing-footer">[\s\S]*?<\/footer>/)?.[0];
    const normalize = (markup) => markup
      .replace(/>\s+</g, "><")
      .replace(/&#x27;|&#39;/g, "&#39;")
      .replace(/\s+\/>/g, '/>')
      .trim();
    const expected = renderToString(
      React.createElement(
        MemoryRouter,
        { initialEntries: ["/our-recruitment-approach"] },
        React.createElement(
          React.Fragment,
          null,
          React.createElement(Navbar),
          React.createElement(EntityPage, { page }),
        ),
      ),
    );

    assert.ok(staticNavbar, "prerender includes the shared product navbar");
    assert.ok(staticMain, "prerender includes the recruitment approach page");
    assert.ok(staticFooter, "prerender includes the shared footer");
    assert.equal(normalize(`${staticNavbar}${staticMain}${staticFooter}`), normalize(expected));
  } finally {
    await vite.close();
  }
});

test("recruitment hero copy can wrap within its viewport-sized container", async () => {
  const css = await readFile("src/components/EntityPage.css", "utf8");
  const prerender = await readFile("scripts/prerender-homepage.mjs", "utf8");

  assert.match(css, /\.recruitment-approach-hero \.entity-page-title\s*\{[^}]*overflow-wrap:\s*anywhere/s);
  assert.match(css, /\.recruitment-approach-hero \.entity-page-intro\s*\{[^}]*overflow-wrap:\s*anywhere/s);
  assert.match(css, /\.recruitment-approach-hero\s*\{\s*padding-inline:\s*18px/s);
  assert.match(prerender, /\.recruitment-approach-hero \.entity-page-title \{[^}]*overflow-wrap:\s*anywhere/);
  assert.match(prerender, /\.recruitment-approach-hero \.entity-page-intro \{[^}]*overflow-wrap:\s*anywhere/);
  assert.match(prerender, /\.recruitment-approach-hero \{ padding-inline: 18px; \}/);
});
