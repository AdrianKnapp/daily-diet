type Errors = {
  code?: string
  message: string
  path?: (string | number)[]
}

const responseWrapper = <D>(
  response:
    | {
        data?: D
        errors?: Errors[] | string
      }
    | string,
) => {
  if (typeof response === 'string') {
    return {
      errors: [
        {
          message: response,
        },
      ],
    }
  }

  const { data, errors } = response

  return {
    data,
    errors,
  }
}

export default responseWrapper
