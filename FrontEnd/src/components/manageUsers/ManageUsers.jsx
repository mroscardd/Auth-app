import { useEffect, useState } from "react"
import "./ManageUsers.css"
import { useSearchParams } from "react-router-dom"
import { EditUser } from "../editUser/EditUser"
import { Link } from "react-router-dom"
import { UseAppContext } from '../../context/AuthContext'
import { Alert } from '../alert/Alert'

const env = import.meta.env

const url = `${env.VITE_API}`

export function ManageUsers() {
    const [users, setUsers] = useState([])
    const [auth, setAuth] = useState(false)
    const [totalUsers, setTotalUsers] = useState(null)
    const [totalPages, setTotalPages] = useState(null)
    const [alertMessage, setAlertMessage] = useState('')
    const [toogleRendering, setToggleRendering] = useState(true)

    const { userRole } = UseAppContext()

    const [searchParams, setSearchParams] = useSearchParams()
    const selectedId = searchParams.get("id")
    const selectedPage = searchParams.get("page")

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    

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

    const handleEdit = (e, userId) => {
        e.preventDefault()
        const params = new URLSearchParams(searchParams)
        params.set("id", userId)
        setSearchParams(params)
    }

    const handleDelete = (e, userId) => {
        e.preventDefault()
        window.confirm('Seguro que quieres eliminar al usuario')
        fetch(`${url}/api/users/${userId}`, {
                method: 'DELETE',
                credentials: 'include' 
                })
            .then(response => {
                console.log(response.status)
                if (response.status == 204) {
                    setAlertMessage('Usuario borrado')
                    setToggleRendering(prev => !prev)
                    setTimeout(() => {
                        setAlertMessage('');
                     }, 3000);
                } else if (response.status == 404) {
                    setAlertMessage('Este usuario no existe en la base de datos')
                    setTimeout(() => {
                        setAlertMessage('');
                     }, 3000);
                } else {
                    setAlertMessage('Problema interno')
                    setTimeout(() => {
                        setAlertMessage('');
                     }, 3000);
                }
            
         })   
        .catch(error => {
            console.log(error)
            setAlertMessage("Ha habido un problema al enviar la solicitud")
    }) 
    }

    const previusPage = () => {

        const url_end = new URL(window.location)
        if (parseInt(selectedPage) > 1) {
            url_end.searchParams.set('page', parseInt(selectedPage) - 1)
            return `${url_end.toString()}`
        } else {
            return `${url_end.toString()}`
        }
    }

    const nextPage = () => {

        const url_end = new URL(window.location)
        if (parseInt(selectedPage) !== totalPages) {
            url_end.searchParams.set('page', parseInt(selectedPage) + 1)
            return `${url_end.toString()}`
        } else {
            return `${url_end.toString()}`
        }
        
    }

    const crearUrlPagina = (page) => {
       
        const url_end = new URL(window.location)
        url_end.searchParams.set('page', page)
        return `${url_end.toString()}`
    }

    return (
            <>
            {selectedId && <EditUser users={users}
                            /> }
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
                               
                                    <button className="edit-btn" onClick={(e) => handleEdit(e, user._id)}>Editar</button>
                                    { 
                                        userRole == "superadmin" && <button className="edit-btn" onClick={(e) => handleDelete(e, user._id)}>Eliminar</button>
                                    }
                               
                            </td>

                        </tr>
                    
                    )}
                
                )}
                </tbody>
                
            </table> 
            <div className="pagination">
                <Link to={previusPage()}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M15 6l-6 6l6 6" />
                    </svg>
                </Link>
                {pages.map(e => <Link key={e} to={crearUrlPagina(e)}>{e}</Link>)}
                <Link to={nextPage()}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round"
                    className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-right">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M9 6l6 6l-6 6" />
                    </svg>
                </Link>
                {alertMessage && <Alert response={ alertMessage } />}
            </div>
            </>
        )
}