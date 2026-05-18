import React, { useEffect, useState } from 'react'
import { Zap, AlertTriangle, Thermometer, Droplets } from 'lucide-react'
import { SummaryCard, DeviceCard, AlertPanel, TelemetryChart } from '../components'
import { useStore } from '../store/useStore'
import { dashboardAPI, deviceAPI, alertAPI, telemetryAPI } from '../services/api'

export default function Dashboard() {
  const { dashboardSummary, setDashboardSummary, devices, setDevices, alerts, setAlerts } = useStore()
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState([])
  
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
      
      // Load telemetry for chart
      const telemetryRes = await telemetryAPI.getLatest(100)
      const chartData = telemetryRes.data
        .filter(t => t.metric_name === 'temperature')
        .slice(-20)
        .map(t => ({
          timestamp: t.created_at,
          temperature: t.metric_value,
        }))
      setChartData(chartData)
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
  
  return (
    <div className="p-6 space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
          title="Avg Temperature"
          value={dashboardSummary?.metrics?.avg_temperature || 0}
          unit="°C"
          icon={Thermometer}
          color="yellow"
        />
        <SummaryCard
          title="Power Usage"
          value={dashboardSummary?.metrics?.total_power_consumption || 0}
          unit="kW"
          icon={Zap}
          color="blue"
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TelemetryChart
          data={chartData}
          title="Temperature Trend"
          dataKey="temperature"
          stroke="#f59e0b"
        />
        <div className="bg-dark-700 border border-dark-600 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Devices Online</span>
              <span className="text-green-400 font-semibold">{dashboardSummary?.devices?.online || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Devices Offline</span>
              <span className="text-red-400 font-semibold">{dashboardSummary?.devices?.offline || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Critical Alerts</span>
              <span className="text-red-400 font-semibold">{dashboardSummary?.alerts?.critical || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">High Alerts</span>
              <span className="text-yellow-400 font-semibold">{dashboardSummary?.alerts?.high || 0}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Alerts */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Active Alerts</h2>
        <AlertPanel alerts={alerts} />
      </div>
      
      {/* Devices Grid */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Device Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {devices.map((device) => (
            <DeviceCard key={device.device_code} device={device} />
          ))}
        </div>
      </div>
    </div>
  )
}
