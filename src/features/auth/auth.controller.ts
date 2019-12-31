import {
  JsonController,
  Body,
  Post,
  Res,
  Get,
  Req,
  Param
} from 'routing-controllers'
import { v4 as uuid } from 'uuid'
import { Response } from 'express'
import { UniqueViolationError } from 'objection'
import { StatusCode } from 'status-code-enum'
import User from '../user/user.model'
import UserRepository from '../user/user.repository'
import { generateToken } from '@app/utils/token'
import { UserRequest } from '@app/types/common'
import redis from '@app/helpers/redis'
import { sendMail } from '@app/helpers/mailer'

@JsonController('/auth')
export default class AuthController {
  private async sendVerificationEmail({
    id,
    email
  }: {
    id: string
    email: string
  }) {
    // create a token on redis matched to user id
    const randomId = uuid()
    redis.set(`auth_${randomId}`, id)
    // Send a mail
    await sendMail({
      deliveryOptions: {
        from: 'randomguy@email.com',
        to: email,
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
    return randomId
  }

  @Post('/login')
  async login(@Body() user: any, @Res() res: Response) {
    try {
      const dbUser = await UserRepository.findByEmail(user.email)
      const passwordMatches = await dbUser.verifyPassword(user.password)
      if (passwordMatches) {
        const token = generateToken({
          id: dbUser.id,
          role: dbUser.role
        })
        return res
          .status(StatusCode.SuccessOK)
          .send({ message: 'User has been successfully registered', token })
      }
    } catch (err) {
      return res.status(StatusCode.ClientErrorUnprocessableEntity).send({
        message: 'Invalid credentials'
      })
    }
  }

  @Post('/register')
  async post(@Body() user: User, @Res() res: Response) {
    try {
      const dbUser = await UserRepository.createUser(user)
      if (dbUser instanceof User) {
        const verificationId = await this.sendVerificationEmail({
          id: dbUser.id,
          email: dbUser.email
        })
        if (verificationId) {
          return res.status(StatusCode.SuccessCreated).send({
            verificationId,
            message:
              'User has been successfully registered. A verification e-mail has been sent to you.'
          })
        }
      } else {
        throw new Error('Unable to register user')
      }
    } catch (error) {
      if (error instanceof UniqueViolationError) {
        return res.status(StatusCode.ClientErrorConflict).send({
          message: 'Email already registered'
        })
      }
      return res.status(StatusCode.ClientErrorUnprocessableEntity).send({
        message: 'Error registering new user',
        error
      })
    }
  }

  @Get('/verify/:id')
  async verifyUser(@Param('id') id: string, @Res() res: Response) {
    try {
      const randomId = `auth_${id}`
      const userId = await redis.get(randomId)
      if (!userId) {
        throw new Error('Token expired')
      }
      const user = await UserRepository.updateUserById(userId, {
        isVerified: true
      })
      if (!user.isVerified) {
        throw new Error('User not verified')
      }
      await redis.del(`auth_${randomId}`)
      return res.status(StatusCode.SuccessOK).send({ message: 'User verified' })
    } catch (error) {
      return res.status(StatusCode.ServerErrorInternal).send({
        message: 'Oops! Something went wrong',
        error
      })
    }
  }

  @Get('/profile')
  async getProfile(@Req() req: UserRequest, @Res() res: Response) {
    try {
      const user = await UserRepository.findById(req.user.id)
      return res.status(StatusCode.SuccessOK).json({
        data: user,
        message: 'Fetching user detail successful'
      })
    } catch (error) {
      return res.status(StatusCode.ServerErrorInternal).json({
        error,
        message: 'Unable to fetch user details'
      })
    }
  }
}
