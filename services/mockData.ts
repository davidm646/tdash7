import { Vehicle, ChargingState, ShiftState } from '../types';

export const MOCK_VEHICLES: Vehicle[] = [
  {
    id: 1,
    vehicle_id: 123456789,
    vin: "5YJ3E1EA1KF123456",
    display_name: "Starship Alpha",
    color: "Deep Blue Metallic",
    charge_state: {
      battery_level: 78,
      battery_range: 245.5,
      charge_energy_added: 12.4,
      charge_miles_added_rated: 45.0,
      charge_rate: 0,
      charging_state: ChargingState.Disconnected,
      est_battery_range: 230.0,
      time_to_full_charge: 0,
      charger_actual_current: 0,
      charger_power: 0
    },
    climate_state: {
      inside_temp: 21.5,
      outside_temp: 18.0,
      driver_temp_setting: 20.0,
      passenger_temp_setting: 20.0,
      is_climate_on: false,
      fan_status: 0,
      seat_heater_left: 0,
      seat_heater_right: 0
    },
    drive_state: {
      shift_state: ShiftState.P,
      speed: null,
      latitude: 37.7749,
      longitude: -122.4194,
      heading: 180,
      gps_as_of: Date.now()
    },
    vehicle_state: {
      odometer: 15420.5,
      locked: true,
      sentry_mode: true,
      tire_pressure_front_left: 41,
      tire_pressure_front_right: 41,
      tire_pressure_rear_left: 42,
      tire_pressure_rear_right: 40,
      car_version: "2024.3.10"
    },
    gui_settings: {
      gui_distance_units: "mi/hr",
      gui_temperature_units: "F",
      gui_charge_rate_units: "mi/hr"
    }
  },
  {
    id: 2,
    vehicle_id: 987654321,
    vin: "7SAYGDEE1PF654321",
    display_name: "Model Y Performance",
    color: "Red Multi-Coat",
    charge_state: {
      battery_level: 42,
      battery_range: 130.2,
      charge_energy_added: 0,
      charge_miles_added_rated: 0,
      charge_rate: 0,
      charging_state: ChargingState.Disconnected,
      est_battery_range: 125.0,
      time_to_full_charge: 0,
      charger_actual_current: 0,
      charger_power: 0
    },
    climate_state: {
      inside_temp: 35.0,
      outside_temp: 32.0,
      driver_temp_setting: 21.0,
      passenger_temp_setting: 21.0,
      is_climate_on: true, // Overheat protection active maybe?
      fan_status: 2,
      seat_heater_left: 0,
      seat_heater_right: 0
    },
    drive_state: {
      shift_state: null,
      speed: null,
      latitude: 34.0522,
      longitude: -118.2437,
      heading: 90,
      gps_as_of: Date.now()
    },
    vehicle_state: {
      odometer: 5230.1,
      locked: true,
      sentry_mode: false,
      tire_pressure_front_left: 36, // Low pressure warning candidate
      tire_pressure_front_right: 39,
      tire_pressure_rear_left: 40,
      tire_pressure_rear_right: 40,
      car_version: "2024.2.7"
    },
    gui_settings: {
      gui_distance_units: "mi/hr",
      gui_temperature_units: "F",
      gui_charge_rate_units: "mi/hr"
    }
  }
];