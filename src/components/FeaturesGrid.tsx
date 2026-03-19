"use client";

import { useState } from "react";

const features = [
  {
    icon: "🎤",
    title: "Voice-First Input",
    desc: "Speak your idea naturally. VOCODE understands context, tone, and purpose.",
    color: "#6C5CE7",
  },
  {
    icon: "🧠",
    title: "AI Architecture",
    desc: "Intelligent layout engine structures your content into a coherent site architecture.",
    color: "#00D4FF",
  },
  {
    icon: "⚡",
    title: "Instant Generation",
    desc: "From concept to fully-coded website in under 30 seconds. No waiting, no friction.",
    color: "#6C5CE7",
  },
  {
    icon: "✏️",
    title: "Natural Editing",
    desc: "Say 'make the hero darker' or 'add a testimonials section'. The AI just does it.",
    color: "#00D4FF",
  },
  {
    icon: "📦",
    title: "Export Clean Code",
    desc: "Export production-ready React, HTML, or Next.js code. Yours to keep and deploy.",
    color: "#6C5CE7",
  },
  {
    icon: "🎨",
    title: "Design Intelligence",
    desc: "AI-crafted layouts with professional typography, spacing, and color systems.",
    color: "#00D4FF",
  },
];

export default function FeaturesGrid() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section
      id="features"
      style={{
        padding: "100px 24px",
        maxWidth: 1200,
        margin: "0 auto",
        position: "relative",
      }}
    >
      {/* Section header */}
      <div style={{ textAlign: "center", marginBottom: 64 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "5px 16px",
            borderRadius: 999,
            background: "rgba(108,92,231,0.1)",
            border: "1px solid rgba(108,92,231,0.25)",
            fontSize: "0.8125rem",
            color: "rgba(255,255,255,0.6)",
            marginBottom: 20,
            fontWeight: 500,
          }}
        >
          ✦ Features
        </div>
        <h2
          style={{
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "#fff",
            lineHeight: 1.1,
          }}
        >
          Everything you need to{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #6C5CE7 0%, #00D4FF 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            build faster
          </span>
        </h2>
        <p
          style={{
            marginTop: 16,
            color: "rgba(255,255,255,0.45)",
            fontSize: "1.0625rem",
            maxWidth: 480,
            margin: "16px auto 0",
            lineHeight: 1.65,
          }}
        >
          Built for speed and quality. Every feature designed to eliminate friction from idea to deployment.
        </p>
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 20,
        }}
      >
        {features.map((feature, i) => (
          <div
            key={i}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            style={{
              borderRadius: 24,
              background: hoveredIdx === i ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.05)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: hoveredIdx === i
                ? `1px solid ${feature.color}40`
                : "1px solid rgba(255,255,255,0.08)",
              padding: "32px 28px",
              cursor: "default",
              transition: "all 0.3s ease",
              transform: hoveredIdx === i ? "translateY(-6px)" : "translateY(0)",
              boxShadow: hoveredIdx === i
                ? `0 20px 50px rgba(0,0,0,0.3), 0 0 30px ${feature.color}18`
                : "0 4px 20px rgba(0,0,0,0.2)",
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: `${feature.color}18`,
                border: `1px solid ${feature.color}30`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.4rem",
                marginBottom: 20,
                transition: "all 0.3s ease",
                boxShadow: hoveredIdx === i ? `0 0 20px ${feature.color}30` : "none",
              }}
            >
              {feature.icon}
            </div>

            <h3
              style={{
                fontSize: "1.125rem",
                fontWeight: 700,
                color: "#fff",
                marginBottom: 10,
                letterSpacing: "-0.01em",
              }}
            >
              {feature.title}
            </h3>
            <p
              style={{
                fontSize: "0.9375rem",
                color: "rgba(255,255,255,0.5)",
                lineHeight: 1.65,
              }}
            >
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
