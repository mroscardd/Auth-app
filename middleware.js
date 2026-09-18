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
    if (!userInfo || userInfo.role !== 'admin') {
        return res.status(403).json({message:"you can't access", admin, userInfo})
    }

    next()

    
}

module.exports = { admin, autenticar }