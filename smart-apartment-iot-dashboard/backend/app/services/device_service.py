"""Device service for database operations"""

from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models import Device, Telemetry, Alert
from app.schemas import DeviceCreate, DeviceUpdate
from datetime import datetime, timedelta

class DeviceService:
    @staticmethod
    def create_device(db: Session, device: DeviceCreate) -> Device:
        """Create a new device"""
        db_device = Device(**device.dict())
        db.add(db_device)
        db.commit()
        db.refresh(db_device)
        return db_device
    
    @staticmethod
    def get_device(db: Session, device_code: str) -> Device:
        """Get device by code"""
        return db.query(Device).filter(Device.device_code == device_code).first()
    
    @staticmethod
    def get_all_devices(db: Session) -> list:
        """Get all devices"""
        return db.query(Device).all()
    
    @staticmethod
    def update_device(db: Session, device_code: str, device_update: DeviceUpdate) -> Device:
        """Update device"""
        db_device = db.query(Device).filter(Device.device_code == device_code).first()
        if db_device:
            update_data = device_update.dict(exclude_unset=True)
            for key, value in update_data.items():
                setattr(db_device, key, value)
            db_device.updated_at = datetime.utcnow()
            db.commit()
            db.refresh(db_device)
        return db_device
    
    @staticmethod
    def get_device_latest_metrics(db: Session, device_code: str) -> dict:
        """Get latest metrics for a device"""
        latest_telemetry = db.query(Telemetry).filter(
            Telemetry.device_code == device_code
        ).order_by(desc(Telemetry.created_at)).limit(100).all()
        
        metrics = {}
        seen = set()
        
        for telemetry in latest_telemetry:
            if telemetry.metric_name not in seen:
                metrics[telemetry.metric_name] = {
                    "value": telemetry.metric_value,
                    "unit": telemetry.metric_unit,
                    "status": telemetry.status,
                    "timestamp": telemetry.created_at.isoformat()
                }
                seen.add(telemetry.metric_name)
        
        return metrics
    
    @staticmethod
    def get_device_status_summary(db: Session) -> dict:
        """Get device status summary"""
        devices = db.query(Device).all()
        
        online_count = sum(1 for d in devices if d.status == "ONLINE")
        offline_count = len(devices) - online_count
        
        return {
            "total_devices": len(devices),
            "online_devices": online_count,
            "offline_devices": offline_count,
            "devices": [
                {
                    "device_code": d.device_code,
                    "device_name": d.device_name,
                    "status": d.status,
                    "device_type": d.device_type,
                    "location": d.location
                }
                for d in devices
            ]
        }
