import { useMainContext } from "../../../context/mainContext";
import MainHeader from "../mainHeader/mainHeader";
import Buttons from "./buttons/buttons"
import "./orderConfirm.css";

const OrderConfirm = ({ listOrders }) => {
    const { view } = useMainContext();

    return (
        <div className="column-wrapper">
            {view === "Confirm" && (<MainHeader/>)}
            <div className="column">
                <div className="column-header">
                    <div className="header-top first">
                        Ожидают принятия
                        <div className="order-counter">
                            {listOrders.oConfirmation.length}
                        </div>
                    </div>
                </div>
                <div className="order-list" style={view === "Confirm" ? {height: "calc(100vh - 86px)"}:{}}>
                    {listOrders.oConfirmation.map((order, id) => {
                        return (
                            <div key={id} className="order confirm">
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
                    })}
                </div>
            </div>
        </div>
    )
}

export default OrderConfirm; 