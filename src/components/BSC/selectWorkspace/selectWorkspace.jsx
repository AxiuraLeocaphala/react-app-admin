import { useMainContext } from "./../../context/mainContext";
import { User } from "../../../other/user";
import QualifierError from "../../../other/_qualifierError";
import AdminPanel from "../adminpanel/adminpanel";
import "./selectWorkspace.css";

const SelectWorkspace = () => {
    const { view, SetView } = useMainContext();

    const handleClickBtnSelect = (view) => {
        if (User.isMobile()) {
            if (view === "GeneralView") {
                QualifierError("It is not possible to open the general view on the phone");
            } else {
                SetView(view);
            }
        } else {
            SetView(view);
        }
    }

    if (!view) {
        return (
            <div className="select-workspace">
                <h4>выберите рабочую зону</h4>
                <div className="btn-space">
                    <button onClick={() => handleClickBtnSelect("Confirm")}>принятие заказов</button>
                    <button onClick={() => handleClickBtnSelect("Assembly")}>сборка заказов</button>
                    <button onClick={() => handleClickBtnSelect("ADelivery")}>выдача заказов</button>
                    <button onClick={() => handleClickBtnSelect("GeneralView")}>общий вид</button>
                </div>
            </div>
        )
    } else {
        return (
            <AdminPanel/>
        )
    }
}

export default SelectWorkspace