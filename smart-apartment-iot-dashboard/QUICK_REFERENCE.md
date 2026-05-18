# Quick Reference Guide

## 🚀 Start Application (30 seconds)

```bash
cd smart-apartment-iot-dashboard
cp .env.example .env
docker-compose up -d
```

**Access:**
- Dashboard: http://localhost:5173
- API: http://localhost:8000/docs
- Database: http://localhost:5050

---

## 📍 Key URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Dashboard | http://localhost:5173 | Main UI |
| API Docs | http://localhost:8000/docs | Interactive API |
| ReDoc | http://localhost:8000/redoc | API documentation |
| PgAdmin | http://localhost:5050 | Database management |
| Health Check | http://localhost:8000/health | Service status |
| WebSocket | ws://localhost:8000/ws/live | Real-time data |

---

## 🔑 Credentials

| Service | Username | Password |
|---------|----------|----------|
| PgAdmin | admin@smartapt.com | admin123 |
| Database | smartapt | smartapt123 |

---

## 🐳 Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose stop

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend

# Restart services
docker-compose restart

# Remove services (keep data)
docker-compose down

# Remove everything (delete data)
docker-compose down -v

# Rebuild images
docker-compose up -d --build

# Check status
docker-compose ps
```

---

## 🔍 Useful Curl Commands

```bash
# Get all devices
curl http://localhost:8000/api/devices

# Get device metrics
curl http://localhost:8000/api/devices/PUMP-01/metrics

# Get active alerts
curl "http://localhost:8000/api/alerts?active_only=true"

# Get dashboard summary
curl http://localhost:8000/api/dashboard/summary

# Get metric history
curl "http://localhost:8000/api/telemetry/device/PUMP-01/metric/temperature?hours=24"

# Resolve alert
curl -X PUT http://localhost:8000/api/alerts/1/resolve

# Health check
curl http://localhost:8000/health
```

---

## 📊 Device Codes

| Code | Device | Type |
|------|--------|------|
| PUMP-01 | Underground Water Pump | PUMP |
| DG-01 | Diesel Generator | GENERATOR |
| LIFT-01 | Elevator Controller | ELEVATOR |
| HVAC-01 | Basement HVAC System | HVAC |
| METER-01 | Main Energy Meter | METER |
| TANK-01 | Overhead Water Tank | TANK |
| FIRE-01 | Fire Alarm Panel | FIRE_ALARM |
| SOLAR-01 | Solar Inverter | SOLAR |

---

## 📈 Metric Names by Device

### PUMP-01
- voltage
- current
- temperature
- runtime

### DG-01
- fuel_level
- load_percentage
- engine_temperature
- voltage
- frequency

### HVAC-01
- fan_rpm
- air_temperature
- humidity
- power_consumption

### METER-01
- voltage
- current
- power_factor
- frequency
- power_consumption

### TANK-01
- water_level
- tank_pressure
- refill_status

### SOLAR-01
- solar_output
- battery_charge
- grid_status

---

## ⚠️ Alert Severity Levels

| Level | Color | Meaning |
|-------|-------|---------|
| LOW | Blue | Minor issue |
| MEDIUM | Orange | Moderate issue |
| HIGH | Yellow | Warning |
| CRITICAL | Red | Urgent action needed |

---

## 🔧 Configuration Files

### .env
```env
DB_USER=smartapt
DB_PASSWORD=smartapt123
DB_NAME=smart_apartment
SECRET_KEY=dev-secret-key
ENVIRONMENT=development
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

### docker-compose.yml
- PostgreSQL on port 5432
- PgAdmin on port 5050
- Backend on port 8000
- Frontend on port 5173

---

## 🐛 Troubleshooting

### Services won't start
```bash
docker-compose down -v
docker-compose up -d --build
```

### Port already in use
Edit docker-compose.yml and change port numbers

### Database connection error
```bash
docker-compose logs postgres
docker-compose restart postgres
```

### Frontend not connecting
Check VITE_API_URL in .env and browser console

### WebSocket issues
Verify backend is running: `curl http://localhost:8000/health`

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| docker-compose.yml | Service orchestration |
| .env | Environment variables |
| backend/app/main.py | FastAPI entry point |
| backend/app/generator/telemetry_generator.py | Data generation |
| frontend/src/App.jsx | React entry point |
| backend/init.sql | Database schema |

---

## 🎯 Common Tasks

### View Real-time Logs
```bash
docker-compose logs -f backend
```

### Access Database
```bash
docker-compose exec postgres psql -U smartapt -d smart_apartment
```

### Restart Backend
```bash
docker-compose restart backend
```

### Clear All Data
```bash
docker-compose down -v
docker-compose up -d
```

### Export Database
```bash
docker-compose exec postgres pg_dump -U smartapt smart_apartment > backup.sql
```

### Check Service Health
```bash
curl http://localhost:8000/health
docker-compose ps
```

---

## 📊 API Response Examples

### Device Response
```json
{
  "id": 1,
  "device_code": "PUMP-01",
  "device_name": "Underground Water Pump",
  "device_type": "PUMP",
  "location": "Basement Level -2",
  "status": "ONLINE"
}
```

### Telemetry Response
```json
{
  "id": 1,
  "device_code": "PUMP-01",
  "metric_name": "temperature",
  "metric_value": 42.3,
  "metric_unit": "°C",
  "status": "NORMAL",
  "created_at": "2026-05-18T10:30:00"
}
```

### Alert Response
```json
{
  "id": 1,
  "device_code": "PUMP-01",
  "alert_type": "temperature",
  "severity": "HIGH",
  "message": "Temperature warning: 45.2°C",
  "is_resolved": false,
  "created_at": "2026-05-18T10:30:00"
}
```

---

## 🔄 Data Flow

```
Telemetry Generator (every 5s)
    ↓
PostgreSQL Database
    ↓
FastAPI REST API
    ↓
React Frontend
    ↓
User Dashboard
```

---

## 📱 Frontend Pages

| Page | URL | Purpose |
|------|-----|---------|
| Dashboard | / | Overview & KPIs |
| Devices | /devices | Device inventory |
| Alerts | /alerts | Alert management |
| Analytics | /analytics | Historical data |

---

## 🔐 Security Notes

- Change SECRET_KEY in production
- Use strong database passwords
- Enable HTTPS in production
- Implement authentication
- Validate all inputs
- Use environment variables for secrets

---

## 📚 Documentation Files

- **README.md** - Project overview
- **SETUP.md** - Detailed setup
- **API.md** - API documentation
- **PROJECT_SUMMARY.md** - Complete summary
- **VERIFICATION.md** - Testing checklist
- **QUICK_REFERENCE.md** - This file

---

## 🎓 Learning Resources

### Backend
- FastAPI: https://fastapi.tiangolo.com
- SQLAlchemy: https://www.sqlalchemy.org
- PostgreSQL: https://www.postgresql.org

### Frontend
- React: https://react.dev
- Vite: https://vitejs.dev
- TailwindCSS: https://tailwindcss.com
- Recharts: https://recharts.org

### DevOps
- Docker: https://www.docker.com
- Docker Compose: https://docs.docker.com/compose

---

## ✅ Quick Checklist

- [ ] Docker installed
- [ ] .env file created
- [ ] Services started
- [ ] Dashboard accessible
- [ ] API responding
- [ ] Real-time updates working
- [ ] Database populated
- [ ] Alerts generating

---

## 🆘 Getting Help

1. Check logs: `docker-compose logs -f`
2. Verify health: `curl http://localhost:8000/health`
3. Review documentation
4. Check browser console for errors
5. Verify all services running: `docker-compose ps`

---

## 📞 Quick Support

| Issue | Solution |
|-------|----------|
| Port in use | Change port in docker-compose.yml |
| DB connection error | Restart postgres: `docker-compose restart postgres` |
| Frontend not loading | Check VITE_API_URL in .env |
| WebSocket not connecting | Verify backend running: `curl http://localhost:8000/health` |
| No data showing | Wait 30 seconds for initial seed, check logs |

---

**Last Updated**: May 2026
**Version**: 1.0.0
