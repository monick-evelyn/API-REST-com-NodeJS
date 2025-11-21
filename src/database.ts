import knex, { type Knex} from 'knex'
import 'dotenv/config'

//console.log(process.env)
if (!process.env.DATABASE_URL) {
    throw new Error ('DATABASE_URL env not found')
}
export const config: Knex.Config = {
    client: 'sqlite',
    connection: {
        filename: process.env.DATABASE_URL,
    },
    useNullAsDefault: true,
    migrations: {
        extension: 'ts',
        directory: './db/migrations',
    }
}
export const knexCode = knex(config)