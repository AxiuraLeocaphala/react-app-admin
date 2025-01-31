import { useState } from "react";

import { CurrentTheme } from "./../../../../../../other/theme";
import { setCookie } from "./../../../../../../other/cookie";
import "./switchTheme.css";

const SwitchTheme = () => {
    const [isDarkTheme, setIsDarkTheme] = useState(CurrentTheme() === "dark" ? true:false)

    const handleClickSwitch = () => {
        document.documentElement.setAttribute("data-theme", isDarkTheme ? "light":"dark");
        setCookie("theme", isDarkTheme ? "light":"dark")
        setIsDarkTheme(prevState => !prevState);
    }

    return (
        <div className="row switch-theme">
            Светлая тема 
            <div className={`switch-wrapper ${isDarkTheme ? "off":"on"}`} onClick={handleClickSwitch}>
                <div className='switch'></div>
            </div>
        </div>
    )
}

export default SwitchTheme