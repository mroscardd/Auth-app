import express from 'express'
import { AuthController } from '../controllers/authController.js'
export const accessRouter = express.Router()


/*==========================
            /
===========================*/

accessRouter.post('/register', AuthController.register)
accessRouter.post('/login', AuthController.login)
accessRouter.post('/logout', AuthController.logout)