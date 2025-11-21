import type { FastifyInstance } from "fastify"
import { knexCode } from "../database.js"

export async function transactionsRoutes(app: FastifyInstance) {
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
}