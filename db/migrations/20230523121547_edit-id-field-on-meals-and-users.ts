import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('meals', (table) => {
    table.uuid('id').primary().alter()
  })

  await knex.schema.alterTable('users', (table) => {
    table.uuid('id').primary().alter()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('meals', (table) => {
    table.increments('id').primary().alter()
  })

  await knex.schema.alterTable('users', (table) => {
    table.increments('id').primary().alter()
  })
}
