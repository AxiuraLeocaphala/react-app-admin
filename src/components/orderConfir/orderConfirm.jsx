import Buttons from "./buttons/buttons"
import "./orderConfirm.css";

const OrderConfirm = ({ order }) => {    
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
                            <tr key={id} className="row-product">
                                <td className="product-quantity">{product["Quantity"]}</td>
                                <td className="product-name" colSpan={1}>{product["ProductName"]}</td>
                                <td className="product-price">{product["ProductPrice"]} ₽</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <Buttons order={order}/>
        </div>
    )
}

export default OrderConfirm; 