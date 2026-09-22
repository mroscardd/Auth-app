import './App.css'
import  { Registro } from './components/registro/Registro'
import { Login } from './components/login/Login'
import { Navbar } from './components/navbar/Navbar'
import { Routes, Route} from 'react-router-dom'

function App() {
  

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<h1>Pagina principal</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registro />} />
      </Routes>
    </>
  )
}

export default App
