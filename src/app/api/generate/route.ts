import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// List of models to try in order (if one hits quota, try the next)
const MODELS_TO_TRY = [
  "gemini-2.0-flash-001",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.5-pro",
  "gemini-flash-latest",
  "gemini-pro-latest",
];

export async function POST(request: NextRequest) {
  try {
    const { prompt, designPrefs } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Check for API key at runtime (not build time)
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not defined in environment variables");
      return NextResponse.json(
        { 
          error: "API key not configured. Please add GEMINI_API_KEY to your environment variables.",
          concept: getDefaultConcept()
        },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Log API key status (first 10 chars only for security)
    console.log("API Key status:", apiKey ? `Present (${apiKey.slice(0, 10)}...)` : "Missing");

    const style = designPrefs?.style || "modern";
    const colorScheme = designPrefs?.colorScheme || "purple";
    const layout = designPrefs?.layout || "standard";

    const colorSchemes: Record<string, { primary: string; secondary: string; accent: string }> = {
      purple: { primary: "#6C5CE7", secondary: "#00D4FF", accent: "#FF6B9D" },
      blue: { primary: "#3B82F6", secondary: "#06B6D4", accent: "#8B5CF6" },
      green: { primary: "#10B981", secondary: "#34D399", accent: "#F59E0B" },
      orange: { primary: "#F97316", secondary: "#FB923C", accent: "#EC4899" },
      pink: { primary: "#EC4899", secondary: "#F472B6", accent: "#8B5CF6" },
    };

    const colors = colorSchemes[colorScheme] || colorSchemes.purple;

    const systemPrompt = `You are VOCODE, an expert AI website builder. Create a complete, production-ready website based on the user's request.

DESIGN PREFERENCES:
- Style: ${style}
- Layout: ${layout}
- Primary Color: ${colors.primary}
- Secondary Color: ${colors.secondary}
- Accent Color: ${colors.accent}

Return a JSON object with this exact structure:
{
  "title": "Professional website name based on the idea",
  "description": "Brief description",
  "targetAudience": "Target users",
  "keyFeatures": ["feature 1", "feature 2", "feature 3"],
  "designStyle": "${style}",
  "colorScheme": {
    "primary": "${colors.primary}",
    "secondary": "${colors.secondary}",
    "accent": "${colors.accent}",
    "background": "#0a0a0f",
    "text": "#ffffff"
  },
  "sections": {
    "hero": {
      "headline": "Compelling headline",
      "subheadline": "Supporting text",
      "ctaText": "Get Started",
      "ctaLink": "#contact"
    },
    "features": [
      { "title": "Feature 1", "description": "Description" }
    ]
  },
  "html": "<!-- HTML BODY CONTENT ONLY - will be injected into template -->",
  "css": "/* CSS styles */"
}

CRITICAL: Generate a PROFESSIONAL, MODERN HTML website. The "html" field must contain COMPLETE HTML body content (NOT React):

REQUIREMENTS:
1. Use plain HTML5 with semantic tags (section, nav, header, footer, etc.)
2. Inline CSS styles using style attributes: style="background: ..."
3. Use these exact colors: primary ${colors.primary}, secondary ${colors.secondary}, accent ${colors.accent}
4. Dark theme background (#0a0a0f) with white text
5. Professional glassmorphism: backdrop-filter, rgba backgrounds, subtle borders
6. Modern design: rounded corners (12-24px), smooth shadows, gradients
7. Responsive with flexbox and CSS grid
8. Include these sections: Navigation, Hero (with gradient text), Features (3-4 cards), Stats/About, CTA, Footer
9. Interactive elements: hover effects using inline CSS or style tags
10. Professional icons using emoji
11. Mobile-responsive (flex/grid layouts)

HTML STRUCTURE:
- Start with: <div style="font-family: system-ui, sans-serif; background: #0a0a0f; color: #fff; min-height: 100vh;">
- Use inline styles on all elements
- Close with: </div>
- NO <html>, <head>, or <body> tags - just the content div

The code should be production-ready, modern, and visually stunning like top-tier SaaS websites.

User's idea: ${prompt}`;

    // Try each model in order until one works
    let lastError: Error | null = null;
    for (const modelName of MODELS_TO_TRY) {
      try {
        console.log(`Trying model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(systemPrompt);
        const response = result.response.text();

        // Extract JSON from the response
        console.log("Raw AI response length:", response.length);
        console.log("Raw AI response preview:", response.slice(0, 200));
        
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            const concept = JSON.parse(jsonMatch[0]);
            console.log("Parsed concept title:", concept.title);
            console.log("Has HTML:", !!concept.html);
            console.log("HTML length:", concept.html?.length || 0);
            console.log(`Success with model: ${modelName}`);
            
            // Ensure html field exists and is valid
            if (!concept.html || concept.html.length < 100) {
              console.log("Using fallback HTML");
              concept.html = generateFallbackHTML(prompt, colors);
            }
            if (!concept.css) {
              concept.css = generateFallbackCSS(colors);
            }
            
            return NextResponse.json({ concept });
          } catch (parseError) {
            console.error("JSON parse error:", parseError);
            throw new Error("Failed to parse AI response");
          }
        }

        throw new Error("Could not parse AI response");
      } catch (err) {
        const error = err as Error;
        console.log(`Model ${modelName} failed:`, error.message);
        lastError = error;
        // If it's a quota error, continue to next model
        if (error.message.includes("429") || error.message.includes("quota")) {
          continue;
        }
        // For other errors, throw immediately
        throw error;
      }
    }

    // All models failed
    throw lastError || new Error("All models failed");
  } catch (error) {
    console.error("Generation error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { 
        error: "Failed to generate concept: " + errorMessage,
        concept: getDefaultConcept()
      },
      { status: 500 }
    );
  }
}

function generateFallbackHTML(prompt: string, colors: { primary: string; secondary: string; accent: string }): string {
  const title = prompt.slice(0, 30) + (prompt.length > 30 ? "..." : "");
  return `<div style="font-family: system-ui, -apple-system, sans-serif; background: #0a0a0f; color: #fff; min-height: 100vh; line-height: 1.6;">
  <section style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 2rem; background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%); position: relative;">
    <div style="position: absolute; width: 600px; height: 600px; border-radius: 50%; background: radial-gradient(circle, ${colors.primary}20 0%, transparent 70%); top: 50%; left: 50%; transform: translate(-50%, -50%); pointer-events: none;"></div>
    <div style="position: relative; z-index: 1;">
      <div style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 999px; font-size: 0.875rem; color: ${colors.secondary}; margin-bottom: 1.5rem; backdrop-filter: blur(10px);">
        <span>🚀</span><span>Powered by VOCODE AI</span>
      </div>
      <h1 style="font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 800; margin-bottom: 1.5rem; background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary}, ${colors.accent}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; line-height: 1.1;">${title}</h1>
      <p style="font-size: clamp(1.125rem, 2vw, 1.5rem); color: rgba(255,255,255,0.7); max-width: 600px; margin-bottom: 2.5rem; margin-left: auto; margin-right: auto;">A beautiful, professional website generated by VOCODE AI based on your unique vision.</p>
      <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;">
        <button style="padding: 1rem 2.5rem; border-radius: 999px; background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary}); color: #fff; font-weight: 600; font-size: 1rem; border: none; cursor: pointer; box-shadow: 0 10px 40px ${colors.primary}40;">Get Started</button>
        <button style="padding: 1rem 2.5rem; border-radius: 999px; background: rgba(255,255,255,0.05); color: #fff; font-weight: 600; font-size: 1rem; border: 1px solid rgba(255,255,255,0.2); cursor: pointer; backdrop-filter: blur(10px);">Learn More</button>
      </div>
    </div>
  </section>
  
  <section style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; padding: 4rem 2rem; max-width: 1000px; margin: 0 auto; border-top: 1px solid rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.05);">
    <div style="text-align: center;"><div style="font-size: 3rem; font-weight: 800; background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary}); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">10K+</div><div style="color: rgba(255,255,255,0.5); font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 0.5rem;">Websites Created</div></div>
    <div style="text-align: center;"><div style="font-size: 3rem; font-weight: 800; background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary}); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">99%</div><div style="color: rgba(255,255,255,0.5); font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 0.5rem;">Satisfaction Rate</div></div>
    <div style="text-align: center;"><div style="font-size: 3rem; font-weight: 800; background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary}); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">24/7</div><div style="color: rgba(255,255,255,0.5); font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 0.5rem;">AI Support</div></div>
    <div style="text-align: center;"><div style="font-size: 3rem; font-weight: 800; background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary}); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">&lt;1s</div><div style="color: rgba(255,255,255,0.5); font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 0.5rem;">Generation Time</div></div>
  </section>
  
  <section style="padding: 6rem 2rem; max-width: 1200px; margin: 0 auto;">
    <div style="text-align: center; margin-bottom: 4rem;">
      <h2 style="font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; margin-bottom: 1rem; color: #fff;">Why Choose Us</h2>
      <p style="font-size: 1.125rem; color: rgba(255,255,255,0.6); max-width: 500px; margin: 0 auto;">Experience the future of web development with our AI-powered platform</p>
    </div>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem;">
      <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; padding: 2rem; backdrop-filter: blur(20px);">
        <div style="width: 56px; height: 56px; border-radius: 16px; background: linear-gradient(135deg, ${colors.primary}30, ${colors.secondary}20); display: flex; align-items: center; justify-content: center; font-size: 1.75rem; margin-bottom: 1.25rem; border: 1px solid rgba(255,255,255,0.1);">✨</div>
        <h3 style="font-size: 1.25rem; font-weight: 600; color: #fff; margin-bottom: 0.75rem;">AI-Powered</h3>
        <p style="color: rgba(255,255,255,0.6); font-size: 1rem; line-height: 1.6;">Built with cutting-edge artificial intelligence technology.</p>
      </div>
      <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; padding: 2rem; backdrop-filter: blur(20px);">
        <div style="width: 56px; height: 56px; border-radius: 16px; background: linear-gradient(135deg, ${colors.primary}30, ${colors.secondary}20); display: flex; align-items: center; justify-content: center; font-size: 1.75rem; margin-bottom: 1.25rem; border: 1px solid rgba(255,255,255,0.1);">📱</div>
        <h3 style="font-size: 1.25rem; font-weight: 600; color: #fff; margin-bottom: 0.75rem;">Responsive</h3>
        <p style="color: rgba(255,255,255,0.6); font-size: 1rem; line-height: 1.6;">Looks perfect on all devices and screen sizes.</p>
      </div>
      <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; padding: 2rem; backdrop-filter: blur(20px);">
        <div style="width: 56px; height: 56px; border-radius: 16px; background: linear-gradient(135deg, ${colors.primary}30, ${colors.secondary}20); display: flex; align-items: center; justify-content: center; font-size: 1.75rem; margin-bottom: 1.25rem; border: 1px solid rgba(255,255,255,0.1);">🎨</div>
        <h3 style="font-size: 1.25rem; font-weight: 600; color: #fff; margin-bottom: 0.75rem;">Modern Design</h3>
        <p style="color: rgba(255,255,255,0.6); font-size: 1rem; line-height: 1.6;">Features the latest UI/UX trends and best practices.</p>
      </div>
    </div>
  </section>
  
  <footer style="text-align: center; padding: 3rem 2rem; color: rgba(255,255,255,0.4); border-top: 1px solid rgba(255,255,255,0.05);">
    <div style="font-size: 1.5rem; font-weight: 700; background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 1rem;">VOCODE</div>
    <p>Built with VOCODE AI • The Future of Web Development</p>
  </footer>
</div>`;
}

function generateFallbackCSS(colors: { primary: string; secondary: string; accent: string }): string {
  return `/* Fallback CSS - Embedded in HTML */`;
}

function getDefaultConcept() {
  const colors = { primary: "#6C5CE7", secondary: "#00D4FF", accent: "#FF6B9D" };
  return {
    title: "My Website",
    description: "A beautiful website built with VOCODE",
    targetAudience: "General audience",
    keyFeatures: ["Responsive design", "Modern UI", "Fast performance"],
    designStyle: "modern",
    colorScheme: colors,
    sections: {
      hero: {
        headline: "Welcome to Your New Website",
        subheadline: "Built with VOCODE AI",
        ctaText: "Get Started",
      },
      features: [
        { title: "AI-Powered", description: "Built with cutting-edge AI", icon: "sparkles" },
        { title: "Responsive", description: "Looks great on all devices", icon: "layout" },
        { title: "Fast", description: "Optimized for performance", icon: "zap" },
      ],
    },
    html: generateFallbackHTML("My Website", colors),
    css: generateFallbackCSS(colors),
  };
}
