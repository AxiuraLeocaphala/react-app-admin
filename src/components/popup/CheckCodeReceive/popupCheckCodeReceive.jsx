import { useEffect, useRef, useState} from "react";
import { useMainContext } from "../../../other/mainContext"
import "./popupCheckCodeReceive.css";

const PopupCheckCodeReceive = ({ 
        setPopupIsShow, 
        colADeliveryRef, 
        setErrMsgShow, 
        errMsgShow, 
        setErrMsg, 
        errMsg 
    }) => {
    const overlayRef = useRef(null);
    const inputRef = useRef(null);
    const [positionOverlay, setPositionOverlay] = useState(null);
    const { webSocket } = useMainContext();

    useEffect(() => {
        setPositionOverlay(colADeliveryRef.current.scrollTop);
        colADeliveryRef.current.style.overflow = "hidden";
        setTimeout(() => {overlayRef.current.classList.remove('hide')}, 50) 
        setTimeout(() => {
            inputRef.current.focus()
            overlayRef.current.addEventListener('click', handleClickOverlay);
        }, 150);
    }, [])

    const handleClickOverlay = (e) => {
        if (e.target.closest('.popupCheckCodeReceive') === null) {
            overlayRef.current.classList.add('hide');
            colADeliveryRef.current.style.overflow = "";
            setTimeout(() => {
                setPopupIsShow(false);
            }, 50)
            overlayRef.current.removeEventListener('click', handleClickOverlay);
        }
    };

    const handleClickBtn = () => {
        inputRef.current.blur()
        if (inputRef.current.value) {
            webSocket.send(JSON.stringify({
                "contentType": "checkCodeReceive",
                "codeReceive": inputRef.current.value
            }))
        } else {
            setErrMsg("Введите код для получения заказа");
            setErrMsgShow(true);
        }
    }

    return (
        <div ref={overlayRef} className="overlay hide" style={{top: `${positionOverlay}px`}}>
            <div className="popupCheckCodeReceive">
                <h4>Введите код для получения</h4>
                <div className="input-wrapper">
                    <div>
                        <input type="text" ref={inputRef} onChange={() => {setErrMsgShow(false)}}/>
                        {errMsgShow && (<div className="error-msg">{errMsg}</div>)}
                    </div>
                    <button onClick={handleClickBtn}>Проверить</button>
                </div>
            </div>
        </div>
    )
}

export default PopupCheckCodeReceive;