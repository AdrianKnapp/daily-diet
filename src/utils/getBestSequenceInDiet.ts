import { Meal } from '../types/tables'

const getBestSequenceInDiet = (meals: Meal[]) => {
  let currentSequence: Meal[] = []
  let bestSequence: Meal[] = []

  for (const meal of meals) {
    if (meal.is_in_the_diet) {
      currentSequence.push(meal)

      if (currentSequence.length > bestSequence.length) {
        bestSequence = [...currentSequence]
      }
    } else {
      currentSequence = []
    }
  }

  return bestSequence
}

export default getBestSequenceInDiet
