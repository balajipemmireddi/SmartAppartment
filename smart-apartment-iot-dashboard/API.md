# API Documentation

## Base URL
```
http://localhost:8000
```

## Authentication
Currently, no authentication is required. In production, implement JWT or similar.

---

## Devices API

### Get All Devices
```http
GET /api/devices
```

**Response:**
```json
[
  {
    "id": 1,
    "device_code": "PUMP-01",
    "device_name": "Underground Water Pump",
    "device_type": "PUMP",
    "location": "Basement Level -2",
    "status": "ONLINE",
    "installed_at": "2026-05-18T10:00:00",
    "created_at": "2026-05-18T10:00:00",
    "updated_at": "2026-05-18T10:00:00"
  }
]
```

### Get Device by Code
```http
GET /api/devices/{device_code}
```

**Example:**
```http
GET /api/devices/PUMP-01
```

**Response:**
```json
{
  "id": 1,
  "device_code": "PUMP-01",
  "device_name": "Underground Water Pump",
  "device_type": "PUMP",
  "location": "Basement Level -2",
  "status": "ONLINE",
  "installed_at": "2026-05-18T10:00:00",
  "created_at": "2026-05-18T10:00:00",
  "updated_at": "2026-05-18T10:00:00"
}
```

### Get Device Metrics
```http
GET /api/devices/{device_code}/metrics
```

**Example:**
```http
GET /api/devices/PUMP-01/metrics
```

**Response:**
```json
{
  "device_code": "PUMP-01",
  "device_name": "Underground Water Pump",
  "metrics": {
    "voltage": {
      "value": 228.5,
      "unit": "V",
      "status": "NORMAL",
      "timestamp": "2026-05-18T10:30:00"
    },
    "current": {
      "value": 15.2,
      "unit": "A",
      "status": "NORMAL",
      "timestamp": "2026-05-18T10:30:00"
    },
    "temperature": {
      "value": 42.3,
      "unit": "°C",
      "status": "NORMAL",
      "timestamp": "2026-05-18T10:30:00"
    }
  }
}
```

### Get Device Status Summary
```http
GET /api/devices/status/summary
```

**Response:**
```json
{
  "total_devices": 8,
  "online_devices": 7,
  "offline_devices": 1,
  "devices": [
    {
      "device_code": "PUMP-01",
      "device_name": "Underground Water Pump",
      "status": "ONLINE",
      "device_type": "PUMP",
      "location": "Basement Level -2"
    }
  ]
}
```

---

## Telemetry API

### Get Latest Telemetry
```http
GET /api/telemetry/latest?limit=100
```

**Query Parameters:**
- `limit` (optional): Number of records to return (default: 100, max: 1000)

**Response:**
```json
[
  {
    "id": 1,
    "device_code": "PUMP-01",
    "metric_name": "temperature",
    "metric_value": 42.3,
    "metric_unit": "°C",
    "status": "NORMAL",
    "created_at": "2026-05-18T10:30:00"
  }
]
```

### Get Device Telemetry
```http
GET /api/telemetry/device/{device_code}?limit=100
```

**Example:**
```http
GET /api/telemetry/device/PUMP-01?limit=50
```

**Response:**
```json
[
  {
    "id": 1,
    "device_code": "PUMP-01",
    "metric_name": "temperature",
    "metric_value": 42.3,
    "metric_unit": "°C",
    "status": "NORMAL",
    "created_at": "2026-05-18T10:30:00"
  }
]
```

### Get Metric History
```http
GET /api/telemetry/device/{device_code}/metric/{metric_name}?hours=24
```

**Example:**
```http
GET /api/telemetry/device/PUMP-01/metric/temperature?hours=24
```

**Query Parameters:**
- `hours` (optional): Number of hours to retrieve (default: 24, max: 720)

**Response:**
```json
{
  "device_code": "PUMP-01",
  "metric_name": "temperature",
  "data": [
    {
      "value": 40.2,
      "unit": "°C",
      "status": "NORMAL",
      "timestamp": "2026-05-17T10:30:00"
    },
    {
      "value": 41.5,
      "unit": "°C",
      "status": "NORMAL",
      "timestamp": "2026-05-17T10:35:00"
    }
  ]
}
```

### Get Metric Statistics
```http
GET /api/telemetry/device/{device_code}/metric/{metric_name}/stats?hours=24
```

**Example:**
```http
GET /api/telemetry/device/PUMP-01/metric/temperature/stats?hours=24
```

**Response:**
```json
{
  "min": 38.5,
  "max": 48.2,
  "avg": 42.8,
  "count": 288,
  "unit": "°C"
}
```

### Get Dashboard Metrics
```http
GET /api/telemetry/dashboard/metrics
```

**Response:**
```json
{
  "avg_temperature": 42.5,
  "total_power_consumption": 35.2,
  "avg_water_level": 75.3
}
```

---

## Alerts API

### Get All Alerts
```http
GET /api/alerts?limit=100&active_only=false
```

**Query Parameters:**
- `limit` (optional): Number of records (default: 100, max: 1000)
- `active_only` (optional): Filter active alerts only (default: false)

**Response:**
```json
[
  {
    "id": 1,
    "device_code": "PUMP-01",
    "alert_type": "temperature",
    "severity": "HIGH",
    "message": "Temperature warning: 45.2°C",
    "is_resolved": false,
    "created_at": "2026-05-18T10:30:00",
    "resolved_at": null
  }
]
```

### Get Active Alerts
```http
GET /api/alerts?active_only=true
```

**Response:**
```json
[
  {
    "id": 1,
    "device_code": "PUMP-01",
    "alert_type": "temperature",
    "severity": "HIGH",
    "message": "Temperature warning: 45.2°C",
    "is_resolved": false,
    "created_at": "2026-05-18T10:30:00",
    "resolved_at": null
  }
]
```

### Get Critical Alerts
```http
GET /api/alerts/critical
```

**Response:**
```json
[
  {
    "id": 2,
    "device_code": "DG-01",
    "alert_type": "fuel_level",
    "severity": "CRITICAL",
    "message": "Fuel level critical: 12%",
    "created_at": "2026-05-18T10:25:00"
  }
]
```

### Get Device Alerts
```http
GET /api/alerts/device/{device_code}?limit=50
```

**Example:**
```http
GET /api/alerts/device/PUMP-01?limit=50
```

**Response:**
```json
[
  {
    "id": 1,
    "device_code": "PUMP-01",
    "alert_type": "temperature",
    "severity": "HIGH",
    "message": "Temperature warning: 45.2°C",
    "is_resolved": false,
    "created_at": "2026-05-18T10:30:00",
    "resolved_at": null
  }
]
```

### Get Alert Summary
```http
GET /api/alerts/summary
```

**Response:**
```json
{
  "total_active": 3,
  "critical": 1,
  "high": 2,
  "critical_alerts": [
    {
      "id": 2,
      "device_code": "DG-01",
      "alert_type": "fuel_level",
      "message": "Fuel level critical: 12%",
      "created_at": "2026-05-18T10:25:00"
    }
  ]
}
```

### Resolve Alert
```http
PUT /api/alerts/{alert_id}/resolve
```

**Example:**
```http
PUT /api/alerts/1/resolve
```

**Response:**
```json
{
  "id": 1,
  "is_resolved": true,
  "resolved_at": "2026-05-18T10:35:00"
}
```

---

## Dashboard API

### Get Dashboard Summary
```http
GET /api/dashboard/summary
```

**Response:**
```json
{
  "devices": {
    "total": 8,
    "online": 7,
    "offline": 1
  },
  "alerts": {
    "total_active": 3,
    "critical": 1,
    "high": 2
  },
  "metrics": {
    "avg_temperature": 42.5,
    "total_power_consumption": 35.2,
    "avg_water_level": 75.3
  }
}
```

### Get Dashboard Overview
```http
GET /api/dashboard/overview
```

**Response:**
```json
{
  "timestamp": "2026-05-18T10:35:00",
  "devices": {
    "total_devices": 8,
    "online_devices": 7,
    "offline_devices": 1,
    "devices": [...]
  },
  "alerts": {
    "total_active": 3,
    "critical": 1,
    "high": 2,
    "critical_alerts": [...]
  },
  "metrics": {
    "avg_temperature": 42.5,
    "total_power_consumption": 35.2,
    "avg_water_level": 75.3
  }
}
```

---

## WebSocket API

### Connect to Live Stream
```javascript
const ws = new WebSocket('ws://localhost:8000/ws/live')

ws.onopen = () => {
  console.log('Connected')
}

ws.onmessage = (event) => {
  const data = JSON.parse(event.data)
  console.log('Received:', data)
}

ws.onerror = (error) => {
  console.error('Error:', error)
}

ws.onclose = () => {
  console.log('Disconnected')
}
```

### Message Types

#### Telemetry Update
```json
{
  "type": "telemetry",
  "device_code": "PUMP-01",
  "metrics": {
    "temperature": {
      "value": 42.3,
      "unit": "°C",
      "status": "NORMAL"
    },
    "voltage": {
      "value": 228.5,
      "unit": "V",
      "status": "NORMAL"
    }
  },
  "timestamp": "2026-05-18T10:30:00"
}
```

#### Alert Update
```json
{
  "type": "alert",
  "data": {
    "id": 1,
    "device_code": "PUMP-01",
    "alert_type": "temperature",
    "severity": "HIGH",
    "message": "Temperature warning: 45.2°C",
    "created_at": "2026-05-18T10:30:00"
  },
  "timestamp": "2026-05-18T10:30:00"
}
```

#### Device Status Update
```json
{
  "type": "device_status",
  "device_code": "PUMP-01",
  "status": "OFFLINE",
  "timestamp": "2026-05-18T10:30:00"
}
```

---

## Health Check

### Check API Health
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "Smart Apartment IoT Dashboard",
  "version": "1.0.0"
}
```

---

## Error Responses

### 404 Not Found
```json
{
  "detail": "Device not found"
}
```

### 400 Bad Request
```json
{
  "detail": "Device code already exists"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```

---

## Rate Limiting

Currently, no rate limiting is implemented. In production, implement appropriate rate limiting.

---

## CORS

CORS is enabled for:
- http://localhost:5173
- http://localhost:3000
- http://localhost:8000

---

## Examples

### Using cURL

```bash
# Get all devices
curl http://localhost:8000/api/devices

# Get device metrics
curl http://localhost:8000/api/devices/PUMP-01/metrics

# Get active alerts
curl "http://localhost:8000/api/alerts?active_only=true"

# Resolve alert
curl -X PUT http://localhost:8000/api/alerts/1/resolve

# Get dashboard summary
curl http://localhost:8000/api/dashboard/summary
```

### Using JavaScript/Fetch

```javascript
// Get all devices
fetch('http://localhost:8000/api/devices')
  .then(res => res.json())
  .then(data => console.log(data))

// Get device metrics
fetch('http://localhost:8000/api/devices/PUMP-01/metrics')
  .then(res => res.json())
  .then(data => console.log(data))

// Resolve alert
fetch('http://localhost:8000/api/alerts/1/resolve', {
  method: 'PUT'
})
  .then(res => res.json())
  .then(data => console.log(data))
```

### Using Python/Requests

```python
import requests

# Get all devices
response = requests.get('http://localhost:8000/api/devices')
print(response.json())

# Get device metrics
response = requests.get('http://localhost:8000/api/devices/PUMP-01/metrics')
print(response.json())

# Resolve alert
response = requests.put('http://localhost:8000/api/alerts/1/resolve')
print(response.json())
```

---

## Interactive API Documentation

Visit: http://localhost:8000/docs

This provides an interactive Swagger UI where you can test all endpoints directly.

---

**Last Updated**: May 2026
