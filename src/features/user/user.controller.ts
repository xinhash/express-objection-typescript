import { JsonController, Res, Get, Param } from 'routing-controllers'
import { Response } from 'express'
import { StatusCode } from 'status-code-enum'
import UserRepository from '../user/user.repository'

@JsonController('/users')
export default class UserController {
  @Get('/:id')
  async getOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const user = await UserRepository.findById(id)
      return res.status(StatusCode.SuccessOK).json({
        data: user
      })
    } catch (error) {
      return res.status(StatusCode.ServerErrorInternal).json({
        message: 'User not found',
        error
      })
    }
  }
  @Get('/')
  async getAll(@Res() res: Response) {
    try {
      const user = await UserRepository.all()
      return res.status(StatusCode.SuccessOK).json({
        data: user
      })
    } catch (error) {
      return res.status(StatusCode.ServerErrorInternal).json({
        message: 'Users not found',
        error
      })
    }
  }
}
