import BaseModel from '@app/helpers/BaseModel'
import { createPassword } from '@app/utils/password'
import { v4 as uuid } from 'uuid'

export default class User extends BaseModel {
  id: string
  email: string
  password: string
  username: string

  static get tableName() {
    return 'users'
  }

  $beforeInsert() {
    this.id = uuid()
    this.email = this.email.trim().toLowerCase()
    this.password = createPassword(this.password)
  }

  $beforeUpdate() {
    delete this.id
    delete this.createdAt
    const now = new Date().toISOString()
    this.updatedAt = now
  }
}
