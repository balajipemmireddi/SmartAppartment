import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export default function TelemetryChart({ data, title, dataKey, stroke = '#3b82f6' }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-dark-700 border border-dark-600 rounded-lg p-6 h-80 flex items-center justify-center">
        <p className="text-gray-400">No data available</p>
      </div>
    )
  }
  
  // Format data to ensure timestamps are valid
  const formattedData = data.map(item => ({
    ...item,
    displayTime: (() => {
      try {
        const date = new Date(item.timestamp)
        if (isNaN(date.getTime())) return 'N/A'
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      } catch (e) {
        return 'N/A'
      }
    })()
  }))
  
  return (
    <div className="bg-dark-700 border border-dark-600 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="displayTime"
            stroke="#9ca3af"
            tick={{ fontSize: 12 }}
          />
          <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#fff' }}
            formatter={(value) => [value.toFixed(2), dataKey]}
            labelFormatter={(label) => label}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={stroke}
            dot={false}
            isAnimationActive={false}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
