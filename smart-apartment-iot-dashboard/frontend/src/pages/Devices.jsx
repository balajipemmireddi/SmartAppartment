import React, { useEffect, useState } from 'react'
import { DeviceCard } from '../components'
import { useStore } from '../store/useStore'
import { deviceAPI } from '../services/api'

export default function Devices() {
  const { devices, setDevices } = useStore()
  const [loading, setLoading] = useState(true)
  const [deviceMetrics, setDeviceMetrics] = useState({})
  
  useEffect(() => {
    loadDevices()
  }, [])
  
  const loadDevices = async () => {
    try {
      setLoading(true)
      const res = await deviceAPI.getAll()
      setDevices(res.data)
      
      // Load metrics for each device
      const metrics = {}
      for (const device of res.data) {
        try {
          const metricsRes = await deviceAPI.getMetrics(device.device_code)
          metrics[device.device_code] = metricsRes.data.metrics
        } catch (error) {
          console.error(`Error loading metrics for ${device.device_code}:`, error)
        }
      }
      setDeviceMetrics(metrics)
    } catch (error) {
      console.error('Error loading devices:', error)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading devices...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Devices</h1>
        <p className="text-gray-400">Total devices: {devices.length}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {devices.map((device) => (
          <DeviceCard
            key={device.device_code}
            device={device}
            metrics={deviceMetrics[device.device_code]}
          />
        ))}
      </div>
    </div>
  )
}
