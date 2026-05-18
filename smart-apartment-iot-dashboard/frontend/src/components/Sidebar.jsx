import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Zap, AlertTriangle, BarChart3, Settings } from 'lucide-react'

const menuItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/devices', label: 'Devices', icon: Zap },
  { path: '/alerts', label: 'Alerts', icon: AlertTriangle },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
]

export default function Sidebar() {
  const location = useLocation()
  
  return (
    <aside className="w-64 bg-dark-800 border-r border-dark-700 h-screen flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-dark-700 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
      
      <div className="p-4 border-t border-dark-700">
        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-400 hover:bg-dark-700 hover:text-white transition-colors">
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </aside>
  )
}
