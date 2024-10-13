import { useState, useRef, useEffect } from "react";
import QualifierError from '../../request/_qualifierError'
import { QRCode } from "react-qrcode-logo";
import { webSocket } from "../../request/wsAuth";
import svg1 from './svg/eye1.svg';
import svg2 from './svg/eye2.svg';
import "./authenticate.css";
import { setCookie } from "../../other/cookie";
import { useNavigate } from "react-router-dom";
import { currentThem } from "../../other/them";

const Authenticate = () => {
    const [wsOpen, setWsOpen] = useState(false)
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [isShowQR, setIsShow] = useState(true)
    const [QR, setQR] = useState("");
    const inputRef = useRef(null);
    const labelRef = useRef(null); 
    const inputWrapperRef = useRef(null);
    const btnRef = useRef(null);
    const navigate = useNavigate();
    const [bgPrimary, setBgPrimary] = useState(null);
    const [colPrimary, setColPrimary] = useState(null);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", currentThem())

        const root = document.documentElement;
        setBgPrimary(getComputedStyle(root).getPropertyValue('--background-primary'));
        setColPrimary(getComputedStyle(root).getPropertyValue('--color-primary'));
    }, []);

    webSocket.onmessage = e => {
        const data = JSON.parse(e.data)
        if (data.contentType === "link"){
            setQR(data.link)
        } else if (data.contentType === "2FA"){
            if (data.stat === false){
                setIsShow(false);
                inputRef.current.style.borderColor = `#ff595a`;
                labelRef.current.style.borderColor = `#ff595a`;
                inputRef.current.addEventListener('input', () => {
                    inputRef.current.style.borderColor = `#ffffff`;
                    labelRef.current.style.borderColor = `#ffffff`;
                })
            } else if (data.stat === true) {
                setCookie("accessToken", data.accessToken, {'max-age': 14400});
                setCookie("refreshToken", data.refreshToken, {'max-age': 14400});
                navigate('/adminpanel');
            } else {
                setIsShow(false);
            }
        } else if (data.contentType === "error"){
            setIsShow(true);
            QualifierError(data.error);
        }
    }

    webSocket.onopen = e => {
        setWsOpen(true);
    }

    const handleClickOnToggle = () => {
        setPasswordVisible(!passwordVisible);
        inputRef.current.type = inputRef.current.type === "password" ? ("test"):("password")
    }

    const onFocusInput = () => {
        labelRef.current.style.color = "white";
        labelRef.current.style.top = `-${inputRef.current.getBoundingClientRect().height / 2}px`;
    }

    const onBlurInput = () => {
        if (inputRef.current.value === "") {
            labelRef.current.style.color = "#9e9e9e";
            labelRef.current.style.top = 0;
        }
    }

    const onOverBtn = () => {
        btnRef.current.style.backgroundColor = "#dad9d9";
    }

    const onOutBtn = () => {
        btnRef.current.style.backgroundColor = "#ffffff";
    }

    const onClickBtn = () => {
        webSocket.send(inputRef.current.value)
    }

    if (wsOpen) {
        return (
            <div className="card">
                {isShowQR ? (
                    <>
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
                        <h4>Вход по QR-коду</h4>
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
                ) : (
                    <>
                        <h4>Введите ваш пароль</h4>
                        <div className="description">
                            Ваш аккаунт защищен дополнительным паролем
                        </div>
                        <div className="input-wrapper" ref={inputWrapperRef}>
                            <div className="input-field">
                                <input 
                                type="password" 
                                autoComplete="off" 
                                required 
                                className="input-field-input" 
                                ref={inputRef}
                                onFocus={onFocusInput}
                                onBlur={onBlurInput}/>
                                <div className="input-field-border"></div>
                                <label ref={labelRef}>
                                    <span className="i18n">
                                        Password
                                    </span>
                                </label>
                                <span className="toggle-visible" onClick={handleClickOnToggle}>
                                    <span className="tgicon">
                                        <img src={passwordVisible ? (svg2):(svg1)} alt=""/>
                                    </span>
                                </span>
                            </div>
                            <button className="btn" onClick={onClickBtn} onMouseOver={onOverBtn} onMouseOut={onOutBtn} ref={btnRef}>
                                <span className="btn-text">Продолжить</span>
                            </button>
                        </div>
                    </>
                )}
            </div>
        )
    }
}

export default Authenticate;