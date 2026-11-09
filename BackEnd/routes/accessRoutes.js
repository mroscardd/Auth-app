import express from 'express'
import { AccessController } from '../controllers/accessController.js'
export const accessRouter = express.Router()


/*==========================
            /
===========================*/

accessRouter.post('/register', AccessController.register)
accessRouter.post('/login', AccessController.login)
accessRouter.get('/logout', AccessController.logout)