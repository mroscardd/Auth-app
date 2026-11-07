import express from 'express'
import { superadmin, admin, autenticate } from '../middlewares/auth-middleware.js'
import { AuthRoutes } from '../controllers/authRoutes.js'
export const authRouter = express.Router()


/*==========================
            /api
===========================*/

authRouter.post('/register', AuthRoutes.register)
authRouter.post('/login', AuthRoutes.login)
authRouter.get('/logout', autenticate, AuthRoutes.logout)
authRouter.get('/me', autenticate, AuthRoutes.me)
authRouter.get('/users', autenticate, admin, AuthRoutes.getUsers)
authRouter.put('/user-role/:id', autenticate, admin, AuthRoutes.updateRole)
authRouter.delete('/users/:id', autenticate, superadmin, AuthRoutes.deleteUser)
authRouter.get('/dev', autenticate, AuthRoutes.dev)


