import { useState } from 'react';
import SwitchTheme from "./childRows/switchTheme/switchTheme";
import SwitchWorkArea from "./childRows/switchWorkArea/switchWorkArea";
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
                            <FormAddChangeWorker visibleFormAddChangeWorker={visibleFormAddChangeWorker} workerInfo={workerInfo}/>
                        )}
                        <SwitchTheme/>
                        <SwitchWorkArea/>
                        <Workers visibleFormAddChangeWorker={visibleFormAddChangeWorker}/>
                        <StopList/>
                        <SwitchReceive stateCreationOrders={stateCreationOrders}/>
                    </>
                )}
            </div>
        </div>
    )
}

export default MainHeader;