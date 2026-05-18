"""Dashboard API routes"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.device_service import DeviceService
from app.services.alert_service import AlertService
from app.services.telemetry_service import TelemetryService

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("/summary")
def get_dashboard_summary(db: Session = Depends(get_db)):
    """Get dashboard summary"""
    device_status = DeviceService.get_device_status_summary(db)
    alert_summary = AlertService.get_alert_summary(db)
    metrics = TelemetryService.get_dashboard_metrics(db)
    
    return {
        "devices": {
            "total": device_status["total_devices"],
            "online": device_status["online_devices"],
            "offline": device_status["offline_devices"]
        },
        "alerts": {
            "total_active": alert_summary["total_active"],
            "critical": alert_summary["critical"],
            "high": alert_summary["high"]
        },
        "metrics": metrics
    }

@router.get("/overview")
def get_dashboard_overview(db: Session = Depends(get_db)):
    """Get detailed dashboard overview"""
    device_status = DeviceService.get_device_status_summary(db)
    alert_summary = AlertService.get_alert_summary(db)
    metrics = TelemetryService.get_dashboard_metrics(db)
    
    return {
        "timestamp": __import__('datetime').datetime.utcnow().isoformat(),
        "devices": device_status,
        "alerts": alert_summary,
        "metrics": metrics
    }
