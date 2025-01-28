import { createContext, useContext, useEffect, useState } from 'react';

const MainContext = createContext(null);

export const useMainContext = () => useContext(MainContext);

export const MainProvider = ({ children, url }) => {
    const [webSocket, setWebSocket] = useState(null);
    const [view, setView] = useState("GeneralView");
    const [priceList, setPriceList] = useState();
    const [stateCreationOrders, setCreationOrders] = useState(null)
    const [errMsgShowADeliveryPopup, setErrMsgShowADeliveryPopup] = useState(false);
    const [targetOrderADeliveryPopup, setTargetOrderADeliveryPopup] = useState();
    const [errMsgADeliveryPopup, setErrMsgADeliveryPopup] = useState();
    const [visibilityState, setVisibilityState] = useState({});
    const [login, setLogin] = useState();
    const [password, setPassword] = useState();
    const [isLoadingNewWorker, setIsLoadingNewChangeWorker] = useState();
    // eslint-disable-next-line
    const [workers, setWorkers] = useState([]);
    
    useEffect(() => {
        const ws = new WebSocket(url);
        setWebSocket(ws);

        ws.onclose = () => {
            ws.onopen = ws.onclose = ws.onmessage = ws.onerror = null;
        }
    }, [url])

    const SetVisibilityState = (componentId, isVisible) => {
        setVisibilityState(prevState => ({
            ...prevState,
            [componentId]: isVisible
        }))
    }

    const SetArrayWorkers = (arrayWorkers) => {
        setWorkers(arrayWorkers);
    }

    const AddNewWorker = (newWorker) => {
        setWorkers(prevState => {
            return [
                ...prevState,
                newWorker
            ]
        })
    }

    const SetLoginPassword = (loginNewWorker, passwordNewWorker) => {
        SetStateLoading()
        setLogin(loginNewWorker);
        setPassword(passwordNewWorker);
    }

    const SetStateLoading = () => {
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

    const SetCreationOrders = (state) => {
        setCreationOrders(state)
    }

    const SetErrMsgShowADeliveryPopup = (state) => {
        setErrMsgShowADeliveryPopup(state)
    }

    const SetTargetOrderADeliveryPopup = (targetOrder) => {
        setTargetOrderADeliveryPopup(targetOrder);
    }

    const SetErrMsgADeliveryPopup = (error) => {
        setErrMsgADeliveryPopup(error);
    }

    return (
        <MainContext.Provider value={
            {
                webSocket, 
                SetVisibilityState,
                visibilityState,
                SetArrayWorkers,
                workers,
                AddNewWorker,
                SetLoginPassword,
                login,
                password,
                setIsLoadingNewChangeWorker,
                isLoadingNewWorker,
                SetStateLoading,
                SetView,
                view,
                SetPriceList,
                priceList,
                SetCreationOrders,
                stateCreationOrders,
                SetErrMsgShowADeliveryPopup,
                errMsgShowADeliveryPopup,
                SetTargetOrderADeliveryPopup,
                targetOrderADeliveryPopup,
                SetErrMsgADeliveryPopup,
                errMsgADeliveryPopup
            }
        }>
            {children}
        </MainContext.Provider>
    )
}