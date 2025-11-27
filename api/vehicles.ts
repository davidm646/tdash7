import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow CORS for local development if needed, Vercel handles this in production usually
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Accessing the secure environment variable on the server
  const token = process.env.TESLA_ACCESS_TOKEN;

  if (!token) {
    console.error("Missing TESLA_ACCESS_TOKEN");
    return res.status(500).json({ error: 'Server misconfiguration: Missing Tesla Token' });
  }

  try {
    const response = await fetch('https://fleet-api.prd.na.vn.cloud.tesla.com/api/1/vehicles', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Tesla API Error (${response.status}):`, errorText);
      return res.status(response.status).json({ error: 'Failed to fetch from Tesla', details: errorText });
    }

    const data = await response.json();
    return res.status(200).json(data.response || []);
  } catch (error) {
    console.error('Tesla API Network Error:', error);
    return res.status(500).json({ error: 'Internal Server Error connecting to Tesla' });
  }
}