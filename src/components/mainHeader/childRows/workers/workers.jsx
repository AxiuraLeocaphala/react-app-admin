import {useState} from "react";
import { useMainContext } from "../../../../other/mainContext";
import { currentTheme } from "../../../../other/them";
import ArrowBlack from "../../../../other/picture/Arrow-black.svg";
import ArrowWhite from "../../../../other/picture/Arrow-white.svg";
import Trashcan from "../../../../other/picture/trashcan.svg"
import "./workers.css";

const Workers = ({ visibleFormAddChangeWorker }) => {
    const [isTurned, setTurned] = useState(false);
    const { webSocket, workers } = useMainContext();
    const arrow = currentTheme() === "dark" ? (ArrowBlack):(ArrowWhite);

    const handleClickArrow = () => {
        if (!isTurned) {
            webSocket.send(JSON.stringify({
                "contentType": "getWorkers"
            }))
        }
        setTurned(prevState => !prevState)
    }

    const handleClickRemoveWorker = (workerId, role, firstName, secondName) => {
        webSocket.send(JSON.stringify({
            "contentType": "removeWorker", 
            "id": workerId,
            "role": role,
            "firstName": firstName,
            "secondName": secondName
        }))
    }

    const handleClickChangeWorker = (role, firstName, secondName, phoneNumber) => {
        visibleFormAddChangeWorker(
            {
                "role": role, 
                "firstName": firstName, 
                "secondName": secondName, 
                "phoneNumber": phoneNumber
            }
        )
    }

    return (
        <>
            <div className="row workers">
                Сотрудники
                <div className={`arrow ${isTurned ? ("turned"):("")}`} onClick={handleClickArrow}>
                    <img src={arrow} alt=''/>
                </div>
            </div>
            {isTurned && workers && (
                <>
                    <button className='btn-add-worker' onClick={() => visibleFormAddChangeWorker(null)}>Добавить работника</button>
                    <div className="list-workers">
                        {workers.map((worker, id) => {
                            return (
                                <div key={id} className="worker">
                                    <button 
                                        className='btn-remove-worker' 
                                        onClick={() => handleClickRemoveWorker(
                                            worker["Worker_Id"],
                                            worker["Role"],
                                            worker["FirstName"],
                                            worker["SecondName"]
                                        )}
                                    >
                                        <img src={Trashcan} alt="" />
                                    </button>
                                    <span className="name">{worker["FirstName"]} {worker["SecondName"]}</span>
                                    <span className="role">{worker["Role"] === "worker" ? ("работник"):("админ")}</span>
                                    <button 
                                        className='btn-change-worker' 
                                        onClick={()=> handleClickChangeWorker(
                                            worker["Role"],
                                            worker["FirstName"],
                                            worker["SecondName"],
                                            worker["PhoneNumber"]
                                        )}
                                    >
                                        изменить
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                </>
            )}
        </>
    )
}

export default Workers