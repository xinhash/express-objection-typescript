declare namespace Express {
  interface Request {
    user: {
      data: { id: string; role: string }
      iat: number
      exp: number
    }
  }
}
