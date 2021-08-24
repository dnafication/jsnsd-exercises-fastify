# jsnsd-exercises-fastify

Following topics are being covered in this repo:

- [jsnsd-exercises-fastify](#jsnsd-exercises-fastify)
  - [Create a basic webserver](#create-a-basic-webserver)
  - [Serve a static content](#serve-a-static-content)
  - [Render views](#render-views)
  - [RESTful JSON service](#restful-json-service)
  - [Aggregate response from multiple sources](#aggregate-response-from-multiple-sources)
  - [HTTP proxy services](#http-proxy-services)
  - [Web Security](#web-security)

## Create a basic webserver

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

## Serve a static content

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

Visit `http://127.0.0.1:3000/02-static-content` for the custom file and `http://127.0.0.1:3000/pub/about.html` since the public directory is mounted on `/pub/` path.

## Render views

Install necessary packages

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


## RESTful JSON service

## Aggregate response from multiple sources

## HTTP proxy services

## Web Security
