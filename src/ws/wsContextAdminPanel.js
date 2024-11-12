import { createContext, useContext, useEffect, useState  } from "react";

const WebSocketContext = createContext(null);

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children, url }) => {
    const [webSocket, setWebSocket] = useState(null);

    useEffect(() => {
        const ws = new WebSocket(url);
        setWebSocket(ws);

        ws.onclose = () => {
            ws.onclose = ws.onerror = ws.onopen = ws.onmessage = null;
        }

    }, [url])

    return (
        <WebSocketContext.Provider value={webSocket}>
            {children}
        </WebSocketContext.Provider>
    )
}
