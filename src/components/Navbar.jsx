import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location]);

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="navbar-logo-n">N</span>
          <span className="navbar-logo-text">estor Services</span>
        </Link>

        <div className={`navbar-links ${open ? "navbar-links--open" : ""}`}>
          <a href="https://hire.nestorservices.in" className="navbar-link navbar-link--product navbar-link--hire" target="_blank" rel="noopener noreferrer">
            <span className="navbar-pip navbar-pip--blue" />
            Hire
          </a>
          <a href="https://core.nestorservices.in/login" className="navbar-link navbar-link--product navbar-link--core" target="_blank" rel="noopener noreferrer">
            <span className="navbar-pip navbar-pip--teal" />
            Core
          </a>
          <Link to="/blog" className="navbar-link">Blog</Link>
          <a href="mailto:hello@nestorservices.in" className="navbar-cta">Get in touch</a>
        </div>

        <button className="navbar-burger" onClick={() => setOpen(!open)} aria-label="Menu">
          <span className={open ? "open" : ""} />
          <span className={open ? "open" : ""} />
          <span className={open ? "open" : ""} />
        </button>
      </div>
    </nav>
  );
}
