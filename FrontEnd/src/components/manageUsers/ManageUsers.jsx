import { useEffect, useState } from "react"
import "./ManageUsers.css"
import { useSearchParams } from "react-router-dom"
import { EditUser } from "../editUser/EditUser"
import { Link } from "react-router-dom"


const env = import.meta.env

const url = `http://localhost:${env.VITE_PORT}`

export function ManageUsers() {
    const [users, setUsers] = useState([])
    const [auth, setAuth] = useState(false)

    const [searchParams, setSearchParams] = useSearchParams()
    const selectedId = searchParams.get("id")
    

    useEffect(() => {

        const endpoint = new URL('/api/users', url)
        endpoint.search = searchParams.toString()

        if (!endpoint.searchParams.has('page')) {
         endpoint.searchParams.set('page', '1');
        }
    
        fetch(endpoint.toString(), {
                method: 'GET',
                credentials: 'include' 
                })
            .then(response => response.json().then(data => ({status: response.status, users: data})))
            .then( ({ users, status }) => {
                if (status === 200) {
                    setUsers(users.usersShown)
                    setAuth(true)
                } 
                })
    }, [searchParams])

    const handleClick = (e, userId) => {
        e.preventDefault()
        const params = new URLSearchParams(searchParams)
        params.set("id", userId)
        setSearchParams(params)
    }

    const crearUrlPagina = (page) => {
       
        const url_end = new URL(window.location)
        url_end.searchParams.set('page', page)
        return `${url_end.toString()}`
    }

    return (
            <>
            {selectedId && <EditUser 
                            user={ users.filter(user => user._id === selectedId)[0] } 
                            /> }
            <table className="usersContainer">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                { auth && users.map(user => { return (
                    
                        <tr key={user._id}>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td><button className="edit-btn" onClick={(e) => handleClick(e, user._id)}>Editar</button></td>
                        </tr>
                    
                    )}
                
                )}
                </tbody>
                
            </table> 
            <div className="pagination">
                <a href="">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M15 6l-6 6l6 6" />
                    </svg>
                </a>
                <Link to={crearUrlPagina(1)}>1</Link>
                <Link to={crearUrlPagina(2)}>2</Link>
                <Link to={crearUrlPagina(3)}>3</Link>
                <a href="">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round"
                    className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-right">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M9 6l6 6l-6 6" />
                    </svg>
                </a>
            </div>
            </>
        )
}