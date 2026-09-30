import { useState, useEffect} from 'react'
const env = import.meta.env

const url = `http://localhost:${env.VITE_PORT}/api/me`


export function MainPage() {
    const [auth, setAuth] = useState()
    useEffect(() => {
        fetch(url, {
            method: 'GET',
            credentials: 'include'
        })
        .then(res => res.json())
        .then(data => console.log(data))
    }, [])

    return (
        <h1>Pagina principal</h1>

    )
}