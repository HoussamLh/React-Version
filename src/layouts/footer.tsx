import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Mail } from "lucide-react";

type BrandIconProps = {
  color: string;
  size?: number;
};

const GithubIcon: React.FC<BrandIconProps> = ({ color, size = 28 }) => (
  <svg
    aria-hidden="true"
    fill={color}
    focusable="false"
    height={size}
    viewBox="0 0 24 24"
    width={size}
  >
    <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.36 6.84 9.72.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.38-3.37-1.38-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.33 9.33 0 0 1 12 6.99c.85 0 1.71.12 2.51.34 1.9-1.33 2.74-1.05 2.74-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.95.68 1.92 0 1.38-.01 2.5-.01 2.84 0 .27.18.59.69.49A10.18 10.18 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
  </svg>
);

const LinkedinIcon: React.FC<BrandIconProps> = ({ color, size = 28 }) => (
  <svg
    aria-hidden="true"
    fill={color}
    focusable="false"
    height={size}
    viewBox="0 0 24 24"
    width={size}
  >
    <path d="M5.34 8.98H2.67V21h2.67V8.98ZM4 3a1.55 1.55 0 1 0 0 3.1A1.55 1.55 0 0 0 4 3Zm7.61 5.98H8.95V21h2.66v-6.32c0-1.67.31-3.28 2.35-3.28 2.01 0 2.04 1.91 2.04 3.39V21h2.66v-7.01c0-3.44-.72-6.08-4.7-6.08-1.91 0-3.19 1.07-3.71 2.08h-.04V8.98Z" />
  </svg>
);

export const Footer: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const currentYear = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <div style={styles.topSection} className="ds-footer-grid">
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
                <Mail color="#74f542" size={28} strokeWidth={2.2} />
              </a>
            </div>

            {/* GitHub */}
            <div style={styles.socialIcon}>
              <a
                href="https://github.com/HoussamLh"
                target="_blank"
                rel="noreferrer"
              >
                <GithubIcon color="#74f542" />
              </a>
            </div>

            {/* LinkedIn */}
            <div style={styles.socialIcon}>
              <a
                href="https://www.linkedin.com/in/houssamlh/"
                target="_blank"
                rel="noreferrer"
              >
                <LinkedinIcon color="#74f542" />
              </a>
            </div>
          </div>
        </div>

        {/* Links Column 1 */}
        <div style={styles.linksCol}>
          <h4 style={styles.colTitle}>SERVICES</h4>
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
            to="/services"
            style={{
              ...styles.link,
              ...(isActive("/services") ? styles.activeLink : {}),
            }}
          >
            CMS Integration
          </Link>
          <Link
            to="/services"
            style={{
              ...styles.link,
              ...(isActive("/services") ? styles.activeLink : {}),
            }}
          >
            Website Maintenance
          </Link>
          <Link
            to="/services"
            style={{
              ...styles.link,
              ...(isActive("/services") ? styles.activeLink : {}),
            }}
          >
            UI/UX Design
          </Link>
        </div>

        {/* Links Column 2 */}
        <div style={styles.linksCol}>
          <h4 style={styles.colTitle}>COMPANY</h4>
          <Link
            to="/about"
            style={{
              ...styles.link,
              ...(isActive("/about") ? styles.activeLink : {}),
            }}
          >
            About Us
          </Link>
          <Link
            to="/projects"
            style={{
              ...styles.link,
              ...(isActive("/projects") ? styles.activeLink : {}),
            }}
          >
            Case Studies
          </Link>
          <Link
            to="/pricing"
            style={{
              ...styles.link,
              ...(isActive("/pricing") ? styles.activeLink : {}),
            }}
          >
            Our Pricing
          </Link>
          <Link
            to="/contact"
            style={{
              ...styles.link,
              ...(isActive("/contact") ? styles.activeLink : {}),
            }}
          >
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
            <button style={styles.inputBtn}>
              <ArrowRight size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      <hr style={styles.divider} />

      {/* Bottom Section */}
      <div style={styles.bottomSection} className="ds-footer-bottom">
        <p style={styles.copyright} className="mono-text">
          Copyright <span className="mono-text">©</span> {currentYear} Devbysam.
          Web Designer & Developer.
        </p>
        <div style={styles.legalLinks} className="mono-text legal-links-cluster">
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
    paddingBottom: "60px",
  },
  bottomSection: {

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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "35px",
    gap: "12px",
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
    display: "inline-block",
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
