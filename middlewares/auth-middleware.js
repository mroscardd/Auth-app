const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWTSECRET

const autenticar = (req, res, next) => {
    const bearer = req.headers.authorization

    try {
    if (!bearer) {
        return res.status(401).json({message:"You have to loggin/register"})
    }
    const token = bearer.split(' ')[1]
    const payload = jwt.verify(token, jwtSecret)
    req.user = payload
    next()

    } catch (error) {
        console.error(error)
        return res.status(401).json({message:"loggin again"})
    }

}

const admin = (req, res,next) => {
    const userInfo = req.user
    console.log(userInfo)
    if (userInfo && (userInfo.role === 'admin' || userInfo.role === 'superadmin')) {
       
        return next()  
    }
    return res.status(403).json({message:"you can't access", userInfo})

}

const superadmin = (req, res,next) => {
    const userInfo = req.user
    if (!userInfo || userInfo.role !== 'superadmin') {

        return res.status(403).json({message:"you can't access", userInfo})
    }

    next()

    
}

module.exports = { superadmin, admin, autenticar }