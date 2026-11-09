import "./EntityPage.css";
import { useEffect } from "react";
import { setCanonical } from "../lib/seo";

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
  if (page.slug === "our-recruitment-approach") {
    return <RecruitmentApproachPage page={page} />;
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
          {page.approachLink && (
            <p className="entity-page-context-link">
              <a href={page.approachLink.href}>{page.approachLink.label} →</a>
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

function RecruitmentApproachPage({ page }) {
  useEffect(() => {
    document.title = page.metaTitle;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute("content", page.metaDescription);
    setCanonical(page.canonical);
  }, [page]);

  return (
    <main className="entity-page recruitment-approach-page">
      <section className="entity-page-hero recruitment-approach-hero">
        <div className="container">
          <div className="entity-page-eyebrow">{page.heroLabel}</div>
          <h1 className="entity-page-title">{page.heroTitle}</h1>
          <p className="recruitment-approach-promise">{page.brandPromise}</p>
          <p className="entity-page-intro">{page.intro}</p>
          <div className="entity-page-actions">
            <a href={page.cta.href} className="entity-page-cta">{page.cta.label}</a>
            <a href="/recruitment-services" className="entity-page-link">Recruitment services</a>
          </div>
        </div>
      </section>

      <section className="entity-page-content recruitment-approach-content">
        <div className="container recruitment-approach-sections">
          <section className="recruitment-approach-panel" aria-labelledby="partnership-title">
            <p className="recruitment-approach-kicker">A collaborative partnership</p>
            <h2 className="entity-page-card-title" id="partnership-title">How we work with your team</h2>
            <p className="entity-page-body">{page.partnershipIntro}</p>
            <ul className="entity-page-list recruitment-approach-points">
              {page.partnershipPoints.map((point) => <li key={point}>{point}</li>)}
            </ul>
          </section>

          <section aria-labelledby="approach-stages-title">
            <div className="recruitment-approach-section-heading">
              <p className="recruitment-approach-kicker">From role context to employer review</p>
              <h2 className="entity-page-card-title" id="approach-stages-title">Our recruitment approach</h2>
            </div>
            <ol className="recruitment-approach-stages">
              {page.stages.map((stage, index) => (
                <li className="recruitment-approach-stage" key={stage.title}>
                  <span className="recruitment-approach-stage-number">0{index + 1}</span>
                  <div>
                    <h3>{stage.title}</h3>
                    <p>{stage.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="recruitment-approach-panel recruitment-approach-panel--contrast" aria-labelledby="beyond-cv-title">
            <p className="recruitment-approach-kicker">Context before forwarding</p>
            <h2 className="entity-page-card-title" id="beyond-cv-title">More than CV forwarding</h2>
            <p className="entity-page-body">{page.workflowIntro}</p>
          </section>

          <section aria-labelledby="technology-title">
            <div className="recruitment-approach-section-heading">
              <p className="recruitment-approach-kicker">Tools in service of the team</p>
              <h2 className="entity-page-card-title" id="technology-title">Technology that supports people</h2>
              <p className="entity-page-body">{page.technologyIntro}</p>
            </div>
            <div className="recruitment-approach-products">
              {page.products.map((product) => (
                <article className="recruitment-approach-product" key={product.name}>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <a href={product.href}>{product.linkLabel} →</a>
                </article>
              ))}
            </div>
          </section>

          <section className="recruitment-approach-panel" aria-labelledby="flexible-title">
            <p className="recruitment-approach-kicker">Different roles, considered individually</p>
            <h2 className="entity-page-card-title" id="flexible-title">Flexible across industries and functions</h2>
            <p className="entity-page-body">{page.flexibilityCopy}</p>
          </section>

          <section className="recruitment-approach-faq" aria-labelledby="recruitment-faq-title">
            <p className="recruitment-approach-kicker">Employer questions</p>
            <h2 className="entity-page-card-title" id="recruitment-faq-title">Frequently asked questions</h2>
            <div className="recruitment-approach-faq-list">
              {page.faqs.map(({ question, answer }) => (
                <details className="recruitment-approach-faq-item" key={question}>
                  <summary>{question}</summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="recruitment-approach-final-cta" aria-labelledby="recruitment-final-title">
            <div>
              <p className="recruitment-approach-kicker">Start with the requirement</p>
              <h2 id="recruitment-final-title">{page.finalCtaTitle}</h2>
              <p>{page.finalCtaCopy}</p>
            </div>
            <a href={page.cta.href} className="entity-page-cta">{page.cta.label}</a>
          </section>
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
  if (page.slug === "our-recruitment-approach") {
    return renderRecruitmentApproachHtml(page);
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
      ${page.approachLink ? `<p class="entity-page-context-link"><a href="${escapeHtml(page.approachLink.href)}">${escapeHtml(page.approachLink.label)} →</a></p>` : ""}
    </div>
  </section>
</main>`;
}

function renderRecruitmentApproachHtml(page) {
  const stages = page.stages.map((stage, index) => `
    <li class="recruitment-approach-stage">
      <span class="recruitment-approach-stage-number">0${index + 1}</span>
      <div><h3>${escapeHtml(stage.title)}</h3><p>${escapeHtml(stage.body)}</p></div>
    </li>`).join("");
  const partnershipPoints = page.partnershipPoints.map((point) => `<li>${escapeHtml(point)}</li>`).join("");
  const products = page.products.map((product) => `
    <article class="recruitment-approach-product">
      <h3>${escapeHtml(product.name)}</h3><p>${escapeHtml(product.description)}</p>
      <a href="${escapeHtml(product.href)}">${escapeHtml(product.linkLabel)} →</a>
    </article>`).join("");
  const faqs = page.faqs.map(({ question, answer }) => `
    <details class="recruitment-approach-faq-item"><summary>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p></details>`).join("");

  return `
<main class="entity-page recruitment-approach-page" data-prerendered="entity-page">
  <section class="entity-page-hero recruitment-approach-hero"><div class="container">
    <div class="entity-page-eyebrow">${escapeHtml(page.heroLabel)}</div>
    <h1 class="entity-page-title">${escapeHtml(page.heroTitle)}</h1>
    <p class="recruitment-approach-promise">${escapeHtml(page.brandPromise)}</p>
    <p class="entity-page-intro">${escapeHtml(page.intro)}</p>
    <div class="entity-page-actions"><a href="${escapeHtml(page.cta.href)}" class="entity-page-cta">${escapeHtml(page.cta.label)}</a><a href="/recruitment-services" class="entity-page-link">Recruitment services</a></div>
  </div></section>
  <section class="entity-page-content recruitment-approach-content"><div class="container recruitment-approach-sections">
    <section class="recruitment-approach-panel" aria-labelledby="partnership-title"><p class="recruitment-approach-kicker">A collaborative partnership</p><h2 class="entity-page-card-title" id="partnership-title">How we work with your team</h2><p class="entity-page-body">${escapeHtml(page.partnershipIntro)}</p><ul class="entity-page-list recruitment-approach-points">${partnershipPoints}</ul></section>
    <section aria-labelledby="approach-stages-title"><div class="recruitment-approach-section-heading"><p class="recruitment-approach-kicker">From role context to employer review</p><h2 class="entity-page-card-title" id="approach-stages-title">Our recruitment approach</h2></div><ol class="recruitment-approach-stages">${stages}</ol></section>
    <section class="recruitment-approach-panel recruitment-approach-panel--contrast" aria-labelledby="beyond-cv-title"><p class="recruitment-approach-kicker">Context before forwarding</p><h2 class="entity-page-card-title" id="beyond-cv-title">More than CV forwarding</h2><p class="entity-page-body">${escapeHtml(page.workflowIntro)}</p></section>
    <section aria-labelledby="technology-title"><div class="recruitment-approach-section-heading"><p class="recruitment-approach-kicker">Tools in service of the team</p><h2 class="entity-page-card-title" id="technology-title">Technology that supports people</h2><p class="entity-page-body">${escapeHtml(page.technologyIntro)}</p></div><div class="recruitment-approach-products">${products}</div></section>
    <section class="recruitment-approach-panel" aria-labelledby="flexible-title"><p class="recruitment-approach-kicker">Different roles, considered individually</p><h2 class="entity-page-card-title" id="flexible-title">Flexible across industries and functions</h2><p class="entity-page-body">${escapeHtml(page.flexibilityCopy)}</p></section>
    <section class="recruitment-approach-faq" aria-labelledby="recruitment-faq-title"><p class="recruitment-approach-kicker">Employer questions</p><h2 class="entity-page-card-title" id="recruitment-faq-title">Frequently asked questions</h2><div class="recruitment-approach-faq-list">${faqs}</div></section>
    <section class="recruitment-approach-final-cta" aria-labelledby="recruitment-final-title"><div><p class="recruitment-approach-kicker">Start with the requirement</p><h2 id="recruitment-final-title">${escapeHtml(page.finalCtaTitle)}</h2><p>${escapeHtml(page.finalCtaCopy)}</p></div><a href="${escapeHtml(page.cta.href)}" class="entity-page-cta">${escapeHtml(page.cta.label)}</a></section>
  </div></section>
</main>`;
}
