const Buttons = ({ orderId, userId, handleRejectAccept }) => {
    const handleClickBtnReject = () => {
        handleRejectAccept(orderId, userId, "reject")
    }

    const handleClickBtnAccept = () => {
        handleRejectAccept(orderId, userId, "accept")
    }

    return (
        <div className="buttons-space">
            <button onClick={handleClickBtnReject}>Отклонить</button>
            <button onClick={handleClickBtnAccept}>Принять</button>
        </div>
    )
}

export default Buttons;