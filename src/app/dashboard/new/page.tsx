"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const loadingStates = [
  "Listening...",
  "Structuring Idea...",
  "Designing Layout...",
  "Generating Code...",
];

export default function CreateNewPage() {
  const [phase, setPhase] = useState<"idle" | "recording" | "processing" | "done">("idle");
  const [loadingText, setLoadingText] = useState(loadingStates[0]);
  const [loadingIdx, setLoadingIdx] = useState(0);
  const [inputText, setInputText] = useState("");
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const startRecording = () => {
    setPhase("recording");
    setTimeout(() => startProcessing(), 3000);
  };

  const startProcessing = () => {
    setPhase("processing");
    setLoadingIdx(0);
    setProgress(0);
  };

  useEffect(() => {
    if (phase !== "processing") return;
    const interval = setInterval(() => {
      setLoadingIdx((prev) => {
        const next = prev + 1;
        if (next >= loadingStates.length) {
          clearInterval(interval);
          setPhase("done");
          return prev;
        }
        setLoadingText(loadingStates[next]);
        return next;
      });
      setProgress((prev) => Math.min(prev + 25, 100));
    }, 900);
    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (phase === "done") {
      const t = setTimeout(() => router.push("/dashboard/plans"), 800);
      return () => clearTimeout(t);
    }
  }, [phase, router]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            phase === "processing"
              ? "radial-gradient(ellipse 100% 80% at 50% 50%, rgba(108,92,231,0.15) 0%, transparent 60%)"
              : "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(108,92,231,0.08) 0%, transparent 60%)",
          transition: "background 1s ease",
          pointerEvents: "none",
          animation: phase === "processing" ? "gradient-shift 3s ease infinite" : "none",
          backgroundSize: "200% 200%",
        }}
      />

      {/* Floating particles for processing */}
      {phase === "processing" &&
        Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: i % 2 === 0 ? "#6C5CE7" : "#00D4FF",
              left: `${10 + i * 7}%`,
              top: `${20 + (i % 4) * 15}%`,
              opacity: 0.4,
              animation: `float ${4 + (i % 3)}s ease-in-out infinite ${i * 0.3}s`,
            }}
          />
        ))}

      <div style={{ textAlign: "center", maxWidth: 600, width: "100%", zIndex: 1 }}>
        {/* Header */}
        {phase === "idle" && (
          <>
            <div
              style={{
                fontSize: "0.875rem",
                color: "rgba(255,255,255,0.4)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 16,
                animation: "fade-in-up 0.4s ease forwards",
              }}
            >
              Voice Lab
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
              What do you want to{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #6C5CE7 0%, #00D4FF 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                build?
              </span>
            </h1>
            <p
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: "1rem",
                marginBottom: 48,
                animation: "fade-in-up 0.4s ease forwards 200ms",
                opacity: 0,
              }}
            >
              Speak naturally. Describe your idea, your audience, your goal.
            </p>
          </>
        )}

        {/* Processing state */}
        {phase === "processing" && (
          <div style={{ animation: "scale-in 0.4s ease forwards" }}>
            <div
              style={{
                fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "#fff",
                marginBottom: 12,
              }}
            >
              {loadingText}
            </div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem", marginBottom: 40 }}>
              AI is working on your idea...
            </p>
          </div>
        )}

        {/* Big mic */}
        {(phase === "idle" || phase === "recording") && (
          <div
            style={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 40,
              animation: "fade-in-up 0.4s ease forwards 300ms",
              opacity: 0,
            }}
          >
            {/* Outer pulse rings for recording */}
            {phase === "recording" && (
              <>
                {[150, 190, 230].map((size, i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      width: size,
                      height: size,
                      borderRadius: "50%",
                      border: `1px solid rgba(108,92,231,${0.4 - i * 0.1})`,
                      animation: `pulse-ring 2s ease-out infinite ${i * 0.4}s`,
                    }}
                  />
                ))}
              </>
            )}

            {/* Gradient ring */}
            <div
              style={{
                position: "absolute",
                width: 140,
                height: 140,
                borderRadius: "50%",
                background:
                  phase === "recording"
                    ? "conic-gradient(from 0deg, #6C5CE7, #00D4FF, #6C5CE7)"
                    : "conic-gradient(from 0deg, rgba(108,92,231,0.5), rgba(0,212,255,0.3), rgba(108,92,231,0.5))",
                animation: phase === "recording" ? "spin-slow 1.5s linear infinite" : "spin-slow 6s linear infinite",
                padding: 2,
                transition: "all 0.5s ease",
              }}
            />

            <button
              onClick={startRecording}
              disabled={phase === "recording"}
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                background:
                  phase === "recording"
                    ? "linear-gradient(135deg, #6C5CE7, #00D4FF)"
                    : "rgba(15,14,28,0.95)",
                border: "none",
                cursor: phase === "recording" ? "default" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                zIndex: 1,
                boxShadow:
                  phase === "recording"
                    ? "0 0 60px rgba(108,92,231,0.6), 0 0 120px rgba(0,212,255,0.2)"
                    : "0 0 40px rgba(108,92,231,0.3)",
                transition: "all 0.4s ease",
              }}
            >
              {phase === "recording" ? (
                <WaveformIcon />
              ) : (
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" x2="12" y1="19" y2="22" />
                </svg>
              )}
            </button>
          </div>
        )}

        {/* Progress bar for processing */}
        {phase === "processing" && (
          <div style={{ marginBottom: 40, animation: "fade-in-up 0.4s ease forwards" }}>
            {/* Animated mic ring */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 36 }}>
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #6C5CE7, #00D4FF)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    animation: "pulse-glow 1.5s ease-in-out infinite",
                  }}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" x2="12" y1="19" y2="22" />
                  </svg>
                </div>
                <div
                  style={{
                    position: "absolute",
                    inset: -4,
                    borderRadius: "50%",
                    border: "2px solid rgba(108,92,231,0.4)",
                    animation: "pulse-ring 1.5s ease-out infinite",
                  }}
                />
              </div>
            </div>

            {/* Progress bar */}
            <div
              style={{
                width: "100%",
                height: 4,
                background: "rgba(255,255,255,0.08)",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #6C5CE7, #00D4FF)",
                  borderRadius: 2,
                  transition: "width 0.8s ease",
                  boxShadow: "0 0 10px rgba(108,92,231,0.6)",
                }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              {loadingStates.map((s, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: "0.7rem",
                    color: i <= loadingIdx ? "rgba(108,92,231,0.9)" : "rgba(255,255,255,0.2)",
                    transition: "color 0.4s ease",
                  }}
                >
                  •
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Text input */}
        {phase === "idle" && (
          <div
            style={{
              width: "100%",
              animation: "fade-in-up 0.4s ease forwards 400ms",
              opacity: 0,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div style={{ position: "relative" }}>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && startProcessing()}
                placeholder="Or describe your idea in text..."
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 16,
                  padding: "16px 20px",
                  color: "#fff",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "all 0.2s ease",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(108,92,231,0.5)";
                  e.target.style.boxShadow = "0 0 24px rgba(108,92,231,0.15)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.1)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
            <button
              onClick={startProcessing}
              className="btn-primary"
              style={{ padding: "16px", fontSize: "1rem" }}
            >
              Generate Website
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function WaveformIcon() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {[0.3, 0.7, 1, 0.7, 0.4, 0.8, 0.5].map((h, i) => (
        <div
          key={i}
          style={{
            width: 4,
            height: `${h * 36}px`,
            borderRadius: 2,
            background: "white",
            animation: `waveform ${0.4 + i * 0.1}s ease-in-out infinite ${i * 0.07}s`,
          }}
        />
      ))}
    </div>
  );
}
