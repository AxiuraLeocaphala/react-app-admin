import { useState, useEffect } from "react";
import { useMainContext } from "./../../../../../context/mainContext";
import { CurrentTheme } from "./../../../../../../other/theme";
import ArrowBlack from "./../../../../../../other/picture/Arrow-black.svg";
import ArrowWhite from "./../../../../../../other/picture/Arrow-white.svg";
import Product from "./product/product";
import "./stopList.css";

const StopList = () => {
    const [isTurned, setTurned] = useState(false);
    const arrow = CurrentTheme() === "dark" ? (ArrowBlack):(ArrowWhite);
    const { webSocket, priceList } = useMainContext();

    const handleClickArrow = () => {
        if (!isTurned) {
            webSocket.send(JSON.stringify({
                "contentType": "getPriceList"
            }))
        }
        setTurned(prevState => !prevState)
    }

    return (
        <>
            <div className="row stop-list">
                Стоп-лист
                <div className={`arrow ${isTurned ? ("turned"):("")}`} onClick={handleClickArrow}>
                    <img src={arrow} alt=''/>
                </div>
            </div>
            {isTurned && priceList && (
                <div className="priceList-container">
                    <button className="btn-save">Сохранить</button>
                    <div className="description">
                        * Если поднять флаг в столбце «Стоп», то соответствующее 
                        ему блюдо окажется в стол-листе — заказать его будет невозможно 
                        с момента поднятия флага <br/>
                        * Число, указанное в столбце «Макс.», означает максимальное 
                        кол-во порций в одном заказе
                    </div>
                    <div className="header-table">
                        <span className="hdr-state">Стоп</span>
                        <span className="hdr-name">Название</span>
                        <span className="hdr-max">Макс.</span>
                    </div>
                    <div className="priceList">
                        {priceList.map((product, id) => {
                            return <Product key={id} product={product}/>
                        })}
                    </div>
                </div>
            )}
        </>
    )
}

export default StopList;