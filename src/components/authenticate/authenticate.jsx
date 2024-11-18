import { useState, useRef, useEffect } from "react";
import QualifierError from '../../ws/_qualifierError'
import { QRCode } from "react-qrcode-logo";
import eye1 from './../../other/picture/eye1.svg';
import eye2 from './../../other/picture/eye2.svg';
import CameraSVGBlack from "./../../other/picture/Camera-black.svg";
import CameraSVGWhite from "./../../other/picture/Camera-white.svg";
import PasswordSVGBlack from "./../../other/picture/Password-black.svg";
import PasswordSVGWhite from "./../../other/picture/Password-white.svg";
import "./authenticate.css";
import { setCookie } from "../../other/cookie";
import { useNavigate } from "react-router-dom";
import { currentThem } from "../../other/them";
import {useWebSocket} from "../../ws/wsContextAdminPanel"

const Authenticate = () => {
    const [showLogin, setShowLogin] = useState(true);
    const [wsOpen, setWsOpen] = useState(false)
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [showQR, setShowQR] = useState(true)
    const [QR, setQR] = useState("");
    const input1Ref = useRef(null);
    const input2Ref = useRef(null);
    const input3Ref = useRef(null);
    const label1Ref = useRef(null);
    const label2Ref = useRef(null);
    const label3Ref = useRef(null);
    const btnRef = useRef(null);
    const navigate = useNavigate();
    const [bgPrimary, setBgPrimary] = useState(null);
    const [colPrimary, setColPrimary] = useState(null);
    const [CameraSVG, setCameraSVG] = useState(null);
    const [PasswordSVG, setPasswordSVG] = useState(null);
    const webSocket = useWebSocket();

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", currentThem());
        const root = document.documentElement;
        setBgPrimary(getComputedStyle(root).getPropertyValue('--background'));
        setColPrimary(getComputedStyle(root).getPropertyValue('--on-surface'));
        if (currentThem() === "dark") {
            setCameraSVG(CameraSVGWhite);
            setPasswordSVG(PasswordSVGWhite);
        } else {
            setCameraSVG(CameraSVGBlack);
            setPasswordSVG(PasswordSVGBlack);
        }

        if (webSocket) {
            webSocket.onmessage = e => {
                const data = JSON.parse(e.data)
                if (data.contentType === "link"){
                    setQR(data.link);
                    setShowQR(true);
                } else if (data.contentType === "2FA"){
                    if (data.stat === false){
                        input3Ref.current.style.borderColor = `#ff595a`;
                        label3Ref.current.style.borderColor = `#ff595a`;
                        input3Ref.current.addEventListener('input', () => {
                            input3Ref.current.style.borderColor = `#ffffff`;
                            label3Ref.current.style.borderColor = `#ffffff`;
                        })
                    } else if (data.stat === true) {
                        webSocket.send(JSON.stringify({"contentType": "close"}))
                        setCookie("accessToken", data.accessToken, {'max-age': 14400});
                        setCookie("refreshToken", data.refreshToken, {'max-age': 14400});
                        navigate('/adminpanel', {state: {accessToken: data.accessToken}});
                    } else {
                        setShowQR(false);
                    }
                } else if (data.contentType === "LP") {
                    if (data.stat === true) {
                        webSocket.send(JSON.stringify({"contentType": "close"}))
                        setCookie("accessToken", data.accessToken, {'max-age': 14400});
                        setCookie("refreshToken", data.refreshToken, {'max-age': 14400});
                        navigate('/adminpanel', {state: {accessToken: data.accessToken}});
                    } else if (data.stat === false) {
                        input1Ref.current.style.borderColor = `#ff595a`;
                        label1Ref.current.style.borderColor = `#ff595a`;
                        input1Ref.current.addEventListener('input', () => {
                            input1Ref.current.style.borderColor = `#ffffff`;
                            label1Ref.current.style.borderColor = `#ffffff`;
                        })
                        input2Ref.current.style.borderColor = `#ff595a`;
                        label2Ref.current.style.borderColor = `#ff595a`;
                        input2Ref.current.addEventListener('input', () => {
                            input2Ref.current.style.borderColor = `#ffffff`;
                            label2Ref.current.style.borderColor = `#ffffff`;
                        })
                    }
                } else if (data.contentType === "error"){
                    setShowQR(true);
                    QualifierError(data.error);
                }
            }
        
            webSocket.onopen = e => {
                if (!showLogin) {
                    webSocket.send(JSON.stringify({"contentType": "qr"}));
                }
                setWsOpen(true);
            }
        }
    }, [webSocket]);

    const handleClickOnToggle = (input) => {
        setPasswordVisible(!passwordVisible);
        input.type = input.type === "password" ? ("text"):("password")
    }

    const onFocusInput = (label, input) => {
        label.style.color = "white";
        label.style.top = `-${input.getBoundingClientRect().height / 2}px`;
    }

    const onBlurInput = (label, input) => {
        if (input.value === "") {
            label.style.color = "#9e9e9e";
            label.style.top = 0;
        }
    }

    const onOverBtn = () => {
        btnRef.current.style.backgroundColor = "#dad9d9";
    }

    const onOutBtn = () => {
        btnRef.current.style.backgroundColor = "#ffffff";
    }

    const onClickBtn = (contentType, ...args) => {
        if (contentType === "2FA") {
            webSocket.send(JSON.stringify({"contentType": contentType, "code": args[0]}));
        } else if (contentType === "LP") {
            webSocket.send(JSON.stringify({"contentType": contentType, "login": args[0], "password": args[1]}));
        }
    }

    const handleClickOnSwitch = () => {
        if (showLogin) {
            webSocket.send(JSON.stringify({"contentType": "qr"}));
        } else {
            // НЕ CLOSE 
            webSocket.send(JSON.stringify({"contentType": "close"}));
        }
        setShowLogin(prevState => !prevState);
    }

    if (wsOpen) {
        if (showLogin) {
            return (
                <div className="card">
                    <img src={CameraSVG} className="switch to-qr" onClick={handleClickOnSwitch}/>
                    <h4>Вход по логину и паролю</h4>
                    <div className="input-wrapper">
                        <div className="input-field">
                            <input 
                                type="text" 
                                autoComplete="off" 
                                required 
                                className="input-field-input"
                                ref={input1Ref}
                                onFocus={() => onFocusInput(label1Ref.current, input1Ref.current)}
                                onBlur={() => onBlurInput(label1Ref.current, input1Ref.current)}
                            />
                            <div className="input-field-border"></div>
                            <label ref={label1Ref}>
                                <span className="i18n">
                                    Логин
                                </span>
                            </label>
                        </div>
                        <div className="input-field">
                            <input 
                                type="password" 
                                autoComplete="off" 
                                required 
                                className="input-field-input"
                                ref={input2Ref}
                                onFocus={() => onFocusInput(label2Ref.current, input2Ref.current)}
                                onBlur={() => onBlurInput(label2Ref.current, input2Ref.current)}
                            />
                            <div className="input-field-border"></div>
                            <label ref={label2Ref}>
                                <span className="i18n">
                                    Пароль
                                </span>
                            </label>
                            <span className="toggle-visible" onClick={() => handleClickOnToggle(input2Ref.current)}>
                                <span className="tgicon">
                                    <img src={passwordVisible ? (eye2):(eye1)} alt=""/>
                                </span>
                            </span>
                        </div>
                        <button className="btn" onClick={() => onClickBtn("LP", input1Ref.current.value, input2Ref.current.value)} onMouseOver={onOverBtn} onMouseOut={onOutBtn} ref={btnRef}>
                            <span className="btn-text">Продолжить</span>
                        </button>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="card">
                    {showQR ? (
                        <>
                            {QR && (
                                <>
                                    <div className="switch-wrapper"><img src={PasswordSVG} className="switch to-login" onClick={handleClickOnSwitch}/></div>
                                    <div className="qr">
                                        <QRCode
                                            value={QR}
                                            size={200}
                                            eyeRadius={[
                                                {
                                                    outer: [10, 10, 10, 10],
                                                    inner: [3, 3, 3, 3]
                                                },
                                                {
                                                    outer: [10, 10, 10, 10],
                                                    inner: [3, 3, 3, 3]
                                                },
                                                {
                                                    outer: [10, 10, 10, 10],
                                                    inner: [3, 3, 3, 3]
                                                }
                                            ]}
                                            
                                            fgColor={colPrimary}
                                            bgColor={bgPrimary}
                                            qrStyle="dots"
                                        />
                                    </div>
                                    <h4 className="h4-qr">Вход по QR-коду</h4>
                                    <ol className="description">
                                        <li>Откройте телеграм с телефона.</li>
                                        <li>
                                            <span>
                                                Откройте <b>Настройки</b> {'>'} <b>Устройства</b> {'>'} <b>Подключить устройство</b>.
                                            </span>
                                        </li>
                                        <li>Для подтверждения направьте камеру телефона на этот экран.</li>
                                    </ol>
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            <h4>Введите ваш пароль</h4>
                            <div className="description">
                                Ваш аккаунт защищен дополнительным паролем
                            </div>
                            <div className="input-wrapper">
                                <div className="input-field">
                                    <input 
                                        type="password" 
                                        autoComplete="off"
                                        required 
                                        className="input-field-input"
                                        ref={input3Ref}
                                        onFocus={() => onFocusInput(label3Ref.current, input3Ref.current)}
                                        onBlur={() => onBlurInput(label3Ref.current, input3Ref.current)}
                                    />
                                    <div className="input-field-border"></div>
                                    <label ref={label3Ref}>
                                        <span className="i18n">
                                            Пароль
                                        </span>
                                    </label>
                                    <span className="toggle-visible" onClick={() => handleClickOnToggle(input3Ref.current)}>
                                        <span className="tgicon">
                                            <img src={passwordVisible ? (eye2):(eye1)} alt=""/>
                                        </span>
                                    </span>
                                </div>
                                <button className="btn" onClick={() => onClickBtn("2FA", input3Ref.current,)} onMouseOver={onOverBtn} onMouseOut={onOutBtn} ref={btnRef}>
                                    <span className="btn-text">Продолжить</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )
        }
    }
}

export default Authenticate;