import {useState, useRef } from 'react';
import "./mainHeader.css";
import { currentThem } from '../../other/them';
import { setCookie } from '../../other/cookie';
import { useWebSocket } from '../../ws/wsContextAdminPanel';

function wsSend(webSocket) {
    webSocket.send(JSON.stringify({
        "contentType": "changeStateCreationOrders",
    }))
}

const MainHeader = ({stateCreationOrders}) => {
    const [isExpanded, setExpanded] = useState(true);
    const mainHeader = useRef(null);
    const [isLightTheme, setLightTheme] = useState(currentThem() === "light" ? true:false);
    const webSocket = useWebSocket(); 
    
    const handleClickMainHeader = () => {
        setExpanded(prevState => !prevState);
    }
    
    const handleClickSwitch1 = () => {
        setLightTheme(prevState => !prevState);
        document.documentElement.setAttribute("data-theme", isLightTheme ? "dark":"light");
        setCookie("them", isLightTheme ? "dark":"light")
    }

    const handleClickSwitch2 = () => {
        wsSend(webSocket);
    }

    return (
        <div className="main-header-wrapper">
            <div ref={mainHeader} className={`main-header ${isExpanded ? "expanded":""}`} onClick={handleClickMainHeader}>
                МЕНЮ
            </div>
            <div className={`surface-main-header ${isExpanded ? "expanded":""}`}>
                {isExpanded && (
                    <>
                        <div className="switch-theme">
                            Светлая тема 
                            <div className={`switch-wrapper ${isLightTheme ? "on":"off"}`} onClick={handleClickSwitch1}>
                                <div className='switch'></div>
                            </div>
                        </div>
                        <div className="add-worker">Сотрудники</div>
                        <div className="stop-list">Стоп-лист</div>
                        <div className="switch-receive">
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