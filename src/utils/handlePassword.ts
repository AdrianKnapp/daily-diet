import bcrypt from 'bcrypt'

export const encryptPassword = async (password: string, salt = 5 as number) =>
  await bcrypt.hash(password, salt)

export const validatePassword = async (password: string) => {
  const hash = bcrypt.hashSync(password, 5)

  return await bcrypt.compareSync(password, hash)
}
