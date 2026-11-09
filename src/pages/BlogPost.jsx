import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { blogPosts } from "../data/blogPosts";
import { formatBlogDate } from "../lib/formatBlogDate";
import { setCanonical } from "../lib/seo";
import { content as recruitmentOutsourcingContent } from "../content/recruitment-outsourcing-vs-in-house-hiring.js";
import "./BlogPost.css";

const RECRUITMENT_OUTSOURCING_SLUG = "recruitment-outsourcing-vs-in-house-hiring";

const contentRegistry = {
  "why-your-cv-might-never-get-read": () =>
    import("../content/why-your-cv-might-never-get-read.js"),
  "why-job-application-went-unanswered": () =>
    import("../content/why-job-application-went-unanswered.js"),
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

function parseImageToken(token) {
  const raw = String(token || "").trim();
  const [namePart, altPart] = raw.split("|", 2);
  const name = namePart.trim();
  const alt = altPart?.trim() || name.replace(/-/g, " ");
  return { name, alt };
}

function resolveImagePath(name) {
  return /\.(svg|png|jpe?g|webp)$/i.test(name) ? name : `${name}.png`;
}

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
    .split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g)
    .filter(Boolean)
    .map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link && isSafeArticleHref(link[2])) {
        return <a key={index} href={link[2]}>{link[1]}</a>;
      }
      return part;
    });
}

function isSafeArticleHref(href) {
  return /^\/(?!\/)/.test(href) || /^https:\/\/(?:[a-z0-9-]+\.)*nestorservices\.in(?:\/|$)/i.test(href);
}

function parseMarkdownTable(lines) {
  if (lines.length < 3 || !lines[0].startsWith("|") || !lines[0].endsWith("|")) {
    return null;
  }
  const rows = lines.map((line) => line.slice(1, -1).split("|").map((cell) => cell.trim()));
  const isSeparator = rows[1].every((cell) => /^:?-{3,}:?$/.test(cell));
  if (!isSeparator || rows.some((row) => row.length !== rows[0].length)) return null;
  return { header: rows[0], body: rows.slice(2) };
}

function renderContent(text, onImageClick) {
  return text
    .trim()
    .split("\n\n")
    .map((block, i) => {
      const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
      const isUnorderedList = lines.length > 0 && lines.every((line) => line.startsWith("- "));
      const isOrderedList = lines.length > 0 && lines.every((line) => /^\d+\. /.test(line));
      const table = parseMarkdownTable(lines);

      if (table) {
        return (
          <div key={i} className="bp-table-scroll" role="region" aria-label="Hiring model comparison" tabIndex="0">
            <table className="bp-comparison-table">
              <thead>
                <tr>{table.header.map((cell, cellIndex) => <th key={cellIndex} scope="col">{renderInline(cell)}</th>)}</tr>
              </thead>
              <tbody>
                {table.body.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => cellIndex === 0
                      ? <th key={cellIndex} scope="row">{renderInline(cell)}</th>
                      : <td key={cellIndex}>{renderInline(cell)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }

      if (isUnorderedList || isOrderedList) {
        const ListTag = isUnorderedList ? "ul" : "ol";
        return (
          <ListTag key={i} className="bp-list">
            {lines.map((line) => (
              <li key={line}>
                {renderInline(line.replace(isUnorderedList ? /^- / : /^\d+\. /, ""))}
              </li>
            ))}
          </ListTag>
        );
      }
      if (block.startsWith("### ")) {
        return (
          <h3 key={i} className="bp-subheading">
            {renderInline(block.replace("### ", ""))}
          </h3>
        );
      }
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
        const { name, alt } = parseImageToken(
          block.replace("[IMAGE:", "").replace("]", ""),
        );
        return (
          <img
            key={i}
            src={`/images/${resolveImagePath(name)}`}
            alt={alt}
            className="bp-article-image"
            onClick={() => onImageClick(`/images/${resolveImagePath(name)}`, alt)}
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
  const [articleContent, setArticleContent] = useState(() =>
    slug === RECRUITMENT_OUTSOURCING_SLUG ? recruitmentOutsourcingContent : null,
  );
  const [articleCta, setArticleCta] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  const ctaLink = useMemo(() => {
    const returnTo = new URLSearchParams(location.search || "").get("returnTo");
    const safeReturnTo = resolveSafeReturnTo(returnTo);
    if (safeReturnTo) return safeReturnTo;
    return articleCta?.link || CTA_FALLBACK;
  }, [articleCta, location.search]);

  const post = blogPosts.find((p) => p.slug === slug);
  const relatedPosts = post?.relatedSlugs
    ? post.relatedSlugs.map((relatedSlug) => blogPosts.find((entry) => entry.slug === relatedSlug)).filter(Boolean)
    : blogPosts.filter((entry) => entry.slug !== slug).slice(0, 2);

  useEffect(() => {
    if (!post) {
      navigate("/blog");
      return;
    }

    document.title = post.metaTitle || `${post.title} — Nestor Services Blog`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", post.metaDescription || post.excerpt);
    setCanonical(`https://www.nestorservices.in/blog/${post.slug}`);

    if (slug === RECRUITMENT_OUTSOURCING_SLUG) {
      setArticleContent(recruitmentOutsourcingContent);
      setArticleCta(null);
      return;
    }

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
    <div className="bp-page" data-prerendered="blog-post">
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
            {`${formatBlogDate(post.date)} · ${post.readTime}`}
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
              <p className="bp-para">{post.metaDescription || post.excerpt}</p>
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
                        {`${entry.title} →`}
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
