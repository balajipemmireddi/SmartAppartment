# Smart Apartment Infrastructure Monitoring Dashboard
## Complete Antigravity AI Build Documentation

---

# FILE: README.md

```md
# Smart Apartment Infrastructure Monitoring Dashboard

An industrial-style IoT monitoring dashboard that simulates RS485/Modbus telemetry data for apartment infrastructure systems.

## Overview

This project simulates a real-world smart apartment infrastructure monitoring platform where telemetry data from devices such as pumps, elevators, DG generators, HVAC systems, and energy meters are continuously generated, stored, analyzed, and visualized.

The system mimics industrial RS485 communication patterns without requiring physical hardware.

## Core Features

- Real-time telemetry simulation
- Device monitoring dashboard
- Alerts & warning system
- Historical analytics
- WebSocket live updates
- Infrastructure overview
- Device health monitoring
- Interactive charts
- Industrial-style UI
- FastAPI backend
- React frontend
- PostgreSQL database

## Simulated Devices

- Underground Water Pumps
- Diesel Generator
- Elevator Controller
- HVAC Ventilation System
- Main Energy Meter
- Solar Inverter
- Fire Alarm Panel
- Overhead Water Tank

## Tech Stack

### Frontend
- React
- Vite
- TailwindCSS
- Recharts
- Axios
- React Router

### Backend
- FastAPI
- SQLAlchemy
- WebSockets
- Pydantic
- APScheduler

### Database
- PostgreSQL

### Data Generator
- Python telemetry simulator

## Project Goals

- Simulate industrial telemetry systems
- Demonstrate IoT dashboard concepts
- Mimic RS485/Modbus infrastructure monitoring
- Build a scalable monitoring platform
- Showcase real-time data visualization

## System Architecture

Telemetry Generator → FastAPI → PostgreSQL → React Dashboard

## Dashboard Modules

1. Infrastructure Overview
2. Device Monitoring
3. Real-Time Charts
4. Alerts Panel
5. Historical Analytics
6. Device Logs
7. System Health

## Expected Workflow

1. Telemetry generator continuously creates fake RS485-like data.
2. Data gets inserted into PostgreSQL.
3. FastAPI exposes REST and WebSocket APIs.
4. React dashboard consumes live data.
5. Charts and alerts update in real time.

## Future Scope

- MQTT support
- Real RS485 integration
- Predictive maintenance
- AI anomaly detection
- Mobile app
- Multi-building support

```

---

# FILE: PROJECT_VISION.md

```md
# Project Vision

## Objective

The goal of this project is to create a realistic industrial IoT infrastructure monitoring dashboard for a smart apartment complex.

The system simulates telemetry data that would normally be transmitted through industrial protocols such as RS485/Modbus.

Instead of physical hardware, the project uses a Python-based telemetry generator that continuously produces realistic infrastructure data.

## Why This Project?

Modern apartment communities rely heavily on automated infrastructure systems:

- Water distribution pumps
- Diesel generators
- Elevator systems
- HVAC ventilation
- Smart power meters
- Fire safety systems
- Solar energy systems

These systems are commonly monitored through industrial telemetry protocols.

This project replicates that ecosystem using software simulation.

## Real-World Relevance

This architecture is similar to systems used in:

- Smart buildings
- Industrial automation
- Manufacturing plants
- Energy management systems
- SCADA systems
- Facility management platforms

## Educational Value

The project demonstrates:

- Full-stack development
- Real-time communication
- IoT architecture
- Industrial telemetry simulation
- Database design
- Data visualization
- Monitoring systems
- Alert management

## Expected User Roles

### Maintenance Operator
- Monitor infrastructure
- Check device status
- Respond to alerts

### Facility Manager
- View analytics
- Monitor power consumption
- Track infrastructure health

### Admin
- Manage devices
- Configure thresholds
- Access reports

```

---

# FILE: DEVICES_AND_TELEMETRY.md

```md
# Devices and Telemetry Design

## Simulated Devices

### 1. Underground Water Pump

Device Code: PUMP-01

Purpose:
Maintains water supply from underground storage to overhead tanks.

Telemetry:
- Voltage
- Current
- Temperature
- Runtime
- Pump Status

Possible States:
- RUNNING
- IDLE
- WARNING
- FAULT

---

### 2. Diesel Generator

Device Code: DG-01

Purpose:
Provides backup power during outages.

Telemetry:
- Fuel Level
- Load Percentage
- Engine Temperature
- Voltage
- Frequency

Possible States:
- STANDBY
- ACTIVE
- LOW_FUEL
- OVERHEAT

---

### 3. Elevator Controller

Device Code: LIFT-01

Purpose:
Monitors apartment lift operations.

Telemetry:
- Current Floor
- Door Status
- Error Code
- Operational State

Possible States:
- ACTIVE
- MAINTENANCE
- ERROR

---

### 4. Basement HVAC System

Device Code: HVAC-01

Purpose:
Controls basement ventilation.

Telemetry:
- Fan RPM
- Air Temperature
- Humidity
- Power Consumption

Possible States:
- RUNNING
- OFF
- FILTER_WARNING

---

### 5. Main Energy Meter

Device Code: METER-01

Purpose:
Measures building power usage.

Telemetry:
- Voltage
- Current
- Power Factor
- Frequency
- Power Consumption

Possible States:
- ONLINE
- WARNING
- OFFLINE

---

### 6. Water Tank Sensor

Device Code: TANK-01

Purpose:
Monitors overhead water levels.

Telemetry:
- Water Level
- Tank Pressure
- Refill Status

Possible States:
- NORMAL
- LOW_LEVEL
- OVERFLOW

---

### 7. Fire Alarm Panel

Device Code: FIRE-01

Purpose:
Monitors fire safety alarms.

Telemetry:
- Alarm State
- Sensor Trigger Count
- Smoke Level

Possible States:
- NORMAL
- ALERT
- EMERGENCY

---

### 8. Solar Inverter

Device Code: SOLAR-01

Purpose:
Tracks solar power generation.

Telemetry:
- Solar Output
- Battery Charge
- Grid Status

Possible States:
- GENERATING
- LOW_OUTPUT
- OFFLINE

```

---

# FILE: DATABASE_DESIGN.md

```md
# Database Design

## Database Choice

PostgreSQL

Reason:
- Reliable
- Scalable
- Industry-standard
- Excellent FastAPI support

---

# Tables

## devices

Purpose:
Stores device metadata.

Columns:

| Column | Type |
|---|---|
| id | SERIAL PRIMARY KEY |
| device_code | VARCHAR(50) |
| device_name | VARCHAR(100) |
| device_type | VARCHAR(50) |
| location | VARCHAR(100) |
| installed_at | TIMESTAMP |
| status | VARCHAR(20) |

---

## telemetry

Purpose:
Stores generated telemetry records.

Columns:

| Column | Type |
|---|---|
| id | SERIAL PRIMARY KEY |
| device_code | VARCHAR(50) |
| metric_name | VARCHAR(100) |
| metric_value | FLOAT |
| metric_unit | VARCHAR(20) |
| status | VARCHAR(20) |
| created_at | TIMESTAMP |

---

## alerts

Purpose:
Stores warnings and critical events.

Columns:

| Column | Type |
|---|---|
| id | SERIAL PRIMARY KEY |
| device_code | VARCHAR(50) |
| alert_type | VARCHAR(50) |
| severity | VARCHAR(20) |
| message | TEXT |
| created_at | TIMESTAMP |

---

## device_logs

Purpose:
Stores operational logs.

Columns:

| Column | Type |
|---|---|
| id | SERIAL PRIMARY KEY |
| device_code | VARCHAR(50) |
| log_message | TEXT |
| log_level | VARCHAR(20) |
| created_at | TIMESTAMP |

```

---

# FILE: BACKEND_ARCHITECTURE.md

```md
# Backend Architecture

## Backend Framework

FastAPI

## Responsibilities

- API development
- Database communication
- WebSocket streaming
- Alert processing
- Telemetry aggregation
- Device management

## Main Modules

### app/main.py
Application entry point.

### app/models/
SQLAlchemy models.

### app/routes/
REST API endpoints.

### app/services/
Business logic.

### app/websocket/
Live telemetry broadcasting.

### app/generator/
Telemetry simulation logic.

### app/utils/
Helper utilities.

## API Design

### Device APIs

GET /api/devices
GET /api/devices/{id}

### Telemetry APIs

GET /api/telemetry/latest
GET /api/telemetry/history

### Alert APIs

GET /api/alerts

### Dashboard APIs

GET /api/dashboard/summary

## WebSocket Design

Endpoint:
/ws/live

Purpose:
Push real-time telemetry to frontend.

## Telemetry Processing Flow

Generator → Validation → DB Insert → Alert Engine → WebSocket Broadcast

## Alert Engine

Example Rules:

- Pump temperature > 50°C
- Tank water level < 20%
- DG fuel < 15%
- HVAC RPM abnormal

## Background Jobs

Scheduler Tasks:

- Generate telemetry
- Cleanup old logs
- Archive historical records
- Calculate analytics

```

---

# FILE: FRONTEND_ARCHITECTURE.md

```md
# Frontend Architecture

## Frontend Framework

React + Vite

## UI Design Goal

Create a modern industrial SCADA-style dashboard.

## Design Theme

Dark mode industrial UI.

Color Indicators:

- Green = Healthy
- Yellow = Warning
- Red = Critical
- Blue = Informational

## Main Pages

### Dashboard Page

Contains:
- Infrastructure overview cards
- Live charts
- Active alerts
- Device summary

### Devices Page

Contains:
- Device table
- Status indicators
- Device metrics

### Analytics Page

Contains:
- Historical trends
- Consumption analytics
- Power usage graphs

### Alerts Page

Contains:
- Critical alerts
- Warning notifications
- Alert history

## Reusable Components

### SummaryCard
Displays KPIs.

### DeviceStatusCard
Displays device health.

### TelemetryChart
Displays line charts.

### AlertPanel
Displays active warnings.

### Sidebar
Navigation panel.

### Navbar
Top navigation.

## Suggested Layout

Sidebar + Main Content Layout

## State Management

Use React Context or Zustand.

## API Communication

Axios

## Real-Time Updates

WebSocket integration.

```

---

# FILE: TELEMETRY_GENERATOR.md

```md
# Telemetry Generator Design

## Purpose

Simulate realistic RS485/Modbus telemetry data.

## Generator Responsibilities

- Generate random telemetry values
- Mimic infrastructure behavior
- Trigger faults and warnings
- Insert records into database

## Simulation Logic

### Water Pump

Behavior:
- Voltage fluctuates slightly
- Temperature rises while running
- Current increases under load

### Water Tank

Behavior:
- Water level gradually decreases
- Pump refills when level low

### DG Generator

Behavior:
- Fuel slowly decreases
- Temperature rises during active mode

### HVAC System

Behavior:
- RPM fluctuates
- Temperature changes with load

## Random Event Simulation

Examples:

- Device offline event
- Overheat warning
- Low fuel warning
- Voltage fluctuation
- Emergency fire alert

## Generation Frequency

Every 5 seconds.

## Sample Flow

1. Generate values
2. Validate thresholds
3. Determine status
4. Insert into database
5. Create alerts if needed
6. Broadcast through WebSocket

## Realism Strategy

Data should evolve gradually rather than changing randomly.

Example:

Bad:
25°C → 48°C instantly

Good:
25°C → 27°C → 29°C → 31°C

```

---

# FILE: UI_UX_GUIDELINES.md

```md
# UI/UX Guidelines

## Goal

Create a professional industrial monitoring dashboard.

## Inspiration

- SCADA systems
- Smart building dashboards
- Industrial control panels
- Energy monitoring platforms

## UI Style

Modern dark dashboard.

## Recommended Layout

- Left sidebar navigation
- Top navbar
- Grid-based content
- Responsive cards

## Dashboard Sections

### Top KPI Cards

- Online Devices
- Active Alerts
- Average Temperature
- Power Usage

### Live Infrastructure Map

Optional future enhancement.

### Device Status Grid

Real-time device monitoring.

### Charts Section

- Temperature trends
- Power usage
- Water level history

### Alerts Feed

Shows latest warnings.

## Animations

- Smooth chart updates
- Status pulse animations
- Alert blinking

## Responsive Design

Must support:

- Desktop
- Tablet
- Mobile

## User Experience Goals

- Easy monitoring
- Quick alert visibility
- Minimal clutter
- Fast data readability

```

---

# FILE: API_CONTRACTS.md

```md
# API Contracts

## Device APIs

### GET /api/devices

Response:

[
  {
    "deviceCode": "PUMP-01",
    "status": "RUNNING"
  }
]

---

### GET /api/devices/{deviceCode}

Response:

{
  "deviceCode": "PUMP-01",
  "temperature": 42,
  "voltage": 228
}

---

## Telemetry APIs

### GET /api/telemetry/latest

Response:

[
  {
    "deviceCode": "PUMP-01",
    "metricName": "temperature",
    "metricValue": 42
  }
]

---

### GET /api/telemetry/history

Query Params:
- deviceCode
- metricName
- from
- to

---

## Alert APIs

### GET /api/alerts

Response:

[
  {
    "deviceCode": "DG-01",
    "severity": "HIGH",
    "message": "Fuel level low"
  }
]

---

## Dashboard APIs

### GET /api/dashboard/summary

Response:

{
  "onlineDevices": 7,
  "activeAlerts": 2,
  "avgTemperature": 36
}

```

---

# FILE: DEPLOYMENT_PLAN.md

```md
# Deployment Plan

## Frontend Deployment

Recommended:
- Vercel

## Backend Deployment

Recommended:
- Render
- Railway

## Database Hosting

Recommended:
- Neon PostgreSQL
- Supabase PostgreSQL

## Deployment Architecture

React Frontend → FastAPI Backend → PostgreSQL

## Environment Variables

### Backend

DATABASE_URL=
SECRET_KEY=
WEBSOCKET_URL=

### Frontend

VITE_API_URL=
VITE_WS_URL=

## Production Features

- CORS configuration
- Logging
- Error handling
- Health check endpoint
- Docker support

## Suggested Docker Setup

Services:
- frontend
- backend
- postgres

```

---

# FILE: FUTURE_ENHANCEMENTS.md

```md
# Future Enhancements

## Hardware Integration

Replace generator with:
- Actual RS485 devices
- Modbus TCP gateways
- MQTT brokers

## AI Features

- Predictive maintenance
- Fault prediction
- Usage forecasting
- Anomaly detection

## Advanced Analytics

- Monthly energy reports
- Water consumption analysis
- Device efficiency scoring

## Mobile Application

Develop operator mobile dashboard.

## Notifications

- SMS alerts
- Email alerts
- Push notifications

## Role-Based Access

- Admin
- Operator
- Maintenance Engineer

## Multi-Building Monitoring

Support multiple apartment communities.

## GIS Visualization

Interactive infrastructure maps.

```

---

# FILE: ANTIGRAVITY_MASTER_PROMPT.md

```md
# Antigravity AI Master Prompt

Build a complete industrial-style IoT monitoring dashboard application named:

"Smart Apartment Infrastructure Monitoring Dashboard"

## Core Goal

The application simulates industrial RS485/Modbus telemetry data for smart apartment infrastructure systems.

No physical hardware should be used.

A Python telemetry generator should continuously generate realistic infrastructure data and store it in PostgreSQL.

The backend should expose REST APIs and WebSocket streams.

The frontend should display real-time infrastructure monitoring dashboards.

## Tech Stack

Frontend:
- React
- Vite
- TailwindCSS
- Recharts

Backend:
- FastAPI
- SQLAlchemy
- WebSocket support

Database:
- PostgreSQL

## Devices to Simulate

1. Underground Water Pump
2. Diesel Generator
3. Elevator Controller
4. Basement HVAC System
5. Main Energy Meter
6. Water Tank Sensor
7. Fire Alarm Panel
8. Solar Inverter

## Backend Requirements

- Modular FastAPI architecture
- REST APIs
- WebSocket streaming
- SQLAlchemy models
- Pydantic schemas
- Background telemetry generator
- Alert engine
- Docker-ready setup

## Frontend Requirements

- Modern industrial dark UI
- Responsive layout
- Realtime charts
- Device overview cards
- Alerts panel
- Analytics pages
- Sidebar navigation
- Live telemetry updates

## Dashboard Features

- Infrastructure overview
- Live device status
- Historical charts
- Alerts monitoring
- Device analytics
- Infrastructure KPIs

## Telemetry Simulation Requirements

- Generate realistic infrastructure values
- Gradual data fluctuations
- Random warning/fault conditions
- Device online/offline simulation
- Water level simulation
- Fuel usage simulation
- Power fluctuation simulation

## Alert Rules

- High temperature
- Low fuel
- Low water level
- Voltage fluctuation
- Device offline

## UI Design Style

SCADA-inspired industrial monitoring dashboard.

Dark mode.

Use status colors:
- Green
- Yellow
- Red
- Blue

## Expected Output

Generate:
- Full backend implementation
- Full frontend implementation
- Database schema
- Docker configuration
- Seed scripts
- Telemetry generator
- Reusable React components
- Charts and dashboards
- API integrations
- WebSocket implementation
- Clean folder structure
- Production-ready architecture

```

