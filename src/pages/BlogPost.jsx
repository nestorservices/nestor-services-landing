import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { blogPosts } from "../data/blogPosts";
import "./BlogPost.css";

const contentRegistry = {
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

  useEffect(() => {
    if (!post) {
      navigate("/blog");
      return;
    }

    document.title = `${post.title} — Nestor Services Blog`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", post.excerpt);

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
            href="https://nestorservices.in"
            className="bp-home-link"
          >
            nestorservices.in →
          </a>
        </div>
      </div>
    </div>
  );
}
