import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
});

export interface WebsiteConcept {
  title: string;
  description: string;
  targetAudience: string;
  keyFeatures: string[];
  designStyle: "modern" | "bold" | "minimal" | "playful";
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
  sections: {
    hero: {
      headline: string;
      subheadline: string;
      ctaText: string;
    };
    features: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  };
}

export async function generateWebsiteConcept(prompt: string): Promise<WebsiteConcept> {
  const systemPrompt = `You are VOCODE, an AI website builder. Analyze the user's idea and generate a structured website concept.

Return a JSON object with this exact structure:
{
  "title": "Website name",
  "description": "Brief description of the website",
  "targetAudience": "Who this website is for",
  "keyFeatures": ["feature 1", "feature 2", "feature 3"],
  "designStyle": "modern" | "bold" | "minimal" | "playful",
  "colorScheme": {
    "primary": "#6C5CE7",
    "secondary": "#00D4FF",
    "accent": "#FF6B9D"
  },
  "sections": {
    "hero": {
      "headline": "Compelling headline",
      "subheadline": "Supporting text",
      "ctaText": "Call to action button text"
    },
    "features": [
      { "title": "Feature 1", "description": "Description", "icon": "sparkles" }
    ]
  }
}

User's idea: ${prompt}`;

  try {
    const result = await geminiModel.generateContent(systemPrompt);
    const response = result.response.text();
    
    // Extract JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as WebsiteConcept;
    }
    
    throw new Error("Could not parse AI response");
  } catch (error) {
    console.error("Gemini API error:", error);
    // Return default concept if API fails
    return getDefaultConcept(prompt);
  }
}

function getDefaultConcept(prompt: string): WebsiteConcept {
  return {
    title: "My Website",
    description: prompt,
    targetAudience: "General audience",
    keyFeatures: ["Responsive design", "Modern UI", "Fast performance"],
    designStyle: "modern",
    colorScheme: {
      primary: "#6C5CE7",
      secondary: "#00D4FF",
      accent: "#FF6B9D",
    },
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
  };
}

export async function refineWebsite(
  currentCode: string,
  instruction: string
): Promise<string> {
  const prompt = `You are a React/Tailwind expert. Modify this website code based on the user's instruction.

Current code:
${currentCode}

User's instruction: ${instruction}

Return ONLY the modified code, no explanations. Use React functional components with TypeScript and Tailwind CSS.`;

  try {
    const result = await geminiModel.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Refinement error:", error);
    return currentCode;
  }
}
