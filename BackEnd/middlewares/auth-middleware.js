import jwt from 'jsonwebtoken'
import { SessionModel } from '../models/sessions.js'
import { UserModel } from '../models/users.js'
import bcrypt from 'bcrypt'

const jwtSecret = process.env.JWTSECRET

export const autenticate = async(req, res, next) => {
    const token = req.cookies.token
    const longSessionToken = req.cookies.session

    try {
    if (!token && !longSessionToken) {
        return res.status(401).json({message:"You have to loggin/register"})
    }

    let payload
    if (token){

        payload = jwt.verify(token, jwtSecret)
        console.log(payload)
        req.user = payload
        next()

    } else {
        const selector = longSessionToken.split(':')[0]
        const validator = longSessionToken.split(':')[1]
        const userSession = await SessionModel.findUserSession(selector)
        if (Date.now() > userSession.expiresAt) {
            return res.status(401).json({message:"Session expired, loggin again"})
        }

        const match = await bcrypt.compare(validator, userSession.validator)

        if (!match) {   
            await SessionModel.deleteUserSession(selector)
            console.log('check')
            res.clearCookie('session', {
                httpOnly: true,
                sameSite: 'strict'
            })
            
            return res.status(401).json({message:"Inconsistent cookies"})
        }

        const user = await UserModel.getUserById(userSession.user_id)

        payload = {
            id: user._id.toString(), 
            username: user.username,
            email: user.email, 
            role: user.role
        }
        console.log(payload)
        req.user = payload
        next()

    } 
    

    } catch (error) {
        console.error(error)
        return res.status(401).json({message:"loggin again"})
    }

}

export const admin = (req, res,next) => {
    const userInfo = req.user

    if (userInfo && (userInfo.role === 'admin' || userInfo.role === 'superadmin')) {
       
        return next()  
    }

    return res.status(403).json({message:"you can't access", userInfo})

}

export const superadmin = (req, res,next) => {
    const userInfo = req.user
    if (!userInfo || userInfo.role !== 'superadmin') {

        return res.status(403).json({message:"you can't access", userInfo})
    }
    
    next()

}
