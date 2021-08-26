'use strict'

/** @type import('fastify').FastifyPluginAsync */
module.exports = async (fastify, opts) => {
  fastify.addHook('onRequest', async function (request, reply) {
    if (request.ip === '127.0.0.1') {
      return reply.forbidden()
    }
  })

  fastify.get('/', async (request, reply) => {
    return {
      msg: 'come and get me!',
    }
  })
}
