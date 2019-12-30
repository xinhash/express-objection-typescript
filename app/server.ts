import bodyParser from 'body-parser'
import express from 'express'
import glob from 'glob-fs'
import morgan from 'morgan'
import jwt from 'express-jwt'
import cors from 'cors'
import graphqlHTTP from 'express-graphql'
import { NODE_ENV } from './types/common'
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
    path: ['/user/register', '/user/login']
  })
)

if (process.env.NODE_ENV === NODE_ENV.development) {
  app.use(morgan('combined'))
}

// register routes
const files: string[] = glob({ gitignore: true }).readdirSync(
  './app/**/*.routes.*',
  {}
)
if (files) {
  files.forEach(async (file: string) => {
    file = file.replace('app/', '')
    if (process.env.NODE_ENV === 'production') {
      file = file.replace('.ts', '.js')
    }
    const fileNameMatches: string[] | null = file.match(/[a-z]+.routes./g)
    if (fileNameMatches) {
      const dynamicRoute = fileNameMatches[0]
        .split('.route')[0]
        .split('/')
        .reverse()[0]
      app.use(`/${dynamicRoute}`, (await import(`./${file}`)).default)
    }
  })
}

app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphQlSchema,
    graphiql: true
  })
)

export default app
