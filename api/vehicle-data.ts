import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { id } = req.query;
  const token = process.env.TESLA_ACCESS_TOKEN;

  if (!id) {
    return res.status(400).json({ error: 'Vehicle ID is required' });
  }

  if (!token) {
    return res.status(401).json({ error: 'TESLA_ACCESS_TOKEN environment variable is missing' });
  }

  try {
    // Using the vehicle_data endpoint to get full telemetry
    const response = await fetch(`https://fleet-api.prd.na.vn.cloud.tesla.com/api/1/vehicles/${id}/vehicle_data`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    return res.status(200).json(data.response);
  } catch (error) {
    console.error('Tesla API Error:', error);
    return res.status(500).json({ error: 'Failed to fetch vehicle data' });
  }
}