import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Device APIs
export const deviceAPI = {
  getAll: () => api.get('/api/devices'),
  getById: (deviceCode) => api.get(`/api/devices/${deviceCode}`),
  getMetrics: (deviceCode) => api.get(`/api/devices/${deviceCode}/metrics`),
  getStatusSummary: () => api.get('/api/devices/status/summary'),
}

// Telemetry APIs
export const telemetryAPI = {
  getLatest: (limit = 100) => api.get('/api/telemetry/latest', { params: { limit } }),
  getDeviceTelemetry: (deviceCode, limit = 100) => 
    api.get(`/api/telemetry/device/${deviceCode}`, { params: { limit } }),
  getMetricHistory: (deviceCode, metricName, hours = 24) =>
    api.get(`/api/telemetry/device/${deviceCode}/metric/${metricName}`, { params: { hours } }),
  getMetricStats: (deviceCode, metricName, hours = 24) =>
    api.get(`/api/telemetry/device/${deviceCode}/metric/${metricName}/stats`, { params: { hours } }),
  getDashboardMetrics: () => api.get('/api/telemetry/dashboard/metrics'),
}

// Alert APIs
export const alertAPI = {
  getAll: (limit = 100) => api.get('/api/alerts', { params: { limit } }),
  getActive: (limit = 100) => api.get('/api/alerts', { params: { active_only: true, limit } }),
  getCritical: () => api.get('/api/alerts/critical'),
  getDeviceAlerts: (deviceCode, limit = 50) =>
    api.get(`/api/alerts/device/${deviceCode}`, { params: { limit } }),
  getSummary: () => api.get('/api/alerts/summary'),
  resolve: (alertId) => api.put(`/api/alerts/${alertId}/resolve`),
}

// Dashboard APIs
export const dashboardAPI = {
  getSummary: () => api.get('/api/dashboard/summary'),
  getOverview: () => api.get('/api/dashboard/overview'),
}

// WebSocket connection
export const connectWebSocket = (onMessage, onError, onClose) => {
  // Determine the correct WebSocket URL based on current location
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const host = window.location.host
  const wsUrl = `${protocol}//${host}/ws/live`
  
  console.log('Connecting to WebSocket:', wsUrl)
  
  const ws = new WebSocket(wsUrl)
  
  ws.onopen = () => {
    console.log('WebSocket connected successfully')
  }
  
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)
      onMessage(data)
    } catch (error) {
      console.error('Error parsing WebSocket message:', error)
    }
  }
  
  ws.onerror = (error) => {
    console.error('WebSocket error:', error)
    if (onError) onError(error)
  }
  
  ws.onclose = () => {
    console.log('WebSocket disconnected')
    if (onClose) onClose()
  }
  
  return ws
}

export default api
