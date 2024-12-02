import { createContext, useContext, useEffect, useState } from 'react';

const MainContext = createContext(null);

export const useMainContext = () => useContext(MainContext);

export const MainProvider = ({ children, url }) => {
    const [webSocket, setWebSocket] = useState(null);
    const [visibilityState, setVisibilityState] = useState({});
    // eslint-disable-next-line
    const [workers, setWorkers] = useState([]);
    
    useEffect(() => {
        const ws = new WebSocket(url);
        setWebSocket(ws);

        ws.onclose = () => {
            ws.onopen = ws.onclose = ws.onmessage = ws.onerror = null;
        }
    }, [url])

    const setComponentVisibility = (componentId, isVisible) => {
        setVisibilityState(prevState => ({
            ...prevState,
            [componentId]: isVisible
        }))
    }

    const setArrayWorkers = (arrayWorkers) => {
        setWorkers(arrayWorkers);
    }

    return (
        <MainContext.Provider value={
            {
                webSocket, 
                visibilityState,
                setComponentVisibility,
                setArrayWorkers
            }
        }>
            {children}
        </MainContext.Provider>
    )
}