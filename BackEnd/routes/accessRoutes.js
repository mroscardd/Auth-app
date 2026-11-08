import express from 'express'
import { AccessRoutes } from '../controllers/accessRoutes.js'
export const accessRouter = express.Router()


/*==========================
            /
===========================*/

accessRouter.post('/register', AccessRoutes.register)
accessRouter.post('/login', AccessRoutes.login)
accessRouter.get('/logout', AccessRoutes.logout)