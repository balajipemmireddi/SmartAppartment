"""Device API routes"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.device_service import DeviceService
from app.schemas import DeviceResponse, DeviceCreate, DeviceUpdate

router = APIRouter(prefix="/api/devices", tags=["devices"])

@router.get("", response_model=list[DeviceResponse])
def get_devices(db: Session = Depends(get_db)):
    """Get all devices"""
    devices = DeviceService.get_all_devices(db)
    return devices

@router.get("/{device_code}", response_model=DeviceResponse)
def get_device(device_code: str, db: Session = Depends(get_db)):
    """Get device by code"""
    device = DeviceService.get_device(db, device_code)
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    return device

@router.post("", response_model=DeviceResponse)
def create_device(device: DeviceCreate, db: Session = Depends(get_db)):
    """Create a new device"""
    existing = DeviceService.get_device(db, device.device_code)
    if existing:
        raise HTTPException(status_code=400, detail="Device code already exists")
    return DeviceService.create_device(db, device)

@router.put("/{device_code}", response_model=DeviceResponse)
def update_device(device_code: str, device_update: DeviceUpdate, db: Session = Depends(get_db)):
    """Update device"""
    device = DeviceService.get_device(db, device_code)
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    return DeviceService.update_device(db, device_code, device_update)

@router.get("/{device_code}/metrics")
def get_device_metrics(device_code: str, db: Session = Depends(get_db)):
    """Get latest metrics for device"""
    device = DeviceService.get_device(db, device_code)
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    
    metrics = DeviceService.get_device_latest_metrics(db, device_code)
    return {
        "device_code": device_code,
        "device_name": device.device_name,
        "metrics": metrics
    }

@router.get("/status/summary")
def get_status_summary(db: Session = Depends(get_db)):
    """Get device status summary"""
    return DeviceService.get_device_status_summary(db)
