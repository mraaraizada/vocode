"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const plans = [
  {
    name: "Modern",
    desc: "Clean lines, bold typography, vibrant gradients. Perfect for startups and SaaS products.",
    preview: { bg: "linear-gradient(135deg, #0f0e2a, #1a1040)", accent: "#6C5CE7" },
    tags: ["Minimal", "Bold", "Gradient"],
  },
  {
    name: "Bold",
    desc: "High contrast, strong visual hierarchy, eye-catching layout. Built for impact.",
    preview: { bg: "linear-gradient(135deg, #0a0a0a, #1a0a0a)", accent: "#FF4757" },
    tags: ["High-Impact", "Dark", "Strong"],
  },
  {
    name: "Minimal",
    desc: "Whitespace-driven, elegant typography, subtle accents. Refined and timeless.",
    preview: { bg: "linear-gradient(135deg, #0d0d12, #0a0d18)", accent: "#00D4FF" },
    tags: ["Clean", "Elegant", "Focused"],
  },
];

export default function PlansPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const router = useRouter();

  const handleSelect = (i: number) => {
    setSelected(i);
    setTimeout(() => router.push("/dashboard/editor"), 600);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 40px",
        position: "relative",
      }}
    >
      {/* Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 90% 70% at 50% 50%, rgba(108,92,231,0.08) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 1000, width: "100%", zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div
            style={{
              fontSize: "0.8rem",
              color: "rgba(255,255,255,0.35)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 12,
              animation: "fade-in-up 0.4s ease forwards",
            }}
          >
            Step 3 of 5
          </div>
          <h1
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#fff",
              marginBottom: 12,
              animation: "fade-in-up 0.4s ease forwards 100ms",
              opacity: 0,
            }}
          >
            Choose your{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #6C5CE7 0%, #00D4FF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              design plan
            </span>
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: "1rem",
              animation: "fade-in-up 0.4s ease forwards 200ms",
              opacity: 0,
            }}
          >
            AI generated 3 unique design concepts for your idea. Pick one to continue.
          </p>
        </div>

        {/* Plan cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
            animation: "fade-in-up 0.5s ease forwards 300ms",
            opacity: 0,
          }}
        >
          {plans.map((plan, i) => (
            <div
              key={i}
              onClick={() => handleSelect(i)}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                borderRadius: 24,
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border:
                  selected === i
                    ? `1px solid ${plan.preview.accent}80`
                    : hoveredIdx === i
                    ? "1px solid rgba(255,255,255,0.15)"
                    : "1px solid rgba(255,255,255,0.07)",
                overflow: "hidden",
                cursor: "pointer",
                transition: "all 0.35s ease",
                transform:
                  hoveredIdx === i || selected === i ? "translateY(-6px) scale(1.02)" : "translateY(0) scale(1)",
                boxShadow:
                  selected === i
                    ? `0 24px 60px rgba(0,0,0,0.4), 0 0 30px ${plan.preview.accent}30`
                    : hoveredIdx === i
                    ? "0 16px 50px rgba(0,0,0,0.35)"
                    : "none",
              }}
            >
              {/* Preview pane */}
              <div
                style={{
                  height: 200,
                  background: plan.preview.bg,
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  padding: 16,
                  gap: 10,
                }}
              >
                {/* Fake website skeleton */}
                <div style={{ height: 28, borderRadius: 8, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", padding: "0 12px" }}>
                  <div style={{ width: 50, height: 6, borderRadius: 3, background: `${plan.preview.accent}80` }} />
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <div style={{ width: "70%", height: 14, borderRadius: 4, background: "rgba(255,255,255,0.2)" }} />
                  <div style={{ width: "50%", height: 10, borderRadius: 3, background: "rgba(255,255,255,0.1)" }} />
                  <div
                    style={{
                      width: 80,
                      height: 24,
                      borderRadius: 999,
                      background: plan.preview.accent,
                      marginTop: 8,
                      opacity: 0.9,
                    }}
                  />
                </div>
                {/* Gradient fade on hover */}
                {hoveredIdx === i && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: `linear-gradient(135deg, ${plan.preview.accent}15, transparent)`,
                    }}
                  />
                )}
              </div>

              {/* Info */}
              <div style={{ padding: "20px" }}>
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
                      fontSize: "1.125rem",
                      fontWeight: 700,
                      color: "#fff",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {plan.name}
                  </h3>
                  {selected === i && (
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #6C5CE7, #00D4FF)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.65rem",
                      }}
                    >
                      ✓
                    </div>
                  )}
                </div>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "rgba(255,255,255,0.45)",
                    lineHeight: 1.6,
                    marginBottom: 16,
                  }}
                >
                  {plan.desc}
                </p>

                {/* Tags */}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {plan.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: "0.7rem",
                        padding: "3px 10px",
                        borderRadius: 999,
                        background: `${plan.preview.accent}15`,
                        border: `1px solid ${plan.preview.accent}30`,
                        color: "rgba(255,255,255,0.5)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <button
                  style={{
                    width: "100%",
                    marginTop: 16,
                    padding: "10px",
                    borderRadius: 12,
                    background:
                      selected === i
                        ? "linear-gradient(135deg, #6C5CE7, #00D4FF)"
                        : "rgba(255,255,255,0.06)",
                    border: selected === i ? "none" : "1px solid rgba(255,255,255,0.1)",
                    color: "#fff",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    fontFamily: "inherit",
                  }}
                >
                  {selected === i ? "✓ Selected" : "Select Plan"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
