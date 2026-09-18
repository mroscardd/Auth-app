const express = require('express')
const { MongoClient } = require('mongodb')
const router = express.Router()
const bcrypt = require('bcrypt')
const { ObjectId } = require('mongodb')
const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWTSECRET
const { admin, autenticar } = require('../middlewares/auth-middleware')


const url = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@localhost:${process.env.MONGO_PORT}`
const client = new MongoClient(url)
const dbName = 'usersdb'

router.get('/', (req, res) => {
    return res.status(200).json({message:"prueba"})
})

router.post('/register', async(req, res) => {
    const { username, password, email } = req.body
    try {
        await client.connect()

        const db = client.db(dbName)

        const collection = db.collection('users')
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
        const { _id, role } = await collection.findOne({username})

        const token = jwt.sign({_id, username, email, role}, jwtSecret)

        
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

        const collection = db.collection('users')
        console.log('Conectado con éxito a MongoDB');

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
            const token = jwt.sign({_id: existinguser._id, username, email, role}, jwtSecret)
     
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
        const collection = db.collection('users')
        console.log('Conectado con éxito a MongoDB');


        const users = await collection.find().project({password: 0}).toArray()
           
        return res.status(200).json(users)
        } catch (error) {
            console.error(error)
                return res.status(500).json({message: "error"})
        }
})

router.put('/user_role/:id', async(req, res) => {
    try{
        await client.connect()
        const db = client.db(dbName)
        const collection = db.collection('users')
        console.log('Conectado con éxito a MongoDB');

        const id = req.params.id
        const _id = new ObjectId(id)

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID no válido" });
        }

        const user = await collection.findOne({ _id })

       
        if (!user) {
            console.log(user)
            return res.status(404).json({message:"User dont exist"})
        }
        if (user.role === "admin") {
            return res.status(403).json({message:"You cant modify admin users"})
        }
        const { role } = req.body

        const userUpdated = await collection.findOneAndUpdate({ _id },{ $set: { role: role } }, { returnDocument: 'after' })
   
        res.status(200).json({message: "Updated successfully", userUpdated})
        

    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Internal problem"})
    }
})



module.exports = router
