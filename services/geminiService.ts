import { GoogleGenAI, Type } from "@google/genai";
import { Vehicle, GeminiAnalysis } from '../types';

// Initialize Gemini Client
// In a production app, the API key should be proxy-ed through a backend to avoid client-side exposure
// However, for this client-side demo, we rely on the environment variable.
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

export const analyzeVehicleHealth = async (vehicle: Vehicle): Promise<GeminiAnalysis> => {
  if (!apiKey) {
    // Return dummy data if no key is present to prevent crash in demo without env vars
    return {
      summary: "AI analysis unavailable (Missing API Key). However, your vehicle appears to be in standard condition based on local heuristics.",
      healthStatus: "good",
      recommendations: ["Configure API Key in environment to enable real AI insights."]
    };
  }

  try {
    const prompt = `
      Analyze the following Tesla vehicle telemetry data. 
      Provide a brief, friendly summary of the car's status suitable for an owner.
      Identify any potential issues (e.g. low tire pressure, low battery, unlocked doors in public, extreme temperatures).
      
      Vehicle Data: ${JSON.stringify(vehicle, null, 2)}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "A 2-3 sentence friendly summary of the vehicle status." },
            healthStatus: { type: Type.STRING, enum: ["good", "warning", "critical"], description: "Overall health assessment." },
            recommendations: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING }, 
              description: "List of actionable recommendations." 
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    return JSON.parse(text) as GeminiAnalysis;

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return {
      summary: "Unable to contact AI services at this time. Please check your connection.",
      healthStatus: "warning",
      recommendations: ["Check internet connection", "Verify API Key"]
    };
  }
};