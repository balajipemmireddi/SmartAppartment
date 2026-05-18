import React from 'react'
import { Activity, AlertCircle, Wifi } from 'lucide-react'
import { useStore } from '../store/useStore'

export default function Navbar() {
  const { wsConnected, dashboardSummary } = useStore()
  
  return (
    <nav className="bg-dark-800 border-b border-dark-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="w-8 h-8 text-blue-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Smart Apartment IoT</h1>
            <p className="text-sm text-gray-400">Infrastructure Monitoring Dashboard</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          {dashboardSummary && (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">Active Alerts</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {dashboardSummary.alerts?.total_active || 0}
                </p>
              </div>
              
              {dashboardSummary.alerts?.critical > 0 && (
                <div className="flex items-center gap-2 bg-red-900 bg-opacity-30 px-3 py-2 rounded-lg border border-red-700">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <span className="text-red-400 font-semibold">
                    {dashboardSummary.alerts.critical} Critical
                  </span>
                </div>
              )}
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${wsConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span className="text-sm text-gray-400">
              {wsConnected ? 'Live' : 'Offline'}
            </span>
          </div>
        </div>
      </div>
    </nav>
  )
}
