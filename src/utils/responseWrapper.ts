const responseWrapper = <D, E>({ data, error }: { data?: D; error?: E }) => ({
  data,
  error,
})

export default responseWrapper
