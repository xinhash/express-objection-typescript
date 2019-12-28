import { compareSync, hashSync } from 'bcryptjs'

export function createPassword(password: string): string {
  return hashSync(password, 10)
}

export function comparePassword(password: string, hash: string): boolean {
  const result = compareSync(password, hash)
  return result
}
