import Rating from '#models/rating'
import SectionParkir from '#models/section_parkir'
import { createSectionTempatParkirValidator, updateSectionTempatParkirValidator } from '#validators/section_tempat_parkir'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class SectionTempatParkirsController {
  /**
   * Display a list of resource
   */
    async  ratings(sectionParkirData) {
      // Fetch the average ratings grouped by section_parkir_id
      const ratingsData = await db
        .from('ratings')
        .select('section_parkir_id')
        .avg('rating as total_rating')
        .groupBy('section_parkir_id')

      // Map over sectionParkirData and attach total_rating from ratingsData
      const result = sectionParkirData.map(section => {
        const rating = ratingsData.find(r => r.section_parkir_id === section.id)// seatch rating by id
        return {
          ...section.toJSON(),
          total_rating: rating ? rating.total_rating : 0 // Attach the calculated total_rating
        }
      })

      return result
    }

  async index({response}: HttpContext) {
    //console.log('masuk')
    // Step 1: Fetch the section_parkir data with preloaded relationships
  const sectionParkirData = await SectionParkir.query()
  .preload('tempat_parkir')
  .preload('slot_parkir')
  .exec()

  const result = await this.ratings(sectionParkirData)
  return response.status(200).json({ message: {
      status: 'succes',
      data: result
    }})
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request,response }: HttpContext) {
    const {nama, tempat_parkir_id, jenis, harga_per_jam, denda_per_jam, promo = 0} = request.all()
    await request.validateUsing(createSectionTempatParkirValidator)
    const section_parkir = await SectionParkir.findBy('nama', nama)
    if (section_parkir) {
      return response.status(400).json({ message: {
        status: 'error',
        message: 'Section Parkir already exists'
      }})
    }
    const newSectionParkir = await SectionParkir.create({ nama: nama, tempat_parkir_id: tempat_parkir_id, jenis: jenis, harga_per_jam:harga_per_jam, denda_per_jam:denda_per_jam, promo: promo })
    return response.status(200).json({ message: {
      status: 'success',
      data: newSectionParkir
    }})
  }

  async getSectionByTempatParkir({ request, response }: HttpContext) {
    const { id } = request.params()
    if(id == null){
      return response.status(400).json({ message: {
        status: 'error',
        message: 'Tempat Parkir ID is required'
      }})
    }
    const section_parkir = await SectionParkir.query().where('tempat_parkir_id', id).preload('tempat_parkir').preload('slot_parkir').exec()
    return response.status(200).json({ message: {
      status: 'success',
      data: section_parkir
    }})
  }

  async getJenisSection({ response }: HttpContext) {
    const section_parkir = await SectionParkir.query().distinct('jenis').exec()
    if (!section_parkir) {
      return response.status(404).json({ message: {
        status: 'error',
        message: 'Section Not Available'
      }})
    }
    return response.status(200).json({ message: {
      status: 'success',
      data: section_parkir
    }})
  }

  async getSectionBySectionJenis({ request, response }: HttpContext) {
    const { jenis } = request.params()
    if(jenis == null){
      return response.status(400).json({ message: {
        status: 'error',
        message: 'Section Jenis is required'
      }})
    }
    const section_parkir = await SectionParkir.query().where('jenis', jenis).preload('tempat_parkir').preload('slot_parkir').exec()
    return response.status(200).json({ message: {
      status: 'success',
      data: await this.ratings(section_parkir)
    }})
  }

  /**
   * Show individual record
   */
  async show({ request, response }: HttpContext) {
    const { id } = request.params()
    const section_parkir = await SectionParkir.find(id)
    if (!section_parkir) {
      return response.status(404).json({ message: {
        status: 'error',
        message: 'Section Parkir not found'
      }})
    }

    await section_parkir.load('tempat_parkir')
    await section_parkir.load('slot_parkir')
    return response.status(200).json({ message: {
      status: 'success',
      data: await this.ratings([section_parkir])
    }})
  }
  /**
   * Handle form submission for the edit action
   */
  async update({ response, request }: HttpContext) {
    const {  nama, tempat_parkir_id, jenis, harga_per_jam, denda_per_jam, promo } = request.all()
    console.log(request.param('id'))
    await request.validateUsing(updateSectionTempatParkirValidator)
    const section_parkir = await SectionParkir.find(request.params().id)
    if (!section_parkir) {
      return response.status(404).json({ message: {
        status: 'error',
        message: 'Section Parkir not found'
      }})
    }
    section_parkir.nama = nama
    section_parkir.tempat_parkir_id = tempat_parkir_id
    section_parkir.jenis = jenis
    section_parkir.harga_per_jam = harga_per_jam
    section_parkir.denda_per_jam = denda_per_jam
    section_parkir.promo = promo

    await section_parkir.save()
    return response.status(200).json({ message: {
      status: 'success',
      data: section_parkir
    }})
  }

  /**
   * Delete record
   */
  async destroy({ request, response }: HttpContext) {
    const section_parkir = await SectionParkir.find(request.params().id)
    if (!section_parkir) {
      return response.status(404).json({ message: {
        status: 'error',
        message: 'Section Parkir not found'
      }})
    }
    await section_parkir.delete()
    return response.status(200).json({ message: {
      status: 'success',
      data: section_parkir
    }})
  }
}
