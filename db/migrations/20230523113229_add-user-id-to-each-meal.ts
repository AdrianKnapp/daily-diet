import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('meals', (table) => {
    table.integer('user_id').unsigned().references('id').inTable('users')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('meals', (table) => {
    table.dropColumn('user_id')
  })
}
