import jwt from 'jsonwebtoken'
import { UserModel } from '../models/users.js'
import { SessionModel } from '../models/sessions.js'

const jwtSecret = process.env.JWTSECRET


export class AuthRoutes {


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
        const { username, rememberMe } = req.body
        try{
        
            const autenticatedUser = await UserModel.findAutenticatedUser(req.body)
       
            if (autenticatedUser && !rememberMe) {
                const email = autenticatedUser.email
                const role = autenticatedUser.role
                const token = jwt.sign({id: autenticatedUser._id, username, email, role}, jwtSecret, { expiresIn: '24h' })
                
                res.cookie(
                'token', token, {
                    httpOnly: true,
                    sameSite: 'strict',
                    maxAge: 24 * 60 * 20 * 1000
                })


                return res.status(200).json({message: "hola " + username})
   
            } else if  (autenticatedUser && rememberMe) {
                const user_id = autenticatedUser._id
                const token_value = await SessionModel.createSession(user_id)
                const selector = token_value.selector
                const validator = token_value.validator

                const longSessionToken = `${selector}:${validator}`

                res.cookie(
                    'session', longSessionToken, {
                        httpOnly: true,
                        sameSite: 'strict',
                        maxAge: 30 * 24 * 60 * 60 * 1000
                    }
                )

                const email = autenticatedUser.email
                const role = autenticatedUser.role
                const token = jwt.sign({id: autenticatedUser._id, username, email, role}, jwtSecret, { expiresIn: '24h' })

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
            const longSessionToken = req.cookies.session

            if (longSessionToken) {
                const selector = longSessionToken.split(':')[0]
                await SessionModel.deleteUserSession(selector)
            }
           
            res.clearCookie('token', {
                httpOnly: true,
                sameSite: 'strict'
            })

            res.clearCookie('session', {
                httpOnly: true,
                sameSite: 'strict'
            })

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
        const LIMIT = 5
        const { page } = req.query
        const user = req.user
            
        try {
            
            const dataUsers = await UserModel.getAllUser({ page, LIMIT, user })

            const usersShown = dataUsers.users
            const totalUsers = dataUsers.totalUsers
            const totalPages = Math.ceil(dataUsers.totalUsers/LIMIT)

            return res.status(200).json({
                totalUsers,
                totalPages,
                usersShown
            })
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

            const user = await UserModel.getUserById(id)

        
            if (!user) {
                return res.status(404).json({message:"UserId dont exist"})
            }
            if (user_role !== "superadmin" && user.role === "admin") {
                return res.status(403).json({message:"You cant modify admin users"})
            }

            if (user.role === "superadmin") {
                return res.status(409).json({message:"You cant modify superadmin"})
            }

            const userUpdated = await UserModel.updateUser({role: req.body.role}, id)
    
            res.status(200).json({message: "Updated successfully", userUpdated})
        
            } catch (error) {
                console.error(error)
                if (error.message === "NO_VALID_ID") {
                    return res.status(400).json({ message: "UserId dont exist" })
                }
                res.status(500).json({message: "Internal problem"})
            }
    }
}

