import express from 'express'
import {
  LoginHandler,
  RegisterHandler,
  ProfileHandler,
  ShowAllHandler
} from './user.controller'

const routes = express.Router()

routes.post('/register', RegisterHandler)
routes.post('/login', LoginHandler)
routes.get('/profile', ProfileHandler)
routes.get('/all', ShowAllHandler)

export default routes
