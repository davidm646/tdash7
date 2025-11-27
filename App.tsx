import React, { useState, useEffect } from 'react';
import { getVehicles } from './services/teslaService';
import { Vehicle } from './types';
import { VehicleCard } from './components/VehicleCard';
import { VehicleDetail } from './components/VehicleDetail';
import { Car } from './components/Icons';

function App() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

  // Initial Data Fetch
  useEffect(() => {
    const fetchFleet = async () => {
      try {
        const data = await getVehicles();
        setVehicles(data);
      } catch (error) {
        console.error("Failed to load fleet", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFleet();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-red-500/30">
      
      {/* View Logic */}
      {selectedVehicle ? (
        <VehicleDetail 
          vehicle={selectedVehicle} 
          onBack={() => setSelectedVehicle(null)} 
        />
      ) : (
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-2">
                Fleet<span className="text-red-600">Command</span>
              </h1>
              <p className="text-neutral-400 text-lg max-w-lg">
                Real-time telemetry and AI-driven insights for your Tesla fleet.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-green-900/20 border border-green-900 text-green-500 rounded-full text-xs font-medium uppercase tracking-wider">
                System Operational
              </div>
              <div className="px-3 py-1 bg-neutral-800 border border-neutral-700 text-neutral-400 rounded-full text-xs font-medium uppercase tracking-wider">
                {vehicles.length} Vehicles Online
              </div>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
               {[1, 2, 3].map(i => (
                 <div key={i} className="h-64 bg-neutral-900 rounded-2xl border border-neutral-800" />
               ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vehicles.map((vehicle) => (
                <VehicleCard 
                  key={vehicle.id} 
                  vehicle={vehicle} 
                  onClick={setSelectedVehicle} 
                />
              ))}
              
              {/* Add New Vehicle Placeholder */}
              <div className="border border-dashed border-neutral-800 rounded-2xl p-6 flex flex-col items-center justify-center text-neutral-600 hover:text-neutral-400 hover:border-neutral-700 hover:bg-neutral-900/30 transition-all cursor-not-allowed group h-64">
                <div className="p-4 bg-neutral-900 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <Car size={24} />
                </div>
                <span className="font-medium">Add Vehicle</span>
                <span className="text-xs mt-1 opacity-50">(Requires Admin Access)</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      {!selectedVehicle && (
        <footer className="border-t border-neutral-900 py-8 mt-12 text-center text-neutral-600 text-sm">
          <p>© 2024 FleetCommand. Not affiliated with Tesla, Inc.</p>
          <p className="mt-2 text-xs">AI insights powered by Gemini 2.5 Flash.</p>
        </footer>
      )}
    </div>
  );
}

export default App;