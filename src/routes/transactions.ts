import type { FastifyInstance } from "fastify"
import { knexCode } from "../database.js"
import { z } from 'zod'
import { randomUUID } from "node:crypto"
import { StatusCodes } from 'http-status-codes'
import {checkSessionIdExists} from '../middlewares/check-session-id-exists.js'

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/', {
    preHandler: [checkSessionIdExists],
  }, 
  async (req, res) => {
    const {sessionId} = req.cookies

    const transactions = await knexCode('transactions')
      .where('session_id', sessionId)
      .select('*')

    return { transactions }
  })

  app.get('/:id', {
    preHandler: [checkSessionIdExists],
  },
  async (req) => {
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    })
    const {sessionId} = req.cookies
    const {id} = getTransactionParamsSchema.parse(req.params)

    const transaction =  await knexCode('transactions')
      .where({
        session_id: sessionId,
        id: id,
      })
      .first()

    return { transaction }
  })

  app.delete('/:id', {
    preHandler: [checkSessionIdExists],
  }, 
  async (req) => {
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    })
    const {sessionId} = req.cookies
    const {id} = getTransactionParamsSchema.parse(req.params)

    const transactionDelete =  await knexCode('transactions')
    .where({
        session_id: sessionId,
        id: id,
      })
    .first()
    .delete()

    return { transactionDelete }
  })

  app.get('/summary',{
    preHandler: [checkSessionIdExists],
  }, 
  async (req) => {
    const {sessionId} = req.cookies
    const summary = await knexCode('transactions')
      .sum('amount', {as: 'amount'})
      .where('session_id', sessionId)
      .first()

    return {summary}
  })

  app.post('/', async (req, res) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = createTransactionBodySchema.parse(req.body)

    let sessionId = req.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      res.cookie('sessionId', sessionId, {
        path: '/', // qualquer rota pode acessar o cookie
        maxAge: 1000 * 60 * 60 * 24 * 7 // cookie vai expirar em 7 dias
      })
    }

    console.log(title)
    console.log(amount)
    console.log(type)
    console.log(sessionId)

    await knexCode('transactions')
      .insert({
        id: randomUUID(),
        title,
        amount: type === 'credit' ? amount : amount * -1,
        created_at: (new Date()).toISOString(), 
        session_id: sessionId
      })

    return res.status(StatusCodes.OK).send()

  })
}