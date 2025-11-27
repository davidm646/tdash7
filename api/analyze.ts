import { GoogleGenAI, Type } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server missing API_KEY" });
  }

  const { vehicleData } = req.body;

  if (!vehicleData) {
    return res.status(400).json({ error: "Missing vehicleData in request body" });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
      Analyze the following Tesla vehicle telemetry data. 
      Provide a brief, friendly summary of the car's status suitable for an owner.
      Identify any potential issues (e.g. low tire pressure, low battery, unlocked doors in public, extreme temperatures).
      
      Vehicle Data: ${JSON.stringify(vehicleData, null, 2)}
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

    return res.status(200).json(JSON.parse(text));

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return res.status(500).json({ 
      error: "AI Service Unavailable",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}