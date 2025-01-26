import { useState } from 'react';
import SwitchTheme from "./childRows/switchTheme/switchTheme";
import SwitchWorkarea from "./childRows/switchWorkArea/switchWorkarea";
import Workers from "./childRows/workers/workers";
import StopList from "./childRows/stopList/stopList";
import SwitchReceive from "./childRows/switchReceive/switchReceive";
import FormAddChangeWorker from "./AddChangeWorker/formAddChangeWorker";
import "./mainHeader.css";

const MainHeader = ({stateCreationOrders}) => {
    const [isExpanded, setExpanded] = useState(true);
    const [showFormAddChangeWorker, setShowAddChangeWorker] = useState(false);
    const [workerInfo, setWorkerInfo] = useState();

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
                        <StopList/>
                        <Workers visibleFormAddChangeWorker={visibleFormAddChangeWorker}/>
                        <SwitchReceive stateCreationOrders={stateCreationOrders}/>
                        <SwitchTheme/>
                        <SwitchWorkarea/>
                    </>
                )}
            </div>
        </div>
    )
}

export default MainHeader;