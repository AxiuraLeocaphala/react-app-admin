import Buttons from "./buttons/buttons"
import "./orderConfirm.css";

const OrderConfirm = ({ order, handleRejectAccept }) => {
    return (
        <div className="order confirm">
            <table>
                <tbody>
                    <tr>
                        <td className="order-id" colSpan={2}>№ {order["OrderId"]}</td>
                        <td className="order-payment-method">{order["PaymentMethod"]}</td>
                    </tr>
                    {order.Products.map((product, id) => {
                        return (
                            <tr key={id}>
                                <td className="product-quantity">{product["Quantity"]}</td>
                                <td className="product-name" colSpan={1}>{product["ProductName"]}</td>
                                <td className="table-void"></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <Buttons
                orderId={order["OrderId"]}
                userId={order["UserId"]}
                handleRejectAccept={handleRejectAccept}
            />
        </div>
    )
}

export default OrderConfirm; 