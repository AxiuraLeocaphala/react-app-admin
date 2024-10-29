import {useRef} from 'react';
import Button from "./button/button";
import "./orderAssembly.css";

const OrderAssembly = ({ order, columnRef }) => {
    const tableRef = useRef(null);

    const handleClickTable = (e) => {
        if (e.target.closest('.btn-space') === null) {
            const activeTable = columnRef.current.querySelector("table.active");
            activeTable && (activeTable.classList.remove("active"));
            tableRef.current.classList.add("active");
            // По ws сообщить всем о выделении заказа
        }
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
                            <tr key={id} className="row-product">
                                <td className="product-quantity">{product["Quantity"]}</td>
                                <td className="product-name" colSpan={1}>{product["ProductName"]}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <Button order={order}/>
        </div>
    )
}

export default OrderAssembly  