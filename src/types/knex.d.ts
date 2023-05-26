// eslint-disable-next-line no-unused-vars
import { Knex } from 'knex'
import type { User as UserTable, Meal as MealTable } from './tables'

declare module 'knex/types/tables' {
  interface User extends UserTable {}

  interface Meal extends MealTable {}

  export interface Tables {
    users: User
    meals: Meal
  }
}
