import { Vehicle } from '../types';
import { MOCK_VEHICLES } from './mockData';

// In a real Vercel deployment, this would point to your serverless function
// e.g., const API_ENDPOINT = '/api/tesla';
// Direct calls to Tesla API from browser are blocked by CORS.

export const getVehicles = async (useMock = true): Promise<Vehicle[]> => {
  if (useMock) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return MOCK_VEHICLES;
  }

  try {
    // This is how you would structure the call to your backend
    const response = await fetch('/api/vehicles');
    if (!response.ok) throw new Error('Failed to fetch vehicles');
    return await response.json();
  } catch (error) {
    console.error("API Error, falling back to mock", error);
    return MOCK_VEHICLES;
  }
};

export const getVehicleData = async (id: number, useMock = true): Promise<Vehicle | undefined> => {
    if (useMock) {
        await new Promise(resolve => setTimeout(resolve, 600));
        return MOCK_VEHICLES.find(v => v.id === id);
    }
    // Real implementation would fetch specific vehicle
    return undefined;
};