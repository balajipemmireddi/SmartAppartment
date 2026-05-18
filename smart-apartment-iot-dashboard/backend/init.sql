-- Create database if not exists
CREATE DATABASE smart_apartment;

-- Connect to the database
\c smart_apartment;

-- Create devices table
CREATE TABLE IF NOT EXISTS devices (
    id SERIAL PRIMARY KEY,
    device_code VARCHAR(50) UNIQUE NOT NULL,
    device_name VARCHAR(100) NOT NULL,
    device_type VARCHAR(50) NOT NULL,
    location VARCHAR(100) NOT NULL,
    installed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'ONLINE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create telemetry table
CREATE TABLE IF NOT EXISTS telemetry (
    id SERIAL PRIMARY KEY,
    device_code VARCHAR(50) NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    metric_value FLOAT NOT NULL,
    metric_unit VARCHAR(20),
    status VARCHAR(20) DEFAULT 'NORMAL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (device_code) REFERENCES devices(device_code) ON DELETE CASCADE
);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
    id SERIAL PRIMARY KEY,
    device_code VARCHAR(50) NOT NULL,
    alert_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    FOREIGN KEY (device_code) REFERENCES devices(device_code) ON DELETE CASCADE
);

-- Create device_logs table
CREATE TABLE IF NOT EXISTS device_logs (
    id SERIAL PRIMARY KEY,
    device_code VARCHAR(50) NOT NULL,
    log_message TEXT NOT NULL,
    log_level VARCHAR(20) DEFAULT 'INFO',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (device_code) REFERENCES devices(device_code) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_telemetry_device_code ON telemetry(device_code);
CREATE INDEX idx_telemetry_created_at ON telemetry(created_at);
CREATE INDEX idx_alerts_device_code ON alerts(device_code);
CREATE INDEX idx_alerts_created_at ON alerts(created_at);
CREATE INDEX idx_device_logs_device_code ON device_logs(device_code);
CREATE INDEX idx_device_logs_created_at ON device_logs(created_at);
