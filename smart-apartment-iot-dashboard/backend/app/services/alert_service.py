"""Alert service for database operations"""

from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models import Alert
from datetime import datetime, timedelta

class AlertService:
    @staticmethod
    def get_active_alerts(db: Session, limit: int = 100) -> list:
        """Get active (unresolved) alerts"""
        return db.query(Alert).filter(
            Alert.is_resolved == False
        ).order_by(desc(Alert.created_at)).limit(limit).all()
    
    @staticmethod
    def get_all_alerts(db: Session, limit: int = 100) -> list:
        """Get all alerts"""
        return db.query(Alert).order_by(desc(Alert.created_at)).limit(limit).all()
    
    @staticmethod
    def get_device_alerts(db: Session, device_code: str, limit: int = 50) -> list:
        """Get alerts for specific device"""
        return db.query(Alert).filter(
            Alert.device_code == device_code
        ).order_by(desc(Alert.created_at)).limit(limit).all()
    
    @staticmethod
    def get_critical_alerts(db: Session) -> list:
        """Get critical alerts"""
        return db.query(Alert).filter(
            Alert.severity == "CRITICAL",
            Alert.is_resolved == False
        ).order_by(desc(Alert.created_at)).all()
    
    @staticmethod
    def resolve_alert(db: Session, alert_id: int) -> Alert:
        """Resolve an alert"""
        alert = db.query(Alert).filter(Alert.id == alert_id).first()
        if alert:
            alert.is_resolved = True
            alert.resolved_at = datetime.utcnow()
            db.commit()
            db.refresh(alert)
        return alert
    
    @staticmethod
    def get_alert_summary(db: Session) -> dict:
        """Get alert summary"""
        active_alerts = db.query(Alert).filter(Alert.is_resolved == False).all()
        critical_alerts = [a for a in active_alerts if a.severity == "CRITICAL"]
        high_alerts = [a for a in active_alerts if a.severity == "HIGH"]
        
        return {
            "total_active": len(active_alerts),
            "critical": len(critical_alerts),
            "high": len(high_alerts),
            "critical_alerts": [
                {
                    "id": a.id,
                    "device_code": a.device_code,
                    "alert_type": a.alert_type,
                    "message": a.message,
                    "created_at": a.created_at.isoformat()
                }
                for a in critical_alerts[:10]
            ]
        }
