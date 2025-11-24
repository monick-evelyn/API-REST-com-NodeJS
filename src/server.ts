import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { env } from './env/index.js'
import { transactionsRoutes } from './routes/transactions.js'


const app = fastify()

app.register(cookie)

app.addHook('preHandler', async (req, res) => {
    console.log(`[${req.method}] ${req.url}`)
  } )

app.register(transactionsRoutes, {
  prefix: 'transactions',
});

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP Server is running')
  })