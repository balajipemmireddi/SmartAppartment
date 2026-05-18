from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, Index
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Device(Base):
    __tablename__ = "devices"
    
    id = Column(Integer, primary_key=True, index=True)
    device_code = Column(String(50), unique=True, nullable=False, index=True)
    device_name = Column(String(100), nullable=False)
    device_type = Column(String(50), nullable=False)
    location = Column(String(100), nullable=False)
    installed_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String(20), default="ONLINE")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    telemetry = relationship("Telemetry", back_populates="device", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="device", cascade="all, delete-orphan")
    logs = relationship("DeviceLog", back_populates="device", cascade="all, delete-orphan")

class Telemetry(Base):
    __tablename__ = "telemetry"
    
    id = Column(Integer, primary_key=True, index=True)
    device_code = Column(String(50), ForeignKey("devices.device_code"), nullable=False, index=True)
    metric_name = Column(String(100), nullable=False)
    metric_value = Column(Float, nullable=False)
    metric_unit = Column(String(20))
    status = Column(String(20), default="NORMAL")
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Relationships
    device = relationship("Device", back_populates="telemetry")
    
    __table_args__ = (
        Index('idx_telemetry_device_created', 'device_code', 'created_at'),
    )

class Alert(Base):
    __tablename__ = "alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    device_code = Column(String(50), ForeignKey("devices.device_code"), nullable=False, index=True)
    alert_type = Column(String(50), nullable=False)
    severity = Column(String(20), nullable=False)  # LOW, MEDIUM, HIGH, CRITICAL
    message = Column(String(500), nullable=False)
    is_resolved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    resolved_at = Column(DateTime, nullable=True)
    
    # Relationships
    device = relationship("Device", back_populates="alerts")

class DeviceLog(Base):
    __tablename__ = "device_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    device_code = Column(String(50), ForeignKey("devices.device_code"), nullable=False, index=True)
    log_message = Column(String(500), nullable=False)
    log_level = Column(String(20), default="INFO")  # DEBUG, INFO, WARNING, ERROR
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Relationships
    device = relationship("Device", back_populates="logs")
