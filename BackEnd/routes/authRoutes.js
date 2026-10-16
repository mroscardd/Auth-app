const express = require('express')
const router = express.Router()
const { superadmin, admin, autenticate } = require('../middlewares/auth-middleware')
const AuthRoutes = require('../controllers/authRoutes')



router.post('/register', AuthRoutes.register)
router.post('/login', AuthRoutes.login)
router.get('/logout', autenticate, AuthRoutes.logout)
router.get('/me', autenticate, AuthRoutes.me)
router.get('/users', autenticate, admin, AuthRoutes.getUsers)
router.put('/user-role/:id', autenticate, admin, AuthRoutes.updateRole)



module.exports = router
