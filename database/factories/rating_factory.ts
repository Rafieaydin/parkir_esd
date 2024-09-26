import factory from '@adonisjs/lucid/factories'
import Rating from '#models/rating'

export const RatingFactory = factory
  .define(Rating, async ({ faker }) => {
    return {
      user_id: faker.number.int(1, 10),
      tempat_parkir_id: faker.number.int(1, 10),
      rating: faker.number.int(1, 5),
      review: faker.lorem.paragraph(),
    }
  })
  .build()
