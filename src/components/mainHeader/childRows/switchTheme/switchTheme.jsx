import { useState } from "react";
import { currentTheme } from "./../../../../other/them";
import { setCookie } from "../../../../other/cookie";
import "./switchTheme.css";

const SwitchTheme = () => {
    const [isLightTheme, setLightTheme] = useState(currentTheme() === "light" ? true:false);

    const handleClickSwitch1 = () => {
        setLightTheme(prevState => !prevState);
        document.documentElement.setAttribute("data-theme", isLightTheme ? "dark":"light");
        setCookie("them", isLightTheme ? "dark":"light")
    }

    return (
        <div className="row switch-theme">
            Светлая тема 
            <div className={`switch-wrapper ${isLightTheme ? "on":"off"}`} onClick={handleClickSwitch1}>
                <div className='switch'></div>
            </div>
        </div>
    )
}

export default SwitchTheme