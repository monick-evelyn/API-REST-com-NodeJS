import type { FastifyInstance } from "fastify"
import { knexCode } from "../database.js"
import {z} from 'zod'
import { randomUUID } from "node:crypto"
import {StatusCodes} from 'http-status-codes'

export async function transactionsRoutes(app: FastifyInstance) {
    app.post('/', async (req, res) => {

      const createTransactionBodySchema = z.object({
        title: z.string(),
        amout: z.number(),
        type: z.enum(['credit', 'debit']),
      })

      const {title, amout, type} = createTransactionBodySchema.parse(req.body)
      
      console.log(title)
      console.log(amout)
      console.log(type)
      
      await knexCode('transactions')
        .insert({
            id: randomUUID(),
            title,
            amout: type === 'credit' ? amout : amout * -1,
        })

        return res.status(StatusCodes.OK).send()
      
    }),
    app.get('/', async () => {
      const transaction = await knexCode('transactions')
        
        .select('*')
      return transaction
    })
}