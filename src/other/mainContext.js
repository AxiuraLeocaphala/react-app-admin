import { createContext, useContext, useEffect, useState } from 'react';

const MainContext = createContext(null);

export const useMainContext = () => useContext(MainContext);

export const MainProvider = ({ children, url }) => {
    const [webSocket, setWebSocket] = useState(null);
    const [visibilityState, setVisibilityState] = useState({});
    const [login, setLogin] = useState();
    const [password, setPassword] = useState();
    const [isLoadingNewWorker, setIsLoadingNewChangeWorker] = useState();
    const [view, setView] = useState("Assembly");
    const [priceList, setPriceList] = useState();
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

    const addNewWorker = (newWorker) => {
        setWorkers(prevState => {
            return [
                ...prevState,
                newWorker
            ]
        })
    }

    const setLoginPassword = (loginNewWorker, passwordNewWorker) => {
        setStateLoading()
        setLogin(loginNewWorker);
        setPassword(passwordNewWorker);
    }

    const setStateLoading = () => {
        setTimeout(() => {
            setIsLoadingNewChangeWorker(false);
        }, 1000)
    }

    const SetView = (view) => {
        setView(view)
    }

    const SetPriceList = (priceList) => {
        priceList.sort();
        setPriceList(priceList);
    }

    return (
        <MainContext.Provider value={
            {
                webSocket, 
                visibilityState,
                setComponentVisibility,
                workers,
                setArrayWorkers,
                addNewWorker,
                setLoginPassword,
                login,
                password,
                setIsLoadingNewChangeWorker,
                isLoadingNewWorker,
                setStateLoading,
                SetView,
                view,
                SetPriceList,
                priceList,
            }
        }>
            {children}
        </MainContext.Provider>
    )
}