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
  if (page.slug === "nestor-assess") {
    return <AssessTrustPage page={page} />;
  }

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

function AssessTrustPage({ page }) {
  return (
    <main className="entity-page assess-trust-page">
      <section className="entity-page-hero assess-trust-hero">
        <div className="container">
          <div className="entity-page-eyebrow">{page.heroLabel}</div>
          <h1 className="entity-page-title">{page.heroTitle}</h1>
          <p className="entity-page-intro">{page.intro}</p>
          <div className="entity-page-actions">
            <a
              href={page.cta.href}
              className="entity-page-cta"
              target="_blank"
              rel="noopener noreferrer"
            >
              {page.cta.label}
            </a>
            <a href={page.trustLink.href} className="entity-page-link">
              {page.trustLink.label}
            </a>
          </div>
          <p className="assess-trust-caption">Invitation required</p>
        </div>
      </section>

      <section className="entity-page-content assess-trust-content">
        <div className="container assess-trust-sections">
          <section className="assess-trust-card" aria-labelledby="invitation-arrives">
            <p className="assess-trust-kicker">Before you begin</p>
            <h2 className="entity-page-card-title" id="invitation-arrives">
              How your invitation reaches you
            </h2>
            <p className="entity-page-body">{page.invitationCopy}</p>
          </section>

          <section
            className="assess-trust-card assess-trust-card--safety"
            id="invitation-safety"
            aria-labelledby="check-invitation"
          >
            <p className="assess-trust-kicker">Stay safe</p>
            <h2 className="entity-page-card-title" id="check-invitation">
              Check your invitation is genuine
            </h2>
            <ul className="entity-page-list">
              {page.safetyPoints.map((point) => <li key={point}>{point}</li>)}
            </ul>
            <p className="assess-trust-official">
              Official assessment destination: {" "}
              <a href="https://assess.nestorservices.in" target="_blank" rel="noopener noreferrer">
                assess.nestorservices.in
              </a>
            </p>
          </section>

          <section className="assess-trust-card" aria-labelledby="what-to-expect">
            <p className="assess-trust-kicker">Your assessment</p>
            <h2 className="entity-page-card-title" id="what-to-expect">What to expect</h2>
            <ul className="entity-page-list">
              {page.expectations.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>

          <section className="assess-trust-card" aria-labelledby="part-of-nestor">
            <p className="assess-trust-kicker">The Nestor ecosystem</p>
            <h2 className="entity-page-card-title" id="part-of-nestor">
              Part of Nestor Services
            </h2>
            <p className="entity-page-body">{page.ecosystemCopy}</p>
            <nav className="assess-trust-product-links" aria-label="Nestor Services products">
              <a href="https://hire.nestorservices.in" target="_blank" rel="noopener noreferrer">
                Nestor Hire
              </a>
              <a href="https://core.nestorservices.in" target="_blank" rel="noopener noreferrer">
                Nestor Core
              </a>
              <a href="https://www.nestorservices.in/">Back to Nestor Services</a>
            </nav>
          </section>

          <section className="assess-trust-faq" aria-labelledby="assess-faq-title">
            <p className="assess-trust-kicker">Need a quick answer?</p>
            <h2 className="entity-page-card-title" id="assess-faq-title">
              Frequently asked questions
            </h2>
            <div className="assess-trust-faq-list">
              {page.faqs.map(({ question, answer }) => (
                <details className="assess-trust-faq-item" key={question}>
                  <summary>{question}</summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </section>
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
