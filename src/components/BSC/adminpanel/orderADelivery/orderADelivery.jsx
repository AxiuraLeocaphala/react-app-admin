import { useEffect, useRef, useState } from "react";

import { useMainContext } from "../../../context/mainContext";
import MainHeader from "../mainHeader/mainHeader";
import Table from "./table/table";
import HeaderRight from "./headerRight/headerRight";
import PopupCheckCodeReceive from "./popup/popupCheckCodeReceive";
import "./orderADelivery.css";

const OrderADelivery = ({ listOrders }) => {
    const columnRef = useRef();
    const orderList = useRef();
    const [isPopupShow, setIsPopupShow] = useState(false);
    const { view, targetOrderADeliveryPopup } = useMainContext();

    const activePopup = () => {
        setIsPopupShow(prevState => !prevState);
    }

    useEffect(() => {
        if (targetOrderADeliveryPopup) {
            columnRef.current.style.overflow = "";
            orderList.current.scrollTo({
                top: targetOrderADeliveryPopup.offsetTop - 60,
                behavior: 'smooth'
            })
        }
    }, [targetOrderADeliveryPopup])

    return (
        <div className="column-wrapper">
            {view === "ADelivery" && (<MainHeader/>)}
            <div className="column" ref={columnRef}>
                <div className="column-header">
                    <div className="header-top third">
                        Ожидают выдачи 
                        <div className="order-counter">
                            {listOrders.ADelivery.length}
                        </div>
                    </div>
                </div>
                <HeaderRight activePopup={activePopup}/>
                <div className="order-list" ref={orderList} style={view === "Confirm" ? {height: "calc(100vh - 86px)"}:{}}>
                    {listOrders.ADelivery.map((order, id) => {
                        return <Table key={id} order={order}/>
                    })}
                </div>
                {isPopupShow && <PopupCheckCodeReceive activePopup={activePopup} columnRef={columnRef}/>}
            </div>
        </div>
    )
}

export default OrderADelivery;