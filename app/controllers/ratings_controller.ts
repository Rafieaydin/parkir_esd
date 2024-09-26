import Rating from '#models/rating'
import { createRatingValidator } from '#validators/rating'
import type { HttpContext } from '@adonisjs/core/http'

export default class RatingsController {
  async index({ response }: HttpContext) {
    return response.status(200).json({ message: {
      status: 'success',
      data: await Rating.query().preload('user').preload('section_parkir').exec()
    }})
  }

  async store({ request, response }: HttpContext) {
    const { user_id, section_parkir_id, rating, review } = request.all()
    await request.validateUsing(createRatingValidator)
    const newRating = await Rating.create({ user_id: user_id, section_parkir_id: section_parkir_id, rating: rating, review: review })
    return response.status(200).json({ message: {
      status: 'success',
      data: newRating
    }})
  }

  async show({ params, response }: HttpContext) {
    const rating = await Rating.query().where('section_parkir_id', params.id).preload('user').preload('section_parkir').first()
    if (!rating) {
      return response.status(404).json({ message: {
        status: 'error',
        message: 'Rating Not Found'
      }})
    }
    return response.status(200).json({ message: {
      status: 'success',
      data: rating
    }})
  }

  async update({ params, request, response }: HttpContext) {
    const { rating, review } = request.all()
    await request.validateUsing(createRatingValidator)
    const ratingInstance = await Rating.find(params.id)
    if (!ratingInstance) {
      return response.status(404).json({ message: {
        status: 'error',
        message: 'Rating Not Found'
      }})
    }
    ratingInstance.rating = rating
    ratingInstance.review = review
    await ratingInstance.save()
    return response.status(200).json({ message: {
      status: 'success',
      data: ratingInstance
    }})
  }

  async destroy({ params, response }: HttpContext) {
    const rating = await Rating.find(params.id)
    if (!rating) {
      return response.status(404).json({ message: {
        status: 'error',
        message: 'Rating Not Found'
      }})
    }
    await rating.delete()
    return response.status(200).json({ message: {
      status: 'success',
      data: rating
    }})
  }

  async ratingBySection({ params, response }: HttpContext) {
    const rating = await Rating.query().where('section_parkir_id', params.id).exec()
    if (!rating) {
      return response.status(404).json({ message: {
        status: 'error',
        message: 'Rating Not Found'
      }})
    }
    return response.status(200).json({ message: {
      status: 'success',
      data: rating
    }})
  }
}
