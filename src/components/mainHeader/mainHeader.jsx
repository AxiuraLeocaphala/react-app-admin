import {useState, useRef, useEffect} from 'react';
import "./mainHeader.css";
import { currentThem } from '../../other/them';
import { setCookie } from '../../other/cookie';

const MainHeader = () => {
    const [isExpanded, setExpanded] = useState(true);
    const mainHeader = useRef(null);
    const [isLightTheme, setLightTheme] = useState(currentThem() === "light" ? true:false);
    
    const handleClickMainHeader = () => {
        setExpanded(prevState => !prevState);
    }
    
    const handleClickSwitch = () => {
        setLightTheme(prevState => !prevState);
        document.documentElement.setAttribute("data-theme", isLightTheme ? "dark":"light");
        setCookie("them", isLightTheme ? "dark":"light")
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
                            <div className={`switch-wrapper ${isLightTheme ? "on":"off"}`} onClick={handleClickSwitch}>
                                <div className='switch'></div>
                            </div>
                        </div>
                        <div className="switch-receive">
                            Получение новых заказов
                            <div className={`switch-wrapper ${isLightTheme ? "on":"off"}`}>
                                <div className='switch'></div>
                            </div>
                        </div>
                        <div className="add-worker">Сотрудники</div>
                        <div className="stop-list">Стоп-лист</div>
                    </>
                )}
            </div>
        </div>
    )
}

export default MainHeader;