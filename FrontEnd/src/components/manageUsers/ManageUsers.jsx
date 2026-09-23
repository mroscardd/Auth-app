import { useEffect, useState } from "react"
const env = import.meta.env

const url = `http://localhost:${env.VITE_PORT}/api/users`

export function ManageUsers() {
    const [users, setUsers] = useState([])
    const [auth, setAuth] = useState(false)

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
                } else {
                    setAuth(false)
                    setUsers([])
                }
                })
    }, [])

    return (
        <div className="usersContainer">
            { users.map(user => { return (
                <div key={user._id}>
                    <p><strong>username: </strong>{user.username}</p>
                    <p><strong>email: </strong>{user.email} </p>
                    <p><strong>role: </strong> {user.role}</p>
                </div>)}
            )}
            
        </div>
    )
}