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
    const [totalUsers, setTotalUsers] = useState(null)
    const [totalPages, setTotalPages] = useState(null)

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
    }, [searchParams])

    const handleClick = (e, userId) => {
        e.preventDefault()
        const params = new URLSearchParams(searchParams)
        params.set("id", userId)
        setSearchParams(params)
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
                <Link to={previusPage()}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M15 6l-6 6l6 6" />
                    </svg>
                </Link>
                {pages.map(e => <Link to={crearUrlPagina(e)}>{e}</Link>)}
                <Link to={nextPage()}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round"
                    className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-right">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M9 6l6 6l-6 6" />
                    </svg>
                </Link>
            </div>
            </>
        )
}