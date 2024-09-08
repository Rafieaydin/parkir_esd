import SlotParkir from '#models/slot_parkir'
import { createSlotSectionTempatParkirValidator, updateSlotSectionTempatParkirValidator } from '#validators/slot_section_tempat_parkir'
import type { HttpContext } from '@adonisjs/core/http'

export default class SlotSectionTempatParkirsController {
  /**
   * Display a list of resource
   */
  async index({response, request}: HttpContext) {
    return response.status(200).json({ message: {
      status: 'succes',
      data: await SlotParkir.query().preload('section_parkir', (sec)=>{sec.preload('tempat_parkir').exec}).exec()
    }})
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request,response }: HttpContext) {
    const {section_parkir_id, kode_slot,  batas_waktu, lantai_slot, kapasitas, status, terisi} = request.all()
    await request.validateUsing(createSlotSectionTempatParkirValidator)
    const slot_parkir = await SlotParkir.findBy('kode_slot', kode_slot)
    if (slot_parkir) {
      return response.status(400).json({ message: {
        status: 'error',
        message: 'Slot Parkir already exists'
      }})
    }
    const newSlotParkir = await SlotParkir.create({ section_parkir_id: section_parkir_id, kode_slot: kode_slot,  batas_waktu: batas_waktu, lantai_slot: lantai_slot, kapasitas: kapasitas, status: status, terisi: terisi })
    return response.status(200).json({ message: {
      status: 'success',
      data: newSlotParkir
    }})
  }

  /**
   * Show individual record
   */
  async show({ response, request }: HttpContext) {
    const { id } = request.params()
    const slot_parkir = await SlotParkir.find(id)
    if (!slot_parkir) {
      return response.status(404).json({ message: {
        status: 'error',
        message: 'Slot Parkir not found'
      }})
    }
    slot_parkir.load('section_parkir')
    return response.status(200).json({ message: {
      status: 'success',
      data: slot_parkir
    }})
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ response, request }: HttpContext) {
    const {  section_parkir_id, kode_slot, batas_waktu, lantai_slot, kapasitas, status, terisi } = request.all()
    await request.validateUsing(updateSlotSectionTempatParkirValidator)
    const slot_parkir = await SlotParkir.find(request.param('id'))
    if (!slot_parkir) {
      return response.status(404).json({ message: {
        status: 'error',
        message: 'Slot Parkir not found'
      }})
    }
    slot_parkir.section_parkir_id = section_parkir_id
    slot_parkir.kode_slot = kode_slot
    // slot_parkir.harga_per_menit = harga_per_menit
    // slot_parkir.denda_per_menit = denda_per_menit
    slot_parkir.batas_waktu = batas_waktu
    slot_parkir.lantai_slot = lantai_slot
    slot_parkir.kapasitas = kapasitas
    slot_parkir.status = status
    slot_parkir.terisi = terisi
    await slot_parkir.save()
    return response.status(200).json({ message: {
      status: 'success',
      data: slot_parkir
    }})
  }

  /**
   * Delete record
   */
  async destroy({ response, request }: HttpContext) {
    const slot_parkir = await SlotParkir.find(request.param('id'))
    if (!slot_parkir) {
      return response.status(404).json({ message: {
        status: 'error',
        message: 'Slot Parkir not found'
      }})
    }
    await slot_parkir.delete()
    return response.status(200).json({ message: {
      status: 'success',
      message: 'Slot Parkir has been deleted'
    }})
  }
}
