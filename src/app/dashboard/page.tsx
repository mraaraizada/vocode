"use client";

import { useState } from "react";
import Link from "next/link";

const stats = [
  { label: "Websites Built", value: "8", color: "#6C5CE7" },
  { label: "Code Lines", value: "15K", color: "#00D4FF" },
  { label: "Time Saved", value: "100h", color: "#6C5CE7" },
  { label: "Exports", value: "10", color: "#00D4FF" },
];

const projects = [
  { name: "SaaS Landing Page", edited: "2 hours ago", status: "Live", statusColor: "#00D4FF", thumb: "#6C5CE720" },
  { name: "E-commerce Store", edited: "Yesterday", status: "Draft", statusColor: "#6C5CE7", thumb: "#00D4FF20" },
  { name: "Portfolio Site", edited: "3 days ago", status: "Live", statusColor: "#00D4FF", thumb: "#6C5CE720" },
  { name: "Blog Platform", edited: "1 week ago", status: "Building", statusColor: "#FFD700", thumb: "#FFD70020" },
  { name: "Agency Website", edited: "2 weeks ago", status: "Live", statusColor: "#00D4FF", thumb: "#00D4FF20" },
  { name: "App Dashboard", edited: "3 weeks ago", status: "Draft", statusColor: "#6C5CE7", thumb: "#6C5CE720" },
];

export default function DashboardPage() {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);

  return (
    <div style={{ padding: "40px", minHeight: "100vh" }}>
      {/* Greeting */}
      <div style={{ marginBottom: 40, animation: "fade-in-up 0.5s ease forwards" }}>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "#fff",
            marginBottom: 6,
          }}
        >
          Welcome back, User 👋
        </h1>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "1rem" }}>
          Ready to build something amazing?
        </p>
      </div>

      {/* Quick Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 48,
          animation: "fade-in-up 0.5s ease forwards 100ms",
          opacity: 0,
        }}
      >
        {stats.map((stat, i) => (
          <div
            key={i}
            onMouseEnter={() => setHoveredStat(i)}
            onMouseLeave={() => setHoveredStat(null)}
            style={{
              borderRadius: 20,
              background: hoveredStat === i ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.05)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: hoveredStat === i
                ? `1px solid ${stat.color}40`
                : "1px solid rgba(255,255,255,0.07)",
              padding: "24px",
              transition: "all 0.3s ease",
              transform: hoveredStat === i ? "translateY(-4px)" : "translateY(0)",
              boxShadow: hoveredStat === i ? `0 12px 40px rgba(0,0,0,0.25)` : "none",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Top accent line */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background: `linear-gradient(90deg, ${stat.color}, transparent)`,
                opacity: hoveredStat === i ? 1 : 0.5,
                transition: "opacity 0.3s ease",
              }}
            />

            <div
              style={{
                fontSize: "2rem",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                background: `linear-gradient(135deg, ${stat.color}, #fff)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: 4,
              }}
            >
              {stat.value}
            </div>
            <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.45)" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Projects header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
          animation: "fade-in-up 0.5s ease forwards 200ms",
          opacity: 0,
        }}
      >
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "-0.02em",
          }}
        >
          Recent Projects
        </h2>
        <Link
          href="/dashboard/new"
          className="btn-primary"
          style={{ fontSize: "0.875rem", padding: "10px 20px" }}
        >
          + New Project
        </Link>
      </div>

      {/* Projects grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 16,
          animation: "fade-in-up 0.5s ease forwards 300ms",
          opacity: 0,
        }}
      >
        {projects.map((project, i) => (
          <div
            key={i}
            onMouseEnter={() => setHoveredProject(i)}
            onMouseLeave={() => setHoveredProject(null)}
            style={{
              borderRadius: 20,
              background: hoveredProject === i ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: hoveredProject === i
                ? "1px solid rgba(108,92,231,0.3)"
                : "1px solid rgba(255,255,255,0.07)",
              overflow: "hidden",
              transition: "all 0.3s ease",
              transform: hoveredProject === i ? "translateY(-4px)" : "translateY(0)",
              boxShadow: hoveredProject === i
                ? "0 16px 48px rgba(0,0,0,0.3), 0 0 20px rgba(108,92,231,0.1)"
                : "none",
            }}
          >
            {/* Preview thumbnail */}
            <div
              style={{
                height: 140,
                background: `linear-gradient(135deg, ${project.thumb}, rgba(0,0,0,0.4))`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                position: "relative",
              }}
            >
              {/* Fake preview */}
              <div style={{ width: "80%", display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ height: 8, borderRadius: 4, background: "rgba(255,255,255,0.15)", width: "70%" }} />
                <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.08)", width: "50%" }} />
                <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.06)", width: "80%" }} />
                <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                  {[1, 2, 3].map((j) => (
                    <div key={j} style={{ flex: 1, height: 40, borderRadius: 8, background: "rgba(255,255,255,0.06)" }} />
                  ))}
                </div>
              </div>
            </div>

            <div style={{ padding: "16px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <h3
                  style={{
                    fontSize: "0.9375rem",
                    fontWeight: 700,
                    color: "#fff",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {project.name}
                </h3>
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    padding: "3px 10px",
                    borderRadius: 999,
                    background: `${project.statusColor}18`,
                    border: `1px solid ${project.statusColor}40`,
                    color: project.statusColor,
                    letterSpacing: "0.04em",
                  }}
                >
                  {project.status}
                </span>
              </div>
              <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.35)", marginBottom: 14 }}>
                Edited {project.edited}
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <Link
                  href="/dashboard/editor"
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: 10,
                    background: "linear-gradient(135deg, #6C5CE7, #00D4FF)",
                    color: "#fff",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    textAlign: "center",
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  Edit
                </Link>
                <button
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.7)",
                    fontSize: "0.8rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    fontFamily: "inherit",
                  }}
                >
                  Export
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
