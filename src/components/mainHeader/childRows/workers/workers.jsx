import {useState} from "react";
import { useMainContext } from "../../../../other/mainContext";
import { currentTheme } from "../../../../other/them";
import ArrowBlack from "../../../../other/picture/Arrow-black.svg";
import ArrowWhite from "../../../../other/picture/Arrow-white.svg";
import "./workers.css";

const Workers = ({ visibleFormAddWorker }) => {
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
                    <button className='btn-add-worker' onClick={visibleFormAddWorker}>Добавить работника</button>
                    <div className="list-workers">
                        {workers.map((worker, id) => {
                            return (
                                <div key={id} className="worker">
                                    <span>{worker["FirstName"]} {worker["SecondName"]}</span>
                                    <span className="role">{worker["Role"] === "worker" ? ("работник"):("админ")}</span>
                                    <button 
                                        className='btn-remove-workers' 
                                        onClick={() => handleClickRemoveWorker(
                                            worker["Worker_Id"],
                                            worker["Role"],
                                            worker["FirstName"],
                                            worker["SecondName"]
                                        )}
                                    >
                                        удалить
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