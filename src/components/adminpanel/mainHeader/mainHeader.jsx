import { useState } from 'react';

import SwitchTheme from "./childRows/switchTheme.jsx";
import SwitchWorkarea from "./childRows/switchWorkarea.jsx";
import Workers from "./childRows/workers.jsx";
import StopList from "./childRows/stopList.jsx";
import SwitchReceive from "./childRows/switchReceive.jsx";
import FormAddChangeWorker from "./childRows/formAddChangeWorker.jsx";
import TimeAcceptanceOrder from "./childRows/timeAcceptanceOrder.jsx";
import { getCookie } from './../../../utils/cookie.js';
import "./../../../style/mainHeader.css";

const MainHeader = () => {
    const [isExpanded, setExpanded] = useState(false);
    const [showFormAddChangeWorker, setShowAddChangeWorker] = useState(false);
    const [workerInfo, setWorkerInfo] = useState();
    const role = getCookie("roleWorker")

    const visibleFormAddChangeWorker = (workerInfo) => {
        setShowAddChangeWorker(prevState => !prevState);
        if (workerInfo) {
            setWorkerInfo(workerInfo);
        }
    }

    return (
        <div className="main-header-wrapper">
            <div className={`main-header ${isExpanded ? "expanded":""}`} onClick={() => {setExpanded(prevState => !prevState)}}>
                МЕНЮ
            </div>
            <div className={`surface-main-header ${isExpanded ? "expanded":""}`}>
                {isExpanded && (
                    <>
                        {showFormAddChangeWorker && (
                            <FormAddChangeWorker visibleFormAddChangeWorker={visibleFormAddChangeWorker} workerInfo={workerInfo} setWorkerInfo={setWorkerInfo}/>
                        )}
                        {role === "admin" && (
                            <>
                                <StopList/>
                                <TimeAcceptanceOrder/>
                                <Workers visibleFormAddChangeWorker={visibleFormAddChangeWorker}/>
                                <SwitchReceive/>
                            </>
                        )}
                        <SwitchTheme/>
                        <SwitchWorkarea/>
                    </>
                )}
            </div>
        </div>
    )
}

export default MainHeader;