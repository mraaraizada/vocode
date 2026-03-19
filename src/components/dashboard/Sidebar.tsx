"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Overview", href: "/dashboard" },
  { label: "Create New", href: "/dashboard/new" },
  { label: "My Projects", href: "/dashboard/projects" },
  { label: "Editor", href: "/dashboard/editor" },
  { label: "Settings", href: "/dashboard/settings" },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: 240,
        minWidth: 240,
        height: "100vh",
        position: "sticky",
        top: 0,
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(255,255,255,0.07)",
        display: "flex",
        flexDirection: "column",
        padding: "0",
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "24px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Link href="/" style={{ textDecoration: "none" }}>
          <span
            style={{
              fontSize: "1.375rem",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              background: "linear-gradient(135deg, #6C5CE7 0%, #00D4FF 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            VOCODE
          </span>
        </Link>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 14px",
                borderRadius: 12,
                textDecoration: "none",
                background: isActive ? "rgba(108,92,231,0.15)" : "transparent",
                borderLeft: isActive ? "3px solid #6C5CE7" : "3px solid transparent",
                color: isActive ? "#fff" : "rgba(255,255,255,0.55)",
                fontSize: "0.9rem",
                fontWeight: isActive ? 600 : 400,
                transition: "all 0.2s ease",
                boxShadow: isActive ? "0 0 20px rgba(108,92,231,0.1)" : "none",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                  (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.8)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)";
                }
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User area */}
      <div
        style={{
          padding: "16px 12px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 14px",
            borderRadius: 12,
            background: "rgba(255,255,255,0.04)",
            cursor: "pointer",
            transition: "background 0.2s ease",
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6C5CE7, #00D4FF)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.875rem",
              fontWeight: 700,
              color: "#fff",
              flexShrink: 0,
            }}
          >
            U
          </div>
          <div>
            <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#fff" }}>User</div>
            <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)" }}>Free Plan</div>
          </div>
          <div style={{ marginLeft: "auto", color: "rgba(255,255,255,0.3)", fontSize: "0.75rem" }}>⋯</div>
        </div>
      </div>
    </aside>
  );
}
