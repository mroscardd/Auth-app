import { useState } from 'react'
const env = import.meta.env
import './Registro.css'

const url = `http://localhost:${env.VITE_PORT}/api/register`

export function Registro() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: ''
    })

    const [notValid, setNotValid] = useState(false)
    const [passwordIssue, setPasswordIssue] = useState(false)
    const [response, setResponse] = useState('')

    const handleChange = (e, property) => {
        const value = e.target.value
        setFormData({...formData, [property]: value})
    }


    const handleOnBlur = () => {
        const username = formData.username
        if (username.length < 4 && username != '') {
            setNotValid(true)
        } else {
            setNotValid(false)
        }
    }

    const clean = () => {

        setFormData({
            username: '',
            password: '',
            email: ''       
        })
        setNotValid(false)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const password = formData.password
        if (password.length < 4) {
            setPasswordIssue(true)
            return
        }
        
        

        fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData)

        }).then(response => { return response.json().then(data => ({
            status: response.status,
            data: data
            }))
        })
          .then(({ status,  data }) => {
            
            if (status === 201) {
                setResponse(data.message)
                sessionStorage.setItem('token', data.token)
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
            <div className="registerContainer">
                <form className="registerForm" onSubmit={(e) => handleSubmit(e)}>
                    <h2>REGISTRO</h2>
                    <div className="fix">
                        <label htmlFor="username">Name</label>
                        <input 
                            type="text"
                            id = "name"
                            value={formData.username}
                            placeholder="Enter your name"
                            onChange={(e) => handleChange(e, "username")}
                            onBlur={() => handleOnBlur()}
                            required
                        />   
                        { notValid && <small>* El usuario debe tener más de 3 caracteres</small> }
                    </div>
                    <div className="fix">
                        <label htmlFor="email">Email</label>
                        <input 
                            type="email"
                            id = "email"
                            value={formData.email}
                            placeholder="Enter your email"
                            onChange={(e) => handleChange(e, "email")}
                            required
                        />
                    </div>
                    <div className="fix">
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password"
                            id = "password"
                            value={formData.password}
                            placeholder="Enter your password"
                            onChange={(e) => handleChange(e, "password")}
                            required
                        />
                        { passwordIssue && <small>* La contraseña debe tener más de 3 caracteres</small> }
                    </div>    

                    <button type="submit">Registrarse</button>
                </form>
                <div>
                   { response != '' && <p>{ response }</p> }
                </div>
            </div>
        </div>
    )
}