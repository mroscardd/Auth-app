import { useState } from 'react'
const env = import.meta.env
import './Login.css'
import { UseAppContext } from '../../context/AuthContext'

const url = `http://localhost:${env.VITE_PORT}/api/login`



export function Login() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })

    const { setIsLogged, setUserName } = UseAppContext()

    const [response, setResponse] = useState('')

    const handleChange = (e, property) => {
        const value = e.target.value
        setFormData({...formData, [property]: value})
    }



    const clean = () => {

        setFormData({
            username: '',
            password: '',
            email: ''       
        })
    
    }

    const handleSubmit = (e) => {
        e.preventDefault()
       
        fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData)

        }).then(response => { return response.json().then(data => ({
            status: response.status,
            data: data
            }))
        })
          .then(({ status,  data }) => {
            
            if (status === 200) {
                setResponse(data.message)
                setIsLogged(true)
                setUserName(formData.username)
                clean()
            } else {
                setResponse(data.message)
            }
            
        })
        .catch(error => {
        console.log(error)
        setResponse("Ha habido un problema al enviar la solicitud")
    })
}

    return (
        <div>
            <div className="loginContainer">
                <form className="loginForm" onSubmit={(e) => handleSubmit(e)}>
                    <h2>Login</h2>
                    <div className="fix">
                        <label htmlFor="log-name">Name</label>
                        <input 
                            type="text"
                            id = "log-name"
                            value={formData.username}
                            placeholder="Enter your name"
                            onChange={(e) => handleChange(e, "username")}
                            required
                        />   
                    </div>
              
                    <div className="fix">
                        <label htmlFor="log-password">Password</label>
                        <input 
                            type="password"
                            id = "log-password"
                            value={formData.password}
                            placeholder="Enter your password"
                            onChange={(e) => handleChange(e, "password")}
                            required
                        />
                    </div>    

                    <button type="submit">Iniciar sesión</button>
                </form>
                <div>
                   { response != '' && <p>{ response }</p> }
                </div>
            </div>
        </div>
    )
}