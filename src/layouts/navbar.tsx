import React from "react";

export const Navbar: React.FC = () => {
  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>Devbysam</div>
      <div style={styles.links}>
        <a href="#home" style={{ ...styles.link, ...styles.activeLink }}>Home</a>
        <a href="#about" style={styles.link}>About</a>
        <a href="#projects" style={styles.link}>Projects</a>
        <a href="#services" style={styles.link}>Services</a>
        <a href="#pricing" style={styles.link}>Pricing</a>
        <a href="#contact" style={styles.link}>Contact</a>
      </div>
      <button style={styles.ctaButton}>Get Started</button>
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
