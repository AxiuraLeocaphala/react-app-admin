import { useState } from "react";
import "./product.css";

const Product = ({ product }) => {
    const [isStop, setIsStop] = useState(product["Stop"]);
    const [maxQuantity, setMaxQuantity] = useState(product["MaxQuantity"])

    return (
        <div className="product">
            <input 
                className="btn-checkBox" 
                type="checkBox" 
                checked={isStop} 
                onChange={() => setIsStop(prevState => !prevState)}
            />
            <label className="nameProduct">{product["ProductName"]}</label>
            <input 
                className="maxQuantity"
                type="number" 
                value={maxQuantity}
                min="1"
                max="10"
                step="1"
                inputMode="numeric"
                pattern="\d+"
                onChange={e => setMaxQuantity(e.target.value)}
            />
        </div>
    )
}

export default Product