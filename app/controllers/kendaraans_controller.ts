import Kendaraan from '#models/kendaraan'
import { createKendaraanValidator } from '#validators/kendaraan'
import type { HttpContext } from '@adonisjs/core/http'

export default class KendaraansController {
  /**
   * Display a list of resource
   */
  async index({response}: HttpContext) {
    //console.log('masuk')
    const kendaraan = await Kendaraan.query().preload('user').exec()
    if (!kendaraan) {
      return response.status(404).json({ message: {
        status: 'error',
        message: 'Kendaraan Not Available'
      }})
    }
    return response.status(200).json({ message: {
      status: 'succes',
      data:  kendaraan
    }})
  }
  /**
   * Handle form submission for the create action
   */
  async store({ request,response }: HttpContext) {
    const {user_id, jenis,nama_kendaraan,plat_nomor} = request.all()
    await request.validateUsing(createKendaraanValidator)
    const kendaraan = await Kendaraan.findBy('plat_nomor', plat_nomor)
    if (kendaraan) {
      return response.status(400).json({ message: {
        status: 'error',
        message: 'Kendaraan already exists'
      }})
    }
    const newKendaraan = await Kendaraan.create({ user_id: user_id,nama_kendaraan:nama_kendaraan, jenis_kendaraan: jenis, plat_nomor:plat_nomor })
    return response.status(200).json({ message: {
      status: 'success',
      data: newKendaraan
    }})
  }

  async getKendaraanByUser({ request, response }: HttpContext) {
    const { id } = request.params()
    if(id == null){
      return response.status(400).json({ message: {
        status: 'error',
        message: 'User ID is required'
      }})
    }
    const kendaraan = await Kendaraan.query().where('user_id', id).preload('user').exec()
    return response.status(200).json({ message: {
      status: 'success',
      data: kendaraan
    }})
  }

  async getJenisKendaraan({ response }: HttpContext) {
    const kendaraan = await Kendaraan.query().distinct('jenis').exec()
    if (!kendaraan) {
      return response.status(404).json({ message: {
        status: 'error',
        message: 'Kendaraan Not Available'
      }})
    }
    return response.status(200).json({ message: {
      status: 'success',
      data: kendaraan
    }})
  }

  async getKendaraanByJenis({ request, response }: HttpContext) {
    const { jenis } = request.params()
    if(jenis == null){
      return response.status(400).json({ message: {
        status: 'error',
        message: 'Jenis Kendaraan is required'
      }})
    }
    const kendaraan = await Kendaraan.query().where('jenis_kendaraan', jenis).preload('user').exec()
    return response.status(200).json({ message: {
      status: 'success',
      data: kendaraan
    }})
  }

  async show({ request, response }: HttpContext) {
    const { id } = request.params()
    if(id == null){
      return response.status(400).json({ message: {
        status: 'error',
        message: 'Kendaraan ID is required'
      }})
    }
    const kendaraan = await Kendaraan.find(id)
    if (!kendaraan) {
      return response.status(404).json({ message: {
        status: 'error',
        message: 'Kendaraan not found'
      }})
    }
    return response.status(200).json({ message: {
      status: 'success',
      data: kendaraan
    }})
  }

  async update({ request, response }: HttpContext) {
    const {user_id, jenis, plat_nomor, nama_kendaraan} = request.all()
    await request.validateUsing(createKendaraanValidator)
    const kendaraan = await Kendaraan.find(request.params().id)
    if (!kendaraan) {
      return response.status(404).json({ message: {
        status: 'error',
        message: 'Kendaraan not found'
      }})
    }
    await  kendaraan.merge({
      nama_kendaraan: nama_kendaraan,
      user_id: user_id,
      jenis_kendaraan: jenis,
      plat_nomor: plat_nomor
    })
    await kendaraan.save()
    return response.status(200).json({ message: {
      status: 'success',
      data: kendaraan
    }})
  }

  async destroy({ request, response }: HttpContext) {
    const { id } = request.params()
    const kendaraan = await Kendaraan.find(id)
    if (!kendaraan) {
      return response.status(404).json({ message: {
        status: 'error',
        message: 'Kendaraan not found'
      }})
    }
    await kendaraan.delete()
    return response.status(200).json({ message: {
      status: 'success',
      data: kendaraan
    }})
  }
}
