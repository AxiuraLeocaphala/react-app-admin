import { useRef, useEffect } from "react";

import { CurrentTheme } from "./../../../other/theme"
import CameraSVGBlack from "./../../../other/picture/Camera-black.svg";
import CameraSVGWhite from "./../../../other/picture/Camera-white.svg";
import "./loginPassword.css";

const LP = ({
    handleClickOnSwitch, handleClickOnToggle, webSocket, 
    isVisiblePassword, eye1, eye2,
    setIsUnvalidInput, isUnvalidInput, onFocusInput,
    onBlurInput
}) => {
    const inputRef1 = useRef();
    const labelRef1 = useRef();
    const inputRef2 = useRef();
    const labelRef2 = useRef();
    const currentTheme = CurrentTheme();
    const cameraSVG = currentTheme === "dark" ? (CameraSVGWhite):(CameraSVGBlack);

    const handleClickBtn = (input1, input2) => {
        if (input1.value === "" || input2.value === "") {
            if (input1.value === "") {
                input1.classList.add("unvalid")
            }
            if (input2.value === "") {
                input2.classList.add("unvalid")
            }
        } else {
            webSocket.send(JSON.stringify({
                "contentType": "LP", 
                "login": input1.value, 
                "password": input2.value
            }));
        }
    }
    
    useEffect(() => {
        if (isUnvalidInput) {
            inputRef1.current.addEventListener('input', () => {
                setIsUnvalidInput(false);
            })
            inputRef2.current.addEventListener('input', () => {
                setIsUnvalidInput(false);
            })
        }
    } , [isUnvalidInput])

    return (
        <div className="card">
            <img src={cameraSVG} className="switch to-qr" onClick={handleClickOnSwitch} alt=""/>
            <h4>Вход по логину и паролю</h4>
            <div className="input-wrapper">
                <div className="input-field">
                    <input 
                        ref={inputRef1}
                        type="text" 
                        autoComplete="off"
                        required 
                        readOnly
                        className={isUnvalidInput ? ("input-field-input unvalid"):("input-field-input")}
                        onFocus={() => onFocusInput(labelRef1.current, inputRef1.current)}
                        onBlur={() => onBlurInput(labelRef1.current, inputRef1.current)}
                        onChange={(e) => {
                            e.target.classList.remove("unvalid")
                        }}
                    />
                    <div className="input-field-border"></div>
                    <label ref={labelRef1}>
                        <span className="i18n">Логин</span>
                    </label>
                </div>
                <div className="input-field">
                    <input 
                        ref={inputRef2}
                        type="password" 
                        autoComplete="off" 
                        required 
                        readOnly
                        className={isUnvalidInput ? ("input-field-input unvalid"):("input-field-input")}
                        onFocus={() => onFocusInput(labelRef2.current, inputRef2.current)}
                        onBlur={() => onBlurInput(labelRef2.current, inputRef2.current)}
                        onChange={(e) => {
                            e.target.classList.remove("unvalid")
                        }}
                    />
                    <div className="input-field-border"></div>
                    <label ref={labelRef2}>
                        <span className="i18n">Пароль</span>
                    </label>
                    <span className="toggle-visible" onClick={() => handleClickOnToggle(inputRef2.current)}>
                        <span className="tgicon">
                            <img src={isVisiblePassword ? (eye2):(eye1)} alt="" />
                        </span>
                    </span>
                </div>
                <button 
                    className="btn" 
                    onClick={() => handleClickBtn(inputRef1.current, inputRef2.current)}
                >
                    <span className="btn-text">Продолжить</span>
                </button>
            </div>
        </div>
    )
}

export default LP;