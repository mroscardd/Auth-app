import jwt from 'jsonwebtoken'

const jwtSecret = process.env.JWTSECRET

export const autenticate = (req, res, next) => {
    const token = req.cookies.token
    const longSessionToken = req.cookies.session

    try {
    if (!token && !longSessionToken) {
        return res.status(401).json({message:"You have to loggin/register"})
    }

    let payload
    if (longSessionToken) {

        req.user = payload
        next()

    } else {
        
        payload = jwt.verify(token, jwtSecret)
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
