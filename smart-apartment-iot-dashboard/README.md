# Smart Apartment Infrastructure Monitoring Dashboard

An industrial-style IoT monitoring dashboard that simulates RS485/Modbus telemetry data for apartment infrastructure systems. Built with React, FastAPI, PostgreSQL, and Docker.

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 16+ (for frontend development)
- Git

### One-Command Setup

```bash
# Clone and navigate to project
cd smart-apartment-iot-dashboard

# Copy environment file
cp .env.example .env

# Start all services with Docker Compose
docker-compose up -d

# Wait for services to be ready (30-60 seconds)
```

### Access the Application

- **Dashboard**: http://localhost:5173
- **API Docs**: http://localhost:8000/docs
- **PgAdmin**: http://localhost:5050 (admin@smartapt.com / admin123)

## 📋 What's Included

### Backend (FastAPI)
- ✅ REST API with full CRUD operations
- ✅ WebSocket live telemetry streaming
- ✅ PostgreSQL database with optimized schema
- ✅ Automatic telemetry generation every 5 seconds
- ✅ Alert engine with severity levels
- ✅ Device management system
- ✅ Historical data seeding (7 days)
- ✅ Docker containerization

### Frontend (React + Vite)
- ✅ Modern dark-mode industrial UI
- ✅ Real-time dashboard with live updates
- ✅ Device monitoring with status indicators
- ✅ Interactive charts (Recharts)
- ✅ Alert management panel
- ✅ Analytics page with metric history
- ✅ Responsive design (desktop, tablet, mobile)
- ✅ WebSocket integration

### Database (PostgreSQL)
- ✅ Optimized schema with indexes
- ✅ Automatic initialization
- ✅ Persistent volumes
- ✅ Health checks
- ✅ PgAdmin for management

## 🏗️ Project Structure

```
smart-apartment-iot-dashboard/
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI entry point
│   │   ├── config.py               # Configuration
│   │   ├── database.py             # Database setup
│   │   ├── models.py               # SQLAlchemy models
│   │   ├── schemas.py              # Pydantic schemas
│   │   ├── websocket_manager.py    # WebSocket handler
│   │   ├── generator/
│   │   │   ├── devices_config.py   # Device configurations
│   │   │   └── telemetry_generator.py  # Data generator
│   │   ├── routes/
│   │   │   ├── devices.py          # Device endpoints
│   │   │   ├── telemetry.py        # Telemetry endpoints
│   │   │   ├── alerts.py           # Alert endpoints
│   │   │   └── dashboard.py        # Dashboard endpoints
│   │   └── services/
│   │       ├── device_service.py   # Device logic
│   │       ├── telemetry_service.py # Telemetry logic
│   │       └── alert_service.py    # Alert logic
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── .env
│   └── init.sql
├── frontend/
│   ├── src/
│   │   ├── components/             # Reusable components
│   │   ├── pages/                  # Page components
│   │   ├── services/               # API services
│   │   ├── store/                  # Zustand store
│   │   ├── hooks/                  # Custom hooks
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.html
├── docker-compose.yml
├── .env.example
└── README.md
```

## 🎯 Simulated Devices

The system simulates 8 industrial IoT devices:

1. **PUMP-01** - Underground Water Pump
   - Metrics: Voltage, Current, Temperature, Runtime
   - States: RUNNING, IDLE, WARNING, FAULT

2. **DG-01** - Diesel Generator
   - Metrics: Fuel Level, Load %, Engine Temp, Voltage, Frequency
   - States: STANDBY, ACTIVE, LOW_FUEL, OVERHEAT

3. **LIFT-01** - Elevator Controller
   - Metrics: Current Floor, Door Status, Error Code
   - States: ACTIVE, MAINTENANCE, ERROR

4. **HVAC-01** - Basement HVAC System
   - Metrics: Fan RPM, Air Temp, Humidity, Power Consumption
   - States: RUNNING, OFF, FILTER_WARNING

5. **METER-01** - Main Energy Meter
   - Metrics: Voltage, Current, Power Factor, Frequency, Power Consumption
   - States: ONLINE, WARNING, OFFLINE

6. **TANK-01** - Overhead Water Tank
   - Metrics: Water Level, Tank Pressure, Refill Status
   - States: NORMAL, LOW_LEVEL, OVERFLOW

7. **FIRE-01** - Fire Alarm Panel
   - Metrics: Alarm State, Sensor Trigger Count, Smoke Level
   - States: NORMAL, ALERT, EMERGENCY

8. **SOLAR-01** - Solar Inverter
   - Metrics: Solar Output, Battery Charge, Grid Status
   - States: GENERATING, LOW_OUTPUT, OFFLINE

## 📊 API Endpoints

### Devices
```
GET    /api/devices                    # Get all devices
GET    /api/devices/{device_code}      # Get device details
GET    /api/devices/{device_code}/metrics  # Get latest metrics
GET    /api/devices/status/summary     # Get device status summary
```

### Telemetry
```
GET    /api/telemetry/latest           # Get latest telemetry
GET    /api/telemetry/device/{device_code}  # Get device telemetry
GET    /api/telemetry/device/{device_code}/metric/{metric_name}  # Get metric history
GET    /api/telemetry/dashboard/metrics    # Get dashboard metrics
```

### Alerts
```
GET    /api/alerts                     # Get all alerts
GET    /api/alerts?active_only=true    # Get active alerts
GET    /api/alerts/critical            # Get critical alerts
GET    /api/alerts/device/{device_code}    # Get device alerts
GET    /api/alerts/summary             # Get alert summary
PUT    /api/alerts/{alert_id}/resolve  # Resolve alert
```

### Dashboard
```
GET    /api/dashboard/summary          # Get dashboard summary
GET    /api/dashboard/overview         # Get detailed overview
```

### WebSocket
```
WS     /ws/live                        # Live telemetry stream
```

## 🔧 Configuration

### Environment Variables (.env)

```env
# Database
DB_USER=smartapt
DB_PASSWORD=smartapt123
DB_NAME=smart_apartment
DB_HOST=postgres
DB_PORT=5432

# Backend
SECRET_KEY=your-secret-key-change-in-production
ENVIRONMENT=development

# PgAdmin
PGADMIN_EMAIL=admin@smartapt.com
PGADMIN_PASSWORD=admin123

# Frontend
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

## 🚀 Running Services

### With Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Manual Setup (Development)

#### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment
cp .env.example .env

# Run migrations (if using Alembic)
# alembic upgrade head

# Start server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📈 Features

### Dashboard
- Real-time KPI cards (Online Devices, Active Alerts, Avg Temperature, Power Usage)
- Live temperature trend chart
- System status overview
- Active alerts panel
- Device status grid

### Devices Page
- Complete device inventory
- Real-time status indicators
- Latest metrics display
- Device location information

### Alerts Page
- Active alerts with severity levels
- Critical alert highlighting
- Alert filtering (Active, Critical, All)
- Alert resolution capability
- Timestamp tracking

### Analytics Page
- Device metric history (24 hours)
- Interactive charts with Recharts
- Device and metric selection
- Power consumption trends
- Statistical analysis

## 🔄 Telemetry Generation

The system automatically generates realistic telemetry data:

- **Frequency**: Every 5 seconds
- **Gradual Fluctuations**: Values change smoothly (±5% per update)
- **Random Faults**: 5% chance of device state change
- **Alert Triggering**: Automatic alerts when thresholds exceeded
- **Historical Data**: 7 days of pre-seeded data
- **WebSocket Broadcasting**: Real-time updates to all connected clients

### Alert Thresholds

- **PUMP-01**: Temperature > 45°C (warning), > 55°C (critical)
- **DG-01**: Fuel < 25% (warning), < 15% (critical)
- **HVAC-01**: RPM > 2500 (warning), > 3000 (critical)
- **METER-01**: Voltage < 210V (warning), < 200V (critical)
- **TANK-01**: Water level < 30% (warning), < 15% (critical)
- **FIRE-01**: Smoke > 20ppm (warning), > 50ppm (critical)
- **SOLAR-01**: Battery < 30% (warning), < 15% (critical)

## 🐳 Docker Services

### PostgreSQL
- Image: `postgres:15-alpine`
- Port: 5432
- Volume: `postgres_data` (persistent)
- Health Check: Enabled

### PgAdmin
- Image: `dpage/pgadmin4:latest`
- Port: 5050
- Access: http://localhost:5050

### Backend
- Image: Built from `backend/Dockerfile`
- Port: 8000
- Volume: `./backend` (for hot reload)
- Depends on: PostgreSQL

## 📊 Database Schema

### devices
- id (PK)
- device_code (UNIQUE)
- device_name
- device_type
- location
- status
- installed_at
- created_at, updated_at

### telemetry
- id (PK)
- device_code (FK)
- metric_name
- metric_value
- metric_unit
- status
- created_at (indexed)

### alerts
- id (PK)
- device_code (FK)
- alert_type
- severity (LOW, MEDIUM, HIGH, CRITICAL)
- message
- is_resolved
- created_at, resolved_at

### device_logs
- id (PK)
- device_code (FK)
- log_message
- log_level
- created_at

## 🎨 UI Design

- **Theme**: Dark mode industrial SCADA-style
- **Colors**: 
  - Green (#10b981) - Healthy/Online
  - Yellow (#f59e0b) - Warning
  - Red (#ef4444) - Critical/Offline
  - Blue (#3b82f6) - Informational
- **Framework**: TailwindCSS
- **Charts**: Recharts
- **Icons**: Lucide React

## 🔐 Security Notes

- Change `SECRET_KEY` in production
- Use strong database passwords
- Enable HTTPS in production
- Implement authentication/authorization
- Use environment variables for secrets
- Validate all inputs

## 🐛 Troubleshooting

### Services won't start
```bash
# Check Docker status
docker-compose ps

# View logs
docker-compose logs

# Rebuild containers
docker-compose down
docker-compose up -d --build
```

### Database connection error
```bash
# Ensure PostgreSQL is running
docker-compose ps postgres

# Check database logs
docker-compose logs postgres

# Verify connection string in .env
```

### Frontend not connecting to backend
```bash
# Check backend is running
curl http://localhost:8000/health

# Verify VITE_API_URL in frontend .env
# Check CORS settings in backend
```

### WebSocket connection issues
```bash
# Check WebSocket URL in frontend
# Verify backend WebSocket endpoint
# Check browser console for errors
```

## 📝 Development

### Adding a New Device

1. Add device config to `backend/app/generator/devices_config.py`
2. Define metrics and thresholds
3. Restart backend service
4. Device appears automatically in dashboard

### Adding a New Metric

1. Update device config with new metric
2. Add alert thresholds if needed
3. Update frontend components to display metric
4. Metric data flows automatically

### Customizing Alerts

Edit `ALERT_THRESHOLDS` in `backend/app/generator/devices_config.py`

## 📚 Tech Stack

### Backend
- FastAPI 0.104.1
- SQLAlchemy 2.0.23
- PostgreSQL 15
- APScheduler 3.10.4
- Pydantic 2.5.0

### Frontend
- React 18.2.0
- Vite 5.0.8
- TailwindCSS 3.3.6
- Recharts 2.10.3
- Zustand 4.4.1
- Axios 1.6.2

### DevOps
- Docker & Docker Compose
- PostgreSQL 15
- PgAdmin 4

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Support

For issues, questions, or contributions, please refer to the project documentation or create an issue.

## 🎯 Next Steps

1. Access dashboard at http://localhost:5173
2. Explore device metrics in real-time
3. Monitor alerts and system status
4. View historical analytics
5. Customize alert thresholds as needed

---

**Status**: ✅ Production Ready for Local Development
**Last Updated**: May 2026
