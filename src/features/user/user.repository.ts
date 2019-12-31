import User from './user.model'

export default class UserRepository {
  public static async createUser(userObj: User) {
    const user = await User.query().insert(userObj)
    if (user instanceof User) {
      return user
    } else {
      throw new Error('Unable to create user')
    }
  }

  public static async findById(id: string) {
    const user = await User.query().findById(id)
    if (user instanceof User) {
      return user
    } else {
      throw new Error('Unable to find user')
    }
  }

  public static async findByEmail(email: string) {
    const user = await User.query()
      .first()
      .where('email', email)
    if (user instanceof User) {
      return user
    } else {
      throw new Error('Unable to find user')
    }
  }

  public static async all() {
    const users = await User.query()
    return users
  }
}
