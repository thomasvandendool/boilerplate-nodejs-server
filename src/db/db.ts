import { Database } from '../lib/types'
import { Pool } from 'pg'
import { Kysely, PostgresDialect } from 'kysely'

const dialect = new PostgresDialect({
    pool: new Pool({
        database: 'postgres',
        host: 'localhost',
        user: 'postgres',
        port: 5432,
        max: 10,
        password: 'warp123',
    })
})

export const db = new Kysely<Database>({
    dialect,
})