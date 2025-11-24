import type { FastifyReply, FastifyRequest } from "fastify"
import { StatusCodes } from 'http-status-codes'

export async function checkSessionIdExists(req: FastifyRequest, res: FastifyReply) {
    const sessionId = req.cookies.sessionId
    
    if (!sessionId) {
        return res.status(StatusCodes.UNAUTHORIZED).send({
            error: 'Unauthorized.'
        })
    }    
}