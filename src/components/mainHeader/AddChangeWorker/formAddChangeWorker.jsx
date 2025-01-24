import { useState, useRef, useEffect } from "react";
import { useMainContext } from "../../../other/mainContext";
import { currentTheme } from "../../../other/them";
import BlackCross from "../../../other/picture/Cross-black.svg";
import WhiteCross from "../../../other/picture/Cross-white.svg";
import "./formAddChangeWorker.css";

const FormAddChangeWorker = ({ visibleFormAddChangeWorker, workerInfo }) => {
    const arrow = currentTheme() === "black" ? (WhiteCross):(BlackCross);
    const { webSocket, isLoadingNewWorker, setIsLoadingNewWorker, login, password } = useMainContext();
    const [isShowForm, setIsShowForm] = useState(true);
    const formWrapperRef = useRef();
    const [height, setHeight] = useState("auto");
    const [isChange, setIsChange] = useState(false);
    const [firstName, setFirstName] = useState(workerInfo["firstName"]); 
    const [secondName, setSecondName] = useState(workerInfo["secondName"]); 
    const [phoneNumber, setPhoneNumber] = useState(workerInfo["phoneNumber"]);
    const [isChangedInfo, setIsChangeInfo] = useState(false)
    const [isShowWarning, setIsShowWarning] = useState(false);

    const addChangeWorker = (e) => {
        e.preventDefault();
        setIsLoadingNewWorker(true);
        setHeight(`${formWrapperRef.current.getBoundingClientRect().height}px`);
        if (!isChange) {
            webSocket.send(JSON.stringify({
                contentType: "addWorker",
                firstName: e.target.elements["firstName"].value,
                secondName: e.target.elements["secondName"].value,
                role: e.target.elements["role"].value,
                phoneNumber: e.target.elements["phoneNumber"].value
            }));
        } else {
            if (isChangedInfo || workerInfo["role"]) {
                webSocket.send(JSON.stringify({
                    contentType: "changeWorker",
                    workerId: workerInfo["Worker_Id"],
                    oldInfo: {
                        firstName: firstName,
                        secondName: secondName,
                        role: workerInfo["role"],
                        phoneNumber: phoneNumber
                    },
                    newInfo: {
                        firstName: e.target.elements["firstName"].value,
                        secondName: e.target.elements["secondName"].value,
                        role: e.target.elements["role"].value,
                        phoneNumber: e.target.elements["phoneNumber"].value
                    }
                }));
            } else {
                setIsShowWarning(true);
            }
        }
        setIsShowForm(false)
    }

    const handleBlur = (e) => {
        setIsShowWarning(false);
        if (e.target.value === "") {
            e.target.setAttribute("required", "");
        } else {
            e.target.removeAttribute("required");
        }
    }

    useEffect(() => {
        setHeight(formWrapperRef.current.getBoundingClientRect().height);
        if (workerInfo) {
            setIsChange(true);
        }
    }, [])

    return (
        <div className="add-worker-wrapper"  ref={formWrapperRef} style={{height: height + "px"}}>
            <div className="cross" onClick={() => visibleFormAddChangeWorker(null)}>
                <img src={arrow} alt="" />
            </div>
            <h4>{isChange ? ("Изменить информацию"):("Новый сотрудник")}</h4>
            {isShowWarning && (
                <label className="warning">Внесите изменения или закройте форму</label>
            )}
            {isShowForm ? (
                <form onSubmit={addChangeWorker}>
                    <section>
                        <article>
                            <div className="cell-fild">
                                <label>Имя</label>
                                <input 
                                    name="firstName" 
                                    type="text" 
                                    pattern="[А-Яа-яЁё]+" 
                                    maxLength={15} 
                                    onBlur={handleBlur}
                                    value={isChange ? (firstName):("")}
                                    onChange={(e) => {
                                        setIsChangeInfo(true);
                                        setFirstName(e.target.value);
                                    }}
                                />
                            </div>
                            <div className="cell-fild">
                                <label>Фамилия</label>
                                <input 
                                    name="secondName" 
                                    type="text" 
                                    pattern="[А-Яа-яЁё]+" 
                                    maxLength={15} 
                                    onBlur={handleBlur}
                                    value={isChange ? (workerInfo["secondName"]):("")}
                                    onChange={(e)=>{
                                        setIsChangeInfo(true);
                                        setSecondName(e.target.value)
                                    }}
                                />
                            </div>
                            <div className="cell-fild">
                                <label>Роль</label>
                                <div className="input-select-question-wrapper">
                                    <select 
                                        name="role" 
                                        onBlur={handleBlur}
                                        onChange={() => {
                                            setIsChangeInfo(true);
                                        }}
                                    >
                                        <option value="worker" selected={workerInfo["role"] === "worker"}>Работник</option>
                                        <option value="admin" selected={workerInfo["role"] === "admin"}>Админ</option>
                                    </select>
                                    <div className="description">
                                        * «Работник» может принимать\отклонять заказы,
                                        сообщать об их сборке и выдавать
                                    </div>
                                    <div className="description">
                                        * «Админ» имеет те же возможности, 
                                        что и «Работник», + возможность управлять системой
                                    </div>
                                </div>
                            </div>
                            <div className="cell-fild">
                                <label>Номер телефона</label>
                                <div className={isChange ? ("input-select-question-wrapper change"):("input-select-question-wrapper")}>
                                    <input 
                                        name="phoneNumber"
                                        placeholder="89006005544"
                                        type="tel"
                                        pattern="[8]{1}[0-9]{10}" 
                                        minLength="11" 
                                        maxLength="12"
                                        value={isChange ? (workerInfo["phoneNumber"]):("")}
                                        onBlur={handleBlur}
                                        onChange={(e) => {
                                            setIsChangeInfo(true);
                                            setPhoneNumber(e.target.value)
                                        }}
                                    />
                                    <div className="description">
                                        * Не обязательно. Номер телефона необходим для авторизации 
                                        с помощью QR-кода через Телеграм
                                    </div>
                                </div>
                            </div>
                        </article>
                    </section>
                    <button>{isChange ? ("Изменить"):("Добавить")}</button>
                </form>
            ):(
                <div className="login-password-block">
                    <div className={isLoadingNewWorker ? ("login loading"):("login loaded")}>
                        <span>Логин:  </span> 
                        {isLoadingNewWorker ? (
                            <span className="spoiler-container">
                                <span className="shine"></span>
                                <span className="spoiler">***************</span>
                            </span>
                        ):(
                            login
                        )}
                    </div>
                    <div className={isLoadingNewWorker ? ("login password"):("login password")}>
                        <span>Пароль:  </span> 
                        {isLoadingNewWorker ? (
                            <span className="spoiler-container">
                                <span className="shine"></span>
                                <span className="spoiler">***************</span>
                            </span>
                        ):(
                            password
                        )}
                    </div>
                    <div className="description">
                        * Полученный логин и пароль теперь может использоваться 
                        сотрудником для получения доступа к системе. Если при 
                        добавлении был указан его номер телефона - он может 
                        воспользователься qr-кодом для авторизации 
                    </div>
                </div>
            )}
        </div>
    )
}

export default FormAddChangeWorker;