import React from 'react'

export default function SummaryCard({ title, value, unit, icon: Icon, color = 'blue', trend }) {
  const colorClasses = {
    blue: 'bg-blue-900 border-blue-700 text-blue-400',
    green: 'bg-green-900 border-green-700 text-green-400',
    yellow: 'bg-yellow-900 border-yellow-700 text-yellow-400',
    red: 'bg-red-900 border-red-700 text-red-400',
  }
  
  return (
    <div className={`${colorClasses[color]} border rounded-lg p-6`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-3xl font-bold text-white">{value}</p>
            {unit && <p className="text-gray-400 text-sm">{unit}</p>}
          </div>
          {trend && (
            <p className={`text-xs mt-2 ${trend > 0 ? 'text-red-400' : 'text-green-400'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last hour
            </p>
          )}
        </div>
        {Icon && <Icon className="w-8 h-8 opacity-50" />}
      </div>
    </div>
  )
}
