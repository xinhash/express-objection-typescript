import BaseModel from '@app/helpers/BaseModel'
import omit from 'lodash/omit'
import Password from 'objection-password-argon2'
import { snakeCaseMappers } from 'objection'
export default class User extends Password({ passwordField: 'password' })(
  BaseModel
) {
  id: string
  email: string
  password: string
  username: string

  public static tableName = 'users'
  public static columnNameMappers = snakeCaseMappers()

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['username', 'email', 'password'],

      properties: {
        id: { type: 'string', format: 'uuid', readOnly: true },
        username: {
          type: 'string',
          minLength: 5,
          maxLength: 15
        },
        email: {
          type: 'string',
          index: { unique: true }
        },
        password: { type: 'string' },
        role: {
          type: 'string',
          enum: ['admin', 'user', 'manager'],
          default: 'user'
        },
        createdAt: { type: 'string', format: 'date-time', readOnly: true },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  }

  $formatJson(jsonRaw) {
    const json = super.$formatJson(jsonRaw)
    return omit(json, ['password'])
  }
}
