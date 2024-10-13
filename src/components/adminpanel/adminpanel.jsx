import { webSocket } from "./../../request/wsAdminPanel";
import { useEffect, useState, useRef, memo } from "react"
import { ScheduleRefreshTokens, CancelRefreshTokens } from "../../other/updateTokens";
import OrderConfirm from '../orderConfir/orderConfirm';
import OrderAssembly from "../orderAssembly/orderAssembly";
import OrderADelivery from "../orderADelivery/orderADelivery";
import { currentThem } from "../../other/them";
import { UserAgent } from "../../other/userAgent";
import QualifierError from "../../request/_qualifierError";
import CameraSVGBlack from "./../../other/picture/Camera-black.svg";
import CameraSVGWhite from "./../../other/picture/Camera-white.svg";
import PasswordSVGBlack from "./../../other/picture/Password-black.svg";
import PasswordSVGWhite from "./../../other/picture/Password-white.svg";
import "./adminpanel.css";

const AdminPanel = () => {
    const [view, setView] = useState("ADelivery");
    const timerRef = useRef(null);
    const [listOrders, setListOrders] = useState(null);
    const columnAssemblyRef = useRef(null);
    const [CameraSVG, setCameraSVG] = useState(null);
    const [PasswordSVG, setPasswordSVG] = useState(null);
    const [positionBtnsADelivery, setPositionBtnsADelivery] = useState("right");

    useEffect(() => {
        ScheduleRefreshTokens(timerRef)
        return () => {
            CancelRefreshTokens(timerRef)
        }
    })
    
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", currentThem());
        if (currentThem() === "dark") {
            setCameraSVG(CameraSVGBlack);
            setPasswordSVG(PasswordSVGBlack);
        } else {
            setCameraSVG(CameraSVGWhite);
            setPasswordSVG(PasswordSVGWhite);
        }
    }, [])

    webSocket.onmessage = e => {
        const data = JSON.parse(e.data)
        if (data.contentType === "listOrders") {
            setListOrders(data);
        }
        else if (data.contentType === "rejectAcceptOrder") {
            if (data.action === "reject") {
                setListOrders(prevListOrders => {
                    const updateConfirmation = prevListOrders.oConfirmation.filter(order => {
                        if (order["OrderId"] === data.orderId && order["UserId"] === data.userId) {
                            return false;
                        }
                        return true;
                    })

                    return {
                        ...prevListOrders,
                        oConfirmation: updateConfirmation
                    }
                })
            } else if (data.action === "accept") {
                setListOrders(prevListOrders => {
                    const updateConfirmation = prevListOrders.oConfirmation.filter(order => {
                        if (order["OrderId"] === data.orderId && order["UserId"] === data.userId) {
                            return false;
                        }
                        return true;
                    })

                    const updateAssembly = [
                        ...prevListOrders.oAssembly,
                        ...prevListOrders.oConfirmation.filter(order => 
                            order["OrderId"] === data.orderId && order["UserId"] === data.userId
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
        }
        else if (data.contentType === "completedOrder") {
            setListOrders(prevListOrders => {
                const updateAssembly = prevListOrders.oAssembly.filter(order => 
                    !(order["OrderId"] === data.orderId && order["UserId"] === data.userId)
                );

                const updateADelivery = [
                    ...prevListOrders.ADelivery,
                    ...prevListOrders.oAssembly.filter(order => 
                        order["OrderId"] === data.orderId && order["UserId"] === data.userId 
                    ).map(order => ({
                        ...order,
                        Status: "Adelivery"
                    }))
                ];
                
                console.log(updateAssembly, updateADelivery);

                return {
                    ...prevListOrders,
                    oAssembly: updateAssembly,
                    ADelivery: updateADelivery
                };
            })
        }
    }

    const handleClickBtnSelect = (e) => {
        if (UserAgent.isMobile()) {
            if (e.target.className === "GeneralView") {
                QualifierError("It is not possible to open the general view on the phone");
            } else if (e.target.className === "ADelivery") {
                setPositionBtnsADelivery("right");
            }
        } else {
            setView(e.target.className);
            setPositionBtnsADelivery("top");
        }
    }

    const handleScanQr = () => {
        console.log('click on scan qr')
        /*TODO: Добавить логику для сканирования qr-кода после установки ssl*/
    }

    const handleInputPassword = () => {
        console.log('click on input password')

    }

    const handleRejectAccept = (orderId, userId, action) => {
        webSocket.send(
            JSON.stringify({
                contentType: "rejectAcceptOrder",
                orderId: orderId, 
                userId: userId, 
                action: action
            })
        );
    }

    const handleAssemblyOrder = (orderId, userId) => {
        webSocket.send(
            JSON.stringify({
                contentType: "completedOrder",
                orderId: orderId,
                userId: userId
            })
        )
    }

    const MemorisedOrderConfirm = memo(OrderConfirm);
    const MemoriesOrderAssembly = memo(OrderAssembly);
    const MemoriesOrderADelivery = memo(OrderADelivery); 

    if (!view){
        return (
            <div className="select-workspace">
                <h4>выберите рабочую зону</h4>
                <div className="btn-space">
                    <button className="Confirm" onClick={handleClickBtnSelect}>принятие заказов</button>
                    <button className="Assembly"  onClick={handleClickBtnSelect}>сборка заказов</button>
                    <button className="ADelivery"  onClick={handleClickBtnSelect}>выдача заказов</button>
                    <button className="GeneralView"  onClick={handleClickBtnSelect}>общий вид</button>
                </div>
            </div>
        )
    } else {
        if (listOrders){
            return (
                <div  className="main">
                    {["Confirm", "GeneralView"].includes(view) && (
                        <div className="column">
                            <div className="column-header">
                                Ожидают принятия
                                <div className="order-counter">
                                    {listOrders.oConfirmation.length}
                                </div>
                            </div> 
                            {listOrders.oConfirmation.map((order) => {
                                return (
                                    <MemorisedOrderConfirm
                                        key={order["OrderId"]}
                                        order={order}
                                        handleRejectAccept={handleRejectAccept}
                                    />
                                )
                            })}
                        </div>
                    )}
                    {["Assembly", "GeneralView"].includes(view) && (
                        <div className="column" ref={columnAssemblyRef}>
                            <div className="column-header">
                                В сборке 
                                <div className="order-counter">
                                    {listOrders.oAssembly.length}
                                </div> 
                            </div> 
                            {listOrders.oAssembly.map((order) => {
                                return (
                                    <MemoriesOrderAssembly
                                        key={order["OrderId"]}
                                        order={order}
                                        columnRef={columnAssemblyRef}
                                        handleAssemblyOrder={handleAssemblyOrder}
                                    />
                                )
                            })}
                        </div>
                    )}
                    {["ADelivery", "GeneralView"].includes(view) && (
                        <div className="column">
                            <div className="column-header">
                                <div className="header-top">
                                    Ожидают выдачи 
                                    <div className="order-counter">
                                        {listOrders.ADelivery.length}
                                    </div>
                                </div>
                                <div className={`header-bottom ${positionBtnsADelivery}`}>
                                    {!UserAgent.isMobile() && (
                                        <div className="wrapper-fringe">
                                            <div className="slide left"></div>
                                            <div className="slide-background"></div>
                                            <div className="fringe" onClick={handleScanQr}>
                                                <img src={CameraSVG} alt="" />
                                            </div>
                                            <div className="slide right"></div>
                                            <div className="slide-background"></div>
                                        </div>
                                    )}
                                    <div className="wrapper-fringe">
                                        <div className="slide left"></div>
                                        <div className="slide-background"></div>
                                        <div className="fringe"onClick={handleInputPassword}>
                                            <img src={PasswordSVG} alt="" />
                                        </div>
                                        <div className="slide right"></div>
                                        <div className="slide-background"></div>
                                    </div>
                                </div>
                            </div> 
                            {listOrders.ADelivery.map((order) => {
                                return (
                                    <MemoriesOrderADelivery
                                        key={order["OrderId"]}
                                        order={order}
                                    />
                                )
                            })}
                        </div>
                    )}
                </div>
            )
        }
    }
}

export default AdminPanel;