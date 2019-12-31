import BaseModel from '@app/helpers/BaseModel'
import omit from 'lodash/omit'
import Password from 'objection-password-argon2'
import { v4 as uuid } from 'uuid'
import { snakeCaseMappers } from 'objection'
import { sendMail } from '@app/helpers/mailer'
import redis from '@app/helpers/redis'
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
        isVerfied: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time', readOnly: true },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  }

  $afterInsert() {
    // create a token on redis matched to user id
    const randomId = uuid()
    redis.set(`auth_${randomId}`, this.id)
    // Send a mail
    sendMail({
      deliveryOptions: {
        from: 'randomguy@email.com',
        to: this.email,
        subject: 'Please verify your e-mail id',
        html: `
          <h3>Welcome to our site!!!</h3>
          <hr/>
          <p>
            Please click <a href="http://localhost:8080/user/verify/${randomId}">here</a> to verify yoour account.<br>
            If you're unable to click the link above please paste the following in your browser.
            <pre>
              http://localhost:8080/user/verify/${randomId}
            </pre>
          </p>
          <br>
          <p>
          Thanks
          </p>
        `
      }
    })
  }

  $formatJson(jsonRaw) {
    const json = super.$formatJson(jsonRaw)
    return omit(json, ['password'])
  }
}
