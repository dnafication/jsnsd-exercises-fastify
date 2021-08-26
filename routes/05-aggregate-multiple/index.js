'use strict'

const got = require('got')

const { CHARACTER_SERVICE, LOCATION_SERVICE } = process.env

/** @type import('fastify').FastifyPluginAsync */
module.exports = async (fastify, opts) => {
  fastify.get('/character/:id', async (request, reply) => {
    const { id } = request.params
    try {
      const character = await got(`${CHARACTER_SERVICE}/${id}`).json()
      return character
    } catch (error) {
      if (!error.response) throw error
      if (error.response.statusCode === 404) reply.notFound()
      throw error
    }
  })
  fastify.get('/location/:id', async (request, reply) => {
    const { id } = request.params
    try {
      const location = await got(`${LOCATION_SERVICE}/${id}`).json()
      return location
    } catch (error) {
      if (!error.response) throw error
      if (error.response.statusCode === 404) reply.notFound()
      throw error
    }
  })
  fastify.get('/locationOfChar/:charId', async (request, reply) => {
    const { charId } = request.params
    const character = await got(`${CHARACTER_SERVICE}/${charId}`).json()
    const location = await got(
      `${LOCATION_SERVICE}?name=${character.location.name}`
    ).json()
    return location
  })

  fastify.setNotFoundHandler((request, reply) => {
    if (request.method !== 'GET') {
      // return fastify.httpErrors.methodNotAllowed()
      reply.methodNotAllowed()
    }
    reply.notFound()
  })
}
