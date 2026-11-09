import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="landing-footer">
      <div className="landing-wrap">
        <div className="landing-footer-top">
          <div className="landing-footer-brand">
            <img src="/nestor-services-logo.png" alt="Nestor Services — Your Workforce Partner" />
            <a href="mailto:shashank@nestorservices.in">Contact Nestor Services</a>
          </div>
          <nav className="landing-footer-links" aria-label="Footer">
            <a href="https://hire.nestorservices.in/jobs">Find a job</a>
            <a href="https://hire.nestorservices.in" target="_blank" rel="noopener noreferrer">Nestor Hire</a>
            <Link to="/nestor-core">Nestor Core</Link>
            <Link to="/nestor-assess">Nestor Assess</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/privacy">Privacy</Link>
          </nav>
        </div>
        <p className="landing-footer-legal">Nestor Services is an India-based recruitment and talent acquisition business supporting employers and candidates. Nestor Core is currently in development / pilot.</p>
        <div className="landing-footer-bottom">© 2026 Nestor Services · Gurugram, India</div>
      </div>
    </footer>
  );
}
