from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

# User Schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    password: Optional[str] = None

class UserResponse(UserBase):
    id: int
    role: str
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# Device Schemas
class DeviceBase(BaseModel):
    device_code: str
    device_name: str
    device_type: str
    location: str

class DeviceCreate(DeviceBase):
    pass

class DeviceUpdate(BaseModel):
    status: Optional[str] = None

class DeviceResponse(DeviceBase):
    id: int
    status: str
    installed_at: datetime
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Telemetry Schemas
class TelemetryBase(BaseModel):
    device_code: str
    metric_name: str
    metric_value: float
    metric_unit: Optional[str] = None
    status: str = "NORMAL"

class TelemetryCreate(TelemetryBase):
    pass

class TelemetryResponse(TelemetryBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Alert Schemas
class AlertBase(BaseModel):
    device_code: str
    alert_type: str
    severity: str
    message: str

class AlertCreate(AlertBase):
    pass

class AlertUpdate(BaseModel):
    is_resolved: bool = True

class AlertResponse(AlertBase):
    id: int
    is_resolved: bool
    created_at: datetime
    resolved_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Device Log Schemas
class DeviceLogBase(BaseModel):
    device_code: str
    log_message: str
    log_level: str = "INFO"

class DeviceLogCreate(DeviceLogBase):
    pass

class DeviceLogResponse(DeviceLogBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Dashboard Summary Schema
class DashboardSummary(BaseModel):
    online_devices: int
    offline_devices: int
    active_alerts: int
    critical_alerts: int
    avg_temperature: float
    total_power_consumption: float
    water_level_avg: float

# Device Status Schema
class DeviceStatus(BaseModel):
    device_code: str
    device_name: str
    device_type: str
    status: str
    latest_metrics: dict
    latest_alert: Optional[AlertResponse] = None
    
    class Config:
        from_attributes = True

# WebSocket Message Schema
class WebSocketMessage(BaseModel):
    type: str  # telemetry, alert, device_status
    data: dict
    timestamp: datetime
