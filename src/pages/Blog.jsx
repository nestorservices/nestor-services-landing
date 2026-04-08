import { useEffect } from "react";
import { Link } from "react-router-dom";
import { blogPosts } from "../data/blogPosts";
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
  }, []);

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
          <div className="blog-cta-box">
            <h3 className="blog-cta-title">Want to stay updated?</h3>
            <p className="blog-cta-sub">
              We publish when we have something worth saying. Follow Shashank on
              LinkedIn for real-time insights.
            </p>
            <a
              href="https://www.linkedin.com/in/shashankmalviya/"
              target="_blank"
              rel="noopener noreferrer"
              className="blog-cta-btn"
            >
              Follow on LinkedIn →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
