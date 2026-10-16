const { MongoClient } = require('mongodb')
const bcrypt = require('bcrypt')
const { ObjectId } = require('mongodb')
const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWTSECRET
const url = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@localhost:${process.env.MONGO_PORT}`
const client = new MongoClient(url)
const dbName = 'usersdb'
const UserModel = require('../models/users.js')


class AuthRoutes {


    static async register(req, res) {
        const { username, password, email } = req.body
        try {
  
            const { id, username, email, role } = await UserModel.createUser(req.body)

            const token = jwt.sign({id, username, email, role}, jwtSecret, { expiresIn: '24h' })

            res.cookie(
                'token', token, {
                    httpOnly: true,
                    sameSite: 'strict',
                    maxAge: 24 * 60 * 60 * 1000
                })
            
            res.status(201).json({message: "Registro exitoso!"})
        
        
        } catch (error) {
            console.error(error)

            if (error.message === 'USERNAME_TAKEN'){
                return res.status(409).json({message: "El usuario ya existe"})
            } 
            if (error.message === 'EMAIL_TAKEN') {
                return res.status(409).json({message: "El email ya existe"})
            } 
            if (error.message === "DATABASE_ERROR") {
                return res.status(500).json({message: "Problema interno de la base de datos"})
            }
            return res.status(500).json({ message: "Problema interno"});
        }
        
    }

    static async login(req, res) {
        const { username, password } = req.body
        try{
        
            const existinguser = await UserModel.findExistingUser(req.body)
        
            if (!existinguser) {
            
                return res.status(401).json({message: "Credential are not correct"})
                
            } 

            const isMatch = await bcrypt.compare(password, existinguser.password)

            if (isMatch ) {
                const email = existinguser.email
                const role = existinguser.role
                const token = jwt.sign({_id: existinguser._id, username, email, role}, jwtSecret, { expiresIn: '24h' })
                
                res.cookie(
                    'token', token, {
                        httpOnly: true,
                        sameSite: 'strict',
                        maxAge: 24 * 60 * 60 * 1000
                    })

                return res.status(200).json({message: "hola " + username})

            } else {
            
                return res.status(401).json({message: "Credential are not correct"})
            }

        } catch (error) {
        
            console.error(error)
            return res.status(500).json({message:"internal error"})
        }   
    }

    static async logout(req, res) {
        try{
            const token = req.cookies.token
            res.clearCookie('token', {
                httpOnly: true,
                sameSite: 'strict'
            });

            return res.status(200).json({message: "You are logout"})
        } catch (error) {
            console.error(error)
            return res.status(500).json({message: "Internal error"})
        }
    }

    static async me(req, res) {
        res.status(200).json({user: req.user})
    }

    static async getUsers(req, res) {
        try {
            
            const users = await UserModel.getAllUser()

            const usersShown = users.filter(user => user.username !== req.user.username && user.role !== 'superadmin')
            
            return res.status(200).json(usersShown)
        } catch (error) {
            console.error(error)
            return res.status(500).json({message: "error"})
        }
    }

    static async updateRole(req, res) {
        const user_role = req.user.role
        const user_id = req.user._id
        const id = req.params.id
        try{
            
            if (id === user_id) {
                return res.status(409).json({ message: "No puedes modificar tus permisos" })
            }


            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ message: "ID no válido" })
            }

            await client.connect()
            const db = client.db(dbName)
            const collection = db.collection('users')
            console.log('Conectado con éxito a MongoDB');

            
            const _id = new ObjectId(id)
            const user = await collection.findOne({ _id })

        
            if (!user) {
                console.log(user)
                return res.status(404).json({message:"User dont exist"})
            }
            if (user_role !== "superadmin" && user.role === "admin") {
                return res.status(403).json({message:"You cant modify admin users"})
            }

            if (user.role === "superadmin") {
                return res.status(409).json({message:"You cant modify superadmin"})
            }

            const { role } = req.body
            req.body.role = role

            const userUpdated = await collection.findOneAndUpdate({ _id },{ $set: { role: role } }, { returnDocument: 'after', projection: { password: 0 } })
    
            res.status(200).json({message: "Updated successfully", userUpdated})
        

            } catch (error) {
                console.error(error)
                res.status(500).json({message: "Internal problem"})
            }
    }
}

module.exports = AuthRoutes