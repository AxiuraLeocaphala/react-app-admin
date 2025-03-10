import { createContext, useContext, useEffect, useState } from 'react';

const MainContext = createContext(null);

export const useMainContext = () => useContext(MainContext);

export const MainProvider = ({ children, url }) => {
    const [webSocket, setWebSocket] = useState();
    const [view, setView] = useState("GeneralView");
    const [priceList, setPriceList] = useState();
    const [stateCreationOrders, setCreationOrders] = useState()
    const [errMsgShowADeliveryPopup, setErrMsgShowADeliveryPopup] = useState(false);
    const [targetOrderADeliveryPopup, setTargetOrderADeliveryPopup] = useState();
    const [errMsgADeliveryPopup, setErrMsgADeliveryPopup] = useState();
    const [visibilityState, setVisibilityState] = useState({});
    const [login, setLogin] = useState();
    const [password, setPassword] = useState();
    const [isLoadingNewWorker, setIsLoadingNewChangeWorker] = useState();
    const [isLoadingChangesPriceList, setIsLoadingChangesPriceList] = useState();
    const [shutdownTime, setShutdownTime] = useState();
    // eslint-disable-next-line
    const [workers, setWorkers] = useState([]);
    

    let flag = true
    useEffect(() => {
        if (flag) {
            const ws = new WebSocket(url);
            setWebSocket(ws);
    
            ws.onclose = () => {
                ws.onopen = ws.onclose = ws.onmessage = ws.onerror = null;
            }

            ws.onerror = error => {
                console.error(error)
            }
            
            flag = false
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

    const UpdatePriceList = (updatePriceList) => {
        const idsProducts = updatePriceList.map(updateProduct => updateProduct["ProductId"])
        setPriceList(prevPriceList => {
            const updatedPriceList = prevPriceList.map(prevProduct => {
                if (idsProducts.includes(prevProduct["ProductId"])) {
                    const [targetProduct] = updatePriceList.filter(updateProduct => updateProduct["ProductId"] === prevProduct["ProductId"]);
                    return {
                        "ProductId": prevProduct["ProductId"],
                        "ProductName": prevProduct["ProductName"],
                        "MaxQuantity": targetProduct["MaxQuantity"],
                        "Stop": targetProduct["Stop"] ? (1):(0)
                    }
                }
                return prevProduct
            })
            return updatedPriceList
        })

        setTimeout(() => {
            setIsLoadingChangesPriceList(false);
        }, 2500)
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
                setVisibilityState,
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
                UpdatePriceList,
                priceList,
                SetCreationOrders,
                stateCreationOrders,
                SetErrMsgShowADeliveryPopup,
                errMsgShowADeliveryPopup,
                SetTargetOrderADeliveryPopup,
                targetOrderADeliveryPopup,
                SetErrMsgADeliveryPopup,
                errMsgADeliveryPopup,
                setIsLoadingChangesPriceList,
                isLoadingChangesPriceList,
                setShutdownTime,
                shutdownTime, 
            }
        }>
            {children}
        </MainContext.Provider>
    )
}