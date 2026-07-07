import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const distIndexPath = path.join(projectRoot, "dist", "index.html");

const HOMEPAGE_URL = "https://www.nestorservices.in/";
const TITLE = "Nestor Services — Recruitment, HR Operations & Workforce Solutions";
const DESCRIPTION =
  "Nestor Services helps companies in India hire talent, run HR operations, manage payroll support, and improve workforce workflows.";

const homepageMarkup = `
<main class="entity-home" data-prerendered="true">
  <section class="entity-hero">
    <p class="entity-eyebrow">Recruitment and workforce solutions in India</p>
    <h1>Nestor Services</h1>
    <p>
      Nestor Services is a recruitment and workforce solutions company in India that helps businesses
      hire talent, manage HR operations, and improve workforce workflows across the employee lifecycle.
    </p>
    <p>
      We work across recruitment, hiring workflows, HR operations, payroll support, and workforce
      management with practical systems built for Indian employers and HR teams.
    </p>
  </section>
  <section class="entity-products" aria-label="Nestor platforms">
    <article class="entity-card">
      <h2>Nestor Hire</h2>
      <p>
        Nestor Hire is the recruitment and hiring platform from Nestor Services. It supports talent
        discovery, recruiter workflows, candidate evaluation, and employer hiring coordination.
      </p>
      <p><a href="https://hire.nestorservices.in">Explore Nestor Hire</a></p>
    </article>
    <article class="entity-card">
      <h2>Nestor Core</h2>
      <p>
        Nestor Core is the HR operations and payroll platform from Nestor Services. It supports HR
        administration, payroll support, employee records, attendance, leave, and workforce management.
      </p>
      <p><a href="https://core.nestorservices.in">Explore Nestor Core</a></p>
    </article>
  </section>
  <section class="entity-summary">
    <h2>How Nestor Services helps</h2>
    <ul>
      <li>Recruitment and talent hiring support for Indian companies</li>
      <li>Hiring workflows that connect employers, recruiters, and candidates</li>
      <li>HR operations support for employee records, attendance, and compliance processes</li>
      <li>Payroll support and workforce management across the employee journey</li>
    </ul>
  </section>
</main>`;

const schema = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Nestor Services",
    url: HOMEPAGE_URL,
    logo: "https://www.nestorservices.in/nestor-services-logo.png",
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

function replaceOrInsertMeta(html, pattern, replacement, fallback) {
  if (pattern.test(html)) {
    return html.replace(pattern, replacement);
  }
  return html.replace("</head>", `  ${fallback}\n  </head>`);
}

function buildJsonLdTag() {
  return `<script type="application/ld+json">${escapeJsonLd(schema)}</script>`;
}

function buildPrerenderStyles() {
  return `<style id="entity-prerender-styles">
    #root[data-prerendered-homepage="true"] {
      display: block;
    }
    .entity-home {
      font-family: "Plus Jakarta Sans", system-ui, sans-serif;
      color: #0f172a;
      background: #f8fbff;
      padding: 48px 20px 64px;
    }
    .entity-home a {
      color: #155dfc;
    }
    .entity-home h1,
    .entity-home h2 {
      margin: 0 0 16px;
      line-height: 1.15;
    }
    .entity-home p,
    .entity-home li {
      font-size: 1rem;
      line-height: 1.7;
    }
    .entity-home section {
      max-width: 1080px;
      margin: 0 auto 28px;
      background: #ffffff;
      border: 1px solid #dbe7f5;
      border-radius: 20px;
      padding: 28px;
      box-shadow: 0 18px 48px rgba(15, 23, 42, 0.06);
    }
    .entity-eyebrow {
      margin: 0 0 12px;
      color: #155dfc;
      font-size: 0.9rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .entity-products {
      display: grid;
      gap: 20px;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .entity-card {
      border: 1px solid #dbe7f5;
      border-radius: 16px;
      padding: 24px;
      background: linear-gradient(180deg, #ffffff 0%, #f2f7ff 100%);
    }
    .entity-summary ul {
      margin: 0;
      padding-left: 20px;
    }
    @media (max-width: 720px) {
      .entity-home {
        padding: 24px 14px 40px;
      }
      .entity-home section,
      .entity-card {
        padding: 20px;
      }
      .entity-products {
        grid-template-columns: 1fr;
      }
    }
  </style>`;
}

async function run() {
  let html = await fs.readFile(distIndexPath, "utf8");

  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(TITLE)}</title>`);
  html = replaceOrInsertMeta(
    html,
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${escapeHtml(DESCRIPTION)}" />`,
    `<meta name="description" content="${escapeHtml(DESCRIPTION)}" />`,
  );
  html = replaceOrInsertMeta(
    html,
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${HOMEPAGE_URL}" />`,
    `<link rel="canonical" href="${HOMEPAGE_URL}" />`,
  );

  if (!html.includes('id="entity-prerender-styles"')) {
    html = html.replace("</head>", `  ${buildPrerenderStyles()}\n  </head>`);
  }

  const jsonLdTag = buildJsonLdTag();
  if (/<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/i.test(html)) {
    html = html.replace(
      /<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/i,
      jsonLdTag,
    );
  } else {
    html = html.replace("</head>", `  ${jsonLdTag}\n  </head>`);
  }

  html = html.replace(
    /<div id="root"><\/div>/i,
    `<div id="root" data-prerendered-homepage="true">${homepageMarkup}</div>`,
  );

  await fs.writeFile(distIndexPath, html, "utf8");
}

run().catch((error) => {
  console.error("Failed to prerender homepage entity HTML:", error);
  process.exitCode = 1;
});
