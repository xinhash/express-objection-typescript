import { Model } from 'objection'

export default class BaseModel extends Model {
  createdAt: string
  updatedAt: string

  $beforeInsert() {
    const now = new Date().toISOString()
    this.createdAt = now
    this.updatedAt = now
  }

  $beforeUpdate() {
    const now = new Date().toISOString()
    this.updatedAt = now
  }
}
