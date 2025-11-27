import { Vehicle, GeminiAnalysis } from '../types';

// We now call the server-side endpoint to protect the API key
export const analyzeVehicleHealth = async (vehicle: Vehicle): Promise<GeminiAnalysis> => {
  try {
    const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ vehicleData: vehicle })
    });

    if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
    }

    return await response.json();

  } catch (error) {
    console.error("Gemini Analysis Client Error:", error);
    // Fallback response for UI continuity
    return {
      summary: "We couldn't reach the AI diagnostic service. Please check your network connection.",
      healthStatus: "warning",
      recommendations: ["Check internet connection", "Try again later"]
    };
  }
};