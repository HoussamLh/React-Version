import React from "react";
import { Link, useLocation } from "react-router-dom";

export const Navbar: React.FC = () => {
  const location = useLocation();

  // Helper function to see if a link is currently active
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav style={styles.nav}>
      <Link to="/" style={{ ...styles.logo, textDecoration: "none" }}>
        Devbysam
      </Link>
      <div style={styles.links}>
        <Link to="/" style={{...styles.link,...(isActive("/") ? styles.activeLink : {}),}}>
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
      <button style={styles.ctaButton} onClick={() => window.location.href = "/contact"}>
        Get Started
      </button>
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
  ctaButton: {
    backgroundColor: "var(--accent-green)",
    color: "#000000",
    border: "none",
    padding: "10px 24px",
    borderRadius: "20px",
    fontWeight: 700,
    fontSize: "14px",
    cursor: "pointer",
  },
};
