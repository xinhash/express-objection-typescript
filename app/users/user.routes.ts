import express from 'express'
import { LoginHandler, RegisterHandler } from './user.controller'

const routes = express.Router()

routes.post('/register', RegisterHandler)
routes.post('/login', LoginHandler)

export default routes
