import {createContext, useContext, useState } from 'react'

const AppContext = createContext()

export const AuthProvider = ({children}) => {
    const [isLogged, setIsLogged] = useState(false)
    const [userName, setUserName] = useState('')

    return (
        <AppContext.Provider value={{ isLogged, setIsLogged, userName, setUserName }}>
            {children}
        </AppContext.Provider>
    )
}


export const UseAppContext = () => useContext(AppContext)