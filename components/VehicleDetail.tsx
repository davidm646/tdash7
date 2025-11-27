import React, { useState, useEffect } from 'react';
import { Vehicle, GeminiAnalysis } from '../types';
import { analyzeVehicleHealth } from '../services/geminiService';
import { 
  Fan, 
  Thermometer, 
  Zap, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  Navigation,
  Car,
  Battery
} from './Icons';

interface VehicleDetailProps {
  vehicle: Vehicle;
  onBack: () => void;
}

export const VehicleDetail: React.FC<VehicleDetailProps> = ({ vehicle, onBack }) => {
  const [activeTab, setActiveTab] = useState<'status' | 'climate' | 'charging'>('status');
  const [aiAnalysis, setAiAnalysis] = useState<GeminiAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Trigger AI analysis when component mounts or vehicle changes
  useEffect(() => {
    // Reset analysis when vehicle changes
    setAiAnalysis(null);
  }, [vehicle]);

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeVehicleHealth(vehicle);
      setAiAnalysis(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const StatItem = ({ label, value, icon: Icon, subValue }: any) => (
    <div className="bg-neutral-900/50 p-4 rounded-xl border border-neutral-800 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-neutral-800 rounded-lg text-neutral-400">
          <Icon size={20} />
        </div>
        <div>
          <p className="text-xs text-neutral-500 uppercase tracking-wider mb-0.5">{label}</p>
          <p className="text-white font-medium">{value}</p>
        </div>
      </div>
      {subValue && <span className="text-sm text-neutral-600">{subValue}</span>}
    </div>
  );

  return (
    <div className="animate-fade-in pb-12">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800 p-4 mb-6">
        <button 
          onClick={onBack}
          className="text-neutral-400 hover:text-white text-sm mb-4 flex items-center gap-1 transition-colors"
        >
          ← Back to Fleet
        </button>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-white">{vehicle.display_name}</h1>
            <p className="text-neutral-500">{vehicle.vin}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${vehicle.vehicle_state.locked ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
            <span className="text-sm text-neutral-400">{vehicle.vehicle_state.locked ? 'Secure' : 'Unlocked'}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {/* Gemini AI Insight Card */}
        <div className="mb-8 bg-gradient-to-r from-indigo-950/40 to-purple-900/20 border border-indigo-500/30 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles size={120} />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                <Sparkles size={24} />
              </div>
              <h2 className="text-xl font-semibold text-white">Gemini Vehicle Intelligence</h2>
            </div>
            
            {!aiAnalysis && !isAnalyzing && (
              <div className="text-center py-6">
                <p className="text-neutral-400 mb-4">Analyze telemetry data to detect anomalies and get maintenance recommendations.</p>
                <button 
                  onClick={handleRunAnalysis}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-full font-medium transition-all shadow-lg shadow-indigo-900/50"
                >
                  Run Diagnostics
                </button>
              </div>
            )}

            {isAnalyzing && (
              <div className="flex flex-col items-center justify-center py-6 gap-3">
                <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-indigo-300 animate-pulse">Analyzing fleet telemetry...</p>
              </div>
            )}

            {aiAnalysis && (
              <div className="animate-fade-in">
                <div className={`mb-4 p-3 rounded-lg border ${
                  aiAnalysis.healthStatus === 'good' ? 'bg-green-950/30 border-green-900' : 
                  aiAnalysis.healthStatus === 'warning' ? 'bg-yellow-950/30 border-yellow-900' : 'bg-red-950/30 border-red-900'
                }`}>
                  <p className="text-neutral-200 leading-relaxed">{aiAnalysis.summary}</p>
                </div>
                {aiAnalysis.recommendations.length > 0 && (
                  <div>
                     <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Recommendations</h3>
                     <ul className="space-y-1">
                       {aiAnalysis.recommendations.map((rec, idx) => (
                         <li key={idx} className="flex items-start gap-2 text-sm text-neutral-400">
                           <span className="text-indigo-500 mt-1">•</span>
                           {rec}
                         </li>
                       ))}
                     </ul>
                  </div>
                )}
                 <button 
                  onClick={handleRunAnalysis}
                  className="mt-4 text-xs text-indigo-400 hover:text-indigo-300 underline"
                >
                  Refresh Analysis
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6 border-b border-neutral-800 pb-1">
          {(['status', 'climate', 'charging'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-2 text-sm font-medium capitalize transition-colors relative ${
                activeTab === tab ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="grid gap-4">
          
          {activeTab === 'status' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StatItem 
                label="Odometer" 
                value={`${vehicle.vehicle_state.odometer.toLocaleString()} mi`} 
                icon={Navigation} 
              />
              <StatItem 
                label="Sentry Mode" 
                value={vehicle.vehicle_state.sentry_mode ? "Active" : "Disabled"} 
                icon={ShieldCheck} 
                subValue={vehicle.vehicle_state.sentry_mode ? "Recording" : "Standby"}
              />
              <StatItem 
                label="Software" 
                value={`v${vehicle.vehicle_state.car_version}`} 
                icon={Car} 
              />
              <div className="bg-neutral-900/50 p-4 rounded-xl border border-neutral-800">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="text-neutral-400" size={20} />
                  <span className="text-xs text-neutral-500 uppercase tracking-wider">Tire Pressure (PSI)</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-2 bg-neutral-950 rounded-lg">
                    <span className="block text-xs text-neutral-600">FL</span>
                    <span className={`font-mono ${vehicle.vehicle_state.tire_pressure_front_left < 38 ? 'text-yellow-500' : 'text-white'}`}>
                      {vehicle.vehicle_state.tire_pressure_front_left}
                    </span>
                  </div>
                  <div className="p-2 bg-neutral-950 rounded-lg">
                    <span className="block text-xs text-neutral-600">FR</span>
                    <span className="font-mono text-white">{vehicle.vehicle_state.tire_pressure_front_right}</span>
                  </div>
                  <div className="p-2 bg-neutral-950 rounded-lg">
                    <span className="block text-xs text-neutral-600">RL</span>
                    <span className="font-mono text-white">{vehicle.vehicle_state.tire_pressure_rear_left}</span>
                  </div>
                  <div className="p-2 bg-neutral-950 rounded-lg">
                    <span className="block text-xs text-neutral-600">RR</span>
                    <span className="font-mono text-white">{vehicle.vehicle_state.tire_pressure_rear_right}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'climate' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="md:col-span-2 bg-neutral-900/50 p-6 rounded-xl border border-neutral-800 flex flex-col items-center justify-center py-12 relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-b ${vehicle.climate_state.is_climate_on ? 'from-blue-500/10' : 'from-transparent'} to-transparent pointer-events-none`} />
                  <span className="text-6xl font-thin text-white mb-2">{vehicle.climate_state.inside_temp}°</span>
                  <span className="text-neutral-500 flex items-center gap-2">
                    {vehicle.climate_state.is_climate_on ? 'Climate On' : 'Climate Off'}
                    {vehicle.climate_state.is_climate_on && <Fan size={16} className="animate-spin text-blue-500" />}
                  </span>
               </div>
               <StatItem 
                label="Outside Temp" 
                value={`${vehicle.climate_state.outside_temp}°`} 
                icon={Thermometer} 
              />
              <StatItem 
                label="Driver Set" 
                value={`${vehicle.climate_state.driver_temp_setting}°`} 
                icon={Fan} 
              />
            </div>
          )}

          {activeTab === 'charging' && (
            <div className="space-y-4">
              <div className="bg-neutral-900/50 p-6 rounded-xl border border-neutral-800">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <h3 className="text-white text-lg font-medium">Battery Level</h3>
                    <p className="text-neutral-500">{vehicle.charge_state.battery_range} mi est. range</p>
                  </div>
                  <div className="text-3xl font-bold text-white flex items-center gap-2">
                    {vehicle.charge_state.battery_level}%
                    <Zap size={24} className={vehicle.charge_state.charging_state === 'Charging' ? "text-green-500" : "text-neutral-600"} />
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="h-4 bg-neutral-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${vehicle.charge_state.battery_level < 20 ? 'bg-red-500' : 'bg-green-500'} transition-all duration-1000 ease-out`}
                    style={{ width: `${vehicle.charge_state.battery_level}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <StatItem 
                  label="Status" 
                  value={vehicle.charge_state.charging_state} 
                  icon={Zap} 
                />
                 <StatItem 
                  label="Charge Limit" 
                  value="80%" 
                  icon={Battery} 
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};