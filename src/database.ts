import { knex, type Knex } from 'knex'

export const config: Knex.Config = {
  client: 'mysql',
  connection: {
    database: 'db/db.json',
  },
  useNullAsDefault: true,
}

export default knex(config)
