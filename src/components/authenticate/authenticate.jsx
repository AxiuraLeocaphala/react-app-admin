import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import LP from "./loginPassword";
import QR from "./qrCode";
import { useMainContext } from "./../../context/mainContext.js";
import { CurrentTheme } from "./../../utils/theme.js"; 
import { setCookie } from "./../../utils/cookie.js";
import QualifierError from './../../error/_qualifierError.js'
import eye1 from './../../assets/images/eye1.svg';
import eye2 from './../../assets/images//eye2.svg';
import "./../../style/authenticate.css";

const Authenticate = () => {
    const { webSocket } = useMainContext();
    const [isOpenWS, setIsOpenWS] = useState(false);
    const [isShowLogin, setIsShowLogin] = useState(true);
    const [isShowQR, setIsShowQR] = useState(true)
    const [isVisiblePassword, setIsVisiblePassword] = useState(false)
    const [qrToken, setQRToken] = useState();
    const [isUnvalidInput, setIsUnvalidInput] = useState(false);
    const navigate = useNavigate();

    document.documentElement.setAttribute("data-theme", CurrentTheme());

    useEffect(() => {
        if (webSocket) {
            webSocket.onmessage = e => {
                const data = JSON.parse(e.data)
                if (data.contentType === "link"){
                    setQRToken(data.link);
                    setIsShowQR(true);
                } else if (data.contentType === "2FA"){
                    if (data.stat === false){
                        setIsUnvalidInput(true)
                    } else if (data.stat === true) {
                        webSocket.send(JSON.stringify({"contentType": "close"}))
                        setCookie("accessTokenAdmin", data.accessToken, {'max-age': 43200});
                        setCookie("refreshTokenAdmin", data.refreshToken, {'max-age': 43200});
                        setCookie('roleWorker', data.role, {'max-age': 43200});
                        navigate('/adminpanel', {state: {accessToken: data.accessToken}});
                    } else {
                        setIsShowQR(false);
                    }
                } else if (data.contentType === "LP") {
                    if (data.stat === true) {
                        webSocket.send(JSON.stringify({"contentType": "close"}))
                        setCookie("accessTokenAdmin", data.accessToken, {'max-age': 43200});
                        setCookie("refreshTokenAdmin", data.refreshToken, {'max-age': 43200});
                        setCookie('roleWorker', data.role, {'max-age': 43200});
                        navigate('/adminpanel', {state: {accessToken: data.accessToken}});
                    } else if (data.stat === false) {
                        setIsUnvalidInput(true)
                    }
                } else if (data.contentType === "error"){
                    setIsShowQR(true);
                    QualifierError(data.error);
                }
            }
        
            webSocket.onopen = e => {
                if (!isShowLogin) {
                    webSocket.send(JSON.stringify({"contentType": "QR"}));
                }
                setIsOpenWS(true);
            }
        }
    }, [webSocket]);

    const handleClickOnToggle = (input) => {
        setIsVisiblePassword(prevState => !prevState);
        input.type = input.type === "password" ? ("text"):("password")
    }

    const handleClickOnSwitch = () => {
        if (isShowLogin) {
            webSocket.send(JSON.stringify({"contentType": "QR"}));
        }
        setIsShowLogin(prevState => !prevState);
    }
    
    const onFocusInput = (label, input) => {
        input.removeAttribute('readonly')
        label.style.color = "white";
        label.style.top = `-${input.getBoundingClientRect().height / 2}px`;
    }

    const onBlurInput = (label, input) => {
        input.setAttribute('readonly', '')
        if (input.value === "") {
            label.style.color = "#9e9e9e";
            label.style.top = 0;
        }
    }

    if (isOpenWS) {
        if (isShowLogin) {
            return (
               <LP 
                    handleClickOnSwitch={handleClickOnSwitch} 
                    handleClickOnToggle={handleClickOnToggle} 
                    webSocket={webSocket} 
                    isVisiblePassword={isVisiblePassword}
                    eye1={eye1}
                    eye2={eye2}
                    setIsUnvalidInput={setIsUnvalidInput}
                    isUnvalidInput={isUnvalidInput}
                    onFocusInput={onFocusInput}
                    onBlurInput={onBlurInput}
                /> 
            ) 
            
        } else {
            return (
                <QR
                    isShowQR={isShowQR}
                    qrToken={qrToken}
                    handleClickOnSwitch={handleClickOnSwitch} 
                    handleClickOnToggle={handleClickOnToggle} 
                    webSocket={webSocket} 
                    isVisiblePassword={isVisiblePassword}
                    eye1={eye1}
                    eye2={eye2}
                    setIsUnvalidInput={setIsUnvalidInput}
                    isUnvalidInput={isUnvalidInput}
                    onFocusInput={onFocusInput}
                    onBlurInput={onBlurInput}
                />
            )
        }
    }
}

export default Authenticate;