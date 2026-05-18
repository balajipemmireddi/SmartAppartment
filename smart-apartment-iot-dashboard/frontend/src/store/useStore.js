import { create } from 'zustand'

export const useStore = create((set) => ({
  // Dashboard state
  dashboardSummary: null,
  setDashboardSummary: (summary) => set({ dashboardSummary: summary }),
  
  // Devices state
  devices: [],
  setDevices: (devices) => set({ devices }),
  
  // Telemetry state
  telemetry: {},
  setTelemetry: (deviceCode, data) => set((state) => ({
    telemetry: {
      ...state.telemetry,
      [deviceCode]: data,
    },
  })),
  
  // Alerts state
  alerts: [],
  setAlerts: (alerts) => set({ alerts }),
  addAlert: (alert) => set((state) => ({
    alerts: [alert, ...state.alerts],
  })),
  
  // WebSocket state
  wsConnected: false,
  setWsConnected: (connected) => set({ wsConnected: connected }),
  
  // Loading state
  loading: false,
  setLoading: (loading) => set({ loading }),
  
  // Error state
  error: null,
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}))
