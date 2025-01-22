import { useEffect, useState, useRef, memo } from "react"
import { ScheduleRefreshTokens, CancelRefreshTokens } from "../../other/updateTokens";
import OrderConfirm from '../orderConfir/orderConfirm';
import OrderAssembly from "../orderAssembly/orderAssembly";
import OrderADelivery from "../orderADelivery/orderADelivery";
import { currentTheme } from "../../other/them";
import { User } from "../../other/user";
import QualifierError from "../../other/_qualifierError";
import CameraSVGBlack from "./../../other/picture/Camera-black.svg";
import CameraSVGWhite from "./../../other/picture/Camera-white.svg";
import PasswordSVGBlack from "./../../other/picture/Password-black.svg";
import PasswordSVGWhite from "./../../other/picture/Password-white.svg";
import PopupCheckCodeReceive from "../popup/CheckCodeReceive/popupCheckCodeReceive";
import "./style/selectWorkspace.css";
import "./style/adminpanel.css";
import "./style/commonOrder.css";
import { useMainContext } from "../../other/mainContext";
import MainHeader from "../mainHeader/mainHeader";

const AdminPanel = () => {
    const [view, setView] = useState("GeneralView");
    const timerRef = useRef(null);
    const [listOrders, setListOrders] = useState(null);
    const [isCreationOrders, setCreationOrders] = useState(null)
    const columnAssemblyRef = useRef(null);
    const [CameraSVG, setCameraSVG] = useState(null);
    const [PasswordSVG, setPasswordSVG] = useState(null);
    const [popupIsShow, setPopupIsShow] = useState(false);
    const colADeliveryRef = useRef(null);
    const [errMsgShow, setErrMsgShow] = useState(false);
    const [errMsg, setErrMsg] = useState(null);
    const orderListADelivedy = useRef(null);
    const MemorisedOrderConfirm = memo(OrderConfirm);
    const MemoriesOrderAssembly = memo(OrderAssembly);
    const MemoriesOrderADelivery = memo(OrderADelivery);
    const { 
        webSocket, 
        setComponentVisibility,
        setArrayWorkers, 
        addNewWorker,
        setLoginPassword
    } = useMainContext();
    
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", currentTheme());

        if (currentTheme() === "dark") {
            setCameraSVG(CameraSVGBlack);
            setPasswordSVG(PasswordSVGBlack);
        } else {
            setCameraSVG(CameraSVGWhite);
            setPasswordSVG(PasswordSVGWhite);
        }

        if (webSocket) {
            webSocket.onmessage = e => {
                const req = JSON.parse(e.data);
                switch (req.contentType) {
                    case "listOrders":
                        setListOrders({oConfirmation: req.oConfirmation, oAssembly: req.oAssembly, ADelivery: req.ADelivery});
                        setCreationOrders(req.stateCreatinonOrder);
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
                            colADeliveryRef.current.style.overflow = "";
                            setTimeout(() => {
                                setPopupIsShow(false);
                                const targetOrder = document.getElementById(req.orderId);
                                orderListADelivedy.current.scrollTo({
                                    top: targetOrder.offsetTop - 60,
                                    behavior: 'smooth'
                                })
                                setComponentVisibility(req.orderId, true);
                            }, 50)
                        } else {
                            setErrMsg(`${req.errorMessage}`);
                            setErrMsgShow(true);
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
                        setCreationOrders(req.data.newStateCreationOrders);
                        break;
                    case "getWorkers":
                        setArrayWorkers(req.admins);
                        break;
                    case "addWorker":
                        addNewWorker(req.newWorker);
                        setLoginPassword(req.login, req.password)
                        break;
                    case "removeWorker":
                        setArrayWorkers(prevArrayWorkers => {
                            const updateArrayWorkers = prevArrayWorkers.filter(worker => (
                                worker["Worker_Id"] !== req.id
                            ))
                            
                            return updateArrayWorkers
                        })
                        break
                    case "getProcelist":
                        console.log(req)
                        break;
                    default:
                        console.log("unknow contentType");
                        break;
                }
            }
        }

        ScheduleRefreshTokens(timerRef)
        return () => {
            CancelRefreshTokens(timerRef);
        }
    }, [webSocket])

    const handleClickBtnSelect = (e) => {
        if (User.isMobile()) {
            if (e.target.className === "GeneralView") {
                QualifierError("It is not possible to open the general view on the phone");
            } else {
                setView(e.target.className);
            }
        } else {
            setView(e.target.className);
        }
    }

    const handleScanQr = () => {
        console.log('click on scan qr')
        /*TODO: Добавить логику для сканирования qr-кода после установки ssl*/
    }

    const handleInputPassword = () => {
        setPopupIsShow(true);
    }

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
                        <div className="column-wrapper">
                            {["Confirm"].includes(view) && (<MainHeader stateCreationOrders={isCreationOrders}/>)}
                            <div className="column">
                                <div className="column-header">
                                    <div className="header-top first">
                                        Ожидают принятия
                                        <div className="order-counter">
                                            {listOrders.oConfirmation.length}
                                        </div>
                                    </div>
                                </div>
                                <div className="order-list" style={view === "Confirm" ? {height: "calc(100vh - 86px)"}:{}}>
                                    {listOrders.oConfirmation.map((order) => {
                                        return (
                                            <MemorisedOrderConfirm key={order["OrderId"]} order={order}/>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                    {["Assembly", "GeneralView"].includes(view) && (
                        <div className="column-wrapper">
                            <MainHeader stateCreationOrders={isCreationOrders}/>
                            <div className="column" ref={columnAssemblyRef}>
                                <div className="column-header">
                                    <div className="header-top second">
                                        В сборке 
                                        <div className="order-counter">
                                            {listOrders.oAssembly.length}
                                        </div>
                                    </div>
                                </div> 
                                <div className="order-list" style={{height: "calc(100vh - 86px)"}}>
                                    {listOrders.oAssembly.map((order) => {
                                        return (
                                            <MemoriesOrderAssembly key={order["OrderId"]} order={order} columnRef={columnAssemblyRef}/>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                    {["ADelivery", "GeneralView"].includes(view) && (
                        <div className="column-wrapper">
                            {["ADelivery"].includes(view) && (<MainHeader stateCreationOrders={isCreationOrders}/>)}
                            <div className="column" ref={colADeliveryRef}>
                                <div className="column-header">
                                    <div className="header-top third">
                                        Ожидают выдачи 
                                        <div className="order-counter">
                                            {listOrders.ADelivery.length}
                                        </div>
                                    </div>
                                </div>
                                <div className="header-right">
                                    {User.isMobile() && (
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
                                        <div className="fringe"onClick={handleInputPassword}>
                                            <img src={PasswordSVG} alt="" />
                                        </div>
                                    </div>
                                </div>
                                <div className="order-list" ref={orderListADelivedy} style={view === "Confirm" ? {height: "calc(100vh - 86px)"}:{}}>
                                    {listOrders.ADelivery.map((order) => {
                                        return (
                                            <MemoriesOrderADelivery key={order["OrderId"]} order={order}/>
                                        )
                                    })}
                                </div>
                                {popupIsShow && (
                                    <PopupCheckCodeReceive
                                        setPopupIsShow={setPopupIsShow}
                                        colADeliveryRef={colADeliveryRef}
                                        setErrMsgShow={setErrMsgShow}
                                        errMsgShow={errMsgShow}
                                        setErrMsg={setErrMsg}
                                        etErrMsg={errMsg}
                                    />
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )
        }
    }
}

export default AdminPanel;