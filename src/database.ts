import { knex as knexSetup, type Knex } from 'knex'

export const config: Knex.Config = {
  client: 'sqlite',
  connection: {
    database: './db/app.db',
    filename: './db/app.db',
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
}

export const knex = knexSetup(config)
