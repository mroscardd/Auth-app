import './EditUser.css'
import { useState } from 'react'
const env = import.meta.env



export function EditUser({ user, setSearchParams }) {
    const [role, setRole] = useState(user.role)

    const url = `http://localhost:${env.VITE_PORT}/api/user-role/${user._id}`

    const handleChange = (e) => {
        setRole(e.target.value)
    }
    
    const handleClick = () => {
        fetch(url, {
            method: 'PUT',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({role: role})

        }).then(response => { return response.json().then(data => ({
            status: response.status,
            data: data
            }))
        })
          .then(({ status,  data }) => {
            
            if (status === 200) {
                alert("Actualizado correctamente")
                setSearchParams({})

            } else {
                alert(data.message)
                setSearchParams({})
            }
            
        })
        .catch(error => {
        console.log(error)
        alert("Ha habido un problema al enviar la solicitud")
    })
    }


    return (

            <div className="editCard">
                <div className="edit-data">
                    <h3>{ user.username }</h3>
                    <p>role actual: {user.role}</p>
                    <div className="edit-select">
                        <label htmlFor='role-select'>Cambiar role: </label>
                        <select id="role-select" value={role} onChange={(e) => handleChange(e)}>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            <option value="superadmin">Superadmin</option>
                        </select>
                    </div>
                </div>
                <div>    
                    <button className="edit-btn" onClick={() => handleClick()}>Guardar</button>
                </div>
                    <button className="exit" onClick={() => setSearchParams({})}><svg width="64px" height="32px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff">
                    <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                    <g id="SVGRepo_iconCarrier">
                        <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM8.96963 8.96965C9.26252 8.67676 9.73739 8.67676 10.0303 8.96965L12 10.9393L13.9696 8.96967C14.2625 8.67678 14.7374 8.67678 15.0303 8.96967C15.3232 9.26256 15.3232 9.73744 15.0303 10.0303L13.0606 12L15.0303 13.9696C15.3232 14.2625 15.3232 14.7374 15.0303 15.0303C14.7374 15.3232 14.2625 15.3232 13.9696 15.0303L12 13.0607L10.0303 15.0303C9.73742 15.3232 9.26254 15.3232 8.96965 15.0303C8.67676 14.7374 8.67676 14.2625 8.96965 13.9697L10.9393 12L8.96963 10.0303C8.67673 9.73742 8.67673 9.26254 8.96963 8.96965Z"
                        fill="#4a1c1c"
                        />
                    </g>
                    </svg>
                    </button>
            </div>

    )
}