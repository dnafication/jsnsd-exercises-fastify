'use strict'

/** @type import('fastify').FastifyPluginAsync */
module.exports = async (fastify, opts) => {
  fastify.register(require('fastify-swagger'), {
    routePrefix: '/doc',
    exposeRoute: true,
    openapi: {
      openapi: '3.0.3',
      info: {
        title: 'JSNSD',
        description: 'Testing the Fastify swagger API',
        version: '0.1.0',
      },
      externalDocs: {
        url: 'https://swagger.io',
        description: 'Find more info here',
      },
    },
    // swagger: {
    //   info: {
    //     title: 'JSNSD',
    //     description: 'Testing the Fastify swagger API',
    //     version: '0.1.0',
    //   },
    //   externalDocs: {
    //     url: 'https://swagger.io',
    //     description: 'Find more info here',
    //   },
    //   host: 'localhost:3000',
    //   schemes: ['http'],
    //   consumes: ['application/json'],
    //   produces: ['application/json'],
    // },
  })

  fastify.get('/nameType', async (request, reply) => {
    const { id } = request.params

    // we expect name in the query string but if it is provided multiple times
    // like `name=dina&name=aubrey`, it is interpreted as ` name: [ 'dina', 'aubrey' ] `
    // so we need to handle arrays in our code to avoid crash.
    const { name } = request.query

    if (!name) {
      reply.badRequest()
      return
    }
    console.log('parsed querystring:', request.query)
    return {
      nameType: Array.isArray(name) ? 'name is array' : 'name is string',
    }
  })

  fastify.get(
    '/withValidation',
    {
      schema: {
        querystring: {
          type: 'object',
          required: ['name'],
          properties: {
            // name: { type: 'string' }, // only string is allowed
            name: {
              oneOf: [
                { type: 'string' },
                {
                  type: 'array',
                  maxItems: 3,
                  items: {
                    type: 'string',
                  },
                },
              ],
            },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              hello: { oneOf: [{ type: 'array' }, { type: 'string' }] },
            },
          },
        },
      },
    },
    async (request, reply) => {
      console.log('querystring:', request.query)
      return {
        hello: request.query.name,
      }
    }
  )

  fastify.post(
    '/withValidation/:id',
    {
      schema: {
        params: {
          id: { type: 'number' },
        },
        body: {
          type: 'object',
          required: ['name'],
          additionalProperties: false,
          properties: {
            name: { type: 'string' },
          },
        },
        response: {
          201: {
            type: 'object',
            required: ['hello'],
            properties: {
              posted: { type: 'boolean' },
              hello: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      console.log('body:', request.body)
      // does nothing
      reply.status(201)
      return {
        posted: true,
        hello: request.body.name,
        extra: 'attribute',
      }
    }
  )
}
