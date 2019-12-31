import express from 'express'
import {
  LoginHandler,
  RegisterHandler,
  ProfileHandler,
  ShowAllHandler,
  VerifyUserHandler
} from './user.controller'

const routes = express.Router()

routes.post('/register', RegisterHandler)
routes.post('/login', LoginHandler)
routes.get('/verify/:id', VerifyUserHandler)
routes.get('/profile', ProfileHandler)
routes.get('/all', ShowAllHandler)

export default routes
