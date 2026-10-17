import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { connectDB } from './config/database.js'
import { authRouter } from './routes/authRoutes.js'



const app = express()
const PORT = process.env.PORT


app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    }))


app.use('/api', authRouter)


app.get('/health', (req, res) => {
    return res.status(200).json({status:"ok", sesion: process.uptime()})
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

