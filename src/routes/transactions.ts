import type { FastifyInstance } from "fastify"
import { knexCode } from "../database.js"
import { z } from 'zod'
import { randomUUID } from "node:crypto"
import { StatusCodes } from 'http-status-codes'

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const transactions = await knexCode('transactions').select('*')

    return { transactions }
  })

  app.get('/:id', async (req) => {
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const {id} = getTransactionParamsSchema.parse(req.params)

    const transaction =  await knexCode('transactions').where('id', id).first()

    return { transaction }
  })

  app.delete('/:id', async (req) => {
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const {id} = getTransactionParamsSchema.parse(req.params)

    const transactionDelete =  await knexCode('transactions').where('id', id).first().delete()

    return { transactionDelete }
  })

  app.get('/summary', async () => {
    const summary = await knexCode('transactions')
      .sum('amout', {as: 'amount'})
      .first()

    return {summary}
  })

  app.post('/', async (req, res) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amout: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amout, type } = createTransactionBodySchema.parse(req.body)

    let sessionId = req.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      res.cookie('sessionId', sessionId, {
        path: '/', // qualquer rota pode acessar o cookie
        maxAge: 1000 * 60 * 60 * 24 * 7 // cookie vai expirar em 7 dias
      })
    }

    console.log(title)
    console.log(amout)
    console.log(type)
    console.log(sessionId)

    await knexCode('transactions')
      .insert({
        id: randomUUID(),
        title,
        amout: type === 'credit' ? amout : amout * -1,
        created_at: (new Date()).toISOString(), 
        session_id: sessionId
      })

    return res.status(StatusCodes.OK).send()

  })
}