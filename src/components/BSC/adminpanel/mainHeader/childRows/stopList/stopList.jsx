import { useState, useEffect, useRef } from "react";

import { useMainContext } from "./../../../../../context/mainContext";
import { CurrentTheme } from "./../../../../../../other/theme";
import ArrowBlack from "./../../../../../../other/picture/Arrow-black.svg";
import ArrowWhite from "./../../../../../../other/picture/Arrow-white.svg";
import Product from "./product/product";
import "./stopList.css";

const StopList = () => {
    const { webSocket, priceList, setIsLoadingChangesPriceList, isLoadingChangesPriceList } = useMainContext();
    const [isTurned, setTurned] = useState(false);
    const [listChanged, setListChanged] = useState([]);
    const [isShowWarning, setIsShowWarning] = useState(false);
    const [isShowPriceList, setIsShowPriceList] = useState(true);
    const priceListContainerRef = useRef();
    const [height, setHeight] = useState("auto");
    // const [arrow, setArrow] = useState();
    const arrow = CurrentTheme() === "dark" ? (ArrowBlack):(ArrowWhite);

    const handleClickArrow = () => {
        if (!isTurned) {
            webSocket.send(JSON.stringify({
                "contentType": "getPriceList"
            }))
        }
        setTurned(prevState => !prevState)
    }

    const handleCickBtn = () => {
        if (listChanged.length > 0) {
            setHeight(`${priceListContainerRef.current.getBoundingClientRect().height}px`)
            setIsLoadingChangesPriceList(true);

            webSocket.send (JSON.stringify({
                "contentType": "updatePriceList",
                "updatePriceList": listChanged
            }))
            setListChanged([]);
            setIsShowPriceList(false)
        } else {
            setIsShowWarning(true);
            setTimeout(() => setIsShowWarning(false), 2500)
        }
    }

    useEffect(() => {
        if (!isLoadingChangesPriceList) {
            setTimeout(() => {
                setIsShowPriceList(true);
            }, 3000)
        }
    }, [isLoadingChangesPriceList]);

    return (
        <>
            <div className="row stop-list">
                Стоп-лист
                <div className={`arrow ${isTurned ? ("turned"):("")}`} onClick={handleClickArrow}>
                    <img src={arrow} alt=''/>
                </div>
            </div>
            {isTurned && priceList && (
                <div className="priceList-container" ref={priceListContainerRef} style={{height: height}}>
                    {isShowPriceList ? (
                        <>
                            <button className="btn-save" onClick={handleCickBtn}>
                                {!isShowWarning ? ("Сохранить"):("Внесите изменения или закройте форму")}
                            </button>
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
                                    return <Product 
                                        key={id} 
                                        product={product} 
                                        setListChanged={setListChanged} 
                                        listChanged={listChanged} 
                                        setIsShowWarning={setIsShowWarning}
                                    />
                                })}
                            </div>
                        </>
                    ):(
                        <div className="response-block">
                            {isLoadingChangesPriceList ? (
                                <span className="spoiler-container">
                                    <span className="shine"></span>
                                    <span className="spoiler">**********</span>
                                </span>
                            ):(
                                <>
                                    <span className="response-msg">Сохранено</span>
                                    <div className="loaderbar"></div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}
        </>
    )
}

export default StopList;