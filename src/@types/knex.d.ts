import {Knex} from 'knex'

declare module 'knex/types/tables.d.ts' {
    export interface Tables {
        transactions: {
            id: string,
            title: string,
            amout: number,
            created_at: string,
            session_id?: string
        }
    }
}