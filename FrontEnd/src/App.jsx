import { useState } from 'react'
import './App.css'
import  { Registro } from './components/registro/Registro'
import { Login } from './components/login/Login'
import { Navbar } from './components/navbar/Navbar'

function App() {
  

  return (
    <>
      <Navbar />
      <Registro/>
      <Login />
    </>
  )
}

export default App
