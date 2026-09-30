import { useState, useEffect} from 'react'
import './MainPage.css'
import { useNavigate } from 'react-router-dom'
const env = import.meta.env


const url = `http://localhost:${env.VITE_PORT}/api/me`


export function MainPage() {
    const navigate = useNavigate()
    const [auth, setAuth] = useState()
    useEffect(() => {
        fetch(url, {
            method: 'GET',
            credentials: 'include'
        })
        .then(res => res.json())
        .then(data => setAuth(data.user.role))
    }, [])

    const handleClick = (e) => {
        e.preventDefault()
        navigate('./manage-users')
    }

    return (
        <>
        <h1>Pagina principal</h1>
        { (auth === 'admin' || auth === 'superadmin') && <button className="admin-btn" onClick={(e) => handleClick(e)}>Administrar usuarios</button>}
        </>
    )
}