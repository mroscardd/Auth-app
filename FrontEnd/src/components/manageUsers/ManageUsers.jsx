import { useEffect, useState } from "react"
import "./ManageUsers.css"
import { useSearchParams } from "react-router-dom"
import { EditUser } from "../editUser/EditUser"


const env = import.meta.env

const url = `http://localhost:${env.VITE_PORT}/api/users`

export function ManageUsers() {
    const [users, setUsers] = useState([])
    const [auth, setAuth] = useState(false)

    const [searchParams, setSearchParams] = useSearchParams()
    const selectedId = searchParams.get("id")

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
    }, [users])

    const handleClick = (e, userId) => {
        e.preventDefault()
        setSearchParams({ id: userId })
    }

    return (
            <>
            {selectedId && <EditUser user={ users.filter(user => user._id === selectedId)[0] } setSearchParams={setSearchParams}/> }
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
            </>
        )
}