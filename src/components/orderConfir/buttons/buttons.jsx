import { webSocket } from "../../../request/wsAdminPanel"

const Buttons = ({ order }) => {
    const handleClickBtn = (e) => {
        let action;
        e.target.className === "reject" ? (action = "reject") : (action = "accept");
        webSocket.send(
            JSON.stringify({
                contentType: "rejectAcceptOrder",
                orderId: order["OrderId"], 
                userId: order["UserId"], 
                action: action
            })
        );
    }

    return (
        <div className="buttons-space">
            <button className="reject" onClick={handleClickBtn}>Отклонить</button>
            <button className="accept" onClick={handleClickBtn}>Принять</button>
        </div>
    )
}

export default Buttons;