import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { blogPosts } from "../data/blogPosts";
import { setCanonical } from "../lib/seo";
import "./BlogPost.css";

const contentRegistry = {
  "why-ai-hiring-tools-in-india-are-mostly-fake": () =>
    import("../content/why-ai-hiring-tools-in-india-are-mostly-fake.js"),
  "ats-graveyard-why-startups-failed-hiring-india": () =>
    import("../content/ats-graveyard-why-startups-failed-hiring-india.js"),
};

function renderContent(text) {
  return text
    .trim()
    .split("\n\n")
    .map((block, i) => {
      if (block.startsWith("## ")) {
        return (
          <h2 key={i} className="bp-heading">
            {block.replace("## ", "")}
          </h2>
        );
      }
      if (block.startsWith("# ")) {
        return (
          <h1 key={i} className="bp-h1">
            {block.replace("# ", "")}
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
            style={{
              width: "100%",
              borderRadius: "8px",
              margin: "32px 0",
              display: "block",
            }}
          />
        );
      }
      return (
        <p key={i} className="bp-para">
          {block}
        </p>
      );
    });
}

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [articleContent, setArticleContent] = useState(null);
  const [articleCta, setArticleCta] = useState(null);

  const post = blogPosts.find((p) => p.slug === slug);
  const relatedPosts = blogPosts.filter((entry) => entry.slug !== slug).slice(0, 2);

  useEffect(() => {
    if (!post) {
      navigate("/blog");
      return;
    }

    document.title = `${post.title} — Nestor Services Blog`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", post.excerpt);
    setCanonical(`https://www.nestorservices.in/blog/${post.slug}`);

    const loader = contentRegistry[slug];
    if (loader) {
      loader().then((mod) => {
        setArticleContent(mod.content);
        setArticleCta(mod.cta || null);
      });
    }
  }, [slug, post, navigate]);

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
              {renderContent(articleContent)}

              {articleCta && (
                <div className="bp-cta-box">
                  <p className="bp-cta-text">{articleCta.text}</p>
                  <a href={articleCta.link} className="bp-cta-btn">
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
