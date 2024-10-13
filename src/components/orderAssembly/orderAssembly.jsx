import {useRef} from 'react';
import Button from "./button/button";
import "./orderAssembly.css";

const OrderAssembly = ({ order, columnRef, handleAssemblyOrder }) => {
    const tableRef = useRef(null);

    const handleClickTable = () => {
        const activeTable = columnRef.current.querySelector(".active");
        activeTable && (activeTable.classList.remove("active"));
        tableRef.current.classList.add("active");
        // По ws сообщить всем о выделении заказа
    }

    return (
        <div 
        className="order assembly"
        onClick={handleClickTable}
        >
            <table ref={tableRef}>
                <tbody>
                    <tr>
                        <td className="order-id" colSpan={2}>№ {order["OrderId"]}</td>
                    </tr>
                    {order.Products.map((product, id) => {
                        return (
                            <tr key={id}>
                                <td className="product-quantity">{product["Quantity"]}</td>
                                <td className="product-name" colSpan={1}>{product["ProductName"]}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <Button
            orderId={order["OrderId"]}
            userId={order["UserId"]}
            handleAssemblyOrder={handleAssemblyOrder}
            />
        </div>
    )
}

export default OrderAssembly  