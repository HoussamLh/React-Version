import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMail } from "react-icons/fi";
import { FaLinkedin, FaGithub } from "react-icons/fa";

export const Footer: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <footer style={styles.footer}>
      <div style={styles.topSection}>
        {/* Brand Column */}
        <div style={styles.brandCol}>
          <h3 style={styles.logo}>Devbysam</h3>
          <p style={styles.brandText}>
            Farnborough based Freelance Web Designer & Developer
          </p>
          <div style={styles.socials}>
            {/* Email */}
            <div style={styles.socialIcon}>
              <a href="mailto:contact@devbysam.co.uk">
                <FiMail />
              </a>
            </div>

            {/* GitHub */}
            <div style={styles.socialIcon}>
              <a
                href="https://github.com/HoussamLh"
                target="_blank"
                rel="noreferrer"
              >
                <FaGithub />
              </a>
            </div>

            {/* LinkedIn */}
            <div style={styles.socialIcon}>
              <a
                href="https://www.linkedin.com/in/houssamlh/"
                target="_blank"
                rel="noreferrer"
              >
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>

        {/* Links Column 1 */}
        <div style={styles.linksCol}>
          <h4 style={styles.colTitle}>SERVICES</h4>
          <Link to="/services" style={{...styles.link,...(isActive("/services") ? styles.activeLink : {}),}}>
            Services
          </Link>
          <Link to="/services" style={{...styles.link,...(isActive("/services") ? styles.activeLink : {}),}}>
            CMS Integration
          </Link>
          <Link to="/services" style={{...styles.link,...(isActive("/services") ? styles.activeLink : {}),}}>
            Website Maintenance
          </Link>
          <Link to="/services" style={{...styles.link,...(isActive("/services") ? styles.activeLink : {}),}}>
            UI/UX Design
          </Link>
        </div>

        {/* Links Column 2 */}
        <div style={styles.linksCol}>
          <h4 style={styles.colTitle}>COMPANY</h4>
          <Link to="/about" style={{...styles.link,...(isActive("/about") ? styles.activeLink : {}),}}>
            About Us
          </Link>
          <Link to="/projects" style={{...styles.link,...(isActive("/projects") ? styles.activeLink : {}),}}>
            Case Studies
          </Link>
          <Link to="/pricing" style={{...styles.link,...(isActive("/pricing") ? styles.activeLink : {}),}}>
            Our Pricing
          </Link>
          <Link to="/contact" style={{...styles.link,...(isActive("/contact") ? styles.activeLink : {}),}}>
            Contact Us
          </Link>
        </div>

        {/* Newsletter Column */}
        <div style={styles.newsletterCol}>
          <h4 style={styles.colTitle}>NEWSLETTER</h4>
          <p style={styles.newsletterText}>
            Get technical insights and updates directly in your inbox.
          </p>
          <div style={styles.inputGroup}>
            <input
              type="email"
              placeholder="email@address.com"
              style={styles.input}
              className="mono-text"
            />
            <button style={styles.inputBtn}>➔</button>
          </div>
        </div>
      </div>

      <hr style={styles.divider} />

      {/* Bottom Section */}
      <div style={styles.bottomSection}>
        <p style={styles.copyright} className="mono-text">
          Copyright © 2026 Devbysam. Web Designer & Developer.
        </p>
        <div style={styles.legalLinks} className="mono-text">
          <Link to="/privacy" style={styles.legalLink}>
            Privacy Policy
          </Link>
          <Link to="/terms" style={styles.legalLink}>
            Terms and conditions
          </Link>
          <Link to="/cookie" style={styles.legalLink}>
            Cookie Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: "var(--bg-dark)",
    borderTop: "1px solid var(--border-color)",
    padding: "80px 8% 40px 8%",
    color: "var(--text-main)",
  },
  topSection: {
    display: "grid",
    gridTemplateColumns: "2.5fr 1.5fr 1.5fr 2.5fr",
    gap: "40px",
    paddingBottom: "60px",
  },
  brandCol: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
  },
  logo: {
    fontSize: "24px",
    color: "var(--accent-green)",
    fontWeight: 900,
    margin: 0,
  },
  brandText: {
    color: "var(--text-muted)",
    fontSize: "15px",
    lineHeight: "1.6",
    maxWidth: "280px",
  },
  socials: {
    display: "flex",
    gap: "12px",
    marginTop: "8px",
  },
  socialIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: "1px solid var(--border-color)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    backgroundColor: "#131518",
  },
  linksCol: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "14px",
  },
  colTitle: {
    fontSize: "13px",
    color: "var(--accent-green)",
    fontWeight: 700,
    letterSpacing: "1px",
    marginBottom: "8px",
  },
  link: {
    color: "var(--text-muted)",
    textDecoration: "none",
    fontSize: "14px",
    transition: "color 0.2s",
  },
    activeLink: {
    color: "var(--accent-green)",
    borderBottom: "2px solid var(--accent-green)",
    paddingBottom: "4px",
  },
  newsletterCol: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "14px",
  },
  newsletterText: {
    color: "var(--text-muted)",
    fontSize: "14px",
    lineHeight: "1.6",
  },
  inputGroup: {
    display: "flex",
    alignItems: "center",
  },
  input: {
    backgroundColor: "#131518",
    border: "1px solid var(--border-color)",
    borderRight: "none",
    padding: "12px 16px",
    color: "#ffffff",
    borderRadius: "4px 0 0 4px",
    outline: "none",
    flex: 1,
    fontSize: "14px",
  },
  inputBtn: {
    backgroundColor: "var(--accent-green)",
    border: "1px solid var(--accent-green)",
    padding: "12px 16px",
    borderRadius: "0 4px 4px 0",
    cursor: "pointer",
    fontSize: "14px",
  },
  divider: {
    border: "none",
    borderTop: "1px solid var(--border-color)",
    margin: "0 0 30px 0",
  },
  bottomSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap" as const,
    gap: "20px",
  },
  copyright: {
    color: "var(--text-muted)",
    fontSize: "12px",
    margin: 0,
  },
  legalLinks: {
    display: "flex",
    gap: "24px",
  },
  legalLink: {
    color: "var(--text-muted)",
    textDecoration: "none",
    fontSize: "12px",
  },
};
