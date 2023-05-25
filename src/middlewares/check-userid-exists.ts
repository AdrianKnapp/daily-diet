import { FastifyReply, FastifyRequest } from 'fastify'
import responseWrapper from '../utils/responseWrapper'

const checkUserIdExists = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { uid } = request.cookies ?? {}

  if (!uid) {
    reply.status(403).send(
      responseWrapper({
        errors: [
          {
            message: 'User not logged in.',
          },
        ],
      }),
    )
  }
}

export default checkUserIdExists
