// Enums for vehicle states
export enum ShiftState {
  P = 'P',
  D = 'D',
  R = 'R',
  N = 'N'
}

export enum ChargingState {
  Disconnected = 'Disconnected',
  Charging = 'Charging',
  Complete = 'Complete',
  Stopped = 'Stopped'
}

// Interfaces for API responses
export interface Vehicle {
  id: number;
  vehicle_id: number;
  vin: string;
  display_name: string;
  color?: string;
  option_codes?: string;
  calendar_enabled?: boolean;
  api_version?: number;
  // Specific vehicle state structures (simplified for this app)
  charge_state: ChargeState;
  climate_state: ClimateState;
  drive_state: DriveState;
  vehicle_state: VehicleState;
  gui_settings: GuiSettings;
}

export interface ChargeState {
  battery_level: number;
  battery_range: number;
  charge_energy_added: number;
  charge_miles_added_rated: number;
  charge_rate: number;
  charging_state: ChargingState;
  est_battery_range: number;
  time_to_full_charge: number;
  charger_actual_current: number;
  charger_power: number;
  supercharger_session_trip_planner_data?: string;
}

export interface ClimateState {
  inside_temp: number;
  outside_temp: number;
  driver_temp_setting: number;
  passenger_temp_setting: number;
  is_climate_on: boolean;
  fan_status: number;
  seat_heater_left: number;
  seat_heater_right: number;
}

export interface DriveState {
  shift_state: ShiftState | null;
  speed: number | null;
  latitude: number;
  longitude: number;
  heading: number;
  gps_as_of: number;
}

export interface VehicleState {
  odometer: number;
  locked: boolean;
  sentry_mode: boolean;
  tire_pressure_front_left: number;
  tire_pressure_front_right: number;
  tire_pressure_rear_left: number;
  tire_pressure_rear_right: number;
  car_version: string;
}

export interface GuiSettings {
  gui_distance_units: string;
  gui_temperature_units: string;
  gui_charge_rate_units: string;
}

export interface GeminiAnalysis {
  summary: string;
  healthStatus: 'good' | 'warning' | 'critical';
  recommendations: string[];
}