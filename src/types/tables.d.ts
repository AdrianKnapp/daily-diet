export type User = {
  id: string
  email: string
  password: string
  name: string
  created_at: string
}

export type Meal = {
  id: string
  name: string
  description: string
  date: string
  is_in_the_diet: boolean
  user_id: number
  created_at: string
}
