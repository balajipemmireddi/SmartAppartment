# Setup Guide - Smart Apartment IoT Dashboard

## 🚀 Quick Start (5 minutes)

### Step 1: Prerequisites Check
```bash
# Check Docker
docker --version
docker-compose --version

# Check Node.js (optional, for frontend development)
node --version
npm --version
```

### Step 2: Clone and Configure
```bash
# Navigate to project directory
cd smart-apartment-iot-dashboard

# Copy environment file
cp .env.example .env

# Review .env (optional - defaults are fine for local development)
cat .env
```

### Step 3: Start Services
```bash
# Start all services in background
docker-compose up -d

# Wait for services to initialize (30-60 seconds)
sleep 30

# Check service status
docker-compose ps
```

### Step 4: Access Application
```
Dashboard:  http://localhost:5173
API Docs:   http://localhost:8000/docs
PgAdmin:    http://localhost:5050
```

---

## 📋 Detailed Setup

### Option A: Docker Compose (Recommended)

#### Full Setup
```bash
# 1. Clone repository
git clone <repo-url>
cd smart-apartment-iot-dashboard

# 2. Create environment file
cp .env.example .env

# 3. Start services
docker-compose up -d

# 4. Verify services
docker-compose ps

# Expected output:
# NAME                    STATUS
# smart_apartment_db      Up (healthy)
# smart_apartment_pgadmin Up
# smart_apartment_backend Up
```

#### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f postgres

# Last 100 lines
docker-compose logs --tail=100 backend
```

#### Stop Services
```bash
# Stop (keep data)
docker-compose stop

# Stop and remove containers (keep data)
docker-compose down

# Stop and remove everything (delete data)
docker-compose down -v
```

#### Rebuild Services
```bash
# Rebuild backend image
docker-compose up -d --build backend

# Rebuild all
docker-compose down
docker-compose up -d --build
```

---

### Option B: Manual Setup (Development)

#### Backend Setup

```bash
# 1. Navigate to backend
cd backend

# 2. Create virtual environment
python -m venv venv

# 3. Activate virtual environment
# On Linux/Mac:
source venv/bin/activate

# On Windows:
venv\Scripts\activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Create .env file
cat > .env << EOF
DATABASE_URL=postgresql://smartapt:smartapt123@localhost:5432/smart_apartment
SECRET_KEY=your-secret-key-change-in-production
ENVIRONMENT=development
EOF

# 6. Start PostgreSQL (ensure it's running)
# Option 1: Using Docker
docker run -d \
  --name smart_apartment_db \
  -e POSTGRES_USER=smartapt \
  -e POSTGRES_PASSWORD=smartapt123 \
  -e POSTGRES_DB=smart_apartment \
  -p 5432:5432 \
  postgres:15-alpine

# Option 2: Using local PostgreSQL installation
# Ensure PostgreSQL is running and create database

# 7. Initialize database
psql -U smartapt -d smart_apartment -f init.sql

# 8. Start backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Create .env file (optional)
cat > .env << EOF
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
EOF

# 4. Start development server
npm run dev

# 5. Access at http://localhost:5173
```

---

## 🔍 Verification

### Check Backend Health
```bash
# Health check endpoint
curl http://localhost:8000/health

# Expected response:
# {"status":"healthy","service":"Smart Apartment IoT Dashboard","version":"1.0.0"}
```

### Check API Documentation
```
Open browser: http://localhost:8000/docs
```

### Check Database Connection
```bash
# Using psql
psql -U smartapt -d smart_apartment -c "SELECT COUNT(*) FROM devices;"

# Using Docker
docker-compose exec postgres psql -U smartapt -d smart_apartment -c "SELECT COUNT(*) FROM devices;"
```

### Check WebSocket Connection
```bash
# Open browser console at http://localhost:5173
# Should see: "WebSocket connected"
```

---

## 🎯 First Time Usage

### 1. Dashboard
- Navigate to http://localhost:5173
- Should see 8 devices with real-time data
- Charts should update every 5 seconds
- Alerts should appear as they're generated

### 2. API Documentation
- Visit http://localhost:8000/docs
- Try endpoints:
  - GET /api/devices
  - GET /api/alerts
  - GET /api/dashboard/summary

### 3. Database Management
- Visit http://localhost:5050 (PgAdmin)
- Login: admin@smartapt.com / admin123
- Add server: postgres:5432
- Explore tables and data

### 4. Monitor Logs
```bash
# Watch backend logs
docker-compose logs -f backend

# Watch database logs
docker-compose logs -f postgres
```

---

## 🔧 Configuration

### Change Telemetry Interval
Edit `backend/app/config.py`:
```python
telemetry_interval: int = 5  # Change to desired seconds
```

### Change Alert Thresholds
Edit `backend/app/generator/devices_config.py`:
```python
ALERT_THRESHOLDS = {
    "PUMP-01": {
        "temperature": {"warning": 45, "critical": 55},
        # Modify thresholds here
    }
}
```

### Change Database Credentials
Edit `.env`:
```env
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_database
```

### Change Frontend API URL
Edit `frontend/.env`:
```env
VITE_API_URL=http://your-backend-url
VITE_WS_URL=ws://your-backend-url
```

---

## 🐛 Troubleshooting

### Issue: "Connection refused" on port 5432
**Solution**: PostgreSQL not running
```bash
# Check if running
docker-compose ps postgres

# Start if stopped
docker-compose up -d postgres

# Or use local PostgreSQL
# Ensure it's running and accessible
```

### Issue: "Cannot connect to backend" from frontend
**Solution**: CORS or network issue
```bash
# Check backend is running
curl http://localhost:8000/health

# Check CORS settings in backend/app/main.py
# Verify VITE_API_URL in frontend/.env
```

### Issue: "WebSocket connection failed"
**Solution**: WebSocket endpoint issue
```bash
# Check backend logs
docker-compose logs backend

# Verify WebSocket URL in frontend
# Should be: ws://localhost:8000/ws/live
```

### Issue: "Database already exists" error
**Solution**: Clean up and restart
```bash
# Remove volumes
docker-compose down -v

# Restart
docker-compose up -d
```

### Issue: "Port already in use"
**Solution**: Change port in docker-compose.yml
```yaml
ports:
  - "5173:5173"  # Change first number to different port
```

### Issue: "Out of memory" or slow performance
**Solution**: Increase Docker resources
```bash
# Docker Desktop: Settings > Resources > Memory
# Increase to 4GB or more
```

---

## 📊 Data Management

### Seed New Data
```bash
# Backend will automatically seed on first run
# To reseed, delete database volume:
docker-compose down -v
docker-compose up -d
```

### Export Data
```bash
# Export devices
docker-compose exec postgres pg_dump -U smartapt smart_apartment > backup.sql

# Export specific table
docker-compose exec postgres pg_dump -U smartapt -t devices smart_apartment > devices.sql
```

### Import Data
```bash
# Import from backup
docker-compose exec -T postgres psql -U smartapt smart_apartment < backup.sql
```

---

## 🚀 Production Deployment

### Before Deploying
1. Change `SECRET_KEY` in .env
2. Use strong database password
3. Enable HTTPS
4. Set `ENVIRONMENT=production`
5. Configure proper CORS origins
6. Set up proper logging
7. Configure backups

### Docker Deployment
```bash
# Build production image
docker build -t smart-apartment-backend:latest ./backend

# Push to registry
docker tag smart-apartment-backend:latest your-registry/smart-apartment-backend:latest
docker push your-registry/smart-apartment-backend:latest

# Deploy using docker-compose or Kubernetes
```

---

## 📚 Additional Resources

### API Documentation
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Database
- PgAdmin: http://localhost:5050
- Connection: postgres:5432

### Logs
```bash
# All logs
docker-compose logs

# Follow logs
docker-compose logs -f

# Specific service
docker-compose logs backend
```

### Health Checks
```bash
# Backend health
curl http://localhost:8000/health

# Database health
docker-compose exec postgres pg_isready -U smartapt
```

---

## ✅ Checklist

- [ ] Docker and Docker Compose installed
- [ ] .env file created from .env.example
- [ ] Services started with `docker-compose up -d`
- [ ] All services showing "Up" in `docker-compose ps`
- [ ] Dashboard accessible at http://localhost:5173
- [ ] API docs accessible at http://localhost:8000/docs
- [ ] Real-time data visible on dashboard
- [ ] Alerts appearing in real-time
- [ ] WebSocket connection established

---

## 🎯 Next Steps

1. **Explore Dashboard**: Monitor devices and alerts
2. **Review API**: Check /docs for all endpoints
3. **Customize**: Modify alert thresholds and device configs
4. **Integrate**: Connect to external systems if needed
5. **Deploy**: Move to production when ready

---

**Need Help?**
- Check logs: `docker-compose logs -f`
- Verify health: `curl http://localhost:8000/health`
- Review documentation: See README.md
