"""FastAPI application entry point"""

from fastapi import FastAPI, WebSocket, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session
import asyncio

from app.config import settings
from app.database import engine, Base, get_db
from app.models import Device
from app.generator.devices_config import DEVICES_CONFIG
from app.generator.telemetry_generator import TelemetryGenerator
from app.websocket_manager import manager
from app.routes import devices, telemetry, alerts, dashboard

# Create tables
Base.metadata.create_all(bind=engine)

# Global scheduler
scheduler = BackgroundScheduler()
telemetry_generator = None

def init_devices(db: Session):
    """Initialize devices in database"""
    for device_config in DEVICES_CONFIG:
        existing = db.query(Device).filter(
            Device.device_code == device_config["device_code"]
        ).first()
        
        if not existing:
            device = Device(
                device_code=device_config["device_code"],
                device_name=device_config["device_name"],
                device_type=device_config["device_type"],
                location=device_config["location"],
                status="ONLINE"
            )
            db.add(device)
    
    db.commit()
    print("Devices initialized")

def seed_data(db: Session):
    """Seed initial data"""
    global telemetry_generator
    
    # Check if data already exists
    telemetry_count = db.query(Device).count()
    if telemetry_count == 0:
        print("Seeding initial data...")
        init_devices(db)
        
        telemetry_generator = TelemetryGenerator(db)
        telemetry_generator.seed_historical_data(days=7)
        telemetry_generator.seed_alert_history()
        telemetry_generator.seed_device_logs()
        print("Data seeding completed")
    else:
        print("Data already exists, skipping seed")
        telemetry_generator = TelemetryGenerator(db)

def generate_telemetry_job():
    """Background job to generate telemetry"""
    from app.database import SessionLocal
    
    db = SessionLocal()
    try:
        global telemetry_generator
        if telemetry_generator is None:
            telemetry_generator = TelemetryGenerator(db)
        
        # Generate telemetry for all devices
        results = telemetry_generator.generate_all_telemetry()
        
        # Broadcast via WebSocket
        for device_code, telemetry_records in results.items():
            if telemetry_records:
                metrics = {}
                for record in telemetry_records:
                    metrics[record.metric_name] = {
                        "value": record.metric_value,
                        "unit": record.metric_unit,
                        "status": record.status
                    }
                
                # Broadcast asynchronously
                asyncio.create_task(manager.broadcast_telemetry(device_code, metrics))
    
    except Exception as e:
        print(f"Error in telemetry generation: {e}")
    finally:
        db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown"""
    # Startup
    print("Starting application...")
    
    # Initialize database and seed data
    from app.database import SessionLocal
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    
    # Start scheduler
    scheduler.add_job(generate_telemetry_job, 'interval', seconds=settings.telemetry_interval)
    scheduler.start()
    print(f"Telemetry generator started (interval: {settings.telemetry_interval}s)")
    
    yield
    
    # Shutdown
    print("Shutting down application...")
    scheduler.shutdown()

# Create FastAPI app
app = FastAPI(
    title="Smart Apartment IoT Dashboard",
    description="Industrial-style IoT monitoring dashboard",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(devices.router)
app.include_router(telemetry.router)
app.include_router(alerts.router)
app.include_router(dashboard.router)

# Health check endpoint
@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Smart Apartment IoT Dashboard",
        "version": "1.0.0"
    }

# WebSocket endpoint
@app.websocket("/ws/live")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for live telemetry"""
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive
            data = await websocket.receive_text()
            # Echo back or handle commands if needed
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        manager.disconnect(websocket)

# Root endpoint
@app.get("/")
def root():
    """Root endpoint"""
    return {
        "message": "Smart Apartment IoT Dashboard API",
        "docs": "/docs",
        "health": "/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
