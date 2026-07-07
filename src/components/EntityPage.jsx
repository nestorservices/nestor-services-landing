import "./EntityPage.css";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export default function EntityPage({ page }) {
  return (
    <main className="entity-page">
      <section className="entity-page-hero">
        <div className="container">
          <div className="entity-page-eyebrow">{page.heroLabel}</div>
          <h1 className="entity-page-title">{page.heroTitle}</h1>
          <p className="entity-page-intro">{page.intro}</p>
          <div className="entity-page-actions">
            <a href={page.cta.href} className="entity-page-cta">
              {page.cta.label}
            </a>
            <a href="/" className="entity-page-link">
              Back to Nestor Services
            </a>
          </div>
        </div>
      </section>

      <section className="entity-page-content">
        <div className="container">
          <div className="entity-page-grid">
            {page.sections.map((section) => (
              <article className="entity-page-card" key={section.title}>
                <h2 className="entity-page-card-title">{section.title}</h2>
                {section.items ? (
                  <ul className="entity-page-list">
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="entity-page-body">{section.body}</p>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export function renderEntityPageHtml(page) {
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
<main class="entity-page">
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
