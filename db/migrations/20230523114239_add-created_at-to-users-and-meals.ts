import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
  })

  await knex.schema.alterTable('meals', (table) => {
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('created_at')
  })

  await knex.schema.alterTable('meals', (table) => {
    table.dropColumn('created_at')
  })
}
