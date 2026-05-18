import { useEffect, useRef } from 'react'
import { connectWebSocket } from '../services/api'
import { useStore } from '../store/useStore'

export const useWebSocket = () => {
  const wsRef = useRef(null)
  const { setWsConnected, setTelemetry, addAlert } = useStore()
  
  useEffect(() => {
    const handleMessage = (data) => {
      if (data.type === 'telemetry') {
        setTelemetry(data.device_code, data.metrics)
      } else if (data.type === 'alert') {
        addAlert(data.data)
      }
    }
    
    const handleError = (error) => {
      console.error('WebSocket error:', error)
      setWsConnected(false)
    }
    
    const handleClose = () => {
      console.log('WebSocket closed, attempting reconnect...')
      setWsConnected(false)
      // Attempt to reconnect after 3 seconds
      setTimeout(() => {
        console.log('Reconnecting WebSocket...')
        wsRef.current = connectWebSocket(handleMessage, handleError, handleClose)
        setWsConnected(true)
      }, 3000)
    }
    
    console.log('Initializing WebSocket connection...')
    wsRef.current = connectWebSocket(handleMessage, handleError, handleClose)
    
    // Set connected after a short delay to ensure connection is established
    const timer = setTimeout(() => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        setWsConnected(true)
        console.log('WebSocket is connected')
      }
    }, 500)
    
    return () => {
      clearTimeout(timer)
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [setWsConnected, setTelemetry, addAlert])
  
  return wsRef.current
}
