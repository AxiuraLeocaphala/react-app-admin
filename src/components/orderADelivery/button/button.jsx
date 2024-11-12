import { useRef } from "react";
import { useVisibility } from "./other/context";
import { useWebSocket } from "../../../ws/wsContextAdminPanel";
import "./button.css";

function wsSend(webSocket, order) {
    webSocket.send(JSON.stringify({
        "contentType": "orderIssued",
        "orderId": order["OrderId"],
        "userId": order["UserId"]
    }))
}

const Button = ({ order }) => {
    const { visibilityState } = useVisibility();
    const isVisible = visibilityState[order["OrderId"]] || false;
    const btnRef = useRef(null);
    const webSocket = useWebSocket();

    const handleClickBtn = () => {
        if (btnRef.current.classList.value === "active") {
            wsSend(webSocket, order);
        } else {
            const handleClickBody = () => {
                if (btnRef.current.classList.value === "active") {
                    document.body.removeEventListener("click", handleClickBody);
                    btnRef.current.classList.remove("active");
                    btnRef.current.innerHTML = "Заказ выдан";

                } else {
                    btnRef.current.classList.add("active");
                    btnRef.current.innerHTML = "Подтвердить выдачу";
                }
            }

            document.body.addEventListener("click", handleClickBody);
        }
    }

    return (
        <>
            {isVisible && (
                <div className="btn-space">
                    <button onClick={handleClickBtn} ref={btnRef}>Заказ выдан</button>
                </div>
            )}
        </> 
    )
}

export default Button;