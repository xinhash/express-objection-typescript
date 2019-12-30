import { generateToken, verifyToken } from '@app/utils/token'
import { RequestHandler } from 'express'
import { UniqueViolationError } from 'objection'
import { StatusCode } from 'status-code-enum'
import User from './user.model'
import { LoginUserSchema, RegisterUserSchema } from './user.validator'

export const RegisterHandler: RequestHandler = async (req, res) => {
  try {
    const { error, value } = await RegisterUserSchema.validate(req.body.user)
    if (!error) {
      const user = await User.query().insert(value)
      console.log(user.password)
      if (user instanceof User) {
        return res
          .status(StatusCode.SuccessCreated)
          .send({ message: 'User has been successfully registered' })
      }
    } else {
      return res.status(StatusCode.ClientErrorUnprocessableEntity).send({
        message: 'Error registering new user',
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

export const LoginHandler: RequestHandler = async (req, res) => {
  try {
    const { error, value } = await LoginUserSchema.validate(req.body.user)
    if (!error) {
      const user = await User.query()
        .first()
        .where('email', value.email)
      if (user instanceof User) {
        const passwordMatches = await user.verifyPassword(value.password)
        if (passwordMatches) {
          // send JWT token
          const token = generateToken({ data: user.id })
          return res
            .status(StatusCode.SuccessOK)
            .send({ message: 'User has been successfully registered', token })
        } else {
          throw new Error('Invalid credentials')
        }
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

export const ProfileHandler: RequestHandler = async (req, res) => {
  const tk = verifyToken(req?.headers?.authorization?.split(' ')[1])
  const user = await User.query().findById(tk.data)
  if (user instanceof User) {
    res.status(StatusCode.SuccessOK).json({
      data: user,
      message: 'Matching profile found'
    })
  } else {
    // Cancel jwt and send response aunauthorized
  }
}
