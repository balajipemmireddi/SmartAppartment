import React, { useEffect, useState } from 'react'
import { Zap, AlertTriangle, Droplets, Activity, TrendingUp, Clock } from 'lucide-react'
import { SummaryCard, DeviceCard, AlertPanel, TelemetryChart } from '../components'
import { useStore } from '../store/useStore'
import { dashboardAPI, deviceAPI, alertAPI, telemetryAPI } from '../services/api'

export default function Dashboard() {
  const { dashboardSummary, setDashboardSummary, devices, setDevices, alerts, setAlerts } = useStore()
  const [loading, setLoading] = useState(true)
  const [temperatureChart, setTemperatureChart] = useState([])
  const [powerChart, setPowerChart] = useState([])
  const [waterLevelChart, setWaterLevelChart] = useState([])
  const [systemHealth, setSystemHealth] = useState(100)
  const [criticalDevices, setCriticalDevices] = useState([])
  
  useEffect(() => {
    loadDashboardData()
    const interval = setInterval(loadDashboardData, 10000) // Refresh every 10 seconds
    return () => clearInterval(interval)
  }, [])
  
  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Load dashboard summary
      const summaryRes = await dashboardAPI.getSummary()
      setDashboardSummary(summaryRes.data)
      
      // Load devices
      const devicesRes = await deviceAPI.getAll()
      setDevices(devicesRes.data)
      
      // Load active alerts
      const alertsRes = await alertAPI.getActive(10)
      setAlerts(alertsRes.data)
      
      // Calculate system health (based on online devices and alert severity)
      const onlineDevices = devicesRes.data.filter(d => d.status === 'ONLINE').length
      const totalDevices = devicesRes.data.length
      const criticalAlerts = alertsRes.data.filter(a => a.severity === 'CRITICAL').length
      const healthScore = Math.max(0, Math.min(100, 
        (onlineDevices / totalDevices * 80) + (Math.max(0, 20 - criticalAlerts * 5))
      ))
      setSystemHealth(Math.round(healthScore))
      
      // Get critical devices (devices with critical alerts)
      const criticalDevicesList = alertsRes.data
        .filter(a => a.severity === 'CRITICAL')
        .map(a => a.device_code)
        .filter((code, index, self) => self.indexOf(code) === index)
        .slice(0, 5)
      setCriticalDevices(criticalDevicesList)
      
      // Load telemetry for charts
      const telemetryRes = await telemetryAPI.getLatest(100)
      
      // Temperature chart
      const tempData = telemetryRes.data
        .filter(t => t.metric_name === 'temperature')
        .slice(-20)
        .map(t => ({
          timestamp: new Date(t.created_at).toLocaleTimeString(),
          temperature: parseFloat(t.metric_value.toFixed(1)),
        }))
      setTemperatureChart(tempData)
      
      // Power consumption chart
      const powerData = telemetryRes.data
        .filter(t => t.metric_name === 'power_consumption')
        .slice(-20)
        .map(t => ({
          timestamp: new Date(t.created_at).toLocaleTimeString(),
          power: parseFloat(t.metric_value.toFixed(1)),
        }))
      setPowerChart(powerData)
      
      // Water level chart
      const waterData = telemetryRes.data
        .filter(t => t.metric_name === 'water_level')
        .slice(-20)
        .map(t => ({
          timestamp: new Date(t.created_at).toLocaleTimeString(),
          water: parseFloat(t.metric_value.toFixed(1)),
        }))
      setWaterLevelChart(waterData)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading && !dashboardSummary) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }
  
  const getHealthColor = (score) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }
  
  const getHealthBgColor = (score) => {
    if (score >= 80) return 'bg-green-900 border-green-700'
    if (score >= 60) return 'bg-yellow-900 border-yellow-700'
    return 'bg-red-900 border-red-700'
  }

  return (
    <div className="p-6 space-y-6">
      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <SummaryCard
          title="Online Devices"
          value={dashboardSummary?.devices?.online || 0}
          unit={`/ ${dashboardSummary?.devices?.total || 0}`}
          icon={Zap}
          color="green"
        />
        <SummaryCard
          title="Active Alerts"
          value={dashboardSummary?.alerts?.total_active || 0}
          icon={AlertTriangle}
          color={dashboardSummary?.alerts?.total_active > 0 ? 'red' : 'blue'}
        />
        <SummaryCard
          title="Power Usage"
          value={dashboardSummary?.metrics?.total_power_consumption || 0}
          unit="kW"
          icon={Zap}
          color="blue"
        />
        <SummaryCard
          title="Water Level"
          value={dashboardSummary?.metrics?.avg_water_level || 0}
          unit="%"
          icon={Droplets}
          color="cyan"
        />
        <div className={`${getHealthBgColor(systemHealth)} border rounded-lg p-6`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">System Health</p>
              <div className="mt-2 flex items-baseline gap-2">
                <p className={`text-3xl font-bold ${getHealthColor(systemHealth)}`}>{systemHealth}%</p>
              </div>
              <div className="mt-3 w-full bg-dark-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    systemHealth >= 80 ? 'bg-green-500' : 
                    systemHealth >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${systemHealth}%` }}
                ></div>
              </div>
            </div>
            <Activity className="w-8 h-8 opacity-50" />
          </div>
        </div>
      </div>
      
      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TelemetryChart
          data={temperatureChart}
          title="Temperature Trend"
          dataKey="temperature"
          stroke="#f59e0b"
        />
        <TelemetryChart
          data={powerChart}
          title="Power Consumption"
          dataKey="power"
          stroke="#3b82f6"
        />
        <TelemetryChart
          data={waterLevelChart}
          title="Water Level Status"
          dataKey="water"
          stroke="#06b6d4"
        />
      </div>
      
      {/* System Status & Critical Devices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dark-700 border border-dark-600 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            System Status
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Devices Online</span>
              <span className="text-green-400 font-semibold">{dashboardSummary?.devices?.online || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Devices Offline</span>
              <span className="text-red-400 font-semibold">{dashboardSummary?.devices?.offline || 0}</span>
            </div>
            <div className="border-t border-dark-600 pt-3 mt-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Critical Alerts</span>
                <span className="text-red-400 font-semibold">{dashboardSummary?.alerts?.critical || 0}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-gray-400">High Alerts</span>
                <span className="text-yellow-400 font-semibold">{dashboardSummary?.alerts?.high || 0}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-dark-700 border border-dark-600 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            Critical Devices
          </h3>
          {criticalDevices.length > 0 ? (
            <div className="space-y-2">
              {criticalDevices.map((deviceCode) => {
                const device = devices.find(d => d.device_code === deviceCode)
                return (
                  <div key={deviceCode} className="flex items-center justify-between p-3 bg-red-900 bg-opacity-20 border border-red-700 rounded">
                    <div>
                      <p className="text-white font-medium">{device?.device_name || deviceCode}</p>
                      <p className="text-gray-400 text-sm">{device?.device_type}</p>
                    </div>
                    <span className="px-3 py-1 bg-red-600 text-white text-xs rounded-full font-semibold">Critical</span>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">✓ No critical devices</p>
              <p className="text-gray-500 text-sm">All systems operating normally</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Active Alerts */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recent Alerts
        </h2>
        <AlertPanel alerts={alerts} />
      </div>
      
      {/* Devices Grid */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Device Status Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {devices.map((device) => (
            <DeviceCard key={device.device_code} device={device} />
          ))}
        </div>
      </div>
    </div>
  )
}
