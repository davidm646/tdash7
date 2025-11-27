import React from 'react';
import { Vehicle, ChargingState } from '../types';
import { Battery, Zap, MapPin, Lock, Unlock } from './Icons';

interface VehicleCardProps {
  vehicle: Vehicle;
  onClick: (vehicle: Vehicle) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onClick }) => {
  const isCharging = vehicle.charge_state.charging_state === ChargingState.Charging;
  
  return (
    <div 
      onClick={() => onClick(vehicle)}
      className="group relative overflow-hidden bg-neutral-900 border border-neutral-800 rounded-2xl p-6 cursor-pointer hover:border-red-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/10"
    >
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="text-xl font-bold text-white mb-1 group-hover:text-red-500 transition-colors">
            {vehicle.display_name}
          </h3>
          <p className="text-neutral-400 text-sm font-medium tracking-wide">
            {vehicle.vin.slice(-6)} • {vehicle.color || 'Unknown Color'}
          </p>
        </div>
        <div className={`p-2 rounded-full ${vehicle.vehicle_state.locked ? 'bg-neutral-800 text-green-400' : 'bg-red-900/20 text-red-500'}`}>
          {vehicle.vehicle_state.locked ? <Lock size={18} /> : <Unlock size={18} />}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Battery Stat */}
        <div className="bg-neutral-950/50 rounded-xl p-3 border border-neutral-800">
          <div className="flex items-center gap-2 mb-2 text-neutral-400 text-xs uppercase tracking-wider">
            <Battery size={14} />
            <span>Battery</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-white">{vehicle.charge_state.battery_level}%</span>
            {isCharging && <Zap size={16} className="text-yellow-400 animate-pulse" />}
          </div>
          <p className="text-xs text-neutral-500 mt-1">{vehicle.charge_state.battery_range} mi</p>
        </div>

        {/* Location Stat */}
        <div className="bg-neutral-950/50 rounded-xl p-3 border border-neutral-800">
          <div className="flex items-center gap-2 mb-2 text-neutral-400 text-xs uppercase tracking-wider">
            <MapPin size={14} />
            <span>Status</span>
          </div>
          <div className="text-lg font-medium text-white truncate">
             {vehicle.drive_state.shift_state === 'P' ? 'Parked' : 'Driving'}
          </div>
          <p className="text-xs text-neutral-500 mt-1 truncate">
            {vehicle.drive_state.speed ? `${vehicle.drive_state.speed} mph` : '0 mph'}
          </p>
        </div>
      </div>
      
      {/* Visual flair */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-600/10 to-transparent rounded-bl-full pointer-events-none" />
    </div>
  );
};