import { useEffect, useState } from "react"
import "./ManageUsers.css"
import { useSearchParams } from "react-router-dom"
import { EditUser } from "../editUser/EditUser"
import { UseAppContext } from '../../context/AuthContext'
import { Alert } from '../alert/Alert'
import { Pagination } from "../pagination/Pagination"
import { Filters } from "../Fiilters/Filters"

const env = import.meta.env

const url = `${env.VITE_API}`

export function ManageUsers() {
    const [users, setUsers] = useState([])
    const [auth, setAuth] = useState(false)
    const [totalUsers, setTotalUsers] = useState(null)
    const [totalPages, setTotalPages] = useState(null)
    const [alertMessage, setAlertMessage] = useState('')
    const [toogleRendering, setToggleRendering] = useState(true)
    const [editVisibleUser, setEditVisibleUser] = useState(null)

    const { userRole } = UseAppContext()

    const [searchParams] = useSearchParams()
    const selectedPage = searchParams.get("page")
    
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
                    setTotalPages(users.totalPages)
                    setTotalUsers(users.totalUsers)
                    setAuth(true)
                } 
                })
    }, [searchParams, toogleRendering])

    const handleDelete = (e, userId) => {
        e.preventDefault()
        window.confirm('Seguro que quieres eliminar al usuario')
        fetch(`${url}/api/users/${userId}`, {
                method: 'DELETE',
                credentials: 'include' 
                })
            .then(response => {
                if (response.status == 204) {
                    alert('Usuario borrado')
                    setToggleRendering(prev => !prev)
                    
                } else if (response.status == 404) {
                    alert('Este usuario no existe en la base de datos')
                    
                } else {
                    alert('Problema interno')
                    
                }
         })   
        .catch(error => {
            console.log(error)
            alert("Ha habido un problema al enviar la solicitud")
    }) 
    }

    const alert = (message) => {
        setAlertMessage(message)
        setTimeout(() => {
            setAlertMessage('');
            }, 3000);
    }

    const handleEdit = (e, userId) => {
        e.preventDefault()
        setEditVisibleUser(userId)
    }

    const deleteEditVisible = () => {
        setEditVisibleUser(null)
    }


    return (
        <div className="container-users">
            {editVisibleUser && <EditUser 
                                        user={editVisibleUser} 
                                        deleteEditVisible={deleteEditVisible}
                                        setToggleRendering={setToggleRendering}
                                     /> }
            
            <div className="table-container">
                <Filters totalUsers={totalUsers}/>
                <table className="usersContainer">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th className="buttons">Action</th>

                        </tr>
                    </thead>
                    <tbody>
                    { auth && users.map(user => { return (
                            <tr key={user._id}>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                
                                        <button className="edit-btn" onClick={(e) => handleEdit(e, user)}>Editar</button>
                                        { 
                                            userRole == "superadmin" && <button className="edit-btn" onClick={(e) => handleDelete(e, user._id)}>Eliminar</button>
                                        }
                                
                                </td>

                            </tr>
                        
                        )}
                    
                    )}
                    </tbody>
                    
                </table> 
            </div>
            <Pagination 
                totalPages={totalPages}
                selectedPage={selectedPage}
            />
            {alertMessage && <Alert response={ alertMessage } />}
        </div>
        )
}