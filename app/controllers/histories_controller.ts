import HistoryBooking from '#models/history_booking'
import auth from '@adonisjs/auth/services/main'
import type { HttpContext } from '@adonisjs/core/http'

export default class HistoriesController {
  /**
   * Display a list of resource
   */
  async History({response, auth}: HttpContext) {
    console.log((await (auth.authenticate())).id)
    const history = await HistoryBooking.query().where('user_id', ((await (auth.authenticate())).id) ).preload('slot_parkir', (slot)=>{
      slot.preload('section_parkir', (sec)=>{
        sec.preload('tempat_parkir').exec()
      }).exec()
    }).exec()

    if (!history) {
      return response.status(404).json({ message: {
        status: 'error',
        message: 'History Not Available'
      }})
    }

    return response.status(200).json({ message: {
      status: 'success',
      data: history
    }})

  }

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {}

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {}

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}
