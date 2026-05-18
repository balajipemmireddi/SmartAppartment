import React, { useEffect, useState } from 'react'
import { AlertPanel } from '../components'
import { useStore } from '../store/useStore'
import { alertAPI } from '../services/api'

export default function Alerts() {
  const { alerts, setAlerts } = useStore()
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('active')
  
  useEffect(() => {
    loadAlerts()
    const interval = setInterval(loadAlerts, 5000)
    return () => clearInterval(interval)
  }, [filter])
  
  const loadAlerts = async () => {
    try {
      setLoading(true)
      let res
      if (filter === 'active') {
        res = await alertAPI.getActive(100)
      } else if (filter === 'critical') {
        res = await alertAPI.getCritical()
      } else {
        res = await alertAPI.getAll(100)
      }
      setAlerts(res.data)
    } catch (error) {
      console.error('Error loading alerts:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleResolveAlert = async (alertId) => {
    try {
      await alertAPI.resolve(alertId)
      loadAlerts()
    } catch (error) {
      console.error('Error resolving alert:', error)
    }
  }
  
  if (loading && alerts.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading alerts...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-4">Alerts</h1>
        
        <div className="flex gap-2 mb-6">
          {['active', 'critical', 'all'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-dark-700 text-gray-400 hover:bg-dark-600'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      <AlertPanel alerts={alerts} onResolve={handleResolveAlert} />
    </div>
  )
}
