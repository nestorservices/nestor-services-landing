import { useEffect } from "react";
import { Link } from "react-router-dom";
import { blogPosts } from "../data/blogPosts";
import { setCanonical } from "../lib/seo";
import "./Blog.css";

export default function Blog() {
  useEffect(() => {
    document.title = "Blog — Nestor Services | HR & Hiring Insights";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "Insights on HR technology, hiring in India, and the future of recruitment from the team at Nestor Services."
      );
    }
    setCanonical("https://www.nestorservices.in/blog");
  }, []);

  const featuredArticle = blogPosts[0];

  return (
    <div className="blog-page">
      <section className="blog-hero">
        <div className="blog-hero-inner">
          <span className="blog-eyebrow">From the desk of Nestor</span>
          <h1 className="blog-hero-title">
            Honest perspectives on <br />
            <span className="blog-hero-accent">hiring, HR, and what's broken.</span>
          </h1>
          <p className="blog-hero-sub">
            Written by practitioners. Not marketers.
          </p>
        </div>
      </section>

      <section className="blog-grid-section">
        <div className="blog-container">
          <div className="blog-grid">
            {blogPosts.map((post, i) => (
              <Link
                to={`/blog/${post.slug}`}
                key={post.slug}
                className={`blog-card ${i === 0 ? "blog-card--featured" : ""}`}
              >
                <div className="blog-card-tag" style={{ color: post.tagColor }}>
                  {post.tag}
                </div>
                <h2 className="blog-card-title">{post.title}</h2>
                <p className="blog-card-excerpt">{post.excerpt}</p>
                <div className="blog-card-meta">
                  <span className="blog-card-author">{post.author}</span>
                  <span className="blog-card-dot">·</span>
                  <span className="blog-card-date">
                    {new Date(post.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <span className="blog-card-dot">·</span>
                  <span className="blog-card-read">{post.readTime}</span>
                </div>
                <div className="blog-card-arrow">
                  Read article <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="blog-cta-section">
        <div className="blog-container">
          <div className="blog-cta-grid">
            <div className="blog-cta-box">
              <h3 className="blog-cta-title">Explore roles with Nestor Hire</h3>
              <p className="blog-cta-sub">
                See active opportunities and experience the higher-traffic side
                of the Nestor ecosystem.
              </p>
              <a
                href="https://hire.nestorservices.in"
                target="_blank"
                rel="noopener noreferrer"
                className="blog-cta-btn"
              >
                Explore roles →
              </a>
            </div>

            <div className="blog-cta-box">
              <h3 className="blog-cta-title">About Nestor Services</h3>
              <p className="blog-cta-sub">
                Return to the main site to see how Nestor Hire and Nestor Core
                fit together.
              </p>
              <a
                href="https://www.nestorservices.in/"
                className="blog-cta-btn blog-cta-btn--secondary"
              >
                Visit homepage →
              </a>
            </div>

            <div className="blog-cta-box">
              <h3 className="blog-cta-title">Start with our key article</h3>
              <p className="blog-cta-sub">
                New here? Begin with the article that frames our point of view on hiring in India.
              </p>
              <Link
                to={`/blog/${featuredArticle.slug}`}
                className="blog-cta-btn blog-cta-btn--secondary"
              >
                Read featured article →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
