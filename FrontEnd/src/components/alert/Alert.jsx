import './Alert.css'

export function Alert({ response }) {
    return (
        <div className="containerAlert">
            <h2>{ response }</h2>
        </div>
     
    )
}