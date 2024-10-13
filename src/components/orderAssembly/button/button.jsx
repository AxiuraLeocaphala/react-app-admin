import "./button.css"

const Button = ({ orderId, userId, handleAssemblyOrder }) => {
    const handleClickBtn = () => {
        handleAssemblyOrder(orderId, userId)
    } 

    return (
        <div className="button-space">
            <button onClick={handleClickBtn}>Собран</button>
        </div>
    )
}

export default Button 