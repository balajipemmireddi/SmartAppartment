import React from 'react'
import { AlertTriangle, AlertCircle, X } from 'lucide-react'

export default function AlertPanel({ alerts, onResolve }) {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-dark-700 border border-dark-600 rounded-lg p-6 text-center">
        <p className="text-gray-400">No active alerts</p>
      </div>
    )
  }
  
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-900 border-red-700 text-red-400'
      case 'HIGH':
        return 'bg-yellow-900 border-yellow-700 text-yellow-400'
      case 'MEDIUM':
        return 'bg-orange-900 border-orange-700 text-orange-400'
      default:
        return 'bg-blue-900 border-blue-700 text-blue-400'
    }
  }
  
  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`${getSeverityColor(alert.severity)} border rounded-lg p-4 flex items-start justify-between`}
        >
          <div className="flex items-start gap-3 flex-1">
            {alert.severity === 'CRITICAL' ? (
              <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            )}
            <div className="flex-1">
              <p className="font-semibold text-white">{alert.device_code}</p>
              <p className="text-sm text-gray-300 mt-1">{alert.message}</p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(alert.created_at).toLocaleString()}
              </p>
            </div>
          </div>
          {onResolve && (
            <button
              onClick={() => onResolve(alert.id)}
              className="ml-4 p-1 hover:bg-black hover:bg-opacity-20 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
