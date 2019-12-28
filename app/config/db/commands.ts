import { NODE_ENV } from '@app/typings/shared'
import knexfile from '../../../knexfile'
import Knex from 'knex'
import { Model } from 'objection'

export function setupDB(env: NODE_ENV, returnInstance = false) {
  const knexConfig = knexfile[env]
  const knex = Knex(knexConfig)
  Model.knex(knex)
  if (returnInstance) {
    return knex
  }
}
