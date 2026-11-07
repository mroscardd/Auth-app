import './Filters.css'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
const env = import.meta.env



export function Filters({totalUsers}) {
    const [role, setRole] = useState('')
    const [input, setInput] = useState('')
    const [searchParams, setSearchParams] = useSearchParams()

    const handleRoleChange = (e) => {
        if(e.target.value === ''){
            setRole(e.target.value)
            setSearchParams({})
        } else {
            setRole(e.target.value)
            setSearchParams({role: e.target.value})
        }
    }  

    const handleInputChange = (e) => {
        if(e.target.value === ''){
            setInput(e.target.value)
            setSearchParams({})
        } else {
            setInput(e.target.value)
            setTimeout(() => {
            setSearchParams({search: e.target.value})
            }, 1000)
        }
    } 

    return (
        <div className="filtersContainer">
            <div className="searchBox">
                <svg width="32px" height="32px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier"> 
                    <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="#777777" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> 
                </g></svg>
                <input 
                    type="text" 
                    id="searchInput" 
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Buscar"
                />
            </div>
            <div className="select-total">
                <div className="selectContainer">
                    <select id="role-select" value={role} onChange={(e) => handleRoleChange(e)}>
                        <option value={''}>Select role</option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div>
                    <div className="totalCard">
                        <h4>Usuarios</h4>
                        <span>{totalUsers}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}