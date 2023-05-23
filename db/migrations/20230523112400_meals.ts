import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('meals', (table) => {
    table.increments('id').primary()
    table.string('name').notNullable()
    table.string('description').notNullable()
    table.dateTime('date').notNullable()
    table.boolean('is_in_the_diet').notNullable().defaultTo(true)
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('meals')
}
