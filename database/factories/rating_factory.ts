import factory from '@adonisjs/lucid/factories'
import Rating from '#models/rating'

export const RatingFactory = factory
  .define(Rating, async ({ faker }) => {
    return {}
  })
  .build()