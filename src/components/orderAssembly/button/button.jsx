import { webSocket } from "../../../request/wsAdminPanel"
import "./button.css"

const Button = ({ order }) => {
    const handleClickBtn = () => {
        webSocket.send(
            JSON.stringify({
                contentType: "completedOrder",
                orderId: order["OrderId"],
                userId: order["UserId"]
            })
        )
    } 

    return (
        <div className="button-space">
            <button onClick={handleClickBtn}>Собран</button>
        </div>
    )
}

export default Button 