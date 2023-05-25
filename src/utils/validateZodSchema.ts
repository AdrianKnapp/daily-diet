import { ZodSchema } from 'zod'

const validateZodSchema = <V>(schema: ZodSchema, value: V) => {
  const zodValidation = schema.safeParse(value)

  if (!zodValidation.success) {
    const formattedErrors = zodValidation.error.issues.map((issue) => {
      return {
        code: issue.code,
        message: issue.message,
        path: issue.path,
      }
    })

    return {
      errors: formattedErrors,
      data: {},
    }
  }

  return {
    data: zodValidation.data,
  }
}

export default validateZodSchema
