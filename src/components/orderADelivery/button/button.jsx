import { webSocket } from "../../../request/wsAdminPanel";
import { useVisibility } from "./other/context";

const Button = ({ order }) => {
    const { visibilityState } = useVisibility();
    const isVisible = visibilityState[order["OrderId"]] || false;

    const handleClickBtn = () => {
        webSocket.send(JSON.stringify({
            "contentType": "orderIssued",
            "orderId": order["OrderId"],
            "userId": order["UserId"]
        }))
    }

    return (
        <>
            {isVisible && (
                <div className="btn-space">
                    <button onClick={handleClickBtn}>Заказ выдан</button>
                </div>
            )}
        </> 
    )
}

export default Button;