# jsnsd-exercises-fastify

My notes for Following topics are being covered in this repo:

- [01 Create a basic webserver](#01-create-a-basic-webserver)
- [02 Serve a static content](#02-serve-a-static-content)
- [03 Render views](#03-render-views)
- [04 RESTful JSON service](#04-restful-json-service)
- [05 Aggregate response from multiple sources](#05-aggregate-response-from-multiple-sources)
- [06 HTTP proxy services](#06-http-proxy-services)
- [07 Web Security](#07-web-security)

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

## 02 Serve a static content

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

Built a plugin that decorates `fastify` instance with `models` function. 
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

For this we will be consuming [Rick and Morty API](https://rickandmortyapi.com/documentation/#rest)
in our main application.

A http client `got` will be installed for the ease of use in our application. 

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

## 07 Web Security
