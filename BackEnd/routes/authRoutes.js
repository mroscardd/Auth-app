import express from 'express'
import { superadmin, admin, autenticate } from '../middlewares/auth-middleware.js'
import { AuthController } from '../controllers/authController.js'
export const authRouter = express.Router()


/*==========================
            /api
===========================*/


authRouter.get('/me', autenticate, AuthController.me)
authRouter.get('/users', autenticate, admin, AuthController.getUsers)
authRouter.put('/users/:id', autenticate, admin, AuthController.updateRole)
authRouter.delete('/users/:id', autenticate, superadmin, AuthController.deleteUser)


