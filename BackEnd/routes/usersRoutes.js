import express from 'express'
import { superadmin, admin, autenticate } from '../middlewares/auth-middleware.js'
import { UsersController } from '../controllers/usersController.js'
export const usersRouter = express.Router()


/*==========================
            /api
===========================*/


usersRouter.get('/me', autenticate, UsersController.me)
usersRouter.get('/users', autenticate, admin, UsersController.getUsers)
usersRouter.put('/users/:id', autenticate, admin, UsersController.updateRole)
usersRouter.delete('/users/:id', autenticate, superadmin, UsersController.deleteUser)

