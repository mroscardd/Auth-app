import express from 'express'
import { superadmin, admin, autenticate } from '../middlewares/auth-middleware.js'
import { AuthController } from '../controllers/authController.js'
export const usersRouter = express.Router()


/*==========================
            /api
===========================*/


usersRouter.get('/me', autenticate, AuthController.me)
usersRouter.get('/users', autenticate, admin, AuthController.getUsers)
usersRouter.put('/users/:id', autenticate, admin, AuthController.updateRole)
usersRouter.delete('/users/:id', autenticate, superadmin, AuthController.deleteUser)

