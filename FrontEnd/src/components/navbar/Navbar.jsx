import './Navbar.css'
import { UseAppContext } from '../../context/AuthContext'
import { Link } from 'react-router-dom'
const env = import.meta.env

const url = `http://localhost:${env.VITE_PORT}/api/logout`

export function Navbar() {
    const {userName, isLogged, setIsLogged, setUserName} = UseAppContext()

    const handleClick = () => {
        fetch(url, {
                    method: 'GET',
                    credentials: 'include' 
                })
        .then(response => {  
            if (response.status === 200) {
                setUserName('')
                setIsLogged(false)
            }
        })
    }

    return (
        <div className="NavbarContainer">
            <nav>
                <ul> {isLogged ? 
                (
                    <>
                    <li>Hola, {userName}</li>
                    <li><Link to="/" onClick={() => handleClick()}>Cerrar sesión</Link></li>
                    </>
                ) :
                (
                    <>
                    <li><Link to="/register">Crea una cuenta</Link></li>
                    <li><Link to="/login">Iniciar Sesion</Link></li>
                    </>
                )}
                </ul>
            </nav>
        </div>
    )
}