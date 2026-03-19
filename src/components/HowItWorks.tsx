"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
  { icon: "🎤", title: "Speak Idea", desc: "Describe what you want to build in plain words." },
  { icon: "🧠", title: "AI Structures", desc: "AI analyzes your concept and defines architecture." },
  { icon: "🎨", title: "Choose Design", desc: "Pick from AI-generated design plans that fit your vision." },
  { icon: "✏️", title: "Edit Naturally", desc: "Refine with conversational commands. No code needed." },
  { icon: "📦", title: "Export Code", desc: "Download clean, production-ready code instantly." },
];

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [visible]);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      style={{
        padding: "100px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle background gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(108,92,231,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "5px 16px",
              borderRadius: 999,
              background: "rgba(0,212,255,0.08)",
              border: "1px solid rgba(0,212,255,0.2)",
              fontSize: "0.8125rem",
              color: "rgba(255,255,255,0.6)",
              marginBottom: 20,
              fontWeight: 500,
            }}
          >
            ✦ How It Works
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
            From idea to website{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #00D4FF 0%, #6C5CE7 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              in 5 steps
            </span>
          </h2>
        </div>

        {/* Steps */}
        <div style={{ position: "relative" }}>
          {/* Progress line */}
          <div
            style={{
              position: "absolute",
              top: 32,
              left: "10%",
              right: "10%",
              height: 2,
              background: "rgba(255,255,255,0.06)",
              borderRadius: 2,
              display: "none",
            }}
          />

          <div
            style={{
              display: "flex",
              gap: 16,
              overflowX: "auto",
              paddingBottom: 16,
              scrollbarWidth: "none",
            }}
          >
            {steps.map((step, i) => (
              <div
                key={i}
                onClick={() => setActiveStep(i)}
                style={{
                  flex: "1 1 0",
                  minWidth: 180,
                  borderRadius: 20,
                  background: activeStep === i
                    ? "rgba(108,92,231,0.14)"
                    : "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: activeStep === i
                    ? "1px solid rgba(108,92,231,0.4)"
                    : "1px solid rgba(255,255,255,0.07)",
                  padding: "28px 24px",
                  cursor: "pointer",
                  transition: "all 0.4s ease",
                  transform: activeStep === i ? "translateY(-4px)" : "translateY(0)",
                  boxShadow: activeStep === i
                    ? "0 16px 40px rgba(108,92,231,0.2)"
                    : "none",
                  opacity: visible ? 1 : 0,
                  animation: visible ? `fade-in-up 0.5s ease forwards ${i * 100}ms` : "none",
                }}
              >
                {/* Step number */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: activeStep === i
                        ? "linear-gradient(135deg, #6C5CE7, #00D4FF)"
                        : "rgba(255,255,255,0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.1rem",
                      flexShrink: 0,
                      boxShadow: activeStep === i ? "0 0 16px rgba(108,92,231,0.4)" : "none",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {step.icon}
                  </div>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: activeStep === i ? "rgba(108,92,231,0.9)" : "rgba(255,255,255,0.25)",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    Step {i + 1}
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: activeStep === i ? "#fff" : "rgba(255,255,255,0.7)",
                    marginBottom: 8,
                    letterSpacing: "-0.01em",
                    transition: "color 0.3s ease",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "rgba(255,255,255,0.4)",
                    lineHeight: 1.6,
                  }}
                >
                  {step.desc}
                </p>

                {/* Active indicator */}
                {activeStep === i && (
                  <div
                    style={{
                      marginTop: 20,
                      height: 2,
                      borderRadius: 2,
                      background: "linear-gradient(90deg, #6C5CE7, #00D4FF)",
                      animation: "progress-line 2.2s linear forwards",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
