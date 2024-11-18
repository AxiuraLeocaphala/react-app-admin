import { useEffect, useState, useRef, memo } from "react"
import { ScheduleRefreshTokens, CancelRefreshTokens } from "../../other/updateTokens";
import OrderConfirm from '../orderConfir/orderConfirm';
import OrderAssembly from "../orderAssembly/orderAssembly";
import OrderADelivery from "../orderADelivery/orderADelivery";
import { currentThem } from "../../other/them";
import { UserAgent } from "../../other/userAgent";
import QualifierError from "./../../ws/_qualifierError";
import CameraSVGBlack from "./../../other/picture/Camera-black.svg";
import CameraSVGWhite from "./../../other/picture/Camera-white.svg";
import PasswordSVGBlack from "./../../other/picture/Password-black.svg";
import PasswordSVGWhite from "./../../other/picture/Password-white.svg";
import PopupCheckCodeReceive from "../popup/CheckCodeReceive/popupCheckCodeReceive";
import { useVisibility} from "../orderADelivery/button/other/context";
import "./style/selectWorkspace.css";
import "./style/adminpanel.css";
import "./style/commonOrder.css";
import { useWebSocket } from "../../ws/wsContextAdminPanel";
import MainHeader from "../mainHeader/mainHeader";

const AdminPanel = () => {
    const [view, setView] = useState("GeneralView");
    const timerRef = useRef(null);
    const [listOrders, setListOrders] = useState(null);
    const columnAssemblyRef = useRef(null);
    const [CameraSVG, setCameraSVG] = useState(null);
    const [PasswordSVG, setPasswordSVG] = useState(null);
    const [popupIsShow, setPopupIsShow] = useState(false);
    const colADeliveryRef = useRef(null);
    const { setComponentVisibility } = useVisibility();
    const [errMsgShow, setErrMsgShow] = useState(false);
    const [errMsg, setErrMsg] = useState(null);
    const orderListADelivedy = useRef(null);
    const MemorisedOrderConfirm = memo(OrderConfirm);
    const MemoriesOrderAssembly = memo(OrderAssembly);
    const MemoriesOrderADelivery = memo(OrderADelivery);
    const webSocket = useWebSocket();

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", currentThem());

        if (currentThem() === "dark") {
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
                        setListOrders(req);
                        break;
                    case "newOrder":
                        setListOrders(prevListOrders => {
                            const updateConfirmation = [
                                ...prevListOrders.oConfirmation,
                                req.data.newOrder
                            ]
                            
                            return{
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
                        break
                }
            }
        }

        ScheduleRefreshTokens(timerRef)
        return () => {
            CancelRefreshTokens(timerRef);
        }
    }, [webSocket])

    const handleClickBtnSelect = (e) => {
        if (UserAgent.isMobile()) {
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
                            {["Confirm"].includes(view) && (<MainHeader/>)}
                            <div className="column">
                                <div className="column-header">
                                    <div className="header-top first">
                                        Ожидают принятия
                                        <div className="order-counter">
                                            {listOrders.oConfirmation.length}
                                        </div>
                                    </div>
                                </div>
                                <div className="order-list">
                                    {listOrders.oConfirmation.map((order) => {
                                        return (
                                            <MemorisedOrderConfirm
                                                key={order["OrderId"]}
                                                order={order}
                                            />
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                    {["Assembly", "GeneralView"].includes(view) && (
                        <div className="column-wrapper">
                            <MainHeader/>
                            <div className="column" ref={columnAssemblyRef}>
                                <div className="column-header">
                                    <div className="header-top second">
                                        В сборке 
                                        <div className="order-counter">
                                            {listOrders.oAssembly.length}
                                        </div>
                                    </div>
                                </div> 
                                <div className="order-list">
                                    {listOrders.oAssembly.map((order) => {
                                        return (
                                            <MemoriesOrderAssembly
                                                key={order["OrderId"]}
                                                order={order}
                                                columnRef={columnAssemblyRef}
                                            />
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                    {["ADelivery", "GeneralView"].includes(view) && (
                        <div className="column-wrapper">
                            {["ADelivery"].includes(view) && (<MainHeader/>)}
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
                                    {UserAgent.isMobile() && (
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
                                <div className="order-list" ref={orderListADelivedy}>
                                    {listOrders.ADelivery.map((order) => {
                                        return (
                                            <MemoriesOrderADelivery
                                                key={order["OrderId"]}
                                                order={order}
                                            />
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