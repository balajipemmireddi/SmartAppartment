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
  
  return (
    <div className="bg-dark-700 border border-dark-600 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="timestamp"
            stroke="#9ca3af"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => {
              if (typeof value === 'string') {
                return new Date(value).toLocaleTimeString()
              }
              return value
            }}
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
            labelFormatter={(label) => {
              if (typeof label === 'string') {
                return new Date(label).toLocaleString()
              }
              return label
            }}
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
