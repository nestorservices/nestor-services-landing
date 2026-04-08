import { useEffect } from "react";
import { Link } from "react-router-dom";
import { blogPosts } from "../data/blogPosts";
import "./Home.css";

const differentiators = [
  {
    icon: "◈",
    title: "Built by an HR insider",
    body: "15 years inside the function. Every feature exists because a real problem demanded it — not because a developer imagined one.",
  },
  {
    icon: "◉",
    title: "Two platforms, one vision",
    body: "Nestor Hire finds the right people. Nestor Core manages them end to end. Built to work together, used independently.",
  },
  {
    icon: "◐",
    title: "India-first by design",
    body: "Not a Western SaaS retrofitted for Indian realities. Built here, for here — with CTC structures, compliance, and hiring dynamics that actually match.",
  },
];

const hireFeatures = ["AI Fitment Scoring", "Talent Advisors", "Kanban Pipeline", "CTC & Notice Signals"];
const coreFeatures = ["Payroll Processing", "Attendance & Leave", "Employee Records", "Compliance Controls"];

export default function Home() {
  useEffect(() => {
    document.title = "Nestor Services — Your Workforce Partner";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Nestor Services powers the full employee lifecycle — from finding the right hire to running every HR operation across their journey.");
  }, []);

  const latestPosts = blogPosts.slice(0, 2);

  return (
    <main className="home">
      <section className="hero">
        <div className="hero-grid-lines" aria-hidden="true" />
        <div className="hero-glow" aria-hidden="true" />
        <div className="container">
          <div className="hero-eyebrow">
            <span className="hero-dot" />
            Workforce Technology · Built in India
          </div>
          <h1 className="hero-title">
            One company.<br />
            <em className="hero-title-em">Two powerful platforms.</em>
          </h1>
          <p className="hero-sub">
            Nestor Services powers the full employee lifecycle — from finding the right hire
            to running every HR operation across their journey.
          </p>
          <div className="hero-actions">
            <a href="https://hire.nestorservices.in" className="btn btn--blue" target="_blank" rel="noopener noreferrer">
              Explore Nestor Hire →
            </a>
            <Link to="/blog" className="btn btn--ghost">Read our thinking</Link>
          </div>
          <div className="hero-founder-strip">
            <div className="hero-founder-avatar">SM</div>
            <p className="hero-founder-text">
              Founded by <strong>Shashank Malviya</strong> — 15 years in HRM across
              Country Delight, Housing.com, WNS and more.
            </p>
          </div>
        </div>
      </section>

      <section className="products">
        <div className="container">
          <div className="products-grid">
            <a href="https://hire.nestorservices.in" className="product-card product-card--hire" target="_blank" rel="noopener noreferrer">
              <div className="product-card-header">
                <div className="product-badge product-badge--blue">NESTOR HIRE</div>
                <div className="product-label">Recruitment Platform</div>
              </div>
              <h2 className="product-card-title">
                AI-powered recruitment that finds the right candidate — not just any candidate.
              </h2>
              <p className="product-card-body">
                Our Talent Advisors combine 15 years of hiring expertise with intelligent
                fitment matching built for India's hiring complexity.
              </p>
              <ul className="product-features">
                {hireFeatures.map((f) => (
                  <li key={f} className="product-feature product-feature--blue">
                    <span className="product-feature-dot product-feature-dot--blue" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="product-card-footer">
                <span className="product-audience">For employers & recruiters</span>
                <span className="product-cta product-cta--blue">Enter Nestor Hire →</span>
              </div>
            </a>

            <div className="product-card product-card--core">
              <div className="product-card-header">
                <div className="product-badge product-badge--teal">NESTOR CORE</div>
                <div className="product-label">HR Operations Cloud</div>
              </div>
              <h2 className="product-card-title">
                A single operating layer for HR and admin teams — across every company you manage.
              </h2>
              <p className="product-card-body">
                Employee records, payroll processing, attendance, leave approvals, and statutory
                compliance — all in one workspace.
              </p>
              <ul className="product-features">
                {coreFeatures.map((f) => (
                  <li key={f} className="product-feature product-feature--teal">
                    <span className="product-feature-dot product-feature-dot--teal" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="product-card-footer">
                <span className="product-audience">For HR & admin teams</span>
                <a href="https://core.nestorservices.in/login" className="product-cta product-cta--teal" target="_blank" rel="noopener noreferrer">
                  Sign in to Core →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="why">
        <div className="container">
          <div className="section-label">Why Nestor</div>
          <h2 className="section-title">
            Not another HR tool.<br />A different starting point.
          </h2>
          <div className="why-grid">
            {differentiators.map((d) => (
              <div key={d.title} className="why-card">
                <div className="why-icon">{d.icon}</div>
                <h3 className="why-card-title">{d.title}</h3>
                <p className="why-card-body">{d.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="blog-preview">
        <div className="container">
          <div className="blog-preview-header">
            <div>
              <div className="section-label">From the desk of Nestor</div>
              <h2 className="section-title section-title--left">
                Honest perspectives on hiring,<br />HR, and what's broken.
              </h2>
            </div>
            <Link to="/blog" className="btn btn--ghost btn--sm">
              All articles →
            </Link>
          </div>

          <div className="blog-preview-grid">
            {latestPosts.map((post) => (
              <Link to={`/blog/${post.slug}`} key={post.slug} className="blog-preview-card">
                <div className="blog-preview-tag" style={{ color: post.tagColor }}>
                  {post.tag}
                </div>
                <h3 className="blog-preview-title">{post.title}</h3>
                <p className="blog-preview-excerpt">{post.excerpt}</p>
                <div className="blog-preview-meta">
                  <span>{post.author}</span>
                  <span className="blog-preview-dot">·</span>
                  <span>{post.readTime}</span>
                </div>
                <div className="blog-preview-arrow">Read article <span>→</span></div>
              </Link>
            ))}

            <div className="blog-preview-card blog-preview-card--cta">
              <p className="blog-cta-quote">
                "The hiring process in India deserves accountability — on all sides."
              </p>
              <p className="blog-cta-attr">— Shashank Malviya, Founder</p>
              <Link to="/blog" className="btn btn--blue btn--sm" style={{ marginTop: "auto" }}>
                Read all articles →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <div className="footer-brand">
              <div className="footer-logo">
                <img
                  src="/nestor-services-logo.png"
                  alt="Nestor Services"
                  className="footer-logo-image"
                />
              </div>
              <p className="footer-tagline">Your Workforce Partner</p>
              <a
                href="https://www.linkedin.com/in/shashankmalviya/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-linkedin"
              >
                LinkedIn — 16k+ followers
              </a>
            </div>
            <div className="footer-links-group">
              <div className="footer-col">
                <div className="footer-col-head">Platforms</div>
                <a href="https://hire.nestorservices.in" className="footer-link" target="_blank" rel="noopener noreferrer">Nestor Hire</a>
                <a href="https://core.nestorservices.in/login" className="footer-link" target="_blank" rel="noopener noreferrer">Nestor Core</a>
              </div>
              <div className="footer-col">
                <div className="footer-col-head">Company</div>
                <Link to="/blog" className="footer-link">Blog</Link>
                <a href="mailto:shashank@nestorservices.in" className="footer-link">Contact</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 Nestor Services · nestorservices.in</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
