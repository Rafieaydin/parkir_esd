import TempatParkir from '#models/tempat_parkir'
import { createTempatParkirValidator, updateTempatParkirValidator } from '#validators/tempat_parkir'
import type { HttpContext } from '@adonisjs/core/http'
import string from '@adonisjs/core/helpers/string'
import {saveImage, deleteImage} from '../helpers/image.helper.js'
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'
import db from '@adonisjs/lucid/services/db'

export default class TempatParkirsController {
  /**
   * Display a list of resource
   */
  async  rating(tempatParkirData) {
   // Step 1: Fetch the average ratings grouped by tempat_parkir_id
    const ratingsData = await db
    .from('ratings')
    .join('section_parkirs', 'ratings.section_parkir_id', 'section_parkirs.id')
    .join('tempat_parkirs', 'section_parkirs.tempat_parkir_id', 'tempat_parkirs.id')
    .select('tempat_parkirs.id')
    .avg('ratings.rating as total_rating')
    .groupBy('tempat_parkirs.id')

  // Log to check if `ratingsData` contains expected results
  console.log('ratingsData:', ratingsData)

  // Step 2: Map over tempatParkirData and attach total_rating from ratingsData
  const result = tempatParkirData.map(tempatParkir => {
    // Convert both IDs to string (or number) for comparison
    const rating = ratingsData.find(r => String(r.id) === String(tempatParkir.id)) // Ensure the comparison is type-safe

    // Log to check if tempatParkir.id matches with ratingsData
    console.log('tempatParkir.id:', tempatParkir.id, 'rating:', rating)

    return {
      ...tempatParkir.toJSON(), // Convert model to plain object
      total_rating: rating ? rating.total_rating : 0 // Attach total_rating or default to 0 if not found
    }
  })

  // Step 3: Return the result
  return result
  }

  async index({response}: HttpContext) {
    const tempatParkirData = await TempatParkir.query()
    .preload('section_parkir', (sec) => { sec.preload('slot_parkir') })
    .exec()

  const resultWithRatings = await this.rating(tempatParkirData)

  return response.status(200).json({
    message: {
      status: 'success',
      data: resultWithRatings
    }
  })

  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const { nama, alamat, kapasitas } = request.all()
    await request.validateUsing(createTempatParkirValidator)

    const tempat_parkir = await TempatParkir.findBy('nama', nama)
    if (tempat_parkir) {
      return response.status(400).json({ message: {
        status: 'error',
        message: 'Tempat Parkir already exists'
      }})
    }
    if (request.file('image')) {
      try{
        const images = request.file('image', {
          extnames: ['jpg', 'png', 'jpeg']
        })
        await images.move(app.makePath('uploads'), {
          name: `${cuid()}.${string.slug(nama)}.${images.extname}`
        })
        var newTempatParkir = await TempatParkir.create({ nama: nama, alamat: alamat, kapasitas: kapasitas, image: 'uploads/'+images.fileName })
      }catch(err){
        return response.status(400).json({ message: {
          status: 'error',
          message: 'Failed to save image'
        }})
      }
      return response.status(200).json({ message: {
        status: 'success',
        data: newTempatParkir
      }})
    }else{
      return response.status(400).json({ message: {
        status: 'error',
        message: 'Image is required'
      }})
    }
  }

  /**
   * Show individual record
   */
  async show({ request, response }: HttpContext) {
    const { id } = request.params()
    const tempat_parkir = await TempatParkir.find(id)
    if (!tempat_parkir) {
      return response.status(404).json({ message: {
        status: 'error',
        message: 'Tempat Parkir not found'
      }})
    }
    await tempat_parkir.load('section_parkir', (sec)=>{sec.preload('slot_parkir').exec})

    return response.status(200).json({ message: {
      status: 'success',
      data: await this.rating([tempat_parkir])
    }})
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ request, response }: HttpContext) {
    const {  nama, alamat, kapasitas, image } = request.all()
    await request.validateUsing(updateTempatParkirValidator)
    if (!request.params().id) {
      return response.status(404).json({ message: {
        status: 'error',
        message: 'Tempat Parkir not found'
      }})
    }

    const tempat_parkir = await TempatParkir.find(request.params().id)
    if (!tempat_parkir) {
      return response.status(404).json({ message: {
        status: 'error',
        message: 'Tempat Parkir not found'
      }})
    }
    if (request.file('image')) {
      await deleteImage(tempat_parkir.image)
      try{
          const images = request.file('image', {
            extnames: ['jpg', 'png', 'jpeg']
          })
          await images.move(app.makePath('uploads'), {
            name: `${cuid()}.${string.slug(nama)}.${images.extname}`
          })
          tempat_parkir.image = 'uploads/'+images.fileName
        }catch(err){
          return response.status(400).json({ message: {
            status: 'error',
            message: 'Failed to save image'
          }})
        }
      }
      tempat_parkir.nama = nama
      tempat_parkir.alamat = alamat
      tempat_parkir.kapasitas = kapasitas
      await tempat_parkir.save()

      return response.status(200).json({ message: {
        status: 'success',
        data: tempat_parkir
      }})
  }

  /**
   * Delete record
   */
  async destroy({ request, response }: HttpContext) {
    const tempat_parkir = await TempatParkir.find(request.params().id)
    if (!tempat_parkir) {
      return response.status(404).json({ message: {
        status: 'error',
        message: 'Tempat Parkir not found'
      }})
    }
    await deleteImage(tempat_parkir.image)
    await tempat_parkir.delete()
    return response.status(200).json({ message: {
      status: 'success',
      message: 'Tempat Parkir deleted'
    }})
  }
}
