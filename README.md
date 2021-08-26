# jsnsd-exercises-fastify

My practice repo and notes for [JSNSD certification](https://training.linuxfoundation.org/certification/jsnsd/). Following topics are being covered in this repo:

- [01 Create a basic webserver](#01-create-a-basic-webserver)
- [02 Serve static contents](#02-serve-static-contents)
- [03 Render views](#03-render-views)
- [04 RESTful JSON service](#04-restful-json-service)
- [05 Aggregate response from multiple sources](#05-aggregate-response-from-multiple-sources)
- [06 HTTP proxy services](#06-http-proxy-services)
- [07 Web Security](#07-web-security)
- [Bonus: Swagger](#bonus-swagger)
- [Handy Fastify plugins & resources](#handy-fastify-plugins--resources)

## 01 Create a basic webserver

[Getting started guide](https://www.fastify.io/docs/latest/Getting-Started/#your-first-server) on Fastify documentation is excellent resource for creating
a basic server.

If you want to [rapidly generate](https://github.com/fastify/create-fastify) a Fastify project

```bash
npm init fastify

#install the dependencies
npm install

# run the dev server
npm run dev
```

Visit the route `http://127.0.0.1:3000/01-basic` on the browser for a basic html response.

Integrating Fastify into an existing project:

```bash
npm init fastify -- --integrate
```

## 02 Serve static contents

Install [fastify-static](https://www.npmjs.com/package/fastify-static) and configure a particular directory to serve.

```bash
npm install --save fastify-static
```

Configure in the `app.js`

```js
const fastifyStatic = require('fastify-static')

/** @type import('fastify').FastifyPluginAsync */
module.exports = async function (fastify, opts) {
  // Place here your custom code!
  fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'public'),
    prefix: '/pub/',
  })
```

Visit `http://127.0.0.1:3000/02-static-content` for the custom file
and `http://127.0.0.1:3000/pub/about.html` since the public directory
is mounted on `/pub/` path.

## 03 Render views

Install necessary packages. Read more about [point-of-view](https://github.com/fastify/point-of-view) and [handlebars](https://handlebarsjs.com/).

```bash
npm install point-of-view handlebars
```

Create a `view` directory and configure the app

```js
const pointOfView = require('point-of-view')
const handlebars = require('handlebars')

/** @type import('fastify').FastifyPluginAsync */
module.exports = async function (fastify, opts) {
  fastify.register(pointOfView, {
    engine: { handlebars },
    root: path.join(__dirname, 'views'),
    layout: 'layout.hbs',
  })
```

Build out the routes as per [here](/routes/03-render-views/index.js) and visit
`http://127.0.0.1:3000/03-render-views?name=dina`

## 04 RESTful JSON service

A basic To-Do service that will allow CRUD operations and will
be interacting with a SQLite database for persistance.

```bash
npm install sequelize sqlite3
```

A plugin is added that decorates `fastify` instance with `models` function.
It can be an object as well.

```js
const fp = require('fastify-plugin')

const { db } = require('../db')
// initialize models
const makeTodoModel = require('../models/todo')
const Todo = makeTodoModel(db)

module.exports = fp(async function (fastify, opts) {
  fastify.decorate('models', function () {
    return { db, Todo }
  })
})
```

Now you can use the function in the routes

```js
module.exports = async (fastify, opts) => {
  const { Todo } = fastify.models()
  fastify.get('/', async (request, reply) => {
    try {
      const todos = await Todo.findAll()
      return todos.map((t) => t.toJSON())
    } catch (error) {
      throw error
    }
  })
```

## 05 Aggregate response from multiple sources

For this, we are consuming [Rick and Morty API](https://rickandmortyapi.com/documentation/#rest)
in our main application.

A http client `got` is installed for the ease of use in our application.

```bash
npm i got

# define following env variables that will be used by the service.
# injecting variables this way is normal for consuming from dynamic dependent
# services

export CHARACTER_SERVICE=https://rickandmortyapi.com/api/character
export LOCATION_SERVICE=https://rickandmortyapi.com/api/location

```

Use the file `./aggregate-test.http` to test out the API.

## 06 HTTP proxy services

Install the required packages

- [fastify-reply-from](https://github.com/fastify/fastify-reply-from)
- [fastify-http-proxy](https://github.com/fastify/fastify-http-proxy)

```bash
npm install fastify-reply-from fastify-http-proxy
```

**Single route: multi origin** proxy

Register the plugin and define the route that will return the response from the url passed in through the query parameter.
The plugin `fastify-reply-from` decorates `reply` object with `from` function which accepts
urls.

```js
fastify.get('/', async function (request, reply) {
  const { url } = request.query
  try {
    new URL(url)
  } catch (err) {
    throw fastify.httpErrors.badRequest()
  }
  return reply.from(url)
})
```

Visit url: `http://127.0.0.1:3000/06-proxy/?url=https://github.com/fastify`

**Using http proxy:** single-origin, multi route proxy

Register the plugin below and pass in the configuration object. The proxy in the example
below will be mounted on `/rickandmorty`.

```js
fastify.register(require('fastify-http-proxy'), {
  upstream: 'https://rickandmortyapi.com/api/episode',
  prefix: '/rickandmorty',
})
```

Visit `http://127.0.0.1:3000/rickandmorty/3` which is now a proxy to `https://rickandmortyapi.com/api/episode/3`

## 07 Web Security

**Parameter pollution:** Supplying multiple HTTP parameters with the same name may cause an application to interpret values in unanticipated ways. By exploiting these effects, an attacker may be able to bypass input validation, trigger application errors or modify internal variables values. As HTTP Parameter Pollution (in short HPP) affects a building block of all web technologies, server and client-side attacks exist.

In the first route `/nameType` we have handled 3 cases of query string pollution.

- http://localhost:3000/07-security/nameType?name=dina (`name` is string)
- http://localhost:3000/07-security/nameType?name=dina&name=audrey (`name` is array)
- http://localhost:3000/07-security/nameType?address=100 (no `name` provided)

It is easier to just tell Fastify to validate the incoming requests using [JSON Schema](https://json-schema.org/). Just add options object with schema

```js
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
  },
},
```

We've introduced validation is the second route `/withValidation`

- /07-security/withValidation?address=100 (no `name` is provided, Bad Request)
- /07-security/withValidation?name=the weekend&name=camilla (`name` can be array or string)

Using ` additionalProperties: false` in schema can strip out unnecessary properties being passed down to the handler.

Validation can also be applied for the response. Only properties mentioned in the schema will be exposed. If the response does not conform to the schema error will thrown.

```js
{
  schema: {
    response: {
      201: {
        posted: { type: 'boolean' },
        hello: { type: 'string' },
      },
    },
  },
},
```

[fluent-schema](https://github.com/fastify/fluent-schema) can also be used to define these schemas.

Almost secure, but let's say someone or somebot is bombarding us with random requests (DOS) and causing our system to slow down or its scraping our services. To make their life a bit harder, we can block their ip in the server. Lets look at how we can do that really quickly.

We can create a plugin and use Fastify [Hooks](https://www.fastify.io/docs/latest/Hooks/) to achieve this.

```js
fastify.addHook('onRequest', async function (request, reply) {
  if (request.ip === '127.0.0.1') {
    return reply.forbidden()
  }
})
```

## Bonus: Swagger

The magic is done by the [fastify-swagger](https://github.com/fastify/fastify-swagger) plugin that generates Swagger (OpenAPI v2) or OpenAPI v3 schemas automatically from the route schemas.
Register the plugin and it just works:

```js
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
})
```

## Handy Fastify plugins & resources

The list of core and community plugins [can be found here](https://www.fastify.io/docs/latest/Ecosystem/).
Following plugins and packages were used in this project.

- [fastify-sensible](https://github.com/fastify/fastify-sensible)
- [fastify-auth](https://github.com/fastify/fastify-auth)
- [fastify-jwt](https://github.com/fastify/fastify-jwt)
- [point-of-view](https://github.com/fastify/point-of-view)
- [fastify-static](https://github.com/fastify/fastify-static)
- [fastify-swagger](https://github.com/fastify/fastify-swagger)
- [fastify-reply-from](https://github.com/fastify/fastify-reply-from)
- [fastify-http-proxy](https://github.com/fastify/fastify-http-proxy)
- [fluent-schema](https://github.com/fastify/fluent-schema)

[Ready to get started?](https://www.fastify.io/docs/latest/Getting-Started/)

![fastify logo](https://www.fastify.io/images/fastify-logo-inverted.2180cc6b1919d47a.png)

---
