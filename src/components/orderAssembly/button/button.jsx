import { useRef } from "react";
import { webSocket } from "../../../request/wsAdminPanel"
import "./button.css"

function wsSend(order) {
    webSocket.send(
        JSON.stringify({
            contentType: "completedOrder",
            orderId: order["OrderId"],
            userId: order["UserId"]
        })
    )
}

const Button = ({ order }) => {
    const btnRef = useRef(null)

    const handleClickBtn = () => {
        if (btnRef.current.classList.value === "active") {
            wsSend(order);
        } else {
            const handleClickBody = () => {
                if (btnRef.current.classList.value === "active") {
                    //if(btnRef.current.closest(".order").querySelector("table").classList.value === null) {
                    btnRef.current.classList.remove("active");
                    btnRef.current.innerHTML = "Собран";
                    document.body.removeEventListener("click", handleClickBody);
                } else {
                    btnRef.current.classList.add("active");
                    btnRef.current.innerHTML = "Подтвердить сборку";
                }
            }

            document.body.addEventListener("click", handleClickBody);
        }
    } 

    return (
        <div className="btn-space">
            <button onClick={handleClickBtn} ref={btnRef}>Собран</button>
        </div>
    )
}

export default Button 