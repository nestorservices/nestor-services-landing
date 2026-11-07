import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const distDir = path.join(projectRoot, "dist");
const distIndexPath = path.join(distDir, "index.html");

const HOMEPAGE_URL = "https://www.nestorservices.in/";
const BLOG_URL = "https://www.nestorservices.in/blog";
const BLOG_POST_BASE_URL = "https://www.nestorservices.in/blog/";
const NESTOR_LOGO_URL = "https://www.nestorservices.in/nestor-services-logo.png";
const HOMEPAGE_CONTENT_MODULE = await import(
  pathToFileURL(path.join(projectRoot, "src", "data", "homepageContent.js")).href
);
const {
  HOMEPAGE_TITLE: TITLE,
  HOMEPAGE_DESCRIPTION: DESCRIPTION,
  candidates,
  products,
  employerTiers,
  empanelmentPoints,
  credibility,
  FIRST_ROLE_HREF,
  EMPANELMENT_HREF,
} = HOMEPAGE_CONTENT_MODULE;
const BLOG_INDEX_TITLE = "Nestor Services Blog — Hiring, Recruitment & Workforce Insights";
const BLOG_INDEX_DESCRIPTION =
  "Read Nestor Services articles on hiring in India, recruitment, HR operations, and practical workforce insights from the team behind Nestor Hire.";
const ENTITY_PAGES_MODULE = await import(
  pathToFileURL(path.join(projectRoot, "src", "content", "entityPages.js")).href
);
const entityPages = ENTITY_PAGES_MODULE.entityPages || [];

const blogPostsModule = await import(
  pathToFileURL(path.join(projectRoot, "src", "data", "blogPosts.js")).href
);
const blogPosts = blogPostsModule.blogPosts || [];

const articleModuleCache = new Map();

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeJsonLd(value) {
  return JSON.stringify(value)
    .replaceAll("<", "\\u003c")
    .replaceAll(">", "\\u003e")
    .replaceAll("&", "\\u0026");
}

function replaceOrInsert(html, pattern, replacement, fallback) {
  if (pattern.test(html)) {
    return html.replace(pattern, replacement);
  }
  return html.replace("</head>", `  ${fallback}\n  </head>`);
}

function setUniqueMetaTag(html, attribute, name, value) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`<meta\\s+${attribute}=["']${escapedName}["'][^>]*>`, "gi");
  const tag = `<meta ${attribute}="${escapeHtml(name)}" content="${escapeHtml(value)}" />`;
  let inserted = false;
  const updated = html.replace(pattern, () => {
    if (inserted) return "";
    inserted = true;
    return tag;
  });
  return inserted ? updated : updated.replace("</head>", `  ${tag}\n  </head>`);
}

function removeMetaTag(html, attribute, name) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return html.replace(new RegExp(`<meta\\s+${attribute}=["']${escapedName}["'][^>]*>`, "gi"), "");
}

function normalizeWhitespace(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function normalizeDescription(value, fallback = "") {
  const text = normalizeWhitespace(value || fallback);
  if (text.length <= 160) return text;
  const slice = text.slice(0, 160);
  const breakIndex = slice.lastIndexOf(" ");
  if (breakIndex > 100) {
    return slice.slice(0, breakIndex);
  }
  return slice;
}

function toLocaleDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function renderInlineHtml(value) {
  const escaped = escapeHtml(normalizeWhitespace(value));
  return escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

function parseImageToken(value) {
  const raw = normalizeWhitespace(value);
  const [namePart, altPart] = raw.split("|", 2);
  const name = normalizeWhitespace(namePart);
  const alt = normalizeWhitespace(altPart || name.replace(/-/g, " "));
  return { name, alt };
}

function resolveImagePath(name) {
  return /\.(svg|png|jpe?g|webp)$/i.test(name) ? name : `${name}.png`;
}

function renderImageHtml(value) {
  const { name, alt } = parseImageToken(value);
  return `<img src="/images/${escapeHtml(resolveImagePath(name))}" alt="${escapeHtml(alt)}" class="bp-article-image" />`;
}

function renderContentHtml(content) {
  const blocks = String(content || "")
    .trim()
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks
    .map((block) => {
      const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
      const isUnorderedList = lines.length > 0 && lines.every((line) => line.startsWith("- "));
      const isOrderedList = lines.length > 0 && lines.every((line) => /^\d+\. /.test(line));
      if (isUnorderedList || isOrderedList) {
        const tag = isUnorderedList ? "ul" : "ol";
        const marker = isUnorderedList ? /^- / : /^\d+\. /;
        const items = lines
          .map((line) => `<li>${renderInlineHtml(line.replace(marker, ""))}</li>`)
          .join("");
        return `<${tag} class="bp-list">${items}</${tag}>`;
      }
      if (block.startsWith("### ")) {
        return `<h3 class="bp-subheading">${renderInlineHtml(block.slice(4))}</h3>`;
      }
      if (block.startsWith("[IMAGE:") && block.endsWith("]")) {
        return renderImageHtml(block.replace("[IMAGE:", "").replace("]", ""));
      }
      if (block.startsWith("## ")) {
        return `<h2 class="bp-heading">${renderInlineHtml(block.slice(3))}</h2>`;
      }
      if (block.startsWith("# ")) {
        return `<h1 class="bp-h1">${renderInlineHtml(block.slice(2))}</h1>`;
      }
      return `<p class="bp-para">${renderInlineHtml(block.replace(/\n+/g, " "))}</p>`;
    })
    .join("\n");
}

function extractLeadParagraph(content) {
  const blocks = String(content || "")
    .trim()
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);
  for (const block of blocks) {
    if (block.startsWith("# ") || block.startsWith("## ") || block.startsWith("[IMAGE:")) {
      continue;
    }
    return normalizeWhitespace(block.replace(/\n+/g, " "));
  }
  return "";
}

function extractImagePath(content) {
  const match = String(content || "").match(/\[IMAGE:([^\]]+)\]/);
  if (!match) return "";
  const { name } = parseImageToken(match[1]);
  return resolveImagePath(name);
}

async function loadArticleModule(slug) {
  if (articleModuleCache.has(slug)) return articleModuleCache.get(slug);
  const filePath = path.join(projectRoot, "src", "content", `${slug}.js`);
  try {
    const mod = await import(pathToFileURL(filePath).href);
    articleModuleCache.set(slug, mod);
    return mod;
  } catch {
    articleModuleCache.set(slug, null);
    return null;
  }
}

function buildShellPage({
  baseHtml,
  title,
  description,
  canonical,
  bodyHtml,
  jsonLd,
  bodyDataAttr,
  social,
}) {
  let html = baseHtml;

  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  html = replaceOrInsert(
    html,
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
  );
  html = replaceOrInsert(
    html,
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
  );

  const openGraph = {
    "og:type": social?.type || "website",
    "og:url": canonical,
    "og:title": social?.title || title,
    "og:description": social?.description || description,
  };
  for (const [property, value] of Object.entries(openGraph)) {
    html = setUniqueMetaTag(html, "property", property, value);
  }

  if (social) {
    const socialTags = [
      `<meta name="twitter:card" content="${escapeHtml(social.image ? "summary_large_image" : "summary")}" />`,
      `<meta name="twitter:title" content="${escapeHtml(social.title || title)}" />`,
      `<meta name="twitter:description" content="${escapeHtml(social.description || description)}" />`,
    ];
    if (social.image) {
      html = setUniqueMetaTag(html, "property", "og:image", social.image);
      socialTags.push(`<meta name="twitter:image" content="${escapeHtml(social.image)}" />`);
    } else {
      html = removeMetaTag(html, "property", "og:image");
    }
    for (const tag of socialTags) {
      html = html.replace("</head>", `  ${tag}\n  </head>`);
    }
  }

  if (jsonLd) {
    const jsonLdTag = `<script type="application/ld+json">${escapeJsonLd(jsonLd)}</script>`;
    if (/<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/i.test(html)) {
      html = html.replace(/<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/i, jsonLdTag);
    } else {
      html = html.replace("</head>", `  ${jsonLdTag}\n  </head>`);
    }
  }

  const rootReplacement = `<div id="root"${
    bodyDataAttr ? ` ${bodyDataAttr}` : ""
  }>${bodyHtml}</div>`;
  html = html.replace(/<div id="root"[^>]*><\/div>/i, rootReplacement);

  return html;
}

function buildHomepageJsonLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Nestor Services",
      url: HOMEPAGE_URL,
      logo: NESTOR_LOGO_URL,
      founder: {
        "@type": "Person",
        name: "Shashank Malviya",
        sameAs: "https://www.linkedin.com/in/shashankmalviya/",
      },
      knowsAbout: [
        "Recruitment",
        "Hiring workflows",
        "HR operations",
        "Payroll support",
        "Workforce management",
      ],
      hasPart: [
        {
          "@type": "SoftwareApplication",
          name: "Nestor Hire",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          url: "https://hire.nestorservices.in",
        },
        {
          "@type": "SoftwareApplication",
          name: "Nestor Core",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          url: "https://core.nestorservices.in",
        },
        {
          "@type": "SoftwareApplication",
          name: "Nestor Assess",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          url: "https://assess.nestorservices.in",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Nestor Services",
      url: HOMEPAGE_URL,
      description: DESCRIPTION,
    },
  ];
}

function buildHomepageBody() {
  return `
<header class="landing-header">
  <div class="landing-nav-inner">
    <a href="/" class="landing-nav-brand" aria-label="Nestor Services — Your Workforce Partner"><img src="/nestor-services-logo.png" alt="Nestor Services — Your Workforce Partner" /></a>
    <button class="landing-menu-button" type="button" aria-label="Open navigation menu" aria-expanded="false" aria-controls="landing-primary-navigation"><span></span><span></span><span></span></button>
    <nav class="landing-nav-links" id="landing-primary-navigation" aria-label="Primary">
      <a href="https://hire.nestorservices.in/jobs">Find a job</a><a href="#platforms">Platforms</a><a href="#employers">For employers</a><a href="#why">Why Nestor</a><a class="landing-nav-cta" href="${escapeHtml(FIRST_ROLE_HREF)}">Share a role — free</a>
    </nav>
  </div>
</header>
<main class="landing-home">
  <section class="landing-hero"><div class="landing-hero-glow" aria-hidden="true"></div><div class="landing-wrap">
    <h1 class="landing-hero-title">Whether you&apos;re building a <span>career</span> or building a <span>team</span> — work starts here.</h1>
    <p class="landing-hero-lead">Find roles and understand the hiring process, or discuss recruitment and HR operations support for your business.</p>
    <div class="landing-actions"><a class="landing-button landing-button--primary" href="https://hire.nestorservices.in/jobs">Find your next role <span aria-hidden="true">→</span></a><a class="landing-button landing-button--secondary" href="#employers">Share a role — free</a></div>
    <div class="landing-proofline" aria-label="About Nestor Services"><div><strong>15+ years</strong><span>in HR and talent acquisition</span></div><div><strong>Founder-led</strong><span>direct and accountable</span></div><div><strong>Gurugram, India</strong><span>working across the Indian market</span></div></div>
  </div></section>
  <section class="landing-band" id="candidates"><div class="landing-wrap">
    <div class="landing-section-head reveal"><p class="landing-eyebrow">Looking for work?</p><h2>Find a role, understand your next step.</h2><p>Start with a live opening, check an assessment invitation, or get practical context on the application process.</p></div>
    <div class="landing-candidate-grid">${candidates.map((item) => `
      <article class="landing-candidate-card reveal"><div class="landing-icon" aria-hidden="true">${escapeHtml(item.icon)}</div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.body)}</p><a class="landing-text-link" href="${escapeHtml(item.href)}"${item.external ? ' target="_blank" rel="noopener noreferrer"' : ""}>${escapeHtml(item.label)} <span aria-hidden="true">→</span></a></article>`).join("")}
    </div>
  </div></section>
  <section class="landing-band landing-band--products" id="platforms"><div class="landing-wrap">
    <div class="landing-section-head reveal"><p class="landing-eyebrow">The Nestor platforms</p><h2>Technology and services for work, hiring, and HR.</h2><p>Nestor Services supports employers and candidates with recruitment and talent acquisition services, alongside focused product experiences.</p></div>
    <div class="landing-product-grid">${products.map((product) => `
      <article class="landing-product-card landing-product-card--${escapeHtml(product.key)} reveal" style="--card-accent:${escapeHtml(product.accent)}"><div class="landing-product-topline"><span class="landing-product-name" style="--card-accent:${escapeHtml(product.accent)}">${escapeHtml(product.name)}</span><span class="landing-product-category">${escapeHtml(product.category)}</span></div>${product.status ? `<p class="landing-product-status">${escapeHtml(product.status)}</p>` : ""}<h3>${escapeHtml(product.headline)}</h3><p class="landing-product-description">${escapeHtml(product.description)}</p><ul class="landing-feature-list">${product.features.map((feature) => `<li>${escapeHtml(feature)}</li>`).join("")}</ul><div class="landing-product-footer"><span>${escapeHtml(product.audience)}</span><div class="landing-product-links">${product.portalHref ? `<a href="${escapeHtml(product.portalHref)}" target="_blank" rel="noopener noreferrer">${escapeHtml(product.portalLabel)}</a>` : ""}<a href="${escapeHtml(product.href)}"${product.external ? ' target="_blank" rel="noopener noreferrer"' : ""}>${escapeHtml(product.label)} <span aria-hidden="true">→</span></a></div></div></article>`).join("")}
    </div>
  </div></section>
  <section class="landing-band" id="employers"><div class="landing-wrap">
    <div class="landing-section-head reveal"><p class="landing-eyebrow">For employers and recruiters</p><h2>Support that starts with your actual requirement.</h2><p>Discuss recruitment services, per-hire support, managed hiring, or HR operations support without a one-size-fits-all promise.</p></div>
    <div class="landing-employer-spectrum">${employerTiers.map((item, index) => `<article class="landing-employer-tier${index === 0 ? " landing-employer-tier--lead" : ""}">${item.freeLabel ? `<span class="landing-employer-free">${escapeHtml(item.freeLabel)}</span>` : ""}<div class="landing-employer-step">${escapeHtml(item.step)}</div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.body)}</p></article>`).join("")}</div>
    <div class="landing-empanelment reveal"><h3>One HR generalist can&apos;t be an expert at everything. Empanel with Nestor.</h3><div class="landing-empanelment-columns"><p>Recruitment, assessments, payroll and HR operations require different expertise. Instead of expecting one generalist to manage everything, work with Nestor as your extended HR team. You focus on running your business while we handle the people side — as little or as much as you need.</p><ul class="landing-empanelment-checklist">${empanelmentPoints.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul></div><div class="landing-empanelment-cta"><a class="landing-button landing-button--primary" href="${escapeHtml(EMPANELMENT_HREF)}">Talk about empanelment</a></div></div>
  </div></section>
  <section class="landing-band landing-band--why" id="why"><div class="landing-wrap">
    <div class="landing-section-head reveal"><p class="landing-eyebrow">Why Nestor Services</p><h2>Practical experience, with a clear point of contact.</h2></div>
    <div class="landing-credibility-grid">${credibility.map((item) => `<article class="landing-credibility-card reveal"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.body)}</p></article>`).join("")}</div>
  </div></section>
  <section class="landing-band landing-band--start" id="start"><div class="landing-wrap"><div class="landing-dual-grid">
    <div class="landing-cta-box landing-cta-box--candidate reveal"><p class="landing-eyebrow">Candidates</p><h3>Looking for your next role?</h3><p>Browse current public openings on Nestor Hire and apply directly to roles that fit.</p><a class="landing-button landing-button--primary" href="https://hire.nestorservices.in/jobs">Explore roles <span aria-hidden="true">→</span></a></div>
    <div class="landing-cta-box landing-cta-box--employer reveal"><p class="landing-eyebrow">Employers</p><h3>Share one role — the first&apos;s on us.</h3><p>Tell us about the role or HR operations support your team needs. We&apos;ll discuss a suitable scope.</p><a class="landing-button landing-button--primary" href="${escapeHtml(FIRST_ROLE_HREF)}">Share a role — free <span aria-hidden="true">→</span></a></div>
  </div></div></section>
  <footer class="landing-footer"><div class="landing-wrap"><div class="landing-footer-top"><div class="landing-footer-brand"><img src="/nestor-services-logo.png" alt="Nestor Services — Your Workforce Partner" /><a href="mailto:shashank@nestorservices.in">Contact Nestor Services</a></div><nav class="landing-footer-links" aria-label="Footer"><a href="https://hire.nestorservices.in/jobs">Find a job</a><a href="https://hire.nestorservices.in" target="_blank" rel="noopener noreferrer">Nestor Hire</a><a href="/nestor-core">Nestor Core</a><a href="/nestor-assess">Nestor Assess</a><a href="/blog">Blog</a><a href="/privacy">Privacy</a></nav></div><p class="landing-footer-legal">Nestor Services is an India-based recruitment and talent acquisition business supporting employers and candidates. Nestor Core is currently in development / pilot.</p><div class="landing-footer-bottom">© 2026 Nestor Services · Gurugram, India</div></div></footer>
</main>`;
}

function buildBlogIndexBody(posts) {
  const featuredPost = posts[0];
  const cards = posts
    .map((post, index) => {
      const summary = normalizeDescription(post.metaDescription || post.excerpt, post.excerpt);
      const date = toLocaleDate(post.date);
      return `
              <a
                href="/blog/${escapeHtml(post.slug)}"
                class="blog-card${index === 0 ? " blog-card--featured" : ""}"
              >
                <div class="blog-card-tag" style="color: ${escapeHtml(post.tagColor || "#2E7CF6")}">
                  ${escapeHtml(post.tag || "Blog")}
                </div>
                <h2 class="blog-card-title">${escapeHtml(post.title)}</h2>
                <p class="blog-card-excerpt">${escapeHtml(summary)}</p>
                <div class="blog-card-meta">
                  <span class="blog-card-author">${escapeHtml(post.author || "Nestor Services")}</span>
                  <span class="blog-card-dot">·</span>
                  <span class="blog-card-date">${escapeHtml(date)}</span>
                  ${post.readTime ? `<span class="blog-card-dot">·</span><span class="blog-card-read">${escapeHtml(post.readTime)}</span>` : ""}
                </div>
                <div class="blog-card-arrow">
                  Read article <span>→</span>
                </div>
              </a>`;
    })
    .join("\n");

  return `
<div class="blog-page" data-prerendered="blog-index">
  <section class="blog-hero">
    <div class="blog-hero-inner">
      <span class="blog-eyebrow">From the desk of Nestor</span>
      <h1 class="blog-hero-title">
        Honest perspectives on <br />
        <span class="blog-hero-accent">hiring, HR, and what's broken.</span>
      </h1>
      <p class="blog-hero-sub">Written by practitioners. Not marketers.</p>
      <p class="blog-hero-sub" style="margin-top: 12px; font-style: normal;">
        ${escapeHtml(posts.length)} articles on hiring, recruitment, and workforce operations in India.
      </p>
    </div>
  </section>

  <section class="blog-grid-section">
    <div class="blog-container">
      <div class="blog-grid">
${cards}
      </div>
    </div>
  </section>

  <section class="blog-cta-section">
    <div class="blog-container">
      <div class="blog-cta-grid">
        <div class="blog-cta-box">
          <h3 class="blog-cta-title">Explore roles with Nestor Hire</h3>
          <p class="blog-cta-sub">
            See active opportunities and experience the higher-traffic side of the Nestor ecosystem.
          </p>
          <a href="https://hire.nestorservices.in" target="_blank" rel="noopener noreferrer" class="blog-cta-btn">
            Explore roles →
          </a>
        </div>

        <div class="blog-cta-box">
          <h3 class="blog-cta-title">About Nestor Services</h3>
          <p class="blog-cta-sub">
            Return to the main site to see how Nestor Hire and Nestor Core fit together.
          </p>
          <a href="https://www.nestorservices.in/" class="blog-cta-btn blog-cta-btn--secondary">
            Visit homepage →
          </a>
        </div>

        <div class="blog-cta-box">
          <h3 class="blog-cta-title">Start with our key article</h3>
          <p class="blog-cta-sub">
            New here? Begin with the article that frames our point of view on hiring in India.
          </p>
          <a href="/blog/${escapeHtml(featuredPost.slug)}" class="blog-cta-btn blog-cta-btn--secondary">
            Read featured article →
          </a>
        </div>
      </div>
    </div>
  </section>
</div>`;
}

async function getArticleData(post) {
  const module = await loadArticleModule(post.slug);
  return {
    content: module?.content || "",
    cta: module?.cta || null,
  };
}

function buildBlogPostJsonLd(post, canonical, description, content, imagePath) {
  const payload = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.metaTitle || post.title,
    description,
    url: canonical,
    mainEntityOfPage: canonical,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: post.author || "Nestor Services",
    },
    publisher: {
      "@type": "Organization",
      name: "Nestor Services",
      url: HOMEPAGE_URL,
      logo: {
        "@type": "ImageObject",
        url: NESTOR_LOGO_URL,
      },
    },
  };

  if (post.tag) {
    payload.articleSection = post.tag;
  }

  if (imagePath) {
    payload.image = `https://www.nestorservices.in/images/${imagePath.replace(/\.svg$/i, ".png")}`;
  }

  const lead = extractLeadParagraph(content);
  if (lead) {
    payload.articleBody = lead;
  }

  return payload;
}

function buildBlogPostBody(post, content, cta) {
  const canonical = `${BLOG_POST_BASE_URL}${post.slug}`;
  const description = post.metaDescription || normalizeDescription(
    post.excerpt || extractLeadParagraph(content),
    post.excerpt,
  );
  const date = toLocaleDate(post.date);
  const relatedPosts = blogPosts.filter((entry) => entry.slug !== post.slug).slice(0, 2);
  const imagePath = extractImagePath(content);
  const articleBody = renderContentHtml(content);
  const ctaMarkup = cta
    ? `
              <div class="bp-cta-box">
                <p class="bp-cta-text">${escapeHtml(cta.text || "")}</p>
                <a href="${escapeHtml(cta.link || BLOG_URL)}" class="bp-cta-btn">
                  ${escapeHtml(cta.linkText || "Read more")} →
                </a>
              </div>`
    : "";
  const relatedMarkup = relatedPosts
    .map(
      (entry) => `
                      <a href="/blog/${escapeHtml(entry.slug)}" class="bp-related-link">
                        ${escapeHtml(entry.title)} →
                      </a>`,
    )
    .join("\n");

  return {
    canonical,
    description,
    imagePath,
    jsonLd: buildBlogPostJsonLd(post, canonical, description, content, imagePath),
    body: `
<div class="bp-page" data-prerendered="blog-post">
  <div class="bp-back-wrap">
    <div class="bp-container">
      <a href="/blog" class="bp-back">
        ← Back to Blog
      </a>
    </div>
  </div>

  <header class="bp-header">
    <div class="bp-container">
      <div class="bp-tag" style="color: ${escapeHtml(post.tagColor || "#2E7CF6")}">
        ${escapeHtml(post.tag || "Blog")}
      </div>
      <h1 class="bp-title">${escapeHtml(post.title)}</h1>
      <div class="bp-meta">
        <div class="bp-avatar">SM</div>
        <div class="bp-meta-text">
          <span class="bp-author">${escapeHtml(post.author || "Nestor Services")}</span>
          <span class="bp-meta-sub">
            ${escapeHtml(date)}${post.readTime ? ` · ${escapeHtml(post.readTime)}` : ""}
          </span>
        </div>
      </div>
    </div>
  </header>

  <div class="bp-divider-wrap">
    <div class="bp-container">
      <div class="bp-divider"></div>
    </div>
  </div>

  <article class="bp-article">
    <div class="bp-container bp-container--narrow">
      <p class="bp-para">${escapeHtml(description)}</p>
      ${articleBody}
      ${ctaMarkup}

      <div class="bp-ecosystem-grid">
        <div class="bp-cta-box bp-cta-box--ecosystem">
          <p class="bp-cta-label">Nestor Hire</p>
          <p class="bp-cta-text">
            Explore live roles and candidate experience on the higher-traffic Nestor Hire platform.
          </p>
          <a href="https://hire.nestorservices.in" class="bp-cta-btn">
            Explore roles →
          </a>
        </div>

        <div class="bp-cta-box bp-cta-box--ecosystem">
          <p class="bp-cta-label">Nestor Services</p>
          <p class="bp-cta-text">
            Visit the homepage to understand how Nestor Hire and Nestor Core connect.
          </p>
          <a href="https://www.nestorservices.in/" class="bp-cta-btn bp-cta-btn--secondary">
            About Nestor Services →
          </a>
        </div>
      </div>

      ${
        relatedPosts.length > 0
          ? `
      <div class="bp-related">
        <h2 class="bp-heading">Related reading</h2>
        <div class="bp-related-list">
${relatedMarkup}
        </div>
      </div>`
          : `
      <div class="bp-related">
        <h2 class="bp-heading">Continue reading</h2>
        <div class="bp-related-list">
          <a href="/blog" class="bp-related-link">
            Browse all articles →
          </a>
        </div>
      </div>`
      }
    </div>
  </article>

  <div class="bp-footer-nav">
    <div class="bp-container">
      <a href="/blog" class="bp-back">
        ← All articles
      </a>
      <a href="https://www.nestorservices.in/" class="bp-home-link">
        www.nestorservices.in →
      </a>
    </div>
  </div>
</div>`,
  };
}

function buildEntityPageBody(page) {
  if (page.slug === "nestor-assess") {
    return buildAssessTrustPageBody(page);
  }

  const sectionsHtml = page.sections
    .map((section) => {
      if (section.items) {
        return `
        <article class="entity-page-card">
          <h2 class="entity-page-card-title">${escapeHtml(section.title)}</h2>
          <ul class="entity-page-list">
            ${section.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        </article>`;
      }
      return `
        <article class="entity-page-card">
          <h2 class="entity-page-card-title">${escapeHtml(section.title)}</h2>
          <p class="entity-page-body">${escapeHtml(section.body)}</p>
        </article>`;
    })
    .join("\n");

  return `
<main class="entity-page" data-prerendered="entity-page">
  <section class="entity-page-hero">
    <div class="container">
      <div class="entity-page-eyebrow">${escapeHtml(page.heroLabel)}</div>
      <h1 class="entity-page-title">${escapeHtml(page.heroTitle)}</h1>
      <p class="entity-page-intro">${escapeHtml(page.intro)}</p>
      <div class="entity-page-actions">
        <a href="${escapeHtml(page.cta.href)}" class="entity-page-cta">${escapeHtml(page.cta.label)}</a>
        <a href="/" class="entity-page-link">Back to Nestor Services</a>
      </div>
    </div>
  </section>

  <section class="entity-page-content">
    <div class="container">
      <div class="entity-page-grid">
        ${sectionsHtml}
      </div>
    </div>
  </section>
</main>`;
}

function buildAssessTrustPageBody(page) {
  const safetyPoints = page.safetyPoints
    .map((point) => `<li>${escapeHtml(point)}</li>`)
    .join("");
  const expectations = page.expectations
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");
  const faqs = page.faqs
    .map(({ question, answer }) => `
      <details class="assess-trust-faq-item">
        <summary>${escapeHtml(question)}</summary>
        <p>${escapeHtml(answer)}</p>
      </details>`)
    .join("");

  return `
<main class="entity-page assess-trust-page" data-prerendered="entity-page">
  <section class="entity-page-hero assess-trust-hero">
    <div class="container">
      <div class="entity-page-eyebrow">${escapeHtml(page.heroLabel)}</div>
      <h1 class="entity-page-title">${escapeHtml(page.heroTitle)}</h1>
      <p class="entity-page-intro">${escapeHtml(page.intro)}</p>
      <div class="entity-page-actions">
        <a href="${escapeHtml(page.cta.href)}" class="entity-page-cta" target="_blank" rel="noopener noreferrer">${escapeHtml(page.cta.label)}</a>
        <a href="${escapeHtml(page.trustLink.href)}" class="entity-page-link">${escapeHtml(page.trustLink.label)}</a>
      </div>
      <p class="assess-trust-caption">Invitation required</p>
    </div>
  </section>

  <section class="entity-page-content assess-trust-content">
    <div class="container assess-trust-sections">
      <section class="assess-trust-card" aria-labelledby="invitation-arrives">
        <p class="assess-trust-kicker">Before you begin</p>
        <h2 class="entity-page-card-title" id="invitation-arrives">How your invitation reaches you</h2>
        <p class="entity-page-body">${escapeHtml(page.invitationCopy)}</p>
      </section>

      <section class="assess-trust-card assess-trust-card--safety" id="invitation-safety" aria-labelledby="check-invitation">
        <p class="assess-trust-kicker">Stay safe</p>
        <h2 class="entity-page-card-title" id="check-invitation">Check your invitation is genuine</h2>
        <ul class="entity-page-list">${safetyPoints}</ul>
        <p class="assess-trust-official">Official assessment destination: <a href="https://assess.nestorservices.in" target="_blank" rel="noopener noreferrer">assess.nestorservices.in</a></p>
      </section>

      <section class="assess-trust-card" aria-labelledby="what-to-expect">
        <p class="assess-trust-kicker">Your assessment</p>
        <h2 class="entity-page-card-title" id="what-to-expect">What to expect</h2>
        <ul class="entity-page-list">${expectations}</ul>
      </section>

      <section class="assess-trust-card" aria-labelledby="part-of-nestor">
        <p class="assess-trust-kicker">The Nestor ecosystem</p>
        <h2 class="entity-page-card-title" id="part-of-nestor">Part of Nestor Services</h2>
        <p class="entity-page-body">${escapeHtml(page.ecosystemCopy)}</p>
        <nav class="assess-trust-product-links" aria-label="Nestor Services products">
          <a href="https://hire.nestorservices.in" target="_blank" rel="noopener noreferrer">Nestor Hire</a>
          <a href="https://core.nestorservices.in" target="_blank" rel="noopener noreferrer">Nestor Core</a>
          <a href="https://www.nestorservices.in/">Back to Nestor Services</a>
        </nav>
      </section>

      <section class="assess-trust-faq" aria-labelledby="assess-faq-title">
        <p class="assess-trust-kicker">Need a quick answer?</p>
        <h2 class="entity-page-card-title" id="assess-faq-title">Frequently asked questions</h2>
        <div class="assess-trust-faq-list">${faqs}
        </div>
      </section>
    </div>
  </section>
</main>`;
}

function buildEntityPageJsonLd(page) {
  if (!page.faqs) return page.schema;
  return [
    page.schema,
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faqs.map(({ question, answer }) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: {
          "@type": "Answer",
          text: answer,
        },
      })),
    },
  ];
}

function buildEntityPageCss() {
  return `
  <style id="entity-page-prerender-styles">
    .entity-page {
      min-height: 100vh;
      background: #ffffff;
      color: #0a1628;
      font-family: var(--font-body);
    }
    .entity-page-hero {
      background: #0a1628;
      padding: 96px 24px 72px;
    }
    .entity-page-eyebrow {
      display: inline-block;
      font-family: var(--font-head);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--blue);
      margin-bottom: 18px;
    }
    .entity-page-title {
      font-family: var(--font-head);
      font-size: clamp(34px, 5vw, 56px);
      color: #ffffff;
      line-height: 1.1;
      margin: 0 0 18px;
    }
    .entity-page-intro {
      max-width: 760px;
      color: #8ba5c9;
      font-size: 18px;
      line-height: 1.75;
      margin: 0 0 28px;
    }
    .entity-page-actions {
      display: flex;
      gap: 14px;
      flex-wrap: wrap;
    }
    .entity-page-cta,
    .entity-page-link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 44px;
      padding: 11px 20px;
      border-radius: 8px;
      font-family: var(--font-head);
      font-size: 14px;
      font-weight: 600;
    }
    .entity-page-cta {
      background: var(--blue);
      color: #ffffff;
    }
    .entity-page-link {
      color: #ffffff;
      border: 1px solid var(--border-2);
    }
    .entity-page-content {
      padding: 72px 24px 96px;
    }
    .entity-page-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 20px;
    }
    .entity-page-card {
      background: #0f1e35;
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 32px;
    }
    .entity-page-card-title {
      font-family: var(--font-head);
      font-size: 24px;
      line-height: 1.2;
      color: #ffffff;
      margin: 0 0 16px;
    }
    .entity-page-list {
      margin: 0;
      padding-left: 20px;
      color: #dce8fb;
      line-height: 1.8;
    }
    .entity-page-body {
      color: #dce8fb;
      line-height: 1.8;
    }
    .assess-trust-hero .entity-page-intro { max-width: 700px; }
    .assess-trust-caption { margin: 10px 0 0; color: #8ba5c9; font-size: 13px; }
    .assess-trust-content { background: #060e1f; }
    .assess-trust-sections { max-width: 900px; display: grid; gap: 20px; }
    .assess-trust-card, .assess-trust-faq { padding: clamp(24px, 4vw, 36px); border: 1px solid rgba(255,255,255,.1); border-radius: 16px; background: #0f1e35; }
    .assess-trust-card--safety { border-color: rgba(46,124,246,.38); background: linear-gradient(140deg,#102747,#0f1e35 68%); }
    .assess-trust-kicker { margin: 0 0 10px; color: #8ba5c9; font-family: var(--font-head); font-size: 11px; font-weight: 700; letter-spacing: 1.6px; text-transform: uppercase; }
    .assess-trust-card .entity-page-card-title, .assess-trust-faq .entity-page-card-title { margin-bottom: 14px; }
    .assess-trust-card .entity-page-list { display: grid; gap: 10px; }
    .assess-trust-official { margin: 20px 0 0; padding-top: 16px; border-top: 1px solid rgba(255,255,255,.1); color: #dce8fb; font-size: 14px; }
    .assess-trust-official a, .assess-trust-product-links a { color: #8db6ff; text-decoration: underline; text-underline-offset: 3px; }
    .assess-trust-product-links { display: flex; flex-wrap: wrap; gap: 18px 24px; margin-top: 20px; }
    .assess-trust-faq-list { display: grid; gap: 10px; }
    .assess-trust-faq-item { border: 1px solid rgba(255,255,255,.1); border-radius: 10px; background: rgba(6,14,31,.45); }
    .assess-trust-faq-item summary { padding: 17px 20px; color: #fff; cursor: pointer; font-family: var(--font-head); font-weight: 600; line-height: 1.5; }
    .assess-trust-faq-item summary:focus-visible, .assess-trust-page a:focus-visible { outline: 3px solid #8db6ff; outline-offset: 3px; }
    .assess-trust-faq-item p { margin: 0; padding: 0 20px 18px; color: #dce8fb; line-height: 1.75; }
    @media (max-width: 860px) {
      .entity-page-grid {
        grid-template-columns: 1fr;
      }
    }
    @media (max-width: 600px) {
      .assess-trust-hero { padding-top: 88px; }
      .assess-trust-content { padding: 44px 18px 64px; }
      .assess-trust-product-links { flex-direction: column; gap: 14px; }
    }
  </style>`;
}

async function writePage(relativePath, html) {
  const outputPath = path.join(distDir, relativePath);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, html, "utf8");
}

function buildPageHtml(baseShellHtml, page) {
  const jsonLd = buildEntityPageJsonLd(page);
  let html = buildShellPage({
    baseHtml: baseShellHtml,
    title: page.metaTitle,
    description: page.metaDescription,
    canonical: page.canonical,
    jsonLd,
    bodyHtml: buildEntityPageBody(page),
    bodyDataAttr: `data-prerendered-entity="${escapeHtml(page.slug)}"`,
    social: page.social
      ? {
          type: page.social.type,
          title: page.metaTitle,
          description: page.metaDescription,
        }
      : undefined,
  });

  html = html.replace("</head>", `${buildEntityPageCss()}\n  </head>`);
  return html;
}

async function run() {
  const baseShellHtml = await fs.readFile(distIndexPath, "utf8");

  const homeHtml = buildShellPage({
    baseHtml: baseShellHtml,
    title: TITLE,
    description: DESCRIPTION,
    canonical: HOMEPAGE_URL,
    jsonLd: buildHomepageJsonLd(),
    bodyHtml: buildHomepageBody(),
    bodyDataAttr: 'data-prerendered-homepage="true"',
  });
  await fs.writeFile(distIndexPath, homeHtml, "utf8");

  const blogIndexHtml = buildShellPage({
    baseHtml: baseShellHtml,
    title: BLOG_INDEX_TITLE,
    description: BLOG_INDEX_DESCRIPTION,
    canonical: BLOG_URL,
    bodyHtml: buildBlogIndexBody(blogPosts),
    bodyDataAttr: 'data-prerendered-blog-index="true"',
  });
  await writePage(path.join("blog", "index.html"), blogIndexHtml);

  for (const post of blogPosts) {
    const { content, cta } = await getArticleData(post);
    const page = buildBlogPostBody(post, content, cta);
    const articleHtml = buildShellPage({
      baseHtml: baseShellHtml,
      title: post.metaTitle || `${post.title} — Nestor Services Blog`,
      description: page.description,
      canonical: page.canonical,
      jsonLd: page.jsonLd,
      bodyHtml: page.body,
      bodyDataAttr: `data-prerendered-blog-post="${escapeHtml(post.slug)}"`,
      social: {
        type: "article",
        title: post.ogTitle || post.title,
        description: post.ogDescription || page.description,
        image: page.imagePath
          ? `https://www.nestorservices.in/images/${page.imagePath.replace(/\.svg$/i, ".png")}`
          : "",
      },
    });
    await writePage(path.join("blog", post.slug, "index.html"), articleHtml);
  }

  for (const page of entityPages) {
    const entityHtml = buildPageHtml(baseShellHtml, page);
    await writePage(path.join(page.slug, "index.html"), entityHtml);
  }
}

run().catch((error) => {
  console.error("Failed to prerender Nestor Services pages:", error);
  process.exitCode = 1;
});
