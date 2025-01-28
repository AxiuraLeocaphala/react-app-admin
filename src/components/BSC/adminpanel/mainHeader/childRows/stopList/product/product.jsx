import { useState } from "react";
import "./product.css";

const Product = ({ product, setListChanged }) => {
    const [isStop, setIsStop] = useState(product["Stop"]);
    const [maxQuantity, setMaxQuantity] = useState(product["MaxQuantity"])

    const handleChange = (source, value) => {
        if (source === "cheakBox") {
            if (isStop === product["Stop"]) {
                setListChanged(prevListChanged => {
                    let inPrevListChanged = false;
                    prevListChanged.forEach((prevProduct, id) => {
                        if (prevProduct["ProductId"] === product["ProductId"]) {
                            inPrevListChanged = true;
                        };
                    })

                    if (inPrevListChanged) {
                        const updateListChanged = prevListChanged.map((prevProduct) => {
                            if (prevProduct["ProductId"] === product["ProductId"]) {
                                return {
                                    "ProductId": product["ProductId"],
                                    "ProductName": product["ProductName"],
                                    "MaxQuantity": product["MaxQuantity"],
                                    "stop": !isStop
                                }
                            }
                        }) 

                        return updateListChanged;
                    } else {
                        return [
                            ...prevListChanged,
                            {
                                "ProductId": product["ProductId"],
                                "ProductName": product["ProductName"],
                                "MaxQuantity": product["MaxQuantity"],
                                "stop": !isStop
                            }
                        ]
                    }
                })
            }
            setIsStop(prevState => !prevState)
        } else {
            setMaxQuantity(value)
        }
    }

    return (
        <div className="product">
            <input 
                className="btn-checkBox" 
                type="checkBox" 
                checked={isStop} 
                onChange={(e) => handleChange("cheakBox", e.target.value)}
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
                onChange={(e) => handleChange("maxQuantity", e.target.value)}
            />
        </div>
    )
}

export default Product