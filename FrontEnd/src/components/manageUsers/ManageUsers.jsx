import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import "./ManageUsers.css"
const env = import.meta.env

const url = `http://localhost:${env.VITE_PORT}/api/users`

export function ManageUsers() {
    const [users, setUsers] = useState([])
    const [auth, setAuth] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        fetch(url, {
                method: 'GET',
                credentials: 'include' 
                })
            .then(response => response.json().then(data => ({status: response.status, users: data})))
            .then( ({ users, status }) => {
                if (status === 200) {
                    setUsers(users)
                    setAuth(true)
                } 
                })
    }, [])

    const handleClick = (e) => {
        e.prevent.default()
        navigate("/")
    }

    return (
        <table className="usersContainer">
            <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
            
            </tr>
            { auth && users.map(user => { return (
                <tr key={user._id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td><button className="edit-btn" onClick={(e) => handleClick(e)}>Editar</button></td>
                </tr>
                )}
            )}
            
        </table>
    )
}