import { config } from "dotenv";
import path from "path";
config({ path: path.resolve(process.cwd(), ".env.local"), override: true });
config({ path: path.resolve(process.cwd(), ".env"), override: true });

import { NextRequest, NextResponse } from "next/server";
import { answerQuestion } from "@/lib/ai";

// CORS headers for embeddable widget
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    // Debug: log if API key is available
    console.log("API Key present:", !!process.env.ANTHROPIC_API_KEY);

    const body = await request.json();
    const { question } = body;

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    if (question.length > 500) {
      return NextResponse.json(
        { error: "Question is too long (max 500 characters)" },
        { status: 400, headers: corsHeaders }
      );
    }

    const result = await answerQuestion(question);

    return NextResponse.json(result, { headers: corsHeaders });
  } catch (error) {
    console.error("Error answering question:", error);
    return NextResponse.json(
      { error: "Failed to process question" },
      { status: 500, headers: corsHeaders }
    );
  }
}
