import React, { useEffect, useState } from 'react'
import { TelemetryChart } from '../components'
import { telemetryAPI } from '../services/api'

export default function Analytics() {
  const [loading, setLoading] = useState(true)
  const [temperatureData, setTemperatureData] = useState([])
  const [powerData, setPowerData] = useState([])
  const [selectedDevice, setSelectedDevice] = useState('PUMP-01')
  const [selectedMetric, setSelectedMetric] = useState('temperature')
  
  const devices = ['PUMP-01', 'DG-01', 'HVAC-01', 'METER-01', 'TANK-01', 'SOLAR-01']
  const metrics = {
    'PUMP-01': ['voltage', 'current', 'temperature', 'runtime'],
    'DG-01': ['fuel_level', 'load_percentage', 'engine_temperature', 'voltage', 'frequency'],
    'HVAC-01': ['fan_rpm', 'air_temperature', 'humidity', 'power_consumption'],
    'METER-01': ['voltage', 'current', 'power_factor', 'frequency', 'power_consumption'],
    'TANK-01': ['water_level', 'tank_pressure', 'refill_status'],
    'SOLAR-01': ['solar_output', 'battery_charge', 'grid_status'],
  }
  
  useEffect(() => {
    loadAnalytics()
  }, [selectedDevice, selectedMetric])
  
  const loadAnalytics = async () => {
    try {
      setLoading(true)
      
      // Load metric history
      const historyRes = await telemetryAPI.getMetricHistory(selectedDevice, selectedMetric, 24)
      const chartData = historyRes.data.data.map(d => ({
        timestamp: d.timestamp,
        [selectedMetric]: d.value,
      }))
      setTemperatureData(chartData)
      
      // Load power consumption data
      const powerRes = await telemetryAPI.getMetricHistory('METER-01', 'power_consumption', 24)
      const powerChartData = powerRes.data.data.map(d => ({
        timestamp: d.timestamp,
        power_consumption: d.value,
      }))
      setPowerData(powerChartData)
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading analytics...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-6">Analytics</h1>
      </div>
      
      {/* Device and Metric Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Select Device</label>
          <select
            value={selectedDevice}
            onChange={(e) => setSelectedDevice(e.target.value)}
            className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
          >
            {devices.map((device) => (
              <option key={device} value={device}>
                {device}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Select Metric</label>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
          >
            {metrics[selectedDevice]?.map((metric) => (
              <option key={metric} value={metric}>
                {metric.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TelemetryChart
          data={temperatureData}
          title={`${selectedDevice} - ${selectedMetric.replace(/_/g, ' ')}`}
          dataKey={selectedMetric}
          stroke="#3b82f6"
        />
        
        <TelemetryChart
          data={powerData}
          title="Building Power Consumption"
          dataKey="power_consumption"
          stroke="#10b981"
        />
      </div>
    </div>
  )
}
