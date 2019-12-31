import { setupDB } from '@app/config/db/commands'
import app from '@app/server'
import { NODE_ENV } from '@app/types/common'
import getRandomItem from '@app/utils/common'
import { verifyToken } from '@app/utils/token'
import { cloneDeep } from 'lodash'
import request from 'supertest'

describe('Authentication endpoints', () => {
  let server
  let knex
  let authToken
  const authUrl = '/api/v1/auth'
  const userCreds = {
    email: 'test@test.com',
    password: 'password',
    username: 'Test User'
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
      .post(`${authUrl}/register`)
      .set('Content-Type', 'application/json')
      .set('Acccept', 'application/json')
      .send(userCreds)
    expect(res.status).toEqual(201)
    expect(res.body).toHaveProperty('message')
  })

  it('should not register user with missing details', async () => {
    const newUserCreds = cloneDeep(userCreds)
    const inputKeys: string[] = Object.keys(newUserCreds)
    const randomKeyToDelete: string = getRandomItem(inputKeys)
    newUserCreds[randomKeyToDelete] = ''
    const res = await request(app)
      .post(`${authUrl}/register`)
      .set('Content-Type', 'application/json')
      .set('Acccept', 'application/json')
      .send(newUserCreds)
    expect(res.status).toEqual(422)
    expect(res.body).toHaveProperty('errors')
    expect(res.body.errors.join(',')).toContain(randomKeyToDelete)
  })

  it('should login user and provide them a token', async () => {
    const loginCreds = {
      email: userCreds.email,
      password: userCreds.password
    }
    const res = await request(app)
      .post(`${authUrl}/login`)
      .set('Content-Type', 'application/json')
      .set('Acccept', 'application/json')
      .send(loginCreds)
    expect(res.status).toEqual(200)
    expect(res.body).toHaveProperty('token')
    authToken = res.body.token
    const userId = verifyToken(authToken)
    expect(userId).toHaveProperty('id')
    expect(userId).toHaveProperty('role')
    expect(userId).toHaveProperty('iat')
    expect(userId).toHaveProperty('exp')
  })

  it('should provide user profile details if authenticated', async () => {
    const res = await request(app)
      .get(`${authUrl}/profile`)
      .set('Content-Type', 'application/json')
      .set('Acccept', 'application/json')
      .set('Authorization', `Bearer ${authToken}`)
    expect(res.status).toEqual(200)
    expect(res.body).toHaveProperty('data')
    expect(res.body.data).not.toHaveProperty('password')
    expect(res.body.data).toHaveProperty('email')
    expect(res.body.data).toHaveProperty('username')
  })
})
