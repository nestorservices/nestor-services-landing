import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import React from "react";
import { renderToString } from "react-dom/server";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { createServer } from "vite";
import { formatBlogDate } from "../src/lib/formatBlogDate.js";
import { blogPosts } from "../src/data/blogPosts.js";
import { content } from "../src/content/recruitment-outsourcing-vs-in-house-hiring.js";

const slug = "recruitment-outsourcing-vs-in-house-hiring";
const canonical = `https://www.nestorservices.in/blog/${slug}`;
const post = blogPosts.find((entry) => entry.slug === slug);

test("article source preserves the PDF's comparison, responsibilities, decision questions and five FAQs", () => {
  assert.ok(post);
  assert.match(content, /\| In-house talent acquisition team \| Recruitment agency \| Embedded talent acquisition partner \|/);
  assert.match(content, /1\. \*\*Understand the role before searching\./);
  assert.match(content, /5\. \*\*Support the decision, never take it\./);
  assert.match(content, /seven questions help/);
  assert.match(content, /existing proprietary candidate database/);
  assert.doesNotMatch(content, /Publishing details \(not part of the article\)|@Shashank|Country Delight|Housing\.com|WNS/);

  const faqSection = content.split("## Frequently asked questions")[1].split("## The right model")[0];
  const visibleFaqs = [...faqSection.matchAll(/\*\*(.+?)\*\*\s+([\s\S]*?)(?=\n\n|$)/g)]
    .map(([, question, answer]) => ({ question, answer: answer.trim() }));
  assert.deepEqual(visibleFaqs, post.faqs);
});

test("article publication date is stable across server and browser timezones", () => {
  const originalTimezone = process.env.TZ;
  try {
    process.env.TZ = "UTC";
    const serverDate = formatBlogDate(post.date);
    process.env.TZ = "America/Los_Angeles";
    const browserDate = formatBlogDate(post.date);
    assert.equal(serverDate, "10 November 2026");
    assert.equal(browserDate, serverDate);
    assert.equal(formatBlogDate("not-a-date"), "");
  } finally {
    if (originalTimezone === undefined) delete process.env.TZ;
    else process.env.TZ = originalTimezone;
  }
});

test("prerender includes unique metadata, canonical, article and matching visible FAQ schema", async () => {
  const html = await readFile(`dist/blog/${slug}/index.html`, "utf8");
  assert.equal((html.match(/<title>/g) || []).length, 1);
  assert.match(html, /<title>Recruitment Outsourcing vs In-House Hiring<\/title>/);
  assert.equal((html.match(/<meta name="description"/g) || []).length, 1);
  assert.match(html, /name="description" content="In-house team, recruitment agency or embedded talent acquisition partner\? How each works, and how to choose for your hiring needs\./);
  assert.equal((html.match(/<link rel="canonical"/g) || []).length, 1);
  assert.ok(html.includes(canonical));
  assert.doesNotMatch(html, /name="robots"[^>]*noindex/i);
  assert.match(html, /<h1 class="bp-title">Recruitment Outsourcing vs In-House Hiring: How an Embedded Talent Acquisition Partner Works<\/h1>/);

  const jsonLdText = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  assert.ok(jsonLdText);
  const jsonLd = JSON.parse(jsonLdText);
  assert.equal(jsonLd["@context"], "https://schema.org");
  const article = jsonLd["@graph"].find((entity) => entity["@type"] === "BlogPosting");
  const faq = jsonLd["@graph"].find((entity) => entity["@type"] === "FAQPage");
  assert.equal(article.headline, post.title);
  assert.equal(article.url, canonical);
  assert.equal(article.mainEntityOfPage, canonical);
  assert.equal(article.datePublished, post.date);
  assert.equal(article.author.name, "Shashank Malviya");
  assert.equal(article.publisher.name, "Nestor Services");
  assert.deepEqual(
    faq.mainEntity.map(({ name, acceptedAnswer }) => ({ question: name, answer: acceptedAnswer.text })),
    post.faqs,
  );
  for (const { question } of post.faqs) assert.ok(html.includes(question));
});

test("article is listed, linked contextually and included once in the sitemap", async () => {
  const indexHtml = await readFile("dist/blog/index.html", "utf8");
  const sitemap = await readFile("public/sitemap.xml", "utf8");
  assert.ok(indexHtml.includes(`/blog/${slug}`));
  assert.ok(content.includes("/our-recruitment-approach"));
  assert.ok(content.includes("/recruitment-services"));
  assert.ok(content.includes("https://hire.nestorservices.in"));
  assert.ok(content.includes("/nestor-assess"));
  assert.ok(content.includes("/blog/recruitment-agency-two-team-problem"));
  assert.equal((sitemap.match(new RegExp(`<loc>${canonical}<\\/loc>`, "g")) || []).length, 1);
  assert.equal((sitemap.match(/<loc>/g) || []).length, 16);
});

test("initial React render matches the prerendered new article route", async () => {
  const vite = await createServer({
    configFile: "./vite.config.js",
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
    logLevel: "silent",
  });

  try {
    const [{ default: Navbar }, { default: BlogPost }] = await Promise.all([
      vite.ssrLoadModule("/src/components/Navbar.jsx"),
      vite.ssrLoadModule("/src/pages/BlogPost.jsx"),
    ]);
    const html = await readFile(`dist/blog/${slug}/index.html`, "utf8");
    const staticRoot = html.match(/<div id="root"[^>]*>([\s\S]*)<\/div>\s*<\/body>/)?.[1];
    assert.ok(staticRoot, "prerendered root is present");

    const normalize = (markup) => markup
      .replace(/>\s+</g, "><")
      .replace(/&#x27;|&#39;/g, "&#39;")
      .replace(/\s+\/>/g, "/>")
      .replace(/<([a-z][\w-]*)(\s[^<>]*?)?\s*\/?\s*>/gi, (_, tag, raw = "") => {
        const attributes = [...raw.matchAll(/([^\s=]+)(?:="([^"]*)"|'([^']*)'|=([^\s>]+))?/g)]
          .map((match) => [match[1], match[2] ?? match[3] ?? match[4] ?? ""])
          .sort(([left], [right]) => left.localeCompare(right));
        return `<${tag.toLowerCase()}${attributes.map(([name, value]) => ` ${name}="${value}"`).join("")}>`;
      })
      .trim();
    const initialReactMarkup = renderToString(
      React.createElement(
        MemoryRouter,
        { initialEntries: [`/blog/${slug}`] },
        React.createElement(
          React.Fragment,
          null,
          React.createElement(Navbar),
          React.createElement(
            Routes,
            null,
            React.createElement(Route, { path: "/blog/:slug", element: React.createElement(BlogPost) }),
          ),
        ),
      ),
    );
    const normalizedStatic = normalize(staticRoot);
    const normalizedReact = normalize(initialReactMarkup);
    if (normalizedStatic !== normalizedReact) {
      const mismatchAt = [...normalizedStatic].findIndex((char, index) => char !== normalizedReact[index]);
      assert.fail(`initial render differs at ${mismatchAt}: static=${JSON.stringify(normalizedStatic.slice(mismatchAt - 80, mismatchAt + 160))}; react=${JSON.stringify(normalizedReact.slice(mismatchAt - 80, mismatchAt + 160))}`);
    }
  } finally {
    await vite.close();
  }
});
