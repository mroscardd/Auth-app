const express = require('express')
const jwt = require('jsonwebtoken')
process.loadEnvFile()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const app = express()
const PORT = process.env.PORT
const { connectDB } = require('./config/database')



app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    }))
app.use(express.json())
app.use(cookieParser())

const authRoutes = require('./routes/authRoutes')
app.use('/api', authRoutes)


app.get('/', (req, res) => {
    console.log(req)
    
    return res.status(200).json({message:"hola"})
    
})


async function startServer() {
    try {
        await connectDB()

        app.listen(PORT, () => {
            console.log("puerto: " + PORT)
        })
    } catch (error) {
        console.error('Error al iniciar la aplicación:', error)
        process.exit(1)
    }
}

startServer()

