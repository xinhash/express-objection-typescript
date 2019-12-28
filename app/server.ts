import bodyParser from 'body-parser'
import express from 'express'
import glob from 'glob-fs'
import morgan from 'morgan'
import { NODE_ENV } from './typings/shared'
const app = express()
app.use(bodyParser.json())

// Middlewares
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

export default app
