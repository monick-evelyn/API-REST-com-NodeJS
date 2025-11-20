import fastify from 'fastify'
import {knexCode} from './database.js'

const app = fastify()

app.get('/hello', async () => {
  const tables = await knexCode('sqlite_schema').select('*')

  return tables
})

app
  .listen({
    port: 3336,
  })
  .then(() => {
    console.log('HTTP Server is running')
  })