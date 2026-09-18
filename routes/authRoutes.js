const express = require('express')
const { MongoClient } = require('mongodb')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const jwtSetret = process.env.JWTSECRET
const { admin, autenticar } = require('../middleware')


const url = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@localhost:27017`
const client = new MongoClient(url)
const dbName = 'users'

router.get('/', (req, res) => {
    return res.status(200).json({message:"prueba"})
})

router.post('/register', async(req, res) => {
    const { username, password, email } = req.body
    try {
        await client.connect()

        const db = client.db(dbName)

        const collection = db.collection('usersdb')
        console.log('¡Conectado con éxito a MongoDB en Docker!');

        const existingusername = await collection.findOne({username})
        const existingemail = await collection.findOne({email})

        if (existingusername) {
            return res.status(409).json({message: "Ya existe ese usuario"})
        }

        if (existingemail) {
            return res.status(409).json({message: "El correo ya esta registrado"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        await collection.insertOne({
            username, 
            password: hashedPassword, 
            email, 
            role: "user"
        })
        role = await collection.findOne({username}).role

        const token = jwt.sign({username, email, role}, jwtSetret)

        
        res.status(201).json({message: "correctamente creado", token})
        
        
        } catch (error) {
            console.error(error)
            return res.status(500).json({message: "error"})
        }

})

router.post('/login', async(req, res) => {
    try{
        await client.connect()

        const db = client.db(dbName)

        const collection = db.collection('usersdb')
        console.log('¡Conectado con éxito a MongoDB en Docker!');

        const { username, password } = req.body
        const existinguser= await collection.findOne({username})
    
        if (!existinguser) {
           
            return res.status(401).json({message: "Credential are not correct"})
            
        } 
        console.log(password, existinguser.password)
        const isMatch = await bcrypt.compare(password, existinguser.password)

        if (isMatch ) {
            const email = existinguser.email
            const role = existinguser.role
            const token = jwt.sign({username, email, role}, jwtSetret)
     
            return res.status(200).json({message: "hola " + username, token})

        } else {
           
            return res.status(401).json({message: "Credential are not correct"})
        }

    } catch (error) {
       
        console.error(error)
        return res.status(500).json({message:"internal error"})
    }
})


router.get('/users', autenticar, admin, async(req, res) => {
    try {
        await client.connect()
        const db = client.db(dbName)
        const collection = db.collection('usersdb')
        console.log('¡Conectado con éxito a MongoDB en Docker!');


        const users = await collection.find().project({password: 0}).toArray()
           
        return res.status(200).json(users)
        } catch (error) {
            console.error(error)
                return res.status(500).json({message: "error"})
        }
})



module.exports = router
