"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname.startsWith("/dashboard")) return null;

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 72,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        padding: "0 32px",
        transition: "all 0.3s ease",
        background: scrolled ? "rgba(7, 6, 15, 0.85)" : "rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Logo with Image */}
      <Link href="/" style={{ textDecoration: "none", flexShrink: 0, display: "flex", alignItems: "center", gap: 12 }}>
        <Image
          src="/logo.png"
          alt="VOCODE"
          width={36}
          height={36}
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
      </Link>

      {/* Center nav */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          margin: "0 auto",
        }}
      >
        {["Features", "How It Works", "Pricing", "Docs"].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase().replace(/ /g, "-")}`}
            style={{
              color: "rgba(255,255,255,0.65)",
              fontSize: "0.9rem",
              fontWeight: 500,
              padding: "8px 16px",
              borderRadius: "8px",
              textDecoration: "none",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.color = "rgba(255,255,255,0.95)";
              (e.target as HTMLElement).style.background = "rgba(255,255,255,0.06)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.color = "rgba(255,255,255,0.65)";
              (e.target as HTMLElement).style.background = "transparent";
            }}
          >
            {item}
          </a>
        ))}
      </div>

      {/* Right CTA */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <Link
          href="/dashboard"
          style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: "0.9rem",
            fontWeight: 500,
            textDecoration: "none",
            padding: "8px 16px",
            borderRadius: "8px",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)";
          }}
        >
          Login
        </Link>
        <Link href="/dashboard" className="btn-primary" style={{ fontSize: "0.875rem", padding: "10px 22px" }}>
          Start Building
        </Link>
      </div>
    </nav>
  );
}
