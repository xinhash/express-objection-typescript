import { setupDB } from '@app/config/db/commands'
import app from '@app/server'
import { NODE_ENV } from '@app/types/common'
import getRandomItem from '@app/utils/common'
import { verifyToken } from '@app/utils/token'
import { cloneDeep } from 'lodash'
import request from 'supertest'

describe('User endpoints', () => {
  let server
  let knex
  let token
  const userCreds = {
    user: {
      email: 'test@test.com',
      password: 'password',
      username: 'Test User'
    }
  }

  beforeAll(async done => {
    //set TEST env
    process.env.JWT_SECRET = 'secret'
    const port = '8081'
    // setup db
    knex = setupDB(NODE_ENV.staging, true)
    await knex.migrate.rollback()
    await knex.migrate.latest()
    //load app
    server = app.listen(port, () => {
      done()
    })
  })

  afterAll(async done => {
    // Closing the DB connection allows Jest to exit successfully.
    await knex.destroy()
    server.close()
    done()
  })

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/user/register')
      .set('Content-Type', 'application/json')
      .set('Acccept', 'application/json')
      .send(userCreds)
    expect(res.status).toEqual(201)
    expect(res.body).toHaveProperty('message')
  })

  it('should not register user with missing details', async () => {
    const newUserCreds = cloneDeep(userCreds)
    const inputKeys: string[] = Object.keys(newUserCreds.user)
    const randomKeyToDelete: string = getRandomItem(inputKeys)
    newUserCreds.user[randomKeyToDelete] = ''
    const res = await request(app)
      .post('/user/register')
      .set('Content-Type', 'application/json')
      .set('Acccept', 'application/json')
      .send(newUserCreds)
    expect(res.status).toEqual(422)
    expect(res.body).toHaveProperty('errors')
    expect(res.body.errors.join(',')).toContain(randomKeyToDelete)
  })

  it('should login user and provide them a token', async () => {
    const loginCreds = {
      user: {
        email: userCreds.user.email,
        password: userCreds.user.password
      }
    }
    const res = await request(app)
      .post('/user/login')
      .set('Content-Type', 'application/json')
      .set('Acccept', 'application/json')
      .send(loginCreds)
    expect(res.status).toEqual(200)
    expect(res.body).toHaveProperty('token')
    token = res.body.token
    const userId = verifyToken(token)
    expect(userId).toHaveProperty('data')
    expect(userId.data).toBeTruthy()
  })

  it('should provide user details if authenticated', async () => {
    const res = await request(app)
      .get('/user/profile')
      .set('Content-Type', 'application/json')
      .set('Acccept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toEqual(200)
    expect(res.body).toHaveProperty('data')
    expect(res.body.data).not.toHaveProperty('password')
    expect(res.body.data).toHaveProperty('email')
    expect(res.body.data).toHaveProperty('username')
  })
})
