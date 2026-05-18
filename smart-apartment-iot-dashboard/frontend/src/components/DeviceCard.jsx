import React from 'react'
import { Zap, AlertCircle, CheckCircle } from 'lucide-react'

const deviceTypeIcons = {
  PUMP: '💧',
  GENERATOR: '⚡',
  ELEVATOR: '🛗',
  HVAC: '❄️',
  METER: '📊',
  TANK: '🏺',
  FIRE_ALARM: '🔥',
  SOLAR: '☀️',
}

export default function DeviceCard({ device, metrics }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'ONLINE':
        return 'text-green-400'
      case 'OFFLINE':
        return 'text-red-400'
      case 'WARNING':
        return 'text-yellow-400'
      default:
        return 'text-gray-400'
    }
  }
  
  const getStatusBg = (status) => {
    switch (status) {
      case 'ONLINE':
        return 'bg-green-900 border-green-700'
      case 'OFFLINE':
        return 'bg-red-900 border-red-700'
      case 'WARNING':
        return 'bg-yellow-900 border-yellow-700'
      default:
        return 'bg-dark-700 border-dark-600'
    }
  }
  
  return (
    <div className={`${getStatusBg(device.status)} border rounded-lg p-4 hover:shadow-lg transition-shadow`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{deviceTypeIcons[device.device_type] || '🔧'}</span>
          <div>
            <h3 className="font-semibold text-white">{device.device_name}</h3>
            <p className="text-xs text-gray-400">{device.device_code}</p>
          </div>
        </div>
        <div className={`flex items-center gap-1 ${getStatusColor(device.status)}`}>
          {device.status === 'ONLINE' ? (
            <CheckCircle className="w-5 h-5" />
          ) : device.status === 'OFFLINE' ? (
            <AlertCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span className="text-xs font-semibold">{device.status}</span>
        </div>
      </div>
      
      <p className="text-xs text-gray-400 mb-3">{device.location}</p>
      
      {metrics && Object.keys(metrics).length > 0 && (
        <div className="space-y-2">
          {Object.entries(metrics).slice(0, 3).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center text-xs">
              <span className="text-gray-400 capitalize">{key.replace(/_/g, ' ')}</span>
              <span className="font-semibold text-white">
                {typeof value === 'object' ? value.value : value}
                {typeof value === 'object' && value.unit && ` ${value.unit}`}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
