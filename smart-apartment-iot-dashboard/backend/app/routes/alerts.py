"""Alert API routes"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.alert_service import AlertService
from app.schemas import AlertResponse, AlertUpdate

router = APIRouter(prefix="/api/alerts", tags=["alerts"])

@router.get("", response_model=list[AlertResponse])
def get_alerts(
    active_only: bool = Query(False),
    limit: int = Query(100, le=1000),
    db: Session = Depends(get_db)
):
    """Get alerts"""
    if active_only:
        alerts = AlertService.get_active_alerts(db, limit)
    else:
        alerts = AlertService.get_all_alerts(db, limit)
    return alerts

@router.get("/critical")
def get_critical_alerts(db: Session = Depends(get_db)):
    """Get critical alerts"""
    alerts = AlertService.get_critical_alerts(db)
    return [
        {
            "id": a.id,
            "device_code": a.device_code,
            "alert_type": a.alert_type,
            "severity": a.severity,
            "message": a.message,
            "created_at": a.created_at.isoformat()
        }
        for a in alerts
    ]

@router.get("/device/{device_code}", response_model=list[AlertResponse])
def get_device_alerts(device_code: str, limit: int = Query(50, le=500), db: Session = Depends(get_db)):
    """Get alerts for specific device"""
    alerts = AlertService.get_device_alerts(db, device_code, limit)
    return alerts

@router.get("/summary")
def get_alert_summary(db: Session = Depends(get_db)):
    """Get alert summary"""
    return AlertService.get_alert_summary(db)

@router.put("/{alert_id}/resolve")
def resolve_alert(alert_id: int, db: Session = Depends(get_db)):
    """Resolve an alert"""
    alert = AlertService.resolve_alert(db, alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return {
        "id": alert.id,
        "is_resolved": alert.is_resolved,
        "resolved_at": alert.resolved_at.isoformat() if alert.resolved_at else None
    }
