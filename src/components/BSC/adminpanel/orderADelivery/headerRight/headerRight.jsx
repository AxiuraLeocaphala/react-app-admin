import { useEffect } from "react";

import { User } from "./../../../../../other/user";
import { CurrentTheme } from "./../../../../../other/theme"
import CameraSVGBlack from "./../../../../../other/picture/Camera-black.svg";
import CameraSVGWhite from "./../../../../../other/picture/Camera-white.svg";
import PasswordSVGBlack from "./../../../../../other/picture/Password-black.svg";
import PasswordSVGWhite from "./../../../../../other/picture/Password-white.svg";
import "./headerRight.css";

const HeaderRight = ({ activePopup }) => {
    const theme = CurrentTheme();
    const cameraSVG = theme === "dark" ? (CameraSVGBlack):(CameraSVGWhite);
    const passwordSVG = theme === "dark" ? (PasswordSVGBlack):(PasswordSVGWhite);

    const handleScanQr = () => {
        console.log('click on scan qr')
        /*TODO: Добавить логику для сканирования qr-кода после установки ssl*/
    }

    useEffect(() => {
    }, [theme]);

    return (
        <div className="header-right">
            {User.isMobile() && (
                <div className="wrapper-fringe">
                    <div className="slide left"></div>
                    <div className="slide-background"></div>
                    <div className="fringe" onClick={handleScanQr}>
                        <img src={cameraSVG} alt="" />
                    </div>
                    <div className="slide right"></div>
                    <div className="slide-background"></div>
                </div>
            )}
            <div className="wrapper-fringe">
                <div className="fringe" onClick={activePopup}>
                    <img src={passwordSVG} alt="" />
                </div>
            </div>
        </div>
    )
}

export default HeaderRight;