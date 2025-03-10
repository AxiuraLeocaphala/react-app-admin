import { useEffect, useRef, useState} from "react";
import { useMainContext } from "./../../../context/mainContext.js"
import "./../../../style/popupCheckCodeReceive.css";

const PopupCheckCodeReceive = ({ activePopup, columnRef }) => {
    const overlayRef = useRef(null);
    const inputRef = useRef(null);
    const [positionOverlay, setPositionOverlay] = useState(null);
    const { 
        webSocket, SetErrMsgShowADeliveryPopup, errMsgShowADeliveryPopup,
        SetErrMsgADeliveryPopup, errMsgADeliveryPopup, 
    } = useMainContext();

    const handleClickOverlay = (e) => {
        if (e.target.closest('.popupCheckCodeReceive') === null) {
            overlayRef.current.classList.add('hide');
            columnRef.current.style.overflow = "";
            setTimeout(() => activePopup(), 50)
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
            SetErrMsgADeliveryPopup("Введите код для получения заказа");
            SetErrMsgShowADeliveryPopup(true);
        }
    }
    
    useEffect(() => {
        setPositionOverlay(columnRef.current.scrollTop);
        columnRef.current.style.overflow = "hidden";
        setTimeout(() => {overlayRef.current.classList.remove('hide')}, 50) 
        setTimeout(() => {
            inputRef.current.focus()
            overlayRef.current.addEventListener('click', handleClickOverlay);
        }, 150);
    }, [])

    return (
        <div ref={overlayRef} className="overlay hide" style={{top: `${positionOverlay}px`}}>
            <div className="popupCheckCodeReceive">
                <h4>Введите код для получения</h4>
                <div className="input-wrapper">
                    <div>
                        <input type="text" ref={inputRef} onChange={() => {SetErrMsgShowADeliveryPopup(false)}}/>
                        {errMsgShowADeliveryPopup && (<div className="error-msg">{errMsgADeliveryPopup}</div>)}
                    </div>
                    <button onClick={handleClickBtn}>Проверить</button>
                </div>
            </div>
        </div>
    )
}

export default PopupCheckCodeReceive;