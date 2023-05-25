import bcrypt from 'bcrypt'

export const encryptPassword = async (plaintextPassword) => {
  const hash = await bcrypt.hash(plaintextPassword, 10)
  return hash
}

export const validatePassword = async (plaintextPassword, hash) => {
  const result = await bcrypt.compare(plaintextPassword, hash)
  return result
}
