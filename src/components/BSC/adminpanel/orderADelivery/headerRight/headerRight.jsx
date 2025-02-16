import { useState, useRef, useEffect } from "react";

import { User } from "./../../../../../other/user";
import { setCookie, getCookie } from "../../../../../other/cookie";
import { CurrentTheme } from "./../../../../../other/theme"
import { useMainContext } from "./../../../../context/mainContext";
import CameraSVGBlack from "./../../../../../other/picture/Camera-black.svg";
import CameraSVGWhite from "./../../../../../other/picture/Camera-white.svg";
import PasswordSVGBlack from "./../../../../../other/picture/Password-black.svg";
import PasswordSVGWhite from "./../../../../../other/picture/Password-white.svg";
import CrossSVGBkack from "./../../../../../other/picture/Cross-black.svg";
import CrossSVGWhite from "./../../../../../other/picture/Cross-white.svg";
import checkerPNG from "./../../../../../other/picture/checker.png";
import "./headerRight.css";

const HeaderRight = ({ activePopup }) => {
    const [savedDevice, setSavedDevice] = useState([getCookie("BarcodeScanerVendorId"), getCookie("BarcodeScanerProductId")]);
    const [connectedDevice, setConnectedDevice] = useState([])
    const [bufferDevice, setBufferDevice] = useState([]);
    const inputBarcodeRef = useRef();
    const { webSocket } = useMainContext();
    const theme = CurrentTheme();
    const isMobile = User.isMobile();
    const cameraSVG = theme === "dark" ? (CameraSVGBlack):(CameraSVGWhite);
    const passwordSVG = theme === "dark" ? (PasswordSVGBlack):(PasswordSVGWhite);
    const crossSVG = theme === "dark" ? (CrossSVGBkack):(CrossSVGWhite);

    const handleClickScanerPhone = () => {
        // действия, если пользовелей с телефоном
    }

    const handleClickScanerPC = async () => {
        if (!savedDevice[0]) {
            try {
                const device = await navigator.usb.requestDevice({ filters: [] })
                if (device) setBufferDevice([device['vendorId'], device['productId']]);
            } catch (error) {
                console.error(error)
            }
        }
    }
    
    const focusingTargetInput = (e) => {
        if (e.target.nodeName !== "INPUT") inputBarcodeRef.current.focus();
    }

    const getDevices = async () => {
        return await navigator.usb.getDevices();
    }

    const onConnectDevices = async () => {
        const devices = await getDevices();
        devices.forEach((device => {
            if (device["vendorId"].toString() === savedDevice[0] && device["productId"].toString() === savedDevice[1]) {
                setConnectedDevice([device["vendorId"], device["productId"]]);
                console.log("Conected device. VendorId: ", device["vendorId"], " productId: ", device["productId"])
            }
        }))
    }

    const onDisconnectDevices = async() => {
        const devices = await getDevices();
        let flag = true;
        devices.forEach((device => {
            if (device["vendorId"].toString() === connectedDevice[0] && device["productId"].toString() === connectedDevice[1]) {
                flag = false;
            }
        }))
        if (flag) {
            console.log("Disonected device. VendorId: ", connectedDevice[0], " productId: ", connectedDevice[1]);
            setConnectedDevice([undefined]);
        };
    }

    const wsSend = (code) => {
        const setRUS = ["А", "К", "Е", "Ц", "П", "М"];
        const setInvalidRUS = ["Ф", "Л", "У", "С", "З", "Ь"];
        const setENG = ["A", "K", "E", "C", "P", "M"];
        let currentLangChar;
        let convertedCode = ""

        if (setENG.includes(code[0])) currentLangChar = setENG
        else currentLangChar = setInvalidRUS

        for (const char of code) {
            if (currentLangChar.includes(char)) {
                convertedCode += setRUS[currentLangChar.indexOf(char)]
            } else convertedCode += char
        }

        webSocket.send(JSON.stringify({
            "contentType": "checkCodeReceive",
            "codeReceive": convertedCode
        }))
    }

    useEffect(() => {
        if (!isMobile) {
            onConnectDevices();
            document.addEventListener("click", focusingTargetInput);
            navigator.usb.addEventListener("connect", onConnectDevices);
            navigator.usb.addEventListener("disconnect", onDisconnectDevices);

            return () => {
                document.removeEventListener("click", focusingTargetInput);
                navigator.usb.removeEventListener("connect", onConnectDevices);
                navigator.usb.removeEventListener("disconnect", onDisconnectDevices);
            }
        }
    }, [])

    return (
        <div className="header-right">
            <div className="wrapper-fringe">
                <div className="slide left"></div>
                <div className="slide-background"></div>
                {isMobile ? (
                    <div className="fringe" onClick={handleClickScanerPhone}>
                        <img src={cameraSVG} alt="" />
                    </div>
                ):(
                    <>
                        <div className="fringe" onClick={handleClickScanerPC}>
                            <img src={cameraSVG} alt="" />
                            <span className={`status-indicator ${savedDevice[0] && connectedDevice[0] ? ("connected"):("disconnected")}`}></span>
                        </div>
                        {bufferDevice[0] && (
                            <div className="checker">
                                <img className="cross" src={crossSVG} alt="" onClick={() => setBufferDevice([undefined])}/>
                                <img className="barcode" src={checkerPNG} alt=""/>
                            </div>
                        )}
                    </>
                )}
                <div className="slide right"></div>
                <div className="slide-background"></div>
                <input 
                    ref={inputBarcodeRef}
                    id="0"
                    autoFocus={true}
                    className="input-barcode" 
                    type="text"
                    onInput={(e) => {
                        const value = e.target.value
                        if (value === "I can work") {
                            setSavedDevice([bufferDevice[0], bufferDevice[1]]);
                            setConnectedDevice([bufferDevice[0], bufferDevice[1]]);
                            setCookie("BarcodeScanerVendorId", bufferDevice[0]);
                            setCookie("BarcodeScanerProductId", bufferDevice[1]);
                            setBufferDevice([undefined]);
                            e.target.value = ""
                        } else if (value.length === 7 && value[0] === "!" && value[value.length - 1] === "!") {
                            wsSend(value.substring(1, value.length-1))
                            e.target.value = ""
                        }
                    }}
                />
            </div>
            <div className="wrapper-fringe">
                <div className="fringe" onClick={activePopup}>
                    <img src={passwordSVG} alt="" />
                </div>
            </div>
        </div>
    )
}

export default HeaderRight;
