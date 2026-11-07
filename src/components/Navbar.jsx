import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FIRST_ROLE_HREF } from "../data/homepageContent";
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

  if (location.pathname === "/") {
    return <LandingNavbar open={open} setOpen={setOpen} />;
  }

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <img
            src="/nestor-services-logo.png"
            alt="Nestor Services"
            className="navbar-logo-image"
          />
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
          <a href="/nestor-assess" className="navbar-link navbar-link--product navbar-link--assess">
            <span className="navbar-pip navbar-pip--assess" />
            Assess
          </a>
          <Link to="/blog" className="navbar-link">Blog</Link>
          <a href="mailto:shashank@nestorservices.in" className="navbar-cta">Get in touch</a>
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

function LandingNavbar({ open, setOpen }) {
  const closeMenu = () => setOpen(false);

  return (
    <header className="landing-header">
      <div className="landing-nav-inner">
        <Link to="/" className="landing-nav-brand" aria-label="Nestor Services — Your Workforce Partner">
          <img src="/nestor-services-logo.png" alt="Nestor Services — Your Workforce Partner" />
        </Link>
        <button
          className={`landing-menu-button${open ? " landing-menu-button--open" : ""}`}
          type="button"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          aria-controls="landing-primary-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav
          className={`landing-nav-links${open ? " landing-nav-links--open" : ""}`}
          id="landing-primary-navigation"
          aria-label="Primary"
        >
          <a href="https://hire.nestorservices.in/jobs">Find a job</a>
          <a href="#platforms" onClick={closeMenu}>Platforms</a>
          <a href="#employers" onClick={closeMenu}>For employers</a>
          <a href="#why" onClick={closeMenu}>Why Nestor</a>
          <a className="landing-nav-cta" href={FIRST_ROLE_HREF} onClick={closeMenu}>
            Share a role — free
          </a>
        </nav>
      </div>
    </header>
  );
}
