"""Telemetry data generator for simulating IoT devices"""

import random
import math
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models import Device, Telemetry, Alert, DeviceLog
from app.generator.devices_config import DEVICES_CONFIG, ALERT_THRESHOLDS

class TelemetryGenerator:
    def __init__(self, db: Session):
        self.db = db
        self.device_states = {}
        self.metric_history = {}
        self.initialize_states()
    
    def initialize_states(self):
        """Initialize device states and metric history"""
        for device_config in DEVICES_CONFIG:
            device_code = device_config["device_code"]
            self.device_states[device_code] = {
                "state": device_config["default_state"],
                "last_update": datetime.utcnow(),
            }
            self.metric_history[device_code] = {}
            for metric_name in device_config["metrics"]:
                self.metric_history[device_code][metric_name] = None
    
    def generate_metric_value(self, device_code: str, metric_name: str, metric_config: dict) -> float:
        """Generate realistic metric value with gradual fluctuations"""
        min_val = metric_config["min"]
        max_val = metric_config["max"]
        
        # Get last value if exists
        last_value = self.metric_history[device_code].get(metric_name)
        
        if last_value is None:
            # First value - use middle of range
            value = (min_val + max_val) / 2
        else:
            # Gradual fluctuation - change by max 5% of range
            range_size = max_val - min_val
            max_change = range_size * 0.05
            change = random.uniform(-max_change, max_change)
            value = last_value + change
            value = max(min_val, min(max_val, value))  # Clamp to range
        
        self.metric_history[device_code][metric_name] = value
        return round(value, 2)
    
    def check_alert_conditions(self, device_code: str, metric_name: str, metric_value: float) -> tuple:
        """Check if metric value triggers an alert. Returns (severity, message) or (None, None)"""
        if device_code not in ALERT_THRESHOLDS:
            return None, None
        
        thresholds = ALERT_THRESHOLDS[device_code].get(metric_name)
        if not thresholds:
            return None, None
        
        # Handle range-based thresholds (tuple)
        if isinstance(thresholds.get("critical"), tuple):
            critical_min, critical_max = thresholds["critical"]
            if metric_value < critical_min or metric_value > critical_max:
                return "CRITICAL", f"{metric_name} out of critical range: {metric_value}"
            
            warning_min, warning_max = thresholds.get("warning", (critical_min, critical_max))
            if metric_value < warning_min or metric_value > warning_max:
                return "HIGH", f"{metric_name} out of warning range: {metric_value}"
        else:
            # Handle single value thresholds
            critical = thresholds.get("critical")
            warning = thresholds.get("warning")
            
            if critical is not None:
                if metric_value >= critical:
                    return "CRITICAL", f"{metric_name} critical: {metric_value}"
            
            if warning is not None:
                if metric_value >= warning:
                    return "HIGH", f"{metric_name} warning: {metric_value}"
        
        return None, None
    
    def generate_telemetry(self, device_code: str) -> list:
        """Generate telemetry for a specific device"""
        device_config = next((d for d in DEVICES_CONFIG if d["device_code"] == device_code), None)
        if not device_config:
            return []
        
        telemetry_records = []
        
        # Simulate random faults (5% chance)
        if random.random() < 0.05:
            self.device_states[device_code]["state"] = random.choice(device_config["states"])
        else:
            self.device_states[device_code]["state"] = device_config["default_state"]
        
        # Generate metrics
        for metric_name, metric_config in device_config["metrics"].items():
            value = self.generate_metric_value(device_code, metric_name, metric_config)
            
            # Determine status
            status = "NORMAL"
            severity, alert_message = self.check_alert_conditions(device_code, metric_name, value)
            if severity:
                status = "WARNING" if severity == "HIGH" else "CRITICAL"
                
                # Create alert
                existing_alert = self.db.query(Alert).filter(
                    Alert.device_code == device_code,
                    Alert.alert_type == metric_name,
                    Alert.is_resolved == False
                ).first()
                
                if not existing_alert:
                    alert = Alert(
                        device_code=device_code,
                        alert_type=metric_name,
                        severity=severity,
                        message=alert_message,
                        is_resolved=False
                    )
                    self.db.add(alert)
            
            # Create telemetry record
            telemetry = Telemetry(
                device_code=device_code,
                metric_name=metric_name,
                metric_value=value,
                metric_unit=metric_config.get("unit"),
                status=status
            )
            telemetry_records.append(telemetry)
            self.db.add(telemetry)
        
        self.db.commit()
        return telemetry_records
    
    def generate_all_telemetry(self) -> dict:
        """Generate telemetry for all devices"""
        results = {}
        for device_config in DEVICES_CONFIG:
            device_code = device_config["device_code"]
            telemetry = self.generate_telemetry(device_code)
            results[device_code] = telemetry
        return results
    
    def seed_historical_data(self, days: int = 7):
        """Seed historical telemetry data"""
        print(f"Seeding {days} days of historical telemetry data...")
        
        now = datetime.utcnow()
        records_count = 0
        
        # Generate data for each hour in the past N days
        for hours_back in range(days * 24, 0, -1):
            timestamp = now - timedelta(hours=hours_back)
            
            for device_config in DEVICES_CONFIG:
                device_code = device_config["device_code"]
                
                for metric_name, metric_config in device_config["metrics"].items():
                    # Generate realistic value
                    min_val = metric_config["min"]
                    max_val = metric_config["max"]
                    value = random.uniform(min_val, max_val)
                    
                    telemetry = Telemetry(
                        device_code=device_code,
                        metric_name=metric_name,
                        metric_value=round(value, 2),
                        metric_unit=metric_config.get("unit"),
                        status="NORMAL",
                        created_at=timestamp
                    )
                    self.db.add(telemetry)
                    records_count += 1
        
        self.db.commit()
        print(f"Seeded {records_count} historical telemetry records")
    
    def seed_alert_history(self):
        """Seed some historical alerts"""
        print("Seeding alert history...")
        
        now = datetime.utcnow()
        alert_scenarios = [
            ("PUMP-01", "temperature", "CRITICAL", "Temperature exceeded critical threshold"),
            ("DG-01", "fuel_level", "HIGH", "Fuel level low"),
            ("TANK-01", "water_level", "HIGH", "Water level below normal"),
            ("HVAC-01", "fan_rpm", "HIGH", "Fan RPM abnormal"),
            ("METER-01", "voltage", "HIGH", "Voltage fluctuation detected"),
        ]
        
        for device_code, alert_type, severity, message in alert_scenarios:
            # Create resolved alert from 2 days ago
            alert = Alert(
                device_code=device_code,
                alert_type=alert_type,
                severity=severity,
                message=message,
                is_resolved=True,
                created_at=now - timedelta(days=2),
                resolved_at=now - timedelta(days=1, hours=12)
            )
            self.db.add(alert)
        
        self.db.commit()
        print("Seeded alert history")
    
    def seed_device_logs(self):
        """Seed device operation logs"""
        print("Seeding device logs...")
        
        now = datetime.utcnow()
        log_messages = [
            ("PUMP-01", "INFO", "Pump started"),
            ("PUMP-01", "INFO", "Pump stopped"),
            ("DG-01", "INFO", "Generator switched to standby"),
            ("HVAC-01", "INFO", "HVAC system started"),
            ("LIFT-01", "INFO", "Elevator maintenance completed"),
            ("TANK-01", "INFO", "Water tank refilled"),
            ("FIRE-01", "INFO", "Fire alarm system test completed"),
            ("SOLAR-01", "INFO", "Solar inverter connected to grid"),
        ]
        
        for device_code, log_level, message in log_messages:
            for i in range(3):  # Create 3 logs per device
                log = DeviceLog(
                    device_code=device_code,
                    log_message=message,
                    log_level=log_level,
                    created_at=now - timedelta(days=random.randint(1, 7))
                )
                self.db.add(log)
        
        self.db.commit()
        print("Seeded device logs")
