const WebSocketController = {
    _WebSocketClose(ws) {
        ws.onopen = ws.onclose = ws.onmessage = ws.onerror = null;
    },

    WindowController(ws) {
        window.addEventListener('beforeunload', () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.onclose = this._WebSocketClose(ws);
                ws.close();
            }
        })
    }
    
}

export default WebSocketController