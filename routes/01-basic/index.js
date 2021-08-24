const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hello</title>
</head>
<body>
  <h1>Hello world</h1>
</body>
</html>
`

/** @type import('fastify').FastifyPluginAsync */
module.exports = async (fastify, opts) => {
  fastify.get('/', (request, reply) => {
    reply.type('text/html')
    return html
  })

  fastify.get('/hello', (request, reply) => {
    return {
      msg: 'Hello there!',
    }
  })

  // requests other than GET are not allowed instead of the usual 'Not Found'
  fastify.setNotFoundHandler((request, reply) => {
    if (request.method !== 'GET') {
      reply.status(405)
      return 'Method Not Allowed'
    }
    return 'Not Found'
  })
}
