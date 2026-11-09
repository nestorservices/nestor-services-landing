import { useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { candidates, products, employerTiers, empanelmentPoints, credibility, FIRST_ROLE_HREF, EMPANELMENT_HREF, HOMEPAGE_TITLE, HOMEPAGE_DESCRIPTION } from "../data/homepageContent";
import { setCanonical } from "../lib/seo";
import "./Home.css";

export default function Home() {
  useEffect(() => {
    document.title = HOMEPAGE_TITLE;

    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", HOMEPAGE_DESCRIPTION);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", HOMEPAGE_TITLE);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", HOMEPAGE_DESCRIPTION);
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", "https://www.nestorservices.in/");
    setCanonical("https://www.nestorservices.in/");

    const page = document.querySelector(".landing-home");
    if (!page || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    page.classList.add("landing-home--animated");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });

    page.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="landing-home">
      <section className="landing-hero">
        <div className="landing-hero-glow" aria-hidden="true" />
        <div className="landing-wrap">
          <h1 className="landing-hero-title">
            Whether you&apos;re building a <span>career</span> or building a <span>team</span> — work starts here.
          </h1>
          <p className="landing-hero-lead">
            Find roles and understand the hiring process, or discuss recruitment and HR operations support for your business.
          </p>
          <div className="landing-actions">
            <a className="landing-button landing-button--primary" href="https://hire.nestorservices.in/jobs">
              Find your next role <span aria-hidden="true">→</span>
            </a>
            <a className="landing-button landing-button--secondary" href="#employers">
              Share a role — free
            </a>
          </div>
          <div className="landing-proofline" aria-label="About Nestor Services">
            <div><strong>15+ years</strong><span>in HR and talent acquisition</span></div>
            <div><strong>Founder-led</strong><span>direct and accountable</span></div>
            <div><strong>Gurugram, India</strong><span>working across the Indian market</span></div>
          </div>
        </div>
      </section>

      <section className="landing-band" id="candidates">
        <div className="landing-wrap">
          <div className="landing-section-head reveal">
            <p className="landing-eyebrow">Looking for work?</p>
            <h2>Find a role, understand your next step.</h2>
            <p>Start with a live opening, check an assessment invitation, or get practical context on the application process.</p>
          </div>
          <div className="landing-candidate-grid">
            {candidates.map((item) => (
              <article className="landing-candidate-card reveal" key={item.title}>
                <div className="landing-icon" aria-hidden="true">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                {item.external ? (
                  <a className="landing-text-link" href={item.href} target="_blank" rel="noopener noreferrer">
                    {item.label} <span aria-hidden="true">→</span>
                  </a>
                ) : (
                  <Link className="landing-text-link" to={item.href}>
                    {item.label} <span aria-hidden="true">→</span>
                  </Link>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-band landing-band--products" id="platforms">
        <div className="landing-wrap">
          <div className="landing-section-head reveal">
            <p className="landing-eyebrow">The Nestor platforms</p>
            <h2>Technology and services for work, hiring, and HR.</h2>
            <p>Nestor Services supports employers and candidates with recruitment and talent acquisition services, alongside focused product experiences.</p>
          </div>
          <div className="landing-product-grid">
            {products.map((product) => (
              <article className={`landing-product-card landing-product-card--${product.key} reveal`} key={product.key}>
                <div className="landing-product-topline">
                  <span className="landing-product-name" style={{ "--card-accent": product.accent }}>{product.name}</span>
                  <span className="landing-product-category">{product.category}</span>
                </div>
                {product.status && <p className="landing-product-status">{product.status}</p>}
                <h3>{product.headline}</h3>
                <p className="landing-product-description">{product.description}</p>
                <ul className="landing-feature-list">
                  {product.features.map((feature) => <li key={feature}>{feature}</li>)}
                </ul>
                <div className="landing-product-footer">
                  <span>{product.audience}</span>
                  <div className="landing-product-links">
                    {product.portalHref && (
                      <a href={product.portalHref} target="_blank" rel="noopener noreferrer">
                        {product.portalLabel}
                      </a>
                    )}
                    <Link to={product.href}>{product.label} <span aria-hidden="true">→</span></Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-band" id="employers">
        <div className="landing-wrap">
          <div className="landing-section-head reveal">
            <p className="landing-eyebrow">For employers and recruiters</p>
            <h2>Support that starts with your actual requirement.</h2>
            <p>Discuss recruitment services, per-hire support, managed hiring, or HR operations support without a one-size-fits-all promise.</p>
            <p><a className="landing-text-link" href="/our-recruitment-approach">See how our recruitment partnership works <span aria-hidden="true">→</span></a></p>
          </div>
          <div className="landing-employer-spectrum">
            {employerTiers.map((item, index) => (
              <article className={`landing-employer-tier${index === 0 ? " landing-employer-tier--lead" : ""}`} key={item.step}>
                {item.freeLabel && <span className="landing-employer-free">{item.freeLabel}</span>}
                <div className="landing-employer-step">{item.step}</div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
          <div className="landing-empanelment reveal">
            <h3>One HR generalist can&apos;t be an expert at everything. Empanel with Nestor.</h3>
            <div className="landing-empanelment-columns">
              <p>Recruitment, assessments, payroll and HR operations require different expertise. Instead of expecting one generalist to manage everything, work with Nestor as your extended HR team. You focus on running your business while we handle the people side — as little or as much as you need.</p>
              <ul className="landing-empanelment-checklist">
                {empanelmentPoints.map((point) => <li key={point}>{point}</li>)}
              </ul>
            </div>
            <div className="landing-empanelment-cta">
              <a className="landing-button landing-button--primary" href={EMPANELMENT_HREF}>Talk about empanelment</a>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-band landing-band--why" id="why">
        <div className="landing-wrap">
          <div className="landing-section-head reveal">
            <p className="landing-eyebrow">Why Nestor Services</p>
            <h2>Practical experience, with a clear point of contact.</h2>
          </div>
          <div className="landing-credibility-grid">
            {credibility.map((item) => (
              <article className="landing-credibility-card reveal" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-band landing-band--start" id="start">
        <div className="landing-wrap">
          <div className="landing-dual-grid">
            <div className="landing-cta-box landing-cta-box--candidate reveal">
              <p className="landing-eyebrow">Candidates</p>
              <h3>Looking for your next role?</h3>
              <p>Browse current public openings on Nestor Hire and apply directly to roles that fit.</p>
              <a className="landing-button landing-button--primary" href="https://hire.nestorservices.in/jobs">
                Explore roles <span aria-hidden="true">→</span>
              </a>
            </div>
            <div className="landing-cta-box landing-cta-box--employer reveal">
              <p className="landing-eyebrow">Employers</p>
              <h3>Share one role — the first&apos;s on us.</h3>
              <p>Tell us about the role or HR operations support your team needs. We&apos;ll discuss a suitable scope.</p>
              <a className="landing-button landing-button--primary" href={FIRST_ROLE_HREF}>
                Share a role — free <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
