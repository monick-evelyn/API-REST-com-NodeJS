import type { FastifyInstance } from "fastify"
import { knexCode } from "../database.js"
import {z} from 'zod'
import { randomUUID } from "node:crypto"
import {StatusCodes} from 'http-status-codes'

export async function transactionsRoutes(app: FastifyInstance) {
    app.post('/', async (req, res) => {

      const createTransactionBodySchema = z.object({
        title: z.string(),
        amount: z.number(),
        type: z.enum(['credit', 'debit']),
      })

      const {title, amount, type} = createTransactionBodySchema.parse(req.body)
      
      await knexCode('transactions')
        .insert({
            id: randomUUID,
            title,
            amount: type === 'credit' ? amount : amount * -1,
        })

        return res.status(StatusCodes.OK).send()
      
    })
    app.get('/', async () => {
      const transaction = await knexCode('transactions')
        
        .select('*')
      return transaction
    })
}