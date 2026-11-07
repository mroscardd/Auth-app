import jwt from 'jsonwebtoken'
import { SessionModel } from '../models/sessions.js'
import { UserModel } from '../models/users.js'
import bcrypt from 'bcrypt'

const jwtSecret = process.env.JWTSECRET

export const autenticate = async(req, res, next) => {
    const token = req.cookies.accessToken
    const longSessionToken = req.cookies.sessionToken

    try {
    if (!token && !longSessionToken) {
        return res.status(401).json({message:"You have to loggin/register"})
    }

    let accessTokenExpired = false
    if (token){
        try {
            const payload = jwt.verify(token, jwtSecret)
            req.user = payload
            return next()
        } catch(error) {
            if (error.name !== 'TokenExpiredError'){
                throw error
            }
            accessTokenExpired = true
        }

    } 

    if (!token || accessTokenExpired) {
        const selector = longSessionToken.split(':')[0]
        const validator = longSessionToken.split(':')[1]
        const userSession = await SessionModel.findUserSession(selector)
        
        if (!userSession) {
            res.clearCookie('sessionToken', {
                httpOnly: true,
                sameSite: 'strict'
            })
            return res.status(401).json({message:"We have a problem"})
        }

        if (Date.now() > userSession.expiresAt.getTime()) {
            await SessionModel.deleteUserSession(selector)
            res.clearCookie('sessionToken', {
                httpOnly: true,
                sameSite: 'strict'
            })
            return res.status(401).json({message:"Session expired, loggin again"})
        }
          
        const match = await bcrypt.compare(validator, userSession.validator)
    
        if (!match) {   
            await SessionModel.deleteUserSession(selector)
            res.clearCookie('sessionToken', {
                httpOnly: true,
                sameSite: 'strict'
            })
            
            return res.status(401).json({message:"Inconsistent cookies"})
        }
        
        const user = await UserModel.getUserById(userSession.user_id)

        if (user){
        const payload = {
            id: user._id.toString(), 
            username: user.username,
            email: user.email, 
            role: user.role
        }
        

        const {newValidator} = await SessionModel.refreshSession(selector, validator)

        const stringSessionToken = `${selector}:${newValidator}`

        res.cookie(
            'sessionToken', stringSessionToken, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 7 * 60 * 60 * 1000
            }
        )
        
        const email = user.email
        const role = user.role
        const username = user.username
        const token = jwt.sign({id: user._id, username, email, role}, jwtSecret, { expiresIn: '15min' })
        
        res.cookie(
            'accessToken', token, {
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000
            })
        req.user = payload

        } else {
            throw new Error("No user exist")
        }
        return next()

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
