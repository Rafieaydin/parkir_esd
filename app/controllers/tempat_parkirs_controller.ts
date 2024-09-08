import TempatParkir from '#models/tempat_parkir'
import { createTempatParkirValidator, updateTempatParkirValidator } from '#validators/tempat_parkir'
import type { HttpContext } from '@adonisjs/core/http'

export default class TempatParkirsController {
  /**
   * Display a list of resource
   */
  async index({response}: HttpContext) {
    return response.status(200).json({ message: {
      status: 'succes',
      data: await TempatParkir.query().preload('section_parkir', (sec)=>{sec.preload('slot_parkir').exec}).exec()
    }})
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
    const newTempatParkir = await TempatParkir.create({ nama: nama, alamat: alamat, kapasitas: kapasitas })
    return response.status(200).json({ message: {
      status: 'success',
      data: newTempatParkir
    }})
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
      data: tempat_parkir
    }})
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ request, response }: HttpContext) {
    const {  nama, alamat, kapasitas } = request.all()
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
    await tempat_parkir.delete()
    return response.status(200).json({ message: {
      status: 'success',
      message: 'Tempat Parkir deleted'
    }})
  }
}
