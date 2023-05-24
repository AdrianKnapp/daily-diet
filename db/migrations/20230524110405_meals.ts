import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary()
    table.string('name').notNullable()
    table.string('description').notNullable()
    table.dateTime('date').notNullable()
    table.boolean('is_in_the_diet').notNullable()
    table.uuid('user_id').notNullable()
    table.foreign('user_id').references('id').inTable('users')
    table.dateTime('created_at').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  knex.schema.dropTable('meals')
}
