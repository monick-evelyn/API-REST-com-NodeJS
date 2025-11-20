import knex from 'knex'

export const knexCode = knex({
    client: 'sqlite',
    connection: {
        filename: './tmp/app.db',
    }
})