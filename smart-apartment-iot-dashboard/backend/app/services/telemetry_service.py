"""Telemetry service for database operations"""

from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models import Telemetry
from datetime import datetime, timedelta

class TelemetryService:
    @staticmethod
    def get_latest_telemetry(db: Session, limit: int = 100) -> list:
        """Get latest telemetry records"""
        return db.query(Telemetry).order_by(desc(Telemetry.created_at)).limit(limit).all()
    
    @staticmethod
    def get_device_telemetry(db: Session, device_code: str, limit: int = 100) -> list:
        """Get telemetry for specific device"""
        return db.query(Telemetry).filter(
            Telemetry.device_code == device_code
        ).order_by(desc(Telemetry.created_at)).limit(limit).all()
    
    @staticmethod
    def get_metric_history(
        db: Session,
        device_code: str,
        metric_name: str,
        hours: int = 24
    ) -> list:
        """Get metric history for a device"""
        since = datetime.utcnow() - timedelta(hours=hours)
        
        return db.query(Telemetry).filter(
            Telemetry.device_code == device_code,
            Telemetry.metric_name == metric_name,
            Telemetry.created_at >= since
        ).order_by(Telemetry.created_at).all()
    
    @staticmethod
    def get_telemetry_stats(db: Session, device_code: str, metric_name: str, hours: int = 24) -> dict:
        """Get statistics for a metric"""
        since = datetime.utcnow() - timedelta(hours=hours)
        
        records = db.query(Telemetry).filter(
            Telemetry.device_code == device_code,
            Telemetry.metric_name == metric_name,
            Telemetry.created_at >= since
        ).all()
        
        if not records:
            return {}
        
        values = [r.metric_value for r in records]
        
        return {
            "min": min(values),
            "max": max(values),
            "avg": sum(values) / len(values),
            "count": len(values),
            "unit": records[0].metric_unit
        }
    
    @staticmethod
    def get_dashboard_metrics(db: Session) -> dict:
        """Get metrics for dashboard"""
        # Get latest telemetry for each device
        latest_telemetry = db.query(Telemetry).order_by(
            desc(Telemetry.created_at)
        ).limit(1000).all()
        
        # Calculate averages
        temperatures = [t.metric_value for t in latest_telemetry if t.metric_name == "temperature"]
        power_consumption = [t.metric_value for t in latest_telemetry if t.metric_name == "power_consumption"]
        water_levels = [t.metric_value for t in latest_telemetry if t.metric_name == "water_level"]
        
        return {
            "avg_temperature": round(sum(temperatures) / len(temperatures), 2) if temperatures else 0,
            "total_power_consumption": round(sum(power_consumption), 2) if power_consumption else 0,
            "avg_water_level": round(sum(water_levels) / len(water_levels), 2) if water_levels else 0,
        }
