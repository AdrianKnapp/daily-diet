import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  knex.schema.createTable('users', (table) => {
    table.uuid('id').primary()
    table.string('email').notNullable()
    table.string('password').notNullable()
    table.string('name').notNullable()
    table.dateTime('created_at').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {}
