# Verification Checklist

## ✅ Pre-Deployment Verification

### Docker & Environment
- [ ] Docker installed and running
- [ ] Docker Compose installed
- [ ] .env file created from .env.example
- [ ] All environment variables set correctly

### Backend
- [ ] Backend Dockerfile exists
- [ ] requirements.txt has all dependencies
- [ ] app/main.py entry point configured
- [ ] Database models defined
- [ ] API routes implemented
- [ ] WebSocket manager configured
- [ ] Telemetry generator implemented
- [ ] Alert thresholds configured

### Frontend
- [ ] package.json configured
- [ ] vite.config.js set up
- [ ] tailwind.config.js configured
- [ ] All React components created
- [ ] API service layer implemented
- [ ] Zustand store configured
- [ ] WebSocket hook implemented

### Database
- [ ] init.sql schema defined
- [ ] Tables created (devices, telemetry, alerts, device_logs)
- [ ] Indexes created for performance
- [ ] Foreign keys configured
- [ ] Seed data logic implemented

---

## 🚀 Startup Verification

### Step 1: Start Services
```bash
docker-compose up -d
```

- [ ] All services start without errors
- [ ] No port conflicts
- [ ] No permission issues

### Step 2: Check Service Status
```bash
docker-compose ps
```

Expected output:
```
NAME                    STATUS
smart_apartment_db      Up (healthy)
smart_apartment_pgadmin Up
smart_apartment_backend Up
```

- [ ] PostgreSQL is "Up (healthy)"
- [ ] PgAdmin is "Up"
- [ ] Backend is "Up"

### Step 3: Verify Database
```bash
docker-compose exec postgres psql -U smartapt -d smart_apartment -c "SELECT COUNT(*) FROM devices;"
```

- [ ] Command executes without error
- [ ] Returns 8 devices
- [ ] No connection errors

### Step 4: Check Backend Health
```bash
curl http://localhost:8000/health
```

Expected response:
```json
{"status":"healthy","service":"Smart Apartment IoT Dashboard","version":"1.0.0"}
```

- [ ] Returns 200 status code
- [ ] Status is "healthy"
- [ ] Service name is correct

### Step 5: Verify API Endpoints
```bash
curl http://localhost:8000/api/devices
```

- [ ] Returns 200 status code
- [ ] Returns array of 8 devices
- [ ] Each device has required fields

### Step 6: Check WebSocket
Open browser console at http://localhost:5173:
```javascript
const ws = new WebSocket('ws://localhost:8000/ws/live')
ws.onopen = () => console.log('Connected')
```

- [ ] WebSocket connects successfully
- [ ] No connection errors in console
- [ ] Messages received every 5 seconds

---

## 🎨 Frontend Verification

### Dashboard Page
- [ ] Page loads without errors
- [ ] KPI cards display (Online Devices, Active Alerts, Avg Temperature, Power Usage)
- [ ] Temperature chart renders
- [ ] System status section shows data
- [ ] Active alerts panel displays
- [ ] Device status grid shows 8 devices
- [ ] Real-time updates occur every 5 seconds

### Devices Page
- [ ] Page loads without errors
- [ ] All 8 devices displayed
- [ ] Device cards show status indicators
- [ ] Metrics display for each device
- [ ] Status colors are correct (green for online, red for offline)

### Alerts Page
- [ ] Page loads without errors
- [ ] Active alerts displayed
- [ ] Alert filtering works (Active, Critical, All)
- [ ] Severity colors are correct
- [ ] Timestamps display correctly
- [ ] Resolve button works

### Analytics Page
- [ ] Page loads without errors
- [ ] Device selector works
- [ ] Metric selector works
- [ ] Charts render with data
- [ ] Time range selection works
- [ ] Data updates correctly

### Navigation
- [ ] Sidebar navigation works
- [ ] All pages accessible
- [ ] Active page highlighted
- [ ] No broken links

---

## 📊 Data Verification

### Telemetry Data
```bash
curl "http://localhost:8000/api/telemetry/latest?limit=10"
```

- [ ] Returns telemetry records
- [ ] Each record has device_code, metric_name, metric_value
- [ ] Timestamps are recent (within last 5 seconds)
- [ ] Metric values are within expected ranges

### Device Metrics
```bash
curl http://localhost:8000/api/devices/PUMP-01/metrics
```

- [ ] Returns device metrics
- [ ] Contains voltage, current, temperature, runtime
- [ ] Values are within normal ranges
- [ ] Status is "NORMAL" or "WARNING"

### Alerts
```bash
curl "http://localhost:8000/api/alerts?active_only=true"
```

- [ ] Returns active alerts (if any)
- [ ] Each alert has device_code, severity, message
- [ ] Severity is one of: LOW, MEDIUM, HIGH, CRITICAL
- [ ] Timestamps are correct

### Dashboard Summary
```bash
curl http://localhost:8000/api/dashboard/summary
```

- [ ] Returns summary data
- [ ] Online devices count is correct
- [ ] Active alerts count is correct
- [ ] Metrics are populated

---

## 🔄 Real-time Updates Verification

### WebSocket Messages
Monitor browser console at http://localhost:5173:

- [ ] Telemetry messages received every 5 seconds
- [ ] Each message has type, device_code, metrics
- [ ] Metrics values change gradually
- [ ] Alert messages appear when thresholds exceeded
- [ ] Device status messages appear on state change

### Chart Updates
- [ ] Temperature chart updates in real-time
- [ ] New data points appear every 5 seconds
- [ ] Chart scrolls to show latest data
- [ ] No console errors during updates

### Alert Generation
- [ ] Alerts appear in real-time
- [ ] Alert count increases when new alerts generated
- [ ] Alert severity colors are correct
- [ ] Alerts can be resolved

---

## 🗄️ Database Verification

### Tables Exist
```bash
docker-compose exec postgres psql -U smartapt -d smart_apartment -c "\dt"
```

- [ ] devices table exists
- [ ] telemetry table exists
- [ ] alerts table exists
- [ ] device_logs table exists

### Data Seeding
```bash
docker-compose exec postgres psql -U smartapt -d smart_apartment -c "SELECT COUNT(*) FROM telemetry;"
```

- [ ] Telemetry records exist (should be 1000+)
- [ ] Historical data spans 7 days
- [ ] Alert history exists
- [ ] Device logs exist

### Indexes
```bash
docker-compose exec postgres psql -U smartapt -d smart_apartment -c "\di"
```

- [ ] idx_telemetry_device_code exists
- [ ] idx_telemetry_created_at exists
- [ ] idx_alerts_device_code exists
- [ ] idx_device_logs_device_code exists

---

## 🔐 Security Verification

- [ ] No hardcoded secrets in code
- [ ] Environment variables used for sensitive data
- [ ] CORS configured correctly
- [ ] Database password is not default (in production)
- [ ] SECRET_KEY is changed (in production)
- [ ] No sensitive data in logs
- [ ] API errors don't expose internal details

---

## 📈 Performance Verification

### Response Times
```bash
time curl http://localhost:8000/api/devices
```

- [ ] Device list returns in < 100ms
- [ ] Telemetry queries return in < 200ms
- [ ] Dashboard summary returns in < 150ms

### Database Performance
```bash
docker-compose exec postgres psql -U smartapt -d smart_apartment -c "EXPLAIN ANALYZE SELECT * FROM telemetry WHERE device_code='PUMP-01' ORDER BY created_at DESC LIMIT 100;"
```

- [ ] Queries use indexes
- [ ] No sequential scans on large tables
- [ ] Query plans are efficient

### Frontend Performance
- [ ] Dashboard loads in < 2 seconds
- [ ] Charts render smoothly
- [ ] No lag during real-time updates
- [ ] No memory leaks in browser console

---

## 🧪 Error Handling Verification

### Invalid Requests
```bash
curl http://localhost:8000/api/devices/INVALID-CODE
```

- [ ] Returns 404 status code
- [ ] Returns error message
- [ ] No server crash

### Missing Parameters
```bash
curl http://localhost:8000/api/telemetry/device/PUMP-01/metric/
```

- [ ] Returns appropriate error
- [ ] No server crash

### Database Connection Loss
- [ ] Backend handles gracefully
- [ ] Error messages are informative
- [ ] Auto-reconnect works

---

## 📱 Responsive Design Verification

### Desktop (1920x1080)
- [ ] All elements visible
- [ ] No horizontal scrolling
- [ ] Charts render properly
- [ ] Navigation works

### Tablet (768x1024)
- [ ] Layout adapts correctly
- [ ] Sidebar collapses if needed
- [ ] Charts are readable
- [ ] Touch interactions work

### Mobile (375x667)
- [ ] Layout is mobile-friendly
- [ ] Navigation is accessible
- [ ] Charts are readable
- [ ] No overflow issues

---

## 🔄 Continuous Operation Verification

### 1 Hour Test
- [ ] Services running without restart
- [ ] No memory leaks
- [ ] Database connections stable
- [ ] WebSocket connections stable
- [ ] Data continuously generated
- [ ] Alerts generated as expected

### 24 Hour Test (Optional)
- [ ] Services running for 24 hours
- [ ] No performance degradation
- [ ] Database size reasonable
- [ ] No connection timeouts
- [ ] Historical data accumulating

---

## 📋 Documentation Verification

- [ ] README.md is complete and accurate
- [ ] SETUP.md has clear instructions
- [ ] API.md documents all endpoints
- [ ] PROJECT_SUMMARY.md is comprehensive
- [ ] Code comments are present
- [ ] Error messages are helpful

---

## 🎯 Final Checklist

### Before Declaring Ready
- [ ] All services start successfully
- [ ] Dashboard displays correctly
- [ ] Real-time updates working
- [ ] API endpoints functional
- [ ] Database seeded with data
- [ ] Alerts generating correctly
- [ ] WebSocket streaming live data
- [ ] No console errors
- [ ] No server errors
- [ ] Documentation complete

### Sign-Off
- [ ] Project verified by developer
- [ ] All tests passing
- [ ] Ready for local development
- [ ] Ready for demonstration
- [ ] Ready for deployment

---

## 📝 Notes

- Run verification after each major change
- Keep this checklist updated
- Document any issues found
- Update documentation as needed

---

**Verification Date**: _______________
**Verified By**: _______________
**Status**: _______________

---

**Last Updated**: May 2026
