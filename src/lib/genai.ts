import { GoogleGenAI } from "@google/genai";

export function getGenAIClient() {
  return new GoogleGenAI({
    apiKey: process.env.GOOGLE_AI_API_KEY!,
  });
}
