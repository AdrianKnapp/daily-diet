type Errors = {
  code?: string
  message: string
  path?: (string | number)[]
}

const responseWrapper = <D>({
  data,
  errors,
}: {
  data?: D
  errors?: Errors[]
}) => ({
  data,
  errors,
})

export default responseWrapper
