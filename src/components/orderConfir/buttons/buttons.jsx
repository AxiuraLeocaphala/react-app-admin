import { useRef } from "react";
import { useMainContext } from "../../../other/mainContext";
import "./buttons.css"

function wsSend(webSocket, order, action) {
    webSocket.send(
        JSON.stringify({
            contentType: "rejectAcceptOrder",
            orderId: order["OrderId"], 
            userId: order["UserId"], 
            action: action
        })
    );
}

const Buttons = ({ order }) => {
    const rejectBtnRef = useRef(null);
    const acceptBtnRef = useRef(null);
    const { webSocket } = useMainContext();

    const handleClickBtn = (e) => {
        if (e.target.className.includes("reject")) {
            if (rejectBtnRef.current.classList.value === "reject active") {
                wsSend(webSocket, order, "reject");
            } else {
                if (acceptBtnRef.current.classList.value === "accept active") {
                    acceptBtnRef.current.classList.remove("active");
                    acceptBtnRef.current.innerHTML = "Принять";
                } else {
                    rejectBtnRef.current.classList.add("active");
                    rejectBtnRef.current.innerHTML = "Подтвердить отклонение";
                }
            }
        } else {
            if (acceptBtnRef.current.classList.value === "accept active") {
                wsSend(webSocket, order, "accept");
            } else {
                if (rejectBtnRef.current.classList.value === "reject active") {
                    rejectBtnRef.current.classList.remove("active");
                    rejectBtnRef.current.innerHTML = "Отклонить";
                } else {
                    acceptBtnRef.current.classList.add("active");
                    acceptBtnRef.current.innerHTML = "Подтвердить принятие";
                }
            }
        }
    }

    return (
        <div className="btn-space">
            <button className="reject" onClick={handleClickBtn} ref={rejectBtnRef}>Отклонить</button>
            <button className="accept" onClick={handleClickBtn} ref={acceptBtnRef}>Принять</button>
        </div>
    )
}

export default Buttons;