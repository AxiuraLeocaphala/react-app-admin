import { useEffect, useState } from "react";

import { useMainContext } from "../../context/mainContext";
import OrderConfirm from './orderConfirm/orderConfirm';
import OrderAssembly from "./orderAssembly/orderAssembly";
import OrderADelivery from "./orderADelivery/orderADelivery";
import "./style/adminpanel.css";
import "./style/commonOrder.css";

const AdminPanel = () => {
    const [listOrders, setListOrders] = useState(null);
    const { 
        webSocket, SetVisibilityState, SetArrayWorkers, 
        AddNewWorker, SetLoginPassword, SetStateLoading,
        view, SetPriceList, SetCreationOrders,
        SetErrMsgADeliveryPopup, SetTargetOrderADeliveryPopup, SetErrMsgShowADeliveryPopup
    } = useMainContext();
    
    useEffect(() => {
        if (webSocket) {
            webSocket.onmessage = e => {
                const req = JSON.parse(e.data);
                switch (req.contentType) {
                    case "listOrders":
                        setListOrders({oConfirmation: req.oConfirmation, oAssembly: req.oAssembly, ADelivery: req.ADelivery});
                        SetCreationOrders(req.stateCreatinonOrder);
                        break;
                    case "newOrder":
                        setListOrders(prevListOrders => {
                            const updateConfirmation = [
                                ...prevListOrders.oConfirmation,
                                req.data
                            ]
                            
                            return{
                                ...prevListOrders,
                                oConfirmation: updateConfirmation
                            }
                        })
                        break
                    case "removeNewOrder":
                        setListOrders(prevListOrders => {
                            const updateConfirmation = prevListOrders.filter(order => (
                                order['OrderId'] !== req.data.OrderId && order['UserId'] !== req.data.UserId
                            ))
                            
                            return {
                                ...prevListOrders,
                                oConfirmation: updateConfirmation
                            }
                        })
                        break
                    case "rejectAcceptOrder":
                        if (req.data.action === "reject") {
                            setListOrders(prevListOrders => {
                                const updateConfirmation = prevListOrders.oConfirmation.filter(order => {
                                    if (order["OrderId"] === req.data.orderId && order["UserId"] === req.data.userId) {
                                        return false;
                                    }
                                    return true;
                                })
            
                                return {
                                    ...prevListOrders,
                                    oConfirmation: updateConfirmation
                                }
                            })
                        } else if (req.data.action === "accept") {
                            setListOrders(prevListOrders => {
                                const updateConfirmation = prevListOrders.oConfirmation.filter(order => {
                                    if (order["OrderId"] === req.data.orderId && order["UserId"] === req.data.userId) {
                                        return false;
                                    }
                                    return true;
                                })
            
                                const updateAssembly = [
                                    ...prevListOrders.oAssembly,
                                    ...prevListOrders.oConfirmation.filter(order => 
                                        order["OrderId"] === req.data.orderId && order["UserId"] === req.data.userId
                                    ).map(order =>({
                                        ...order,
                                        Status: "assembly"
                                    }))
                                ]
                            
                                return {
                                    ...prevListOrders,
                                    oConfirmation: updateConfirmation,
                                    oAssembly: updateAssembly
                                };
                            });
                        };
                        break;
                    case "completedOrder":
                        setListOrders(prevListOrders => {
                            const updateAssembly = prevListOrders.oAssembly.filter(order => 
                                !(order["OrderId"] === req.data.orderId && order["UserId"] === req.data.userId)
                            );
            
                            const updateADelivery = [
                                ...prevListOrders.ADelivery,
                                ...prevListOrders.oAssembly.filter(order => 
                                    order["OrderId"] === req.data.orderId && order["UserId"] === req.data.userId 
                                ).map(order => ({
                                    ...order,
                                    Status: "Adelivery"
                                }))
                            ];
                            
                            return {
                                ...prevListOrders,
                                oAssembly: updateAssembly,
                                ADelivery: updateADelivery
                            };
                        })
                        break;
                    case "checkCodeReceive":
                        if (req.codeCorrect) {
                            setTimeout(() => {
                                SetErrMsgShowADeliveryPopup(false);
                                SetTargetOrderADeliveryPopup(document.getElementById(req.orderId));
                                SetVisibilityState(req.orderId, true);
                            }, 50)
                        } else {
                            SetErrMsgADeliveryPopup(`${req.errorMessage}`);
                            SetErrMsgShowADeliveryPopup(true);
                        }
                        break;
                    case "orderIssued":
                        setListOrders(prevListOrders => {
                            const updateADelivery = prevListOrders.ADelivery.filter(order => {
                                if (order["OrderId"] === req.data.orderId && order["UserId"] === req.data.userId) {
                                    return false;
                                }
                                return true;
                            })
            
                            return {
                                ...prevListOrders,
                                ADelivery: updateADelivery
                            }
                        })
                        break;
                    case "changeStateCreationOrders":
                        SetCreationOrders(req.data.newStateCreationOrders);
                        break;
                    case "getWorkers":
                        SetArrayWorkers(req.admins);
                        break;
                    case "addWorker":
                        AddNewWorker(req.newWorker);
                        SetLoginPassword(req.login, req.password)
                        break;
                    case "changeWorker":
                        SetArrayWorkers(prevArrayWorkers => {
                            const updateArrayWorkers = prevArrayWorkers.map(worker => {
                                if (worker["Worker_Id"] === req.updateWorker.Worker_Id) return req.updateWorker
                                return worker
                            })

                            return updateArrayWorkers
                        })
                        SetStateLoading()
                        break;
                    case "removeWorker":
                        SetArrayWorkers(prevArrayWorkers => {
                            const updateArrayWorkers = prevArrayWorkers.filter(worker => (
                                worker["Worker_Id"] !== req.id
                            ))
                            
                            return updateArrayWorkers
                        })
                        break
                    case "getPriceList":
                        SetPriceList(req.priceList)
                        break;
                    default:
                        console.log("unknow contentType");
                        break;
                }
            }
        }
    }, [webSocket])

    if (listOrders) {
        return (
            <div  className="main">
                {["Confirm", "GeneralView"].includes(view) && (
                    <OrderConfirm listOrders={listOrders}/>
                )}
                {["Assembly", "GeneralView"].includes(view) && (
                    <OrderAssembly listOrders={listOrders}/>
                )}
                {["ADelivery", "GeneralView"].includes(view) && (
                    <OrderADelivery listOrders={listOrders}/>
                )}
            </div>
        )
    }
}

export default AdminPanel;