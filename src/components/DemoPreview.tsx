"use client";

import { useState } from "react";

const codeLines = [
  { tokens: [{ text: "import", color: "#C586C0" }, { text: " React ", color: "#9CDCFE" }, { text: "from", color: "#C586C0" }, { text: " 'react'", color: "#CE9178" }] },
  { tokens: [] },
  { tokens: [{ text: "export default function ", color: "#DCDCAA" }, { text: "Hero", color: "#4EC9B0" }, { text: "(", color: "#D4D4D4" }, { text: ")", color: "#D4D4D4" }, { text: " {", color: "#D4D4D4" }] },
  { tokens: [{ text: "  return ", color: "#C586C0" }, { text: "(", color: "#D4D4D4" }] },
  { tokens: [{ text: "    <", color: "#808080" }, { text: "section", color: "#4EC9B0" }, { text: " className=", color: "#9CDCFE" }, { text: '"hero"', color: "#CE9178" }, { text: ">", color: "#808080" }] },
  { tokens: [{ text: "      <", color: "#808080" }, { text: "h1", color: "#4EC9B0" }, { text: ">", color: "#808080" }, { text: "Build Anything", color: "#D4D4D4" }, { text: "</", color: "#808080" }, { text: "h1", color: "#4EC9B0" }, { text: ">", color: "#808080" }] },
  { tokens: [{ text: "      <", color: "#808080" }, { text: "p", color: "#4EC9B0" }, { text: ">", color: "#808080" }, { text: "AI-powered builder", color: "#D4D4D4" }, { text: "</", color: "#808080" }, { text: "p", color: "#4EC9B0" }, { text: ">", color: "#808080" }] },
  { tokens: [{ text: "    </", color: "#808080" }, { text: "section", color: "#4EC9B0" }, { text: ">", color: "#808080" }] },
  { tokens: [{ text: "  );", color: "#D4D4D4" }] },
  { tokens: [{ text: "}", color: "#D4D4D4" }] },
];

export default function DemoPreview() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");

  return (
    <section
      id="demo"
      style={{
        padding: "100px 24px",
        maxWidth: 1100,
        margin: "0 auto",
        position: "relative",
      }}
    >
      {/* Aura */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: "80%",
          height: "80%",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(108,92,231,0.1) 0%, transparent 65%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 56 }}>
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
          ✦ Live Demo
        </div>
        <h2
          style={{
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "#fff",
          }}
        >
          See it in{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #6C5CE7 0%, #00D4FF 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            action
          </span>
        </h2>
      </div>

      {/* Browser Mockup */}
      <div
        style={{
          borderRadius: 24,
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.1)",
          overflow: "hidden",
          boxShadow: "0 40px 120px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
          position: "relative",
        }}
      >
        {/* Animated glow border */}
        <div
          style={{
            position: "absolute",
            inset: -1,
            borderRadius: 25,
            background: "linear-gradient(135deg, rgba(108,92,231,0.4), rgba(0,212,255,0.2), rgba(108,92,231,0.4))",
            backgroundSize: "200% 200%",
            animation: "gradient-shift 4s ease infinite",
            zIndex: -1,
            padding: 1,
          }}
        />

        {/* Browser top bar */}
        <div
          style={{
            background: "rgba(0,0,0,0.4)",
            padding: "12px 20px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {/* Traffic dots */}
          <div style={{ display: "flex", gap: 6 }}>
            {["#FF5F57", "#FFBD2E", "#28C840"].map((c) => (
              <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
            ))}
          </div>

          {/* URL bar */}
          <div
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.06)",
              borderRadius: 8,
              padding: "5px 14px",
              fontSize: "0.8rem",
              color: "rgba(255,255,255,0.4)",
              maxWidth: 380,
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ fontSize: "0.65rem", color: "rgba(0,212,255,0.6)" }}>🔒</span>
            my-startup.vocode.app
          </div>

          {/* Tab toggle */}
          <div
            style={{
              display: "flex",
              gap: 4,
              background: "rgba(255,255,255,0.06)",
              padding: 4,
              borderRadius: 10,
            }}
          >
            {(["preview", "code"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "5px 14px",
                  borderRadius: 7,
                  border: "none",
                  background: activeTab === tab ? "rgba(108,92,231,0.4)" : "transparent",
                  color: activeTab === tab ? "#fff" : "rgba(255,255,255,0.5)",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "inherit",
                }}
              >
                {tab === "preview" ? "👁 Preview" : "💻 Code"}
              </button>
            ))}
          </div>
        </div>

        {/* Content area */}
        {activeTab === "preview" ? (
          <div
            style={{
              minHeight: 460,
              background: "linear-gradient(135deg, #0f0e1f 0%, #0a0918 100%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 40,
              gap: 24,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Fake preview content */}
            <div
              style={{
                width: "100%",
                maxWidth: 600,
                display: "flex",
                flexDirection: "column",
                gap: 16,
                animation: "fade-in-up 0.6s ease forwards",
              }}
            >
              {/* Fake nav */}
              <div
                style={{
                  height: 48,
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex",
                  alignItems: "center",
                  padding: "0 20px",
                  gap: 12,
                }}
              >
                <div style={{ width: 80, height: 10, borderRadius: 4, background: "linear-gradient(90deg, #6C5CE7, #00D4FF)" }} />
                <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                  {[60, 50, 70].map((w, i) => (
                    <div key={i} style={{ width: w, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.12)" }} />
                  ))}
                </div>
              </div>

              {/* Fake hero */}
              <div
                style={{
                  height: 240,
                  borderRadius: 16,
                  background: "linear-gradient(135deg, rgba(108,92,231,0.2), rgba(0,212,255,0.1))",
                  border: "1px solid rgba(255,255,255,0.06)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  padding: 24,
                }}
              >
                <div style={{ width: "70%", height: 20, borderRadius: 6, background: "rgba(255,255,255,0.2)" }} />
                <div style={{ width: "50%", height: 14, borderRadius: 4, background: "rgba(255,255,255,0.1)" }} />
                <div style={{ width: 120, height: 36, borderRadius: 999, background: "linear-gradient(135deg, #6C5CE7, #00D4FF)", marginTop: 8 }} />
              </div>

              {/* Fake cards */}
              <div style={{ display: "flex", gap: 12 }}>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: 90,
                      borderRadius: 12,
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      display: "flex",
                      flexDirection: "column",
                      padding: 14,
                      gap: 8,
                    }}
                  >
                    <div style={{ width: 24, height: 24, borderRadius: 6, background: `rgba(${i === 1 ? "108,92,231" : i === 2 ? "0,212,255" : "108,92,231"},0.3)` }} />
                    <div style={{ width: "80%", height: 8, borderRadius: 3, background: "rgba(255,255,255,0.15)" }} />
                    <div style={{ width: "60%", height: 6, borderRadius: 3, background: "rgba(255,255,255,0.08)" }} />
                  </div>
                ))}
              </div>
            </div>

            {/* AI generating label */}
            <div
              style={{
                position: "absolute",
                bottom: 16,
                right: 16,
                padding: "6px 14px",
                borderRadius: 999,
                background: "rgba(108,92,231,0.2)",
                border: "1px solid rgba(108,92,231,0.3)",
                fontSize: "0.75rem",
                color: "rgba(255,255,255,0.7)",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#6C5CE7",
                  animation: "pulse-glow 1.5s ease-in-out infinite",
                }}
              />
              AI Generated
            </div>
          </div>
        ) : (
          <div
            style={{
              minHeight: 460,
              background: "#1e1e2e",
              padding: "28px 32px",
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: "0.875rem",
              lineHeight: 1.8,
              overflowX: "auto",
            }}
          >
            {codeLines.map((line, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0,
                  animation: `fade-in-up 0.3s ease forwards ${i * 50}ms`,
                  opacity: 0,
                }}
              >
                <span style={{ color: "rgba(255,255,255,0.2)", width: 32, flexShrink: 0, fontSize: "0.75rem", userSelect: "none" }}>
                  {i + 1}
                </span>
                {line.tokens.map((token, j) => (
                  <span key={j} style={{ color: token.color }}>
                    {token.text}
                  </span>
                ))}
              </div>
            ))}
            {/* Cursor */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ color: "rgba(255,255,255,0.2)", width: 32, fontSize: "0.75rem" }}>11</span>
              <span
                style={{
                  display: "inline-block",
                  width: 8,
                  height: 16,
                  background: "#6C5CE7",
                  animation: "typing-cursor 1s ease-in-out infinite",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
