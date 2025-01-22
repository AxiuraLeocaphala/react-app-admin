import { useState } from 'react';
import SwitchTheme from "./childRows/switchTheme/switchTheme";
import SwitchWorkArea from "./childRows/switchWorkArea/switchWorkArea";
import Workers from "./childRows/workers/workers";
import StopList from "./childRows/stopList/stopList";
import SwitchReceive from "./childRows/switchReceive/switchReceive";
import FormAddWorker from "./AddWorker/formAddWorker";
import "./mainHeader.css";

const MainHeader = ({stateCreationOrders}) => {
    const [isExpanded, setExpanded] = useState(true);
    const [showFormAddWorker, setShowAddWorker] = useState(false);

    const visibleFormAddWorker = () => {
        setShowAddWorker(prevState => !prevState)
    }

    return (
        <div className="main-header-wrapper">
            <div className={`main-header ${isExpanded ? "expanded":""}`} onClick={() => {setExpanded(prevState => !prevState)}}>
                МЕНЮ
            </div>
            <div className={`surface-main-header ${isExpanded ? "expanded":""}`}>
                {isExpanded && (
                    <>
                        {showFormAddWorker && (<FormAddWorker visibleFormAddWorker={visibleFormAddWorker}/>)}
                        <SwitchTheme/>
                        <SwitchWorkArea/>
                        <Workers visibleFormAddWorker={visibleFormAddWorker}/>
                        <StopList/>
                        <SwitchReceive stateCreationOrders={stateCreationOrders}/>
                    </>
                )}
            </div>
        </div>
    )
}

export default MainHeader;