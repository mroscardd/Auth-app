import {createContext, useContext, useState, useEffect } from 'react'
const env = import.meta.env

const url = `${env.VITE_API}/api/me`

const AppContext = createContext()

export const AuthProvider = ({children}) => {
    const [isLogged, setIsLogged] = useState(false)
    const [userName, setUserName] = useState('')
    const [userRole, setUserRole] = useState('')

    const login = () => {
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
                    setUserRole(data.user.role)
                    
                }
            }).catch(error => {console.log(error)})

    }

    useEffect(()=>{
        login()
    }, [])
    
    console.log(isLogged)
    return (
        <AppContext.Provider value={{ isLogged, setIsLogged, userName, setUserName, userRole, login }}>
            {children}
        </AppContext.Provider>
    )
}


export const UseAppContext = () => useContext(AppContext)