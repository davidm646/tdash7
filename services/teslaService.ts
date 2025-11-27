import { Vehicle } from '../types';
import { MOCK_VEHICLES } from './mockData';

// API endpoints - in Vercel, /api/... automatically routes to the api folder
const API_VEHICLES = '/api/vehicles';
const API_VEHICLE_DATA = '/api/vehicle-data';

export const getVehicles = async (useMock = false): Promise<Vehicle[]> => {
  if (useMock) {
    await new Promise(resolve => setTimeout(resolve, 800));
    return MOCK_VEHICLES;
  }

  try {
    const response = await fetch(API_VEHICLES);
    
    if (!response.ok) {
       console.warn(`Backend unavailable (${response.status}), falling back to mock data.`);
       // For demo purposes, if backend is missing config, show mock
       return MOCK_VEHICLES; 
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : MOCK_VEHICLES;
  } catch (error) {
    console.error("API Error, falling back to mock", error);
    return MOCK_VEHICLES;
  }
};

export const getVehicleData = async (id: number, useMock = false): Promise<Vehicle | undefined> => {
    if (useMock) {
        await new Promise(resolve => setTimeout(resolve, 600));
        return MOCK_VEHICLES.find(v => v.id === id);
    }

    try {
        const response = await fetch(`${API_VEHICLE_DATA}?id=${id}`);
        if (!response.ok) throw new Error('Failed to fetch vehicle details');
        return await response.json();
    } catch (error) {
        console.error("API Error fetching details, falling back to mock search", error);
        return MOCK_VEHICLES.find(v => v.id === id);
    }
};

export const wakeUpVehicle = async (id: number): Promise<boolean> => {
  try {
    const response = await fetch(`/api/wake-up`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    return response.ok;
  } catch (e) {
    console.error("Wake up failed", e);
    return false;
  }
};