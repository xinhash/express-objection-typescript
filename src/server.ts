import 'reflect-metadata'
import { useExpressServer } from 'routing-controllers'
import bodyParser from 'body-parser'
import express from 'express'
import morgan from 'morgan'
import jwt from 'express-jwt'
import cors from 'cors'
import graphqlHTTP from 'express-graphql'
import graphQlSchema from './graphQlSchema'
const app = express()
app.use(bodyParser.json())

// Middlewares
app.use(cors())

app.use(
  jwt({
    secret: process.env.JWT_SECRET || 'secret',
    credentialsRequired: false,
    getToken: function fromHeaderOrQuerystring(req) {
      if (req?.headers?.authorization?.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1]
      } else if (req.query?.token) {
        return req.query.token
      }
      return null
    }
  }).unless({
    path: ['/user/register', '/user/login', '/user/verify']
  })
)

app.use(morgan('combined'))

app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphQlSchema,
    graphiql: true
  })
)

useExpressServer(app, {
  routePrefix: '/api/v1',
  controllers: [__dirname + '/features/**/*.controller.ts']
})

export default app
