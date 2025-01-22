import { useState } from "react";
import { useMainContext } from "../../../../other/mainContext";
import { currentTheme } from "../../../../other/them";
import ArrowBlack from "./../../../../other/picture/Arrow-black.svg";
import ArrowWhite from "./../../../../other/picture/Arrow-white.svg";
import "./stopList.css";

const StopList = () => {
    const [isTurned, setTurned] = useState(false);
    const arrow = currentTheme() === "dark" ? (ArrowBlack):(ArrowWhite);
    const { webSocket } = useMainContext();

    const handleClickArrow = () => {
        if (!isTurned) {
            webSocket.send(JSON.stringify({
                "contentType": "getPricelist"
            }))
        }
        setTurned(prevState => !prevState)
    }

    return (
        <div className="row stop-list">
            Стоп-лист
            <div className={`arrow ${isTurned ? ("turned"):("")}`} onClick={handleClickArrow}>
                <img src={arrow} alt=''/>
            </div>
        </div>
    )
}

export default StopList;