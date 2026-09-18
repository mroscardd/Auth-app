const express = require('express')
require('dotenv').config()
const app = express()
const jwt = require('jsonwebtoken')
const authRoutes = require('./routes/authRoutes')
app.use(express.json())

const PORT = process.env.PORT

app.use('/api', authRoutes)




app.get('/', (req, res) => {
    console.log(req)
    
    return res.status(200).json({message:"hola"})
    
})

app.listen(PORT, () => {
    console.log("puerto: " + PORT)
})

