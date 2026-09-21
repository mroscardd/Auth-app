const express = require('express')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const app = express()
const PORT = process.env.PORT

app.use(cors({origin: 'http://localhost:5173'}))
app.use(express.json())
app.use(cookieParser())

const authRoutes = require('./routes/authRoutes')
app.use('/api', authRoutes)


app.get('/', (req, res) => {
    console.log(req)
    
    return res.status(200).json({message:"hola"})
    
})

app.listen(PORT, () => {
    console.log("puerto: " + PORT)
})

