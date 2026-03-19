"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const loadingPhrases = [
  "Initializing AI Engine...",
  "Loading Design System...",
  "Preparing Voice Interface...",
  "Almost ready...",
];

export default function AppLoading({ onDone }: { onDone?: () => void }) {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const pInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(pInterval);
          setExiting(true);
          setTimeout(() => onDone?.(), 400);
          return 100;
        }
        return prev + 1.2;
      });
    }, 30);

    const tInterval = setInterval(() => {
      setPhraseIdx((prev) => Math.min(prev + 1, loadingPhrases.length - 1));
    }, 900);

    return () => {
      clearInterval(pInterval);
      clearInterval(tInterval);
    };
  }, [onDone]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "transparent",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        opacity: exiting ? 0 : 1,
        transition: "opacity 0.4s ease",
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
          textAlign: "center",
        }}
      >
        {/* VOCODE Logo */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <Image
            src="/logo.png"
            alt="VOCODE"
            width={64}
            height={64}
            style={{ objectFit: "contain" }}
          />
          <div
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#fff",
            }}
          >
            VOCODE
          </div>
        </div>

        {/* Status text */}
        <div
          style={{
            fontSize: "0.9375rem",
            color: "rgba(255,255,255,0.45)",
            fontWeight: 400,
            minHeight: 24,
            transition: "opacity 0.3s ease",
          }}
        >
          {loadingPhrases[phraseIdx]}
        </div>

        {/* Progress bar */}
        <div
          style={{
            width: 280,
            height: 3,
            background: "rgba(255,255,255,0.07)",
            borderRadius: 2,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg, #6C5CE7, #00D4FF)",
              borderRadius: 2,
              transition: "width 0.1s linear",
              boxShadow: "0 0 12px rgba(108,92,231,0.8)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Shimmer on progress bar */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
                animation: "shimmer 1.5s infinite linear",
              }}
            />
          </div>
        </div>

        {/* Percentage */}
        <div
          style={{
            fontSize: "0.8rem",
            color: "rgba(255,255,255,0.2)",
            letterSpacing: "0.05em",
          }}
        >
          {Math.round(progress)}%
        </div>
      </div>
    </div>
  );
}
