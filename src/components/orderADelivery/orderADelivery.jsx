import Button from "./button/button";
import "./orderADelivery.css";

const OrderADelivery = ({ order }) => {
    return (
        <div className="order awaiting-delivery" id={order["OrderId"]}>
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
            <Button order={order}/>
        </div>
    )
}

export default OrderADelivery;