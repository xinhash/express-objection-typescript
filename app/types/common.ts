import { Request, RequestHandler } from 'express'
export enum NODE_ENV {
  development = 'development',
  staging = 'staging',
  production = 'production'
}

export enum USER_ROLES {
  user = 'user',
  manager = 'manager',
  admin = 'admin'
}
