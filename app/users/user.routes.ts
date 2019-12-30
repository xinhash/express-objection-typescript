import express from 'express'
import {
  LoginHandler,
  RegisterHandler,
  ProfileHandler
} from './user.controller'

const routes = express.Router()

routes.post('/register', RegisterHandler)
routes.post('/login', LoginHandler)
routes.get('/profile', ProfileHandler)

export default routes
