import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// List of models to try in order
const MODELS_TO_TRY = [
  "gemini-2.0-flash-001",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.5-pro",
  "gemini-flash-latest",
  "gemini-pro-latest",
];

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { status: "error", message: "GEMINI_API_KEY not configured" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Try each model until one works
    let lastError: Error | null = null;
    for (const modelName of MODELS_TO_TRY) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Say 'VOCODE API is working!' in one sentence.");
        const response = result.response.text();

        return NextResponse.json({
          status: "success",
          message: "Gemini API is working",
          modelUsed: modelName,
          apiKeyPresent: true,
          apiKeyPreview: apiKey.slice(0, 10) + "...",
          testResponse: response,
        });
      } catch (err) {
        const error = err as Error;
        lastError = error;
        // If quota error, try next model
        if (error.message.includes("429") || error.message.includes("quota")) {
          continue;
        }
        throw error;
      }
    }

    // All models failed
    throw lastError || new Error("All models failed");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { 
        status: "error", 
        message: "Gemini API test failed - all models exhausted",
        error: errorMessage 
      },
      { status: 500 }
    );
  }
}
