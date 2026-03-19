import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { status: "error", message: "GEMINI_API_KEY not configured" },
        { status: 500 }
      );
    }

    // Fetch available models from Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { status: "error", message: "Failed to fetch models", error },
        { status: 500 }
      );
    }

    const data = await response.json();
    
    // Filter for Gemini models that support generateContent
    const geminiModels = data.models?.filter((model: any) => 
      model.name.includes("gemini") && 
      model.supportedGenerationMethods?.includes("generateContent")
    ) || [];

    return NextResponse.json({
      status: "success",
      apiKeyPresent: true,
      apiKeyPreview: apiKey.slice(0, 10) + "...",
      availableModels: geminiModels.map((m: any) => ({
        name: m.name,
        displayName: m.displayName,
        supportedMethods: m.supportedGenerationMethods,
      })),
      allModels: data.models?.map((m: any) => m.name) || [],
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { 
        status: "error", 
        message: "Failed to list models",
        error: errorMessage 
      },
      { status: 500 }
    );
  }
}
