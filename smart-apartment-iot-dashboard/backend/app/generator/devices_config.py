"""Device configuration for telemetry simulation"""

DEVICES_CONFIG = [
    {
        "device_code": "PUMP-01",
        "device_name": "Underground Water Pump",
        "device_type": "PUMP",
        "location": "Basement Level -2",
        "metrics": {
            "voltage": {"min": 220, "max": 240, "unit": "V", "normal_range": (220, 240)},
            "current": {"min": 5, "max": 25, "unit": "A", "normal_range": (5, 25)},
            "temperature": {"min": 20, "max": 55, "unit": "°C", "normal_range": (20, 45)},
            "runtime": {"min": 0, "max": 24, "unit": "hours", "normal_range": (0, 24)},
        },
        "states": ["RUNNING", "IDLE", "WARNING", "FAULT"],
        "default_state": "RUNNING",
    },
    {
        "device_code": "DG-01",
        "device_name": "Diesel Generator",
        "device_type": "GENERATOR",
        "location": "Basement Level -1",
        "metrics": {
            "fuel_level": {"min": 0, "max": 100, "unit": "%", "normal_range": (30, 100)},
            "load_percentage": {"min": 0, "max": 100, "unit": "%", "normal_range": (0, 80)},
            "engine_temperature": {"min": 20, "max": 95, "unit": "°C", "normal_range": (20, 85)},
            "voltage": {"min": 220, "max": 240, "unit": "V", "normal_range": (220, 240)},
            "frequency": {"min": 49, "max": 51, "unit": "Hz", "normal_range": (49.5, 50.5)},
        },
        "states": ["STANDBY", "ACTIVE", "LOW_FUEL", "OVERHEAT"],
        "default_state": "STANDBY",
    },
    {
        "device_code": "LIFT-01",
        "device_name": "Elevator Controller",
        "device_type": "ELEVATOR",
        "location": "Main Lobby",
        "metrics": {
            "current_floor": {"min": 0, "max": 20, "unit": "floor", "normal_range": (0, 20)},
            "door_status": {"min": 0, "max": 1, "unit": "status", "normal_range": (0, 1)},
            "error_code": {"min": 0, "max": 10, "unit": "code", "normal_range": (0, 0)},
        },
        "states": ["ACTIVE", "MAINTENANCE", "ERROR"],
        "default_state": "ACTIVE",
    },
    {
        "device_code": "HVAC-01",
        "device_name": "Basement HVAC System",
        "device_type": "HVAC",
        "location": "Basement Level -1",
        "metrics": {
            "fan_rpm": {"min": 0, "max": 3000, "unit": "RPM", "normal_range": (500, 2500)},
            "air_temperature": {"min": 15, "max": 35, "unit": "°C", "normal_range": (18, 28)},
            "humidity": {"min": 30, "max": 80, "unit": "%", "normal_range": (40, 60)},
            "power_consumption": {"min": 0, "max": 5, "unit": "kW", "normal_range": (0, 4)},
        },
        "states": ["RUNNING", "OFF", "FILTER_WARNING"],
        "default_state": "RUNNING",
    },
    {
        "device_code": "METER-01",
        "device_name": "Main Energy Meter",
        "device_type": "METER",
        "location": "Ground Floor - Electrical Room",
        "metrics": {
            "voltage": {"min": 220, "max": 240, "unit": "V", "normal_range": (220, 240)},
            "current": {"min": 10, "max": 100, "unit": "A", "normal_range": (10, 80)},
            "power_factor": {"min": 0.8, "max": 1.0, "unit": "PF", "normal_range": (0.9, 1.0)},
            "frequency": {"min": 49, "max": 51, "unit": "Hz", "normal_range": (49.5, 50.5)},
            "power_consumption": {"min": 0, "max": 50, "unit": "kW", "normal_range": (5, 40)},
        },
        "states": ["ONLINE", "WARNING", "OFFLINE"],
        "default_state": "ONLINE",
    },
    {
        "device_code": "TANK-01",
        "device_name": "Overhead Water Tank",
        "device_type": "TANK",
        "location": "Roof Level",
        "metrics": {
            "water_level": {"min": 0, "max": 100, "unit": "%", "normal_range": (40, 100)},
            "tank_pressure": {"min": 0, "max": 5, "unit": "bar", "normal_range": (2, 4)},
            "refill_status": {"min": 0, "max": 1, "unit": "status", "normal_range": (0, 1)},
        },
        "states": ["NORMAL", "LOW_LEVEL", "OVERFLOW"],
        "default_state": "NORMAL",
    },
    {
        "device_code": "FIRE-01",
        "device_name": "Fire Alarm Panel",
        "device_type": "FIRE_ALARM",
        "location": "Ground Floor - Main Lobby",
        "metrics": {
            "alarm_state": {"min": 0, "max": 2, "unit": "state", "normal_range": (0, 0)},
            "sensor_trigger_count": {"min": 0, "max": 50, "unit": "count", "normal_range": (0, 0)},
            "smoke_level": {"min": 0, "max": 100, "unit": "ppm", "normal_range": (0, 10)},
        },
        "states": ["NORMAL", "ALERT", "EMERGENCY"],
        "default_state": "NORMAL",
    },
    {
        "device_code": "SOLAR-01",
        "device_name": "Solar Inverter",
        "device_type": "SOLAR",
        "location": "Roof Level",
        "metrics": {
            "solar_output": {"min": 0, "max": 10, "unit": "kW", "normal_range": (0, 10)},
            "battery_charge": {"min": 0, "max": 100, "unit": "%", "normal_range": (50, 100)},
            "grid_status": {"min": 0, "max": 1, "unit": "status", "normal_range": (1, 1)},
        },
        "states": ["GENERATING", "LOW_OUTPUT", "OFFLINE"],
        "default_state": "GENERATING",
    },
]

# Alert thresholds
ALERT_THRESHOLDS = {
    "PUMP-01": {
        "temperature": {"warning": 45, "critical": 55},
        "voltage": {"warning": 210, "critical": 200},
    },
    "DG-01": {
        "fuel_level": {"warning": 25, "critical": 15},
        "engine_temperature": {"warning": 85, "critical": 95},
        "frequency": {"warning": (49, 51), "critical": (48.5, 51.5)},
    },
    "HVAC-01": {
        "fan_rpm": {"warning": 2500, "critical": 3000},
        "air_temperature": {"warning": (15, 35), "critical": (10, 40)},
    },
    "METER-01": {
        "voltage": {"warning": 210, "critical": 200},
        "power_factor": {"warning": 0.85, "critical": 0.8},
    },
    "TANK-01": {
        "water_level": {"warning": 30, "critical": 15},
    },
    "FIRE-01": {
        "smoke_level": {"warning": 20, "critical": 50},
    },
    "SOLAR-01": {
        "battery_charge": {"warning": 30, "critical": 15},
    },
}
