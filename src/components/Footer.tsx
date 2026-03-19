"use client";

import Image from "next/image";

const footerLinks = {
  Product: ["Features", "How It Works", "Pricing", "Changelog"],
  Resources: ["Docs", "Templates", "API Reference", "Blog"],
  Company: ["About", "Careers", "Press", "Contact"],
  Legal: ["Privacy", "Terms", "Security", "Cookies"],
};

export default function Footer() {
  return (
    <footer
      style={{
        position: "relative",
        padding: "80px 40px 40px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Top gradient fade */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(108,92,231,0.4), rgba(0,212,255,0.3), transparent)",
        }}
      />

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Top row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
            gap: 48,
            marginBottom: 64,
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <Image
                src="/logo.png"
                alt="VOCODE"
                width={32}
                height={32}
                style={{ objectFit: "contain" }}
              />
              <span
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  color: "#fff",
                }}
              >
                VOCODE
              </span>
            </div>
            <p
              style={{
                fontSize: "0.9rem",
                color: "rgba(255,255,255,0.4)",
                lineHeight: 1.7,
                maxWidth: 260,
                marginBottom: 24,
              }}
            >
              The AI-powered no-code builder that turns your voice into production-ready websites.
            </p>
            {/* Social icons */}
            <div style={{ display: "flex", gap: 12 }}>
              {["𝕏", "in", "GH"].map((icon) => (
                <button
                  key={icon}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.5)",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(108,92,231,0.2)";
                    (e.currentTarget as HTMLElement).style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)";
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.5)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                {category}
              </h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      style={{
                        color: "rgba(255,255,255,0.4)",
                        fontSize: "0.9rem",
                        textDecoration: "none",
                        transition: "color 0.2s ease",
                      }}
                      onMouseEnter={(e) => (e.target as HTMLElement).style.color = "rgba(255,255,255,0.8)"}
                      onMouseLeave={(e) => (e.target as HTMLElement).style.color = "rgba(255,255,255,0.4)"}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.25)" }}>
            © 2026 VOCODE. All rights reserved.
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: "0.8rem",
              color: "rgba(255,255,255,0.25)",
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#00D4FF",
                animation: "pulse-glow 2s ease-in-out infinite",
              }}
            />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
