import fastify from 'fastify'
import {knexCode} from './database.js'
import crypto from 'node:crypto'

const app = fastify()

app.get('/hello', async () => {
  /*
  //Criação de Tabela transactions
  const transaction = await knexCode('transactions').insert({
    id: crypto.randomUUID(),
    title: 'Transação de teste',
    amout: 1000,
  })
  .returning('*')
  
  //Seleção de todos os dados
  const transaction = await knexCode('transactions')
    .select('*')
  return transaction
  
  */
  const transaction = await knexCode('transactions')
    .where('amout', 1000)
    .select('*')
  return transaction
})

app
  .listen({
    port: 3336,
  })
  .then(() => {
    console.log('HTTP Server is running')
  })