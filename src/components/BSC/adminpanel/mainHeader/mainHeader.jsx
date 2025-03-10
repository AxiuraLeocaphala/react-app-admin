import { useState } from 'react';

import SwitchTheme from "./childRows/switchTheme/switchTheme";
import SwitchWorkarea from "./childRows/switchWorkArea/switchWorkarea";
import Workers from "./childRows/workers/workers";
import StopList from "./childRows/stopList/stopList";
import SwitchReceive from "./childRows/switchReceive/switchReceive";
import FormAddChangeWorker from "./AddChangeWorker/formAddChangeWorker";
import TimeAcceptanceOrder from "./childRows/timeAcceptanceOrder/timeAcceptanceOrder";
import { getCookie } from '../../../../other/cookie';
import "./mainHeader.css";

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