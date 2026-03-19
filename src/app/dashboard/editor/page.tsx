"use client";

import { useState, useRef, useEffect } from "react";

export default function EditorPage() {
  const [activeView, setActiveView] = useState<"preview" | "code">("preview");
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<{role: string, text: string}[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [htmlCode, setHtmlCode] = useState("");
  const [cssCode, setCssCode] = useState("");
  const [projectName, setProjectName] = useState("New Project");
  const [isGenerating, setIsGenerating] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const deviceWidths = { desktop: "100%", tablet: "768px", mobile: "375px" };

  // Load generated code from localStorage on mount (for persistence)
  useEffect(() => {
    // Check for current project first (for continue editing)
    const currentProject = localStorage.getItem("vocode-current-project");
    const storedHtml = sessionStorage.getItem("vocode-html") || localStorage.getItem("vocode-html");
    const storedCss = sessionStorage.getItem("vocode-css") || localStorage.getItem("vocode-css");
    const storedConcept = sessionStorage.getItem("vocode-concept") || localStorage.getItem("vocode-concept");
    const storedPrompt = sessionStorage.getItem("vocode-prompt") || localStorage.getItem("vocode-prompt");
    const storedGenerating = sessionStorage.getItem("vocode-generating");
    const storedDesignPrefs = sessionStorage.getItem("vocode-design-prefs") || localStorage.getItem("vocode-design-prefs");
    
    if (storedHtml) setHtmlCode(storedHtml);
    if (storedCss) setCssCode(storedCss);
    
    // If we have a current project, load it
    if (currentProject) {
      try {
        const project = JSON.parse(currentProject);
        if (project.html) setHtmlCode(project.html);
        if (project.css) setCssCode(project.css);
        if (project.name) setProjectName(project.name);
        if (project.prompt) {
          setMessages([
            { role: "user", text: project.prompt },
            { role: "ai", text: `Welcome back! You can continue editing "${project.name}" or describe new changes below.` }
          ]);
        }
      } catch (e) {
        console.error("Failed to load current project", e);
      }
    }
    
    // If we need to generate (coming from home page)
    if (storedGenerating === "true" && storedPrompt && !storedHtml) {
      setIsGenerating(true);
      setMessages([
        { role: "user", text: storedPrompt },
        { role: "ai", text: "Generating your website... This may take a few seconds." }
      ]);
      
      // Trigger generation
      generateWebsite(storedPrompt, storedDesignPrefs ? JSON.parse(storedDesignPrefs) : {});
    } else if (storedGenerating === "true") {
      setIsGenerating(true);
    }
    
    if (storedConcept) {
      try {
        const concept = JSON.parse(storedConcept);
        let title = concept.title;
        if (!title || title === "My Website" || title === "Website Title") {
          const prompt = storedPrompt || "";
          title = generateProjectName(prompt);
        }
        setProjectName(title);
      } catch (e) {
        setProjectName(generateProjectName(storedPrompt || ""));
      }
    } else if (!currentProject) {
      setProjectName(generateProjectName(storedPrompt || ""));
    }
    
    // Add initial message if not generating and no current project
    if (storedPrompt && storedGenerating !== "true" && !currentProject) {
      setMessages([
        { role: "user", text: storedPrompt },
        { role: "ai", text: `I've generated your website based on: "${storedPrompt}". You can now preview it and make edits using the chat below.` }
      ]);
    }
  }, []);

  // Generate website function
  const generateWebsite = async (prompt: string, designPrefs: any) => {
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, designPrefs }),
      });
      
      const data = await response.json();
      
      // Use fallback concept if error but concept provided
      const concept = data.concept || data;
      
      // Store the generated code
      sessionStorage.setItem("vocode-concept", JSON.stringify(concept));
      sessionStorage.setItem("vocode-html", concept?.html || "");
      sessionStorage.setItem("vocode-css", concept?.css || "");
      sessionStorage.setItem("vocode-generating", "false");
      
      // Update state
      setHtmlCode(concept?.html || "");
      setCssCode(concept?.css || "");
      setIsGenerating(false);
      
      // Update project name
      const title = concept?.title || generateProjectName(prompt);
      setProjectName(title);
      
      // Update message
      setMessages([
        { role: "user", text: prompt },
        { role: "ai", text: `I've generated your website based on: "${prompt}". You can now preview it and make edits using the chat below.` }
      ]);
      
      // Generate thumbnail from preview (use gradient as placeholder for now)
      const thumbnailGradient = `linear-gradient(135deg, ${designPrefs.colorScheme === "blue" ? "#3B82F6, #06B6D4" : designPrefs.colorScheme === "green" ? "#10B981, #34D399" : designPrefs.colorScheme === "orange" ? "#F97316, #FB923C" : designPrefs.colorScheme === "pink" ? "#EC4899, #F472B6" : "#6C5CE7, #00D4FF"})`;
      
      // Save to projects in localStorage for persistence
      const existingProjects = JSON.parse(localStorage.getItem("vocode-projects") || "[]");
      const newProject = {
        id: Date.now().toString(),
        name: title,
        description: concept?.description || prompt.slice(0, 100) + "...",
        createdAt: new Date().toISOString(),
        status: "completed",
        thumbnail: thumbnailGradient,
        html: concept?.html || "",
        css: concept?.css || "",
        prompt: prompt,
        designPrefs: designPrefs
      };
      localStorage.setItem("vocode-projects", JSON.stringify([newProject, ...existingProjects]));
      
      // Also save as current project for continue editing
      localStorage.setItem("vocode-current-project", JSON.stringify(newProject));
      
    } catch (error) {
      console.error("Generation failed:", error);
      setIsGenerating(false);
      sessionStorage.setItem("vocode-generating", "false");
    }
  };

  // Generate professional project name from prompt
  const generateProjectName = (prompt: string): string => {
    if (!prompt) return "Untitled Project";
    
    // Extract key words from prompt
    const words = prompt.toLowerCase().split(/\s+/);
    const keyWords = words.filter(w => 
      w.length > 3 && 
      !["website", "landing", "page", "create", "make", "build", "for", "with", "and", "the", "a", "an"].includes(w)
    );
    
    if (keyWords.length === 0) return "Untitled Project";
    
    // Capitalize first letter of each word
    const capitalized = keyWords.map(w => w.charAt(0).toUpperCase() + w.slice(1));
    
    // Take first 2-3 words
    const name = capitalized.slice(0, 3).join(" ");
    return name || "Untitled Project";
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;
    const userMsg = { role: "user", text: inputValue };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);
    setIsGenerating(true);
    
    try {
      // Get current prompt and design prefs
      const currentPrompt = sessionStorage.getItem("vocode-prompt") || "";
      const designPrefs = JSON.parse(sessionStorage.getItem("vocode-design-prefs") || "{}");
      
      // Combine original prompt with new instruction
      const combinedPrompt = `${currentPrompt}. Update: ${userMsg.text}`;
      
      // Call API to regenerate
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: combinedPrompt, designPrefs }),
      });
      
      const data = await response.json();
      
      // Update stored code
      sessionStorage.setItem("vocode-concept", JSON.stringify(data.concept));
      sessionStorage.setItem("vocode-html", data.concept?.html || "");
      sessionStorage.setItem("vocode-css", data.concept?.css || "");
      
      // Update state
      setHtmlCode(data.concept?.html || "");
      setCssCode(data.concept?.css || "");
      
      // Now show AI message after code is generated and preview will auto-load
      setIsTyping(false);
      setIsGenerating(false);
      
      // Generate a descriptive response based on the user's request
      const userRequest = userMsg.text.toLowerCase();
      let changeDescription = "";
      
      if (userRequest.includes("color") || userRequest.includes("theme") || userRequest.includes("dark") || userRequest.includes("light")) {
        changeDescription = "I've updated the color scheme and styling throughout the page. The new palette creates a more cohesive visual experience.";
      } else if (userRequest.includes("font") || userRequest.includes("text") || userRequest.includes("typography")) {
        changeDescription = "I've refreshed the typography with improved font sizes, weights, and spacing for better readability.";
      } else if (userRequest.includes("button") || userRequest.includes("cta")) {
        changeDescription = "I've redesigned the buttons with new styling, hover effects, and visual hierarchy to improve conversion.";
      } else if (userRequest.includes("hero") || userRequest.includes("header") || userRequest.includes("banner")) {
        changeDescription = "I've revamped the hero section with a bolder layout, improved headline styling, and better visual impact.";
      } else if (userRequest.includes("card") || userRequest.includes("feature")) {
        changeDescription = "I've updated the feature cards with refined styling, better spacing, and enhanced visual appeal.";
      } else if (userRequest.includes("spacing") || userRequest.includes("padding") || userRequest.includes("margin")) {
        changeDescription = "I've adjusted the spacing throughout the page for better visual breathing room and improved layout flow.";
      } else if (userRequest.includes("image") || userRequest.includes("photo") || userRequest.includes("background")) {
        changeDescription = "I've enhanced the visual elements with updated imagery treatment and background styling.";
      } else if (userRequest.includes("mobile") || userRequest.includes("responsive")) {
        changeDescription = "I've improved the responsive behavior to ensure the site looks great on all device sizes.";
      } else if (userRequest.includes("animation") || userRequest.includes("transition") || userRequest.includes("hover")) {
        changeDescription = "I've added smooth animations and transitions to create a more engaging interactive experience.";
      } else if (userRequest.includes("nav") || userRequest.includes("menu")) {
        changeDescription = "I've refined the navigation with improved styling and better usability.";
      } else if (userRequest.includes("footer")) {
        changeDescription = "I've updated the footer section with cleaner styling and better organization.";
      } else if (userRequest.includes("gradient")) {
        changeDescription = "I've applied beautiful gradient effects to enhance the visual depth and modern feel.";
      } else if (userRequest.includes("glass") || userRequest.includes("blur")) {
        changeDescription = "I've incorporated glassmorphism effects with backdrop blur for a modern, premium aesthetic.";
      } else {
        changeDescription = `I've updated the page based on your request. The design now better reflects your vision with improved styling and layout.`;
      }
      
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: changeDescription,
        },
      ]);
      
    } catch (error) {
      console.error("Update failed:", error);
      setIsTyping(false);
      setIsGenerating(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Sorry, I couldn't update the page. Please try again.",
        },
      ]);
    }
  };

  // Function to refresh the preview iframe
  const [refreshKey, setRefreshKey] = useState(0);
  const refreshPreview = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Top toolbar */}
      <div
        style={{
          height: 56,
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          gap: 16,
          flexShrink: 0,
        }}
      >
        {/* Project name */}
        <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>
          {projectName}
        </div>
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#00D4FF",
            animation: "pulse-glow 2s ease-in-out infinite",
          }}
        />
        <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)" }}>Saved</div>

        {/* Device toggle */}
        <div style={{ marginLeft: "auto", display: "flex", gap: 4, background: "rgba(255,255,255,0.05)", padding: 4, borderRadius: 10 }}>
          {(["desktop", "tablet", "mobile"] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDevice(d)}
              style={{
                padding: "5px 12px",
                borderRadius: 7,
                border: "none",
                background: device === d ? "rgba(108,92,231,0.4)" : "transparent",
                color: device === d ? "#fff" : "rgba(255,255,255,0.45)",
                fontSize: "0.75rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
                fontFamily: "inherit",
              }}
            >
              {d}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.05)", padding: 4, borderRadius: 10 }}>
          {(["preview", "code"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setActiveView(v)}
              style={{
                padding: "5px 14px",
                borderRadius: 7,
                border: "none",
                background: activeView === v ? "rgba(108,92,231,0.4)" : "transparent",
                color: activeView === v ? "#fff" : "rgba(255,255,255,0.45)",
                fontSize: "0.8rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
                fontFamily: "inherit",
                fontWeight: 500,
              }}
            >
              {v === "preview" ? "👁 Preview" : "</> Code"}
            </button>
          ))}
        </div>

        {/* Export */}
        <button
          onClick={() => {
            const fullCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName}</title>
  <style>${cssCode}</style>
</head>
<body>
${htmlCode}
</body>
</html>`;
            const blob = new Blob([fullCode], { type: "text/html" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${projectName.replace(/\s+/g, "-").toLowerCase()}.html`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }}
          className="btn-primary"
          style={{ padding: "8px 18px", fontSize: "0.8rem" }}
        >
          Export Code
        </button>
      </div>

      {/* Main split */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left: Preview */}
        <div
          style={{
            flex: "1 1 0",
            minWidth: 0,
            background: "#0d0c1a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            overflow: "auto",
            position: "relative",
          }}
        >
          {/* Grid background */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              pointerEvents: "none",
            }}
          />

          {/* Browser shell */}
          <div
            style={{
              width: deviceWidths[device],
              maxWidth: "100%",
              transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {/* Browser chrome */}
            <div
              style={{
                background: "rgba(15,14,28,0.95)",
                padding: "10px 16px",
                display: "flex",
                alignItems: "center",
                gap: 8,
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div style={{ display: "flex", gap: 5 }}>
                {["#FF5F57", "#FFBD2E", "#28C840"].map((c) => (
                  <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
                ))}
              </div>
              <div
                style={{
                  flex: 1,
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: 6,
                  padding: "4px 12px",
                  fontSize: "0.75rem",
                  color: "rgba(255,255,255,0.3)",
                  maxWidth: 300,
                  margin: "0 auto",
                  textAlign: "center",
                }}
              >
                preview.vocode.app
              </div>
              <button
                onClick={refreshPreview}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  border: "none",
                  background: "transparent",
                  color: "rgba(255,255,255,0.4)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                  marginLeft: 8,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#fff";
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)";
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
                title="Reload Preview"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10"/>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
              </button>
            </div>

            {activeView === "preview" ? (
              /* Live Preview */
              <div
                style={{
                  minHeight: 600,
                  height: "calc(100vh - 280px)",
                  background: "#0a0a0f",
                  position: "relative",
                }}
              >
                {isGenerating ? (
                  /* Loading State */
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", minHeight: 600, flexDirection: "column", gap: 24 }}>
                    <div style={{ position: "relative", width: 60, height: 60 }}>
                      <div style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "50%",
                        border: "3px solid transparent",
                        borderTopColor: "#6C5CE7",
                        animation: "spin 1s linear infinite",
                      }} />
                      <div style={{
                        position: "absolute",
                        inset: 8,
                        borderRadius: "50%",
                        border: "3px solid transparent",
                        borderTopColor: "#00D4FF",
                        animation: "spin 1.5s linear infinite reverse",
                      }} />
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <p style={{ color: "#fff", fontWeight: 600, marginBottom: 8 }}>Generating your website...</p>
                      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.875rem" }}>This may take a few seconds</p>
                    </div>
                  </div>
                ) : htmlCode ? (
                  <iframe
                    key={refreshKey}
                    srcDoc={`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${cssCode}</style>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
  </style>
</head>
<body>
  ${htmlCode || '<div style="padding: 40px; text-align: center; background: #0a0a0f; color: #fff; min-height: 100vh;"><h1>Website Preview</h1><p>Your generated website will appear here.</p></div>'}
</body>
</html>`}
                    style={{
                      width: "100%",
                      height: "100%",
                      minHeight: 600,
                      border: "none",
                      background: "#0a0a0f",
                    }}
                    title="Website Preview"
                  />
                ) : (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", minHeight: 600, flexDirection: "column", gap: 16 }}>
                    <div style={{ fontSize: "3rem" }}>🎨</div>
                    <p style={{ color: "rgba(255,255,255,0.5)" }}>No preview available yet</p>
                    <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.875rem" }}>Generate a website to see the preview</p>
                  </div>
                )}
              </div>
            ) : (
              /* Code view */
              <div
                style={{
                  background: "#0d0d12",
                  minHeight: 600,
                  height: "calc(100vh - 280px)",
                  fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
                  fontSize: "0.875rem",
                  lineHeight: 1.7,
                  overflow: "auto",
                  display: "flex",
                }}
              >
                {/* Line numbers gutter */}
                <div
                  style={{
                    background: "#0a0a0f",
                    padding: "20px 12px 20px 16px",
                    borderRight: "1px solid rgba(255,255,255,0.06)",
                    textAlign: "right",
                    userSelect: "none",
                    position: "sticky",
                    left: 0,
                  }}
                >
                  {(htmlCode || "// No code generated yet").split("\n").map((_, i: number) => (
                    <div
                      key={i}
                      style={{
                        color: "rgba(255,255,255,0.25)",
                        fontSize: "0.75rem",
                        height: "1.7em",
                      }}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
                
                {/* Code content */}
                <div style={{ padding: "20px 24px", flex: 1, minWidth: 0 }}>
                  {(htmlCode || "// No code generated yet").split("\n").map((line: string, i: number) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        height: "1.7em",
                        whiteSpace: "pre",
                      }}
                    >
                      <span dangerouslySetInnerHTML={{ __html: formatCodeLine(line) }} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: AI Chat Panel */}
        <div
          style={{
            width: 380,
            minWidth: 380,
            display: "flex",
            flexDirection: "column",
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderLeft: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {/* Chat header */}
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <img
              src="/logo.png"
              alt="VOCODE"
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                objectFit: "cover",
                flexShrink: 0,
              }}
            />
            <div>
              <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#fff" }}>AI Editor</div>
              <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.35)" }}>Describe changes</div>
            </div>
            <div
              style={{
                marginLeft: "auto",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#10B981",
                boxShadow: "0 0 10px #10B981",
              }}
              title="AI Editor Active"
            />
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              scrollbarWidth: "thin",
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                  animation: "fade-in-up 0.3s ease forwards",
                }}
              >
                {msg.role === "ai" && (
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #6C5CE7, #00D4FF)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.65rem",
                      marginRight: 8,
                      flexShrink: 0,
                      marginTop: 4,
                    }}
                  >
                    AI
                  </div>
                )}
                <div
                  style={{
                    maxWidth: "78%",
                    padding: "10px 14px",
                    borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    background:
                      msg.role === "user"
                        ? "linear-gradient(135deg, rgba(108,92,231,0.35), rgba(0,212,255,0.2))"
                        : "rgba(255,255,255,0.07)",
                    border: msg.role === "user"
                      ? "1px solid rgba(108,92,231,0.3)"
                      : "1px solid rgba(255,255,255,0.08)",
                    fontSize: "0.875rem",
                    color: "rgba(255,255,255,0.85)",
                    lineHeight: 1.55,
                    backdropFilter: "blur(10px)",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #6C5CE7, #00D4FF)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.65rem",
                    flexShrink: 0,
                  }}
                >
                  AI
                </div>
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: "16px 16px 16px 4px",
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    display: "flex",
                    gap: 4,
                    alignItems: "center",
                  }}
                >
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <div
                      key={i}
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.5)",
                        animation: `waveform 0.8s ease-in-out infinite ${delay}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Prompt suggestions */}
          <div
            style={{
              padding: "8px 12px",
              display: "flex",
              gap: 6,
              overflowX: "auto",
              scrollbarWidth: "none",
            }}
          >
            {["Make hero darker", "Add testimonials", "Change font", "Bold CTA"].map((s) => (
              <button
                key={s}
                onClick={() => setInputValue(s)}
                style={{
                  flexShrink: 0,
                  padding: "5px 12px",
                  borderRadius: 999,
                  background: "rgba(108,92,231,0.1)",
                  border: "1px solid rgba(108,92,231,0.2)",
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s ease",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(108,92,231,0.2)";
                  (e.currentTarget as HTMLElement).style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(108,92,231,0.1)";
                  (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)";
                }}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input area */}
          <div
            style={{
              padding: "12px 16px 16px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "flex-end",
              }}
            >
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Make hero darker..."
                rows={2}
                style={{
                  flex: 1,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 16,
                  padding: "10px 14px",
                  color: "#fff",
                  fontSize: "0.875rem",
                  outline: "none",
                  resize: "none",
                  fontFamily: "inherit",
                  lineHeight: 1.5,
                  transition: "all 0.2s ease",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(108,92,231,0.5)";
                  e.target.style.boxShadow = "0 0 16px rgba(108,92,231,0.12)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.1)";
                  e.target.style.boxShadow = "none";
                }}
              />
              <button
                onClick={sendMessage}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: "linear-gradient(135deg, #6C5CE7, #00D4FF)",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "all 0.2s ease",
                  boxShadow: "0 0 16px rgba(108,92,231,0.3)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "scale(1.05)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0 24px rgba(108,92,231,0.5)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0 16px rgba(108,92,231,0.3)";
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
            <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.2)", marginTop: 6, paddingLeft: 2 }}>
              Press Enter to send · Shift+Enter for newline
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getCodeColor(line: string): string {
  if (line.includes("export") || line.includes("return") || line.includes("import")) return "#C586C0";
  if (line.includes("function") || line.includes("default")) return "#DCDCAA";
  if (line.includes("className") || line.includes("title=") || line.includes("subtitle=") || line.includes("cta=")) return "#9CDCFE";
  if (line.includes('"')) return "#CE9178";
  if (line.includes("<") && line.includes(">")) return "#4EC9B0";
  if (line.includes("//")) return "#6A9955";
  return "#D4D4D4";
}

function formatCodeLine(line: string): string {
  // Escape HTML
  let formatted = line
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  
  // Keywords (purple)
  const keywords = ["import", "export", "default", "return", "const", "let", "var", "function", "class", "interface", "type", "async", "await", "if", "else", "for", "while", "switch", "case", "break", "continue", "try", "catch", "finally", "throw", "new", "this", "super", "extends", "implements"];
  keywords.forEach(kw => {
    const regex = new RegExp(`\\b(${kw})\\b`, "g");
    formatted = formatted.replace(regex, '<span style="color: #C586C0; font-weight: 500;">$1</span>');
  });
  
  // Functions (yellow)
  formatted = formatted.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g, '<span style="color: #DCDCAA;">$1</span>');
  
  // Strings (orange)
  formatted = formatted.replace(/(&quot;.*?&quot;|&#039;.*?&#039;|`.*?`)/g, '<span style="color: #CE9178;">$1</span>');
  
  // Comments (green)
  if (formatted.includes("//")) {
    formatted = formatted.replace(/(\/\/.*$)/, '<span style="color: #6A9955;">$1</span>');
  }
  
  // Numbers (light blue)
  formatted = formatted.replace(/\b(\d+)\b/g, '<span style="color: #B5CEA8;">$1</span>');
  
  // JSX tags (cyan)
  formatted = formatted.replace(/(&lt;\/?)([a-zA-Z][a-zA-Z0-9]*)/g, '$1<span style="color: #4EC9B0;">$2</span>');
  
  // Attributes (light blue)
  formatted = formatted.replace(/\b([a-zA-Z-]+)(=)/g, '<span style="color: #9CDCFE;">$1</span>$2');
  
  return formatted;
}
