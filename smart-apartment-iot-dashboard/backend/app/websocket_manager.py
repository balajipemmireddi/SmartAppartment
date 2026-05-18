"""WebSocket connection manager"""

from typing import List, Set
from fastapi import WebSocket
import json
from datetime import datetime

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
    
    async def connect(self, websocket: WebSocket):
        """Accept and register a new WebSocket connection"""
        await websocket.accept()
        self.active_connections.append(websocket)
        print(f"Client connected. Total connections: {len(self.active_connections)}")
    
    def disconnect(self, websocket: WebSocket):
        """Remove a disconnected WebSocket"""
        self.active_connections.remove(websocket)
        print(f"Client disconnected. Total connections: {len(self.active_connections)}")
    
    async def broadcast(self, message: dict):
        """Broadcast message to all connected clients"""
        if not self.active_connections:
            return
        
        message["timestamp"] = datetime.utcnow().isoformat()
        message_json = json.dumps(message)
        
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_text(message_json)
            except Exception as e:
                print(f"Error sending message: {e}")
                disconnected.append(connection)
        
        # Remove disconnected clients
        for connection in disconnected:
            self.disconnect(connection)
    
    async def broadcast_telemetry(self, device_code: str, metrics: dict):
        """Broadcast telemetry update"""
        await self.broadcast({
            "type": "telemetry",
            "device_code": device_code,
            "metrics": metrics
        })
    
    async def broadcast_alert(self, alert: dict):
        """Broadcast alert"""
        await self.broadcast({
            "type": "alert",
            "data": alert
        })
    
    async def broadcast_device_status(self, device_code: str, status: str):
        """Broadcast device status change"""
        await self.broadcast({
            "type": "device_status",
            "device_code": device_code,
            "status": status
        })

# Global connection manager
manager = ConnectionManager()
