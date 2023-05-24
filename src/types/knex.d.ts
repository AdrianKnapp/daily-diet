// eslint-disable-next-line no-unused-vars
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  interface User {
    id: string
    email: string
    password: string
    name: string
    created_at: string
  }

  interface Meal {
    id: string
    name: string
    description: string
    date: string
    is_in_the_diet: boolean
    user_id: number
    created_at: string
  }

  export interface Tables {
    users: User
    meals: Meal
  }
}
