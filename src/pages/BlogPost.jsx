import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { blogPosts } from "../data/blogPosts";
import { setCanonical } from "../lib/seo";
import "./BlogPost.css";

const contentRegistry = {
  "what-happens-after-you-apply": () =>
    import("../content/what-happens-after-you-apply.js"),
  "why-ai-hiring-tools-in-india-are-mostly-fake": () =>
    import("../content/why-ai-hiring-tools-in-india-are-mostly-fake.js"),
  "ats-graveyard-why-startups-failed-hiring-india": () =>
    import("../content/ats-graveyard-why-startups-failed-hiring-india.js"),
  "recruitment-agency-two-team-problem": () =>
    import("../content/recruitment-agency-two-team-problem.js"),
};
const CTA_FALLBACK = "https://hire.nestorservices.in/jobs";

function resolveSafeReturnTo(raw) {
  const value = String(raw || "").trim();
  if (!value) return "";
  if (value.startsWith("/jobs/") || value.startsWith("/apply/")) {
    return `https://hire.nestorservices.in${value}`;
  }
  try {
    const url = new URL(value);
    const path = url.pathname || "";
    const allowedHost = url.hostname === "hire.nestorservices.in";
    const allowedPath = path.startsWith("/jobs/") || path.startsWith("/apply/");
    if (!allowedHost || !allowedPath) return "";
    return `${url.origin}${url.pathname}${url.search || ""}`;
  } catch {
    return "";
  }
}

function renderInline(text) {
  return String(text || "")
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
}

function renderContent(text, onImageClick) {
  return text
    .trim()
    .split("\n\n")
    .map((block, i) => {
      if (block.startsWith("## ")) {
        return (
          <h2 key={i} className="bp-heading">
            {renderInline(block.replace("## ", ""))}
          </h2>
        );
      }
      if (block.startsWith("# ")) {
        return (
          <h1 key={i} className="bp-h1">
            {renderInline(block.replace("# ", ""))}
          </h1>
        );
      }
      if (block.startsWith("[IMAGE:")) {
        const name = block.replace("[IMAGE:", "").replace("]", "");
        return (
          <img
            key={i}
            src={`/images/${name}.png`}
            alt={name}
            className="bp-article-image"
            onClick={() => onImageClick(`/images/${name}.png`, name)}
          />
        );
      }
      return (
        <p key={i} className="bp-para">
          {renderInline(block)}
        </p>
      );
    });
}

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [articleContent, setArticleContent] = useState(null);
  const [articleCta, setArticleCta] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  const ctaLink = useMemo(() => {
    const returnTo = new URLSearchParams(location.search || "").get("returnTo");
    const safeReturnTo = resolveSafeReturnTo(returnTo);
    if (safeReturnTo) return safeReturnTo;
    return articleCta?.link || CTA_FALLBACK;
  }, [articleCta, location.search]);

  const post = blogPosts.find((p) => p.slug === slug);
  const relatedPosts = blogPosts.filter((entry) => entry.slug !== slug).slice(0, 2);

  useEffect(() => {
    if (!post) {
      navigate("/blog");
      return;
    }

    document.title = post.metaTitle || `${post.title} — Nestor Services Blog`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", post.metaDescription || post.excerpt);
    setCanonical(`https://www.nestorservices.in/blog/${post.slug}`);

    const loader = contentRegistry[slug];
    if (loader) {
      loader().then((mod) => {
        setArticleContent(mod.content);
        setArticleCta(mod.cta || null);
      });
    }
  }, [slug, post, navigate]);

  useEffect(() => {
    if (!lightboxImage) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setLightboxImage(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxImage]);

  if (!post) return null;

  return (
    <div className="bp-page">
      <div className="bp-back-wrap">
        <div className="bp-container">
          <Link to="/blog" className="bp-back">
            ← Back to Blog
          </Link>
        </div>
      </div>

      <header className="bp-header">
        <div className="bp-container">
          <div className="bp-tag" style={{ color: post.tagColor }}>
            {post.tag}
          </div>
          <h1 className="bp-title">{post.title}</h1>
          <div className="bp-meta">
            <div className="bp-avatar">SM</div>
            <div className="bp-meta-text">
              <span className="bp-author">{post.author}</span>
              <span className="bp-meta-sub">
                {new Date(post.date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}{" "}
                · {post.readTime}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="bp-divider-wrap">
        <div className="bp-container">
          <div className="bp-divider" />
        </div>
      </div>

      <article className="bp-article">
        <div className="bp-container bp-container--narrow">
          {articleContent ? (
            <>
              {renderContent(articleContent, (src, alt) => setLightboxImage({ src, alt }))}

              {articleCta && (
                <div className="bp-cta-box">
                  <p className="bp-cta-text">{articleCta.text}</p>
                  <a href={ctaLink} className="bp-cta-btn">
                    {articleCta.linkText} →
                  </a>
                </div>
              )}

              <div className="bp-ecosystem-grid">
                <div className="bp-cta-box bp-cta-box--ecosystem">
                  <p className="bp-cta-label">Nestor Hire</p>
                  <p className="bp-cta-text">
                    Explore live roles and candidate experience on the higher-traffic Nestor Hire platform.
                  </p>
                  <a href="https://hire.nestorservices.in" className="bp-cta-btn">
                    Explore roles →
                  </a>
                </div>

                <div className="bp-cta-box bp-cta-box--ecosystem">
                  <p className="bp-cta-label">Nestor Services</p>
                  <p className="bp-cta-text">
                    Visit the homepage to understand how Nestor Hire and Nestor Core connect.
                  </p>
                  <a href="https://www.nestorservices.in/" className="bp-cta-btn bp-cta-btn--secondary">
                    About Nestor Services →
                  </a>
                </div>
              </div>

              {relatedPosts.length > 0 ? (
                <div className="bp-related">
                  <h2 className="bp-heading">Related reading</h2>
                  <div className="bp-related-list">
                    {relatedPosts.map((entry) => (
                      <Link key={entry.slug} to={`/blog/${entry.slug}`} className="bp-related-link">
                        {entry.title} →
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bp-related">
                  <h2 className="bp-heading">Continue reading</h2>
                  <div className="bp-related-list">
                    <Link to="/blog" className="bp-related-link">
                      Browse all articles →
                    </Link>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bp-loading">Loading article...</div>
          )}
        </div>
      </article>

      {lightboxImage && (
        <div className="bp-lightbox" onClick={() => setLightboxImage(null)} role="presentation">
          <div className="bp-lightbox-content" onClick={(e) => e.stopPropagation()} role="presentation">
            <img src={lightboxImage.src} alt={lightboxImage.alt} className="bp-lightbox-image" />
          </div>
        </div>
      )}

      <div className="bp-footer-nav">
        <div className="bp-container">
          <Link to="/blog" className="bp-back">
            ← All articles
          </Link>
          <a
            href="https://www.nestorservices.in/"
            className="bp-home-link"
          >
            www.nestorservices.in →
          </a>
        </div>
      </div>
    </div>
  );
}
