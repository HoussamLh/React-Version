import React from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";

interface RootLayoutProps {
  children: React.ReactNode;
}

export const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--bg-dark)",
      }}
    >
      {/* Universal Header */}
      <Navbar />

      {/* Main Page Canvas Element */}
      <main style={{ flex: 1 }}>{children}</main>

      {/* Universal Footer */}
      <Footer />
    </div>
  );
};
