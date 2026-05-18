"""Telemetry API routes"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.telemetry_service import TelemetryService
from app.schemas import TelemetryResponse

router = APIRouter(prefix="/api/telemetry", tags=["telemetry"])

@router.get("/latest", response_model=list[TelemetryResponse])
def get_latest_telemetry(limit: int = Query(100, le=1000), db: Session = Depends(get_db)):
    """Get latest telemetry records"""
    telemetry = TelemetryService.get_latest_telemetry(db, limit)
    return telemetry

@router.get("/device/{device_code}", response_model=list[TelemetryResponse])
def get_device_telemetry(device_code: str, limit: int = Query(100, le=1000), db: Session = Depends(get_db)):
    """Get telemetry for specific device"""
    telemetry = TelemetryService.get_device_telemetry(db, device_code, limit)
    return telemetry

@router.get("/device/{device_code}/metric/{metric_name}")
def get_metric_history(
    device_code: str,
    metric_name: str,
    hours: int = Query(24, ge=1, le=720),
    db: Session = Depends(get_db)
):
    """Get metric history for a device"""
    history = TelemetryService.get_metric_history(db, device_code, metric_name, hours)
    return {
        "device_code": device_code,
        "metric_name": metric_name,
        "data": [
            {
                "value": h.metric_value,
                "unit": h.metric_unit,
                "status": h.status,
                "timestamp": h.created_at.isoformat()
            }
            for h in history
        ]
    }

@router.get("/device/{device_code}/metric/{metric_name}/stats")
def get_metric_stats(
    device_code: str,
    metric_name: str,
    hours: int = Query(24, ge=1, le=720),
    db: Session = Depends(get_db)
):
    """Get statistics for a metric"""
    stats = TelemetryService.get_telemetry_stats(db, device_code, metric_name, hours)
    if not stats:
        raise HTTPException(status_code=404, detail="No data found for metric")
    return stats

@router.get("/dashboard/metrics")
def get_dashboard_metrics(db: Session = Depends(get_db)):
    """Get metrics for dashboard"""
    return TelemetryService.get_dashboard_metrics(db)
