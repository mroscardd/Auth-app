import jwt from 'jsonwebtoken'
import { UserModel } from '../models/users.js'
import { SessionModel } from '../models/sessions.js'

const jwtSecret = process.env.JWTSECRET


export class AuthController {

    static async register(req, res) {
        const { username, password, email } = req.body
        try {
            const { id, username, email, role } = await UserModel.createUser(req.body)

            const token = jwt.sign({id, username, email, role}, jwtSecret, { expiresIn: '15min' })

            res.cookie(
                'accessToken', token, {
                    httpOnly: true,
                    sameSite: 'strict',
                    maxAge: 15 * 60 * 1000
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
                const token = jwt.sign({id: autenticatedUser._id, username, email, role}, jwtSecret, { expiresIn: '1min' })
                
                res.cookie(
                'accessToken', token, {
                    httpOnly: true,
                    sameSite: 'strict',
                    maxAge: 1 * 60 * 1000
                })


                return res.status(200).json({message: "hola " + username})
    
            } else if  (autenticatedUser && rememberMe) {
                const user_id = autenticatedUser._id
                const token_value = await SessionModel.createSession(user_id)
                const selector = token_value.selector
                const validator = token_value.validator

                const longSessionToken = `${selector}:${validator}`

                res.cookie(
                    'sessionToken', longSessionToken, {
                        httpOnly: true,
                        sameSite: 'strict',
                        maxAge: 7 * 24 * 60 * 60 * 1000
                    }
                )

                const email = autenticatedUser.email
                const role = autenticatedUser.role
                const token = jwt.sign({id: autenticatedUser._id, username, email, role}, jwtSecret, { expiresIn: '1min' })

                res.cookie(
                    'accessToken', token, {
                        httpOnly: true,
                        sameSite: 'strict',
                        maxAge: 1 * 60 * 1000
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
            const token = req.cookies.accessToken
            const longSessionToken = req.cookies.sessionToken

            if (longSessionToken) {
                const selector = longSessionToken.split(':')[0]
                await SessionModel.deleteUserSession(selector)
            }
            
            res.clearCookie('accessToken', {
                httpOnly: true,
                sameSite: 'strict'
            })

            res.clearCookie('sessionToken', {
                httpOnly: true,
                sameSite: 'strict'
            })

            return res.status(200).json({message: "You are logout"})
        } catch (error) {
            console.error(error)
            return res.status(500).json({message: "Internal error"})
        }
    }
}