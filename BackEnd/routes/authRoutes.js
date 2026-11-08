import express from 'express'
import { superadmin, admin, autenticate } from '../middlewares/auth-middleware.js'
import { AuthRoutes } from '../controllers/authRoutes.js'
export const authRouter = express.Router()


/*==========================
            /api
===========================*/


authRouter.get('/me', autenticate, AuthRoutes.me)
authRouter.get('/users', autenticate, admin, AuthRoutes.getUsers)
authRouter.put('/users/:id', autenticate, admin, AuthRoutes.updateRole)
authRouter.delete('/users/:id', autenticate, superadmin, AuthRoutes.deleteUser)


