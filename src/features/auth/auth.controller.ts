import { JsonController, Body, Post, Res, Get, Req } from 'routing-controllers'
import { Response } from 'express'
import { UniqueViolationError } from 'objection'
import { StatusCode } from 'status-code-enum'
import { RegisterUserSchema, LoginUserSchema } from '../user/user.validator'
import User from '../user/user.model'
import UserRepository from '../user/user.repository'
import { generateToken } from '@app/utils/token'
import { UserRequest } from '@app/types/common'

@JsonController('/auth')
export default class AuthController {
  @Post('/login')
  async login(@Body() user: Partial<User>, @Res() res: Response) {
    try {
      const { error, value } = await LoginUserSchema.validate(user)
      if (!error) {
        const user = await UserRepository.findByEmail(value.email)
        const passwordMatches = await user.verifyPassword(value.password)
        if (passwordMatches) {
          // send JWT token
          const token = generateToken({
            id: user.id,
            role: user.role
          })
          return res
            .status(StatusCode.SuccessOK)
            .send({ message: 'User has been successfully registered', token })
        }
      } else {
        return res.status(StatusCode.ClientErrorUnprocessableEntity).send({
          message: 'Invalid credentials',
          errors: error.details.map(r => r.message)
        })
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
      const { error, value } = await RegisterUserSchema.validate(user)
      if (!error) {
        await UserRepository.createUser(value)
        return res
          .status(StatusCode.SuccessCreated)
          .send({ message: 'User has been successfully registered' })
      } else {
        return res.status(StatusCode.ClientErrorUnprocessableEntity).send({
          message: 'Unable to validate input',
          errors: error.details.map(r => r.message)
        })
      }
    } catch (err) {
      console.log(err)
      if (err instanceof UniqueViolationError) {
        return res.status(StatusCode.ClientErrorConflict).send({
          message: 'Email already registered'
        })
      }
      return res.status(StatusCode.ClientErrorUnprocessableEntity).send({
        message: 'Error registering new user'
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
