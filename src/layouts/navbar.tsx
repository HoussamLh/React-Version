import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();  
  // Helper function to see if a link is currently active
  const isActive = (path: string) => location.pathname === path;

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav style={styles.nav}>
      <Link to="/" style={{ ...styles.logo, textDecoration: "none" }}>
        Devbysam
      </Link>

      {/* Desktop Links (Hidden on mobile via CSS) */}
      <div style={styles.links} className="desktop-menu">
        <Link
          to="/"
          style={{
            ...styles.link,
            ...(isActive("/") ? styles.activeLink : {}),
          }}
        >
          Home
        </Link>
        <Link
          to="/about"
          style={{
            ...styles.link,
            ...(isActive("/about") ? styles.activeLink : {}),
          }}
        >
          About
        </Link>
        <Link
          to="/services"
          style={{
            ...styles.link,
            ...(isActive("/services") ? styles.activeLink : {}),
          }}
        >
          Services
        </Link>
        <Link
          to="/projects"
          style={{
            ...styles.link,
            ...(isActive("/projects") ? styles.activeLink : {}),
          }}
        >
          Projects
        </Link>
        <Link
          to="/pricing"
          style={{
            ...styles.link,
            ...(isActive("/pricing") ? styles.activeLink : {}),
          }}
        >
          Pricing
        </Link>
        <Link
          to="/contact"
          style={{
            ...styles.link,
            ...(isActive("/contact") ? styles.activeLink : {}),
          }}
        >
          Contact
        </Link>
      </div>
      <Link to="/services" 
      style={styles.ctaLink} 
      className="desktop-menu"
      onClick={toggleMenu}>
        Get Started
      </Link>
      {/* Mobile Hamburger Menu */}
      <button
        style={styles.hamburger}
        className="mobile-menu-button"
        onClick={toggleMenu}
        aria-label="Toggle Menu"
      >
        <div
          style={{
            ...styles.bar,
            transform: isOpen ? "rotate(50deg) translate(2px, 8px)" : "none",
          }}
        />
        <div style={{ ...styles.bar, opacity: isOpen ? 0 : 1 }} />
        <div
          style={{
            ...styles.bar,
            transform: isOpen ? "rotate(-50deg) translate(-2px, -5px)" : "none",
          }}
        />
      </button>

      {/* Mobile Pop-up Window */}
      {isOpen && (
        <div style={styles.mobilePopup} className="mobile-menu-panel">
          <Link to="/" style={styles.popupLink} onClick={toggleMenu}>
            Home
          </Link>
          <Link to="/about" style={styles.popupLink} onClick={toggleMenu}>
            About
          </Link>
          <Link to="/services" style={styles.popupLink} onClick={toggleMenu}>
            Services
          </Link>
          <Link to="/projects" style={styles.popupLink} onClick={toggleMenu}>
            Projects
          </Link>
          <Link to="/pricing" style={styles.popupLink} onClick={toggleMenu}>
            Pricing
          </Link>
          <Link to="/contact" style={styles.popupLink} onClick={toggleMenu}>
            Contact
          </Link>
          <Link
            to="/services"
            style={styles.ctaLink}
            className="mobile-menu-cta"
          >
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "24px 8%",
    backgroundColor: "var(--bg-dark)",
    borderBottom: "1px solid var(--border-color)",
    position: "relative" as const,
    zIndex: 100,
  },
  logo: {
    fontSize: "24px",
    fontWeight: 900,
    color: "var(--accent-green)",
    letterSpacing: "-0.5px",
  },
  links: {
    display: "flex",
    gap: "32px",
  },
  link: {
    color: "var(--text-muted)",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: "15px",
    transition: "color 0.2s ease",
  },
  activeLink: {
    color: "var(--accent-green)",
    borderBottom: "2px solid var(--accent-green)",
    paddingBottom: "4px",
  },
  ctaLink: {
    backgroundColor: "var(--accent-green)",
    color: "#000000",
    textDecoration: "none",
    border: "none",
    padding: "10px 24px",
    borderRadius: "20px",
    fontWeight: 700,
    fontSize: "14px",
    cursor: "pointer",
  },
  hamburger: {
    display: "none",
    flexDirection: "column" as const,
    gap: "5px",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px",
  },
  bar: {
    width: "24px",
    height: "2px",
    backgroundColor: "var(--accent-green)",
    transition: "all 0.3s ease",
  },
  mobilePopup: {
    position: "fixed" as const,
    top: "80px",
    right: "5%",
    width: "min(390px, calc(100vw - 32px))",
    height: "auto",
    maxHeight: "calc(100vh - 96px)",
    backgroundColor: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    borderRadius: "16px",
    padding: "36px 24px",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: "22px",
    boxShadow: "-10px 20px 40px rgba(0,0,0,0.5)",
    zIndex: 1000,
  },
  popupLink: {
    color: "var(--text-main)",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: "16px",
    textAlign: "center" as const,
    width: "100%",
  },
};
