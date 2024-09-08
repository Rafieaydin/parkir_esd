import SectionParkir from '#models/section_parkir'
import { createSectionTempatParkirValidator, updateSectionTempatParkirValidator } from '#validators/section_tempat_parkir'
import type { HttpContext } from '@adonisjs/core/http'

export default class SectionTempatParkirsController {
  /**
   * Display a list of resource
   */
  async index({response}: HttpContext) {
    //console.log('masuk')
    return response.status(200).json({ message: {
      status: 'succes',
      data: await SectionParkir.query().preload('tempat_parkir').preload('slot_parkir').exec()
    }})
  }
  /**
   * Handle form submission for the create action
   */
  async store({ request,response }: HttpContext) {
    const {nama, tempat_parkir_id, jenis, harga_per_menit, denda_per_menit} = request.all()
    await request.validateUsing(createSectionTempatParkirValidator)
    const section_parkir = await SectionParkir.findBy('nama', nama)
    if (section_parkir) {
      return response.status(400).json({ message: {
        status: 'error',
        message: 'Section Parkir already exists'
      }})
    }
    const newSectionParkir = await SectionParkir.create({ nama: nama, tempat_parkir_id: tempat_parkir_id, jenis: jenis, harga_per_menit:harga_per_menit, denda_per_menit:denda_per_menit })
    return response.status(200).json({ message: {
      status: 'success',
      data: newSectionParkir
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
      data: section_parkir
    }})
  }
  /**
   * Handle form submission for the edit action
   */
  async update({ response, request }: HttpContext) {
    const {  nama, tempat_parkir_id, jenis, harga_per_menit, denda_per_menit } = request.all()
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
    section_parkir.harga_per_menit = harga_per_menit
    section_parkir.denda_per_menit = denda_per_menit

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
