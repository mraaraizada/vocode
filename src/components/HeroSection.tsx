"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// TypeScript declarations for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export default function HeroSection() {
  const [isRecording, setIsRecording] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const [showDesignPrefs, setShowDesignPrefs] = useState(false);
  const [designPrefs, setDesignPrefs] = useState({
    style: "modern",
    colorScheme: "purple",
    layout: "standard"
  });
  const router = useRouter();
  const waveRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const inputTextRef = useRef<string>("");

  // Keep ref in sync with state
  useEffect(() => {
    inputTextRef.current = inputText;
  }, [inputText]);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = "en-US";

        let pauseTimer: NodeJS.Timeout;
        const PAUSE_THRESHOLD = 800; // 800ms pause to auto-stop

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          let finalTranscript = "";
          let interimTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          if (finalTranscript) {
            setInputText((prev) => prev + finalTranscript);
          }

          // Reset pause timer on speech detected
          clearTimeout(pauseTimer);
          pauseTimer = setTimeout(() => {
            if (recognitionRef.current && isRecording) {
              recognitionRef.current.stop();
            }
          }, PAUSE_THRESHOLD);
        };

        recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error("Speech recognition error:", event.error);
          if (event.error !== "aborted") {
            setIsRecording(false);
          }
        };

        recognitionRef.current.onend = () => {
          setIsRecording(false);
          clearTimeout(pauseTimer);
          
          // Auto-trigger design preferences after voice input stops
          setTimeout(() => {
            const currentText = inputTextRef.current;
            if (currentText.trim() && !showDesignPrefs && !isGenerating) {
              setShowDesignPrefs(true);
            }
          }, 300);
        };

        return () => {
          clearTimeout(pauseTimer);
        };
      } else {
        setIsSpeechSupported(false);
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [isRecording]);

  const toggleRecord = () => {
    if (!recognitionRef.current || !isSpeechSupported) {
      alert("Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setInputText("");
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  // Auto-submit when recording stops and we have text
  useEffect(() => {
    if (!isRecording && inputText.trim() && !isGenerating) {
      const timer = setTimeout(() => {
        handleGenerate();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isRecording, inputText]);

  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    
    // Show design preferences instead of generating immediately
    setShowDesignPrefs(true);
  };

  const handleDesignPrefsSubmit = async () => {
    setIsGenerating(true);
    setShowDesignPrefs(false);
    
    // Store design prefs and prompt for the editor to use
    sessionStorage.setItem("vocode-prompt", inputText);
    sessionStorage.setItem("vocode-design-prefs", JSON.stringify(designPrefs));
    sessionStorage.setItem("vocode-generating", "true");
    
    // Navigate to editor immediately - generation will happen there
    router.push("/dashboard/editor");
  };

  // Generate professional project name from prompt
  const generateProjectName = (prompt: string): string => {
    if (!prompt) return "Untitled Project";
    
    const words = prompt.toLowerCase().split(/\s+/);
    const keyWords = words.filter(w => 
      w.length > 3 && 
      !["website", "landing", "page", "create", "make", "build", "for", "with", "and", "the", "a", "an"].includes(w)
    );
    
    if (keyWords.length === 0) return "Untitled Project";
    
    const capitalized = keyWords.map(w => w.charAt(0).toUpperCase() + w.slice(1));
    return capitalized.slice(0, 3).join(" ") || "Untitled Project";
  };

  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "120px 24px 80px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background orbs */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: "10%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(108,92,231,0.18) 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: "orb-drift 18s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "8%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,212,255,0.13) 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: "orb-drift 22s ease-in-out infinite reverse",
          pointerEvents: "none",
        }}
      />

      {/* Floating Particles - Spread across different areas */}
      {/* Top right area */}
      <div
        style={{
          position: "absolute",
          top: "12%",
          right: "18%",
          width: 50,
          height: 50,
          borderRadius: 10,
          background: "linear-gradient(135deg, rgba(0,212,255,0.35), rgba(108,92,231,0.25))",
          border: "1px solid rgba(255,255,255,0.15)",
          backdropFilter: "blur(8px)",
          animation: "float-particle-1 9s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />
      {/* Bottom left area */}
      <div
        style={{
          position: "absolute",
          bottom: "18%",
          left: "10%",
          width: 35,
          height: 35,
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(108,92,231,0.4), rgba(0,212,255,0.2))",
          border: "1px solid rgba(255,255,255,0.12)",
          backdropFilter: "blur(8px)",
          animation: "float-particle-2 11s ease-in-out infinite 1.5s",
          pointerEvents: "none",
        }}
      />
      {/* Middle right area */}
      <div
        style={{
          position: "absolute",
          top: "55%",
          right: "8%",
          width: 25,
          height: 25,
          borderRadius: 6,
          background: "linear-gradient(135deg, rgba(255,107,157,0.35), rgba(108,92,231,0.25))",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(6px)",
          animation: "float-particle-3 7s ease-in-out infinite 0.5s",
          pointerEvents: "none",
        }}
      />
      {/* Upper left area */}
      <div
        style={{
          position: "absolute",
          top: "28%",
          left: "15%",
          width: 45,
          height: 45,
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(0,212,255,0.3), rgba(255,107,157,0.2))",
          border: "1px solid rgba(255,255,255,0.12)",
          backdropFilter: "blur(10px)",
          animation: "float-particle-4 13s ease-in-out infinite 2.5s",
          pointerEvents: "none",
        }}
      />
      {/* Center left area */}
      <div
        style={{
          position: "absolute",
          top: "70%",
          left: "22%",
          width: 20,
          height: 20,
          borderRadius: 4,
          background: "linear-gradient(135deg, rgba(108,92,231,0.35), rgba(0,212,255,0.25))",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(5px)",
          animation: "float-particle-1 8s ease-in-out infinite 3s",
          pointerEvents: "none",
        }}
      />
      {/* Top center area */}
      <div
        style={{
          position: "absolute",
          top: "8%",
          left: "45%",
          width: 30,
          height: 30,
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(255,107,157,0.25), rgba(0,212,255,0.3))",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(7px)",
          animation: "float-particle-2 10s ease-in-out infinite 4s",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(108,92,231,0.07) 0%, transparent 65%)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      {/* Floating 3D elements */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          right: "12%",
          width: 60,
          height: 60,
          borderRadius: 16,
          background: "linear-gradient(135deg, rgba(108,92,231,0.4), rgba(0,212,255,0.2))",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.15)",
          animation: "float 10s ease-in-out infinite",
          boxShadow: "0 8px 32px rgba(108,92,231,0.3)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "35%",
          left: "8%",
          width: 40,
          height: 40,
          borderRadius: 10,
          background: "linear-gradient(135deg, rgba(0,212,255,0.3), rgba(108,92,231,0.2))",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.12)",
          animation: "float-reverse 12s ease-in-out infinite",
          boxShadow: "0 6px 24px rgba(0,212,255,0.2)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "25%",
          left: "15%",
          width: 50,
          height: 50,
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(108,92,231,0.35), rgba(0,212,255,0.15))",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.1)",
          animation: "float 14s ease-in-out infinite 2s",
        }}
      />

      {/* Badge */}
      <div
        className="animate-fade-in-up"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 16px 6px 10px",
          borderRadius: 999,
          background: "rgba(108,92,231,0.12)",
          border: "1px solid rgba(108,92,231,0.3)",
          marginBottom: 28,
          fontSize: "0.8125rem",
          color: "rgba(255,255,255,0.8)",
          fontWeight: 500,
        }}
      >
        <span
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#6C5CE7,#00D4FF)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.65rem",
          }}
        >
          ✦
        </span>
        Next-Gen AI Website Builder · Join Free
      </div>

      {/* Headline */}
      <h1
        className="animate-fade-in-up delay-100"
        style={{
          fontSize: "clamp(2.8rem, 6vw, 5rem)",
          fontWeight: 800,
          lineHeight: 1.08,
          letterSpacing: "-0.03em",
          textAlign: "center",
          maxWidth: 900,
          marginBottom: 20,
          color: "#fff",
        }}
      >
        Build Professional Websites{" "}
        <span
          style={{
            background: "linear-gradient(135deg, #6C5CE7 0%, #00D4FF 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          From Your Ideas
        </span>
      </h1>

      {/* Subtext */}
      <p
        className="animate-fade-in-up delay-200"
        style={{
          fontSize: "clamp(1rem, 2vw, 1.25rem)",
          color: "rgba(255,255,255,0.55)",
          textAlign: "center",
          maxWidth: 560,
          lineHeight: 1.65,
          marginBottom: 48,
          fontWeight: 400,
        }}
      >

      </p>

      {/* Voice Input Capsule Card */}
      <div
        className="animate-fade-in-up delay-300"
        style={{
          width: "min(640px, 92vw)",
          borderRadius: 32,
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(30px)",
          WebkitBackdropFilter: "blur(30px)",
          border: "1px solid rgba(255,255,255,0.12)",
          padding: "36px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
          boxShadow: "0 24px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
          position: "relative",
        }}
      >
        {/* Capsule Input Container */}
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "rgba(0,0,0,0.3)",
            borderRadius: 999,
            padding: "6px 6px 6px 24px",
            border: "1px solid rgba(255,255,255,0.1)",
            transition: "all 0.3s ease",
          }}
        >
          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isGenerating ? "Generating your website concept..." : "Describe your website idea..."}
            disabled={isGenerating}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              color: "#fff",
              fontSize: "1rem",
              outline: "none",
              fontFamily: "inherit",
              padding: "12px 0",
              opacity: isGenerating ? 0.6 : 1,
            }}
          />

          {/* Voice Button */}
          <button
            onClick={toggleRecord}
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: isRecording
                ? "linear-gradient(135deg, #6C5CE7, #00D4FF)"
                : "rgba(108,92,231,0.2)",
              border: isRecording ? "none" : "1px solid rgba(108,92,231,0.4)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease",
              flexShrink: 0,
              boxShadow: isRecording
                ? "0 0 30px rgba(108,92,231,0.5)"
                : "0 0 0 rgba(108,92,231,0)",
            }}
            onMouseEnter={(e) => {
              if (!isRecording) {
                (e.currentTarget as HTMLElement).style.background = "rgba(108,92,231,0.35)";
                (e.currentTarget as HTMLElement).style.transform = "scale(1.05)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isRecording) {
                (e.currentTarget as HTMLElement).style.background = "rgba(108,92,231,0.2)";
                (e.currentTarget as HTMLElement).style.transform = "scale(1)";
              }
            }}
          >
            {isRecording ? (
              <StopIconSmall />
            ) : (
              <MicIconSmall />
            )}
          </button>

          {/* Submit Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !inputText.trim()}
            style={{
              padding: "14px 28px",
              borderRadius: 999,
              background: isGenerating 
                ? "linear-gradient(135deg, #4a4a5a, #5a5a6a)" 
                : "linear-gradient(135deg, #6C5CE7, #00D4FF)",
              border: "none",
              color: "#fff",
              fontSize: "0.9375rem",
              fontWeight: 600,
              cursor: isGenerating || !inputText.trim() ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              whiteSpace: "nowrap",
              boxShadow: isGenerating ? "none" : "0 4px 20px rgba(108,92,231,0.3)",
              opacity: isGenerating || !inputText.trim() ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isGenerating && inputText.trim()) {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 30px rgba(108,92,231,0.5)";
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLElement).style.boxShadow = isGenerating ? "none" : "0 4px 20px rgba(108,92,231,0.3)";
            }}
          >
            {isGenerating ? (
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <LoadingSpinner />
                Building...
              </span>
            ) : (
              "Build"
            )}
          </button>
        </div>

        {/* Waveform - shows when recording */}
        {isRecording && (
          <div ref={waveRef} style={{ height: 32, display: "flex", alignItems: "center", gap: 3 }}>
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 3,
                  height: `${Math.random() * 24 + 6}px`,
                  borderRadius: 2,
                  background: `linear-gradient(to top, #6C5CE7, #00D4FF)`,
                  transition: "height 0.15s ease",
                  animation: `waveform ${0.4 + (i % 4) * 0.1}s ease-in-out infinite ${i * 0.03}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Recording indicator */}
        {isRecording && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#ff4444",
                animation: "pulse 1s ease-in-out infinite",
              }}
            />
            <span style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)" }}>
              Listening... Click stop when done
            </span>
          </div>
        )}

      </div>

      {/* Design Preferences Modal */}
      {showDesignPrefs && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 24,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowDesignPrefs(false);
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 500,
              background: "rgba(20,20,30,0.95)",
              borderRadius: 24,
              padding: 32,
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
            }}
          >
            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "#fff",
                marginBottom: 8,
              }}
            >
              Choose Your Design Style
            </h3>
            <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 24 }}>
              Customize how your website will look
            </p>

            {/* Style Selection */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.875rem", marginBottom: 8, display: "block" }}>
                Design Style
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {["modern", "minimal", "bold", "elegant", "playful", "corporate"].map((style) => (
                  <button
                    key={style}
                    onClick={() => setDesignPrefs({ ...designPrefs, style })}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 10,
                      border: "1px solid",
                      borderColor: designPrefs.style === style ? "#6C5CE7" : "rgba(255,255,255,0.1)",
                      background: designPrefs.style === style ? "rgba(108,92,231,0.2)" : "rgba(255,255,255,0.05)",
                      color: designPrefs.style === style ? "#fff" : "rgba(255,255,255,0.6)",
                      fontSize: "0.8125rem",
                      fontWeight: 500,
                      cursor: "pointer",
                      textTransform: "capitalize",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Scheme */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.875rem", marginBottom: 8, display: "block" }}>
                Color Scheme
              </label>
              <div style={{ display: "flex", gap: 12 }}>
                {[
                  { name: "purple", colors: ["#6C5CE7", "#00D4FF"] },
                  { name: "blue", colors: ["#3B82F6", "#06B6D4"] },
                  { name: "green", colors: ["#10B981", "#34D399"] },
                  { name: "orange", colors: ["#F97316", "#FB923C"] },
                  { name: "pink", colors: ["#EC4899", "#F472B6"] },
                ].map((scheme) => (
                  <button
                    key={scheme.name}
                    onClick={() => setDesignPrefs({ ...designPrefs, colorScheme: scheme.name })}
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      border: "2px solid",
                      borderColor: designPrefs.colorScheme === scheme.name ? "#fff" : "transparent",
                      background: `linear-gradient(135deg, ${scheme.colors[0]}, ${scheme.colors[1]})`,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      transform: designPrefs.colorScheme === scheme.name ? "scale(1.1)" : "scale(1)",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Layout */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.875rem", marginBottom: 8, display: "block" }}>
                Layout Type
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
                {["standard", "landing", "portfolio", "business"].map((layout) => (
                  <button
                    key={layout}
                    onClick={() => setDesignPrefs({ ...designPrefs, layout })}
                    style={{
                      padding: "12px 16px",
                      borderRadius: 10,
                      border: "1px solid",
                      borderColor: designPrefs.layout === layout ? "#6C5CE7" : "rgba(255,255,255,0.1)",
                      background: designPrefs.layout === layout ? "rgba(108,92,231,0.2)" : "rgba(255,255,255,0.05)",
                      color: designPrefs.layout === layout ? "#fff" : "rgba(255,255,255,0.6)",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      cursor: "pointer",
                      textTransform: "capitalize",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {layout}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => setShowDesignPrefs(false)}
                style={{
                  flex: 1,
                  padding: "14px 24px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "transparent",
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDesignPrefsSubmit}
                style={{
                  flex: 1,
                  padding: "14px 24px",
                  borderRadius: 12,
                  border: "none",
                  background: "linear-gradient(135deg, #6C5CE7, #00D4FF)",
                  color: "#fff",
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: "0 4px 20px rgba(108,92,231,0.3)",
                }}
              >
                Generate Website
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trust badges - after capsule */}
      <p
        className="animate-fade-in-up delay-400"
        style={{
          fontSize: "0.875rem",
          color: "rgba(255,255,255,0.4)",
          textAlign: "center",
          marginTop: 32,
        }}
      >
        No credit card required · Free to start · Export anytime
      </p>

      {/* Stats Section */}
      <div
        className="animate-fade-in-up delay-450"
        style={{
          marginTop: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 48,
          flexWrap: "wrap",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              background: "linear-gradient(135deg, #6C5CE7, #00D4FF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            4.1
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 2, marginTop: 4, justifyContent: "center" }}>
            {["★", "★", "★", "★", "☆"].map((star, i) => (
              <span key={i} style={{ color: "#FFD700", fontSize: "0.75rem" }}>{star}</span>
            ))}
          </div>
          <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", marginTop: 4 }}>
            2,400+ reviews
          </div>
        </div>

        <div
          style={{
            width: 1,
            height: 40,
            background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.15), transparent)",
          }}
        />

        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              color: "#fff",
            }}
          >
            10K+
          </div>
          <div style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)", marginTop: 6, fontWeight: 500 }}>
            Creators
          </div>
        </div>

        <div
          style={{
            width: 1,
            height: 40,
            background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.15), transparent)",
          }}
        />

        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              background: "linear-gradient(135deg, #00D4FF, #6C5CE7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            100%
          </div>
          <div style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)", marginTop: 6, fontWeight: 500 }}>
            Responsive
          </div>
        </div>
      </div>

      {/* Ideas Scroll Section */}
      <IdeasScroll />
    </section>
  );
}

function MicIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
      <line x1="12" x2="12" y1="19" y2="22"/>
    </svg>
  );
}

function StopIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="white" stroke="none">
      <rect x="6" y="6" width="12" height="12" rx="2"/>
    </svg>
  );
}

function MicIconSmall() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
      <line x1="12" x2="12" y1="19" y2="22"/>
    </svg>
  );
}

function StopIconSmall() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="none">
      <rect x="6" y="6" width="12" height="12" rx="2"/>
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

const exampleIdeas = [
  "A portfolio website for a photographer",
  "A SaaS landing page for AI tools",
  "An e-commerce store for handmade jewelry",
  "A restaurant website with online menu",
  "A personal blog for tech articles",
  "A fitness coach booking website",
  "A real estate property showcase",
  "A music band promotional site",
  "A consulting agency homepage",
  "A nonprofit donation website",
  "A podcast website with episodes",
  "A travel blog with photo galleries",
  "A coffee shop with online ordering",
  "A yoga studio class scheduler",
  "A digital product marketplace",
  "A wedding photography portfolio",
  "A tech startup landing page",
  "A pet grooming service site",
  "A language learning platform",
  "A virtual event hosting page",
];

function IdeasScroll() {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPos = 0;
    const scrollSpeed = 0.5;
    
    const animate = () => {
      scrollPos += scrollSpeed;
      const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
      
      if (scrollPos >= maxScroll) {
        scrollPos = 0;
      }
      
      scrollContainer.scrollLeft = scrollPos;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    // Pause on hover
    const handleMouseEnter = () => cancelAnimationFrame(animationId);
    const handleMouseLeave = () => {
      animationId = requestAnimationFrame(animate);
    };

    scrollContainer.addEventListener("mouseenter", handleMouseEnter);
    scrollContainer.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      scrollContainer.removeEventListener("mouseenter", handleMouseEnter);
      scrollContainer.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleIdeaClick = (idea: string) => {
    setTimeout(() => {
      sessionStorage.setItem("vocode-prompt", idea);
      router.push("/dashboard/new");
    }, 300);
  };

  // Double the ideas for seamless infinite scroll effect
  const doubledIdeas = [...exampleIdeas, ...exampleIdeas];

  return (
    <div
      className="animate-fade-in-up delay-500"
      style={{
        marginTop: 24,
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        paddingBottom: 16,
      }}
    >
      <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.5)", textAlign: "center" }}>
        Or try one of these ideas
      </p>
      
      {/* Scroll container - full width with gradient fade edges */}
      <div
        style={{
          width: "100%",
          position: "relative",
        }}
      >
        {/* Left fade */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 80,
            background: "linear-gradient(to right, #0a0a0f, transparent)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
        {/* Right fade */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: 80,
            background: "linear-gradient(to left, #0a0a0f, transparent)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
        
        <div
          ref={scrollRef}
          style={{
            width: "100%",
            overflowX: "auto",
            overflowY: "hidden",
            padding: "12px 0",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <style>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          
          <div
            style={{
              display: "flex",
              gap: 14,
              padding: "4px 80px",
              width: "max-content",
              flexWrap: "nowrap",
            }}
          >
            {doubledIdeas.map((idea, index) => (
              <button
                key={index}
                onClick={() => handleIdeaClick(idea)}
                style={{
                  padding: "14px 24px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.75)",
                  fontSize: "0.9375rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s ease",
                  fontFamily: "inherit",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(108,92,231,0.2)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(108,92,231,0.5)";
                  (e.currentTarget as HTMLElement).style.color = "#fff";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(108,92,231,0.3)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)";
                  (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.75)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
                }}
              >
                {idea}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
