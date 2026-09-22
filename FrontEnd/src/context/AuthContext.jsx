import {createContext, useContext, useState, useEffect } from 'react'
const env = import.meta.env

const url = `http://localhost:${env.VITE_PORT}/api/me`

const AppContext = createContext()

export const AuthProvider = ({children}) => {
    const [isLogged, setIsLogged] = useState(false)
    const [userName, setUserName] = useState('')

    useEffect(() => {
        fetch(url, {
                    method: 'GET',
                    credentials: 'include' 
                })
        .then(response => { return response.json().then(data => ({
            status: response.status,
            user: data.user
            }))})
        .then(data => {
            if (data.status === 200) {
                setIsLogged(true)
                setUserName(data.user.username)
            }
        }).catch(error => {console.log(error)})


    }, [])

    return (
        <AppContext.Provider value={{ isLogged, setIsLogged, userName, setUserName }}>
            {children}
        </AppContext.Provider>
    )
}


export const UseAppContext = () => useContext(AppContext)