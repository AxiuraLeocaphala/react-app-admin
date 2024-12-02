import {useState, useRef, useEffect} from 'react';
import "./mainHeader.css";
import { currentThem } from '../../other/them';
import { setCookie } from '../../other/cookie';
import { useMainContext } from '../../other/mainContext'
import ArrowBlack from '../../other/picture/Arrow-black.svg';
import ArrowWhite from '../../other/picture/Arrow-white.svg';

const MainHeader = ({stateCreationOrders}) => {
    const [isExpanded, setExpanded] = useState(true);
    const mainHeader = useRef(null);
    const [isLightTheme, setLightTheme] = useState(currentThem() === "light" ? true:false);
    const { webSocket, workers } = useMainContext();
    const [arrow, setArrow] = useState();
    const arrow0Ref = useRef();
    const arrow1Ref = useRef();
    const [isTurned0, setTurned0] = useState(false);
    const [isTurned1, setTurned1] = useState(false);

    useEffect(() => {
        if (currentThem() === "dark") {
            setArrow(ArrowBlack);
        } else {
            setArrow(ArrowWhite);
        }
    }, [])
    
    const handleClickMainHeader = () => {
        setExpanded(prevState => !prevState);
    }
    
    const handleClickSwitch1 = () => {
        setLightTheme(prevState => !prevState);
        document.documentElement.setAttribute("data-theme", isLightTheme ? "dark":"light");
        setCookie("them", isLightTheme ? "dark":"light")
    }

    const handleClickSwitch2 = () => {
        webSocket.send(JSON.stringify({
            "contentType": "changeStateCreationOrders",
        }))
    }

    const handleClickArrow = (arrowRef) => {
        if (arrowRef.current.id === '0') {
            if (!isTurned0) {
                webSocket.send(JSON.stringify({
                    "contentType": "getWorkers"
                }))
            }
            setTurned0(prevState => !prevState)
        } else {
            if (!isTurned1) {
                webSocket.send(JSON.stringify({
                    "contentType": "getPricelist"
                }))
            }
            setTurned1(prevState => !prevState)
        }
    }

    return (
        <div className="main-header-wrapper">
            <div ref={mainHeader} className={`main-header ${isExpanded ? "expanded":""}`} onClick={handleClickMainHeader}>
                МЕНЮ
            </div>
            <div className={`surface-main-header ${isExpanded ? "expanded":""}`}>
                {isExpanded && (
                    <>
                        <div className="row switch-theme">
                            Светлая тема 
                            <div className={`switch-wrapper ${isLightTheme ? "on":"off"}`} onClick={handleClickSwitch1}>
                                <div className='switch'></div>
                            </div>
                        </div>
                        <div className="row switch-workarea">
                            Сменить рабочую зону
                        </div>
                        <div className="row workers">
                            Сотрудники
                            <div className={`arrow ${isTurned0 ? ("turned"):("")}`} id='0' onClick={() => handleClickArrow(arrow0Ref)} ref={arrow0Ref}>
                                <img src={arrow} alt=''/>
                            </div>
                            {isTurned0 && (
                                workers !== undefined && (
                                    <div className="list-workers">
                                        {workers.map(worker => {
                                            return (
                                                <>
                                                    <div className="worker">
                                                        <span>{worker["FirstName"]} {worker["SecondName"]}</span>
                                                        <button>удалить</button>
                                                    </div>
                                                </>
                                            )
                                        })}
                                    </div>
                                )
                            )}
                        </div>
                        <div className="row stop-list">
                            Стоп-лист
                            <div className={`arrow ${isTurned1 ? ("turned"):("")}`} id='1' onClick={() => handleClickArrow(arrow1Ref)} ref={arrow1Ref}>
                                <img src={arrow} alt=''/>
                            </div>
                        </div>
                        <div className="row switch-receive">
                            Создавание новых заказов
                            <div className={`switch-wrapper ${stateCreationOrders ? "on":"off"}`} onClick={handleClickSwitch2}>
                                <div className='switch'></div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default MainHeader;