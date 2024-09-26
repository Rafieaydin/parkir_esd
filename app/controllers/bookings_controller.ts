import type { HttpContext } from '@adonisjs/core/http'

import Booking from "#models/booking"
import SlotBooking from "#models/slot_booking"
import { DateTime } from 'luxon'
import SlotParkir from '#models/slot_parkir'
import { checBooingValidator, createBookingValidator } from '#validators/booking'
import HistoryBooking from '#models/history_booking'
import SectionParkir from '#models/section_parkir'

export default class BookingsController {

  public async list({ response }: HttpContext) {
    return response.status(200).json({ message: {
      status: 'success',
      data: await Booking.query().preload('slot_booking', (slot) => {slot.preload('section_parkir', (sec) => {sec.preload('tempat_parkir').exec}).exec}).exec()
    }})
  }

  public async promo({response} : HttpContext){
    const promo = await SectionParkir.query().where('promo', '>', 0).preload('tempat_parkir').preload('slot_parkir').exec()
    if (!promo) {
      return response.status(404).json({ message: {
        status: 'error',
        message: 'Promo Not Available'
      }})
    }
    return response.status(200).json({ message: {
      status: 'success',
      data: promo
    }})
  }

  public async Booking({ response, request }: HttpContext) {
    const { user_id, slot_parkir_id, kode_booking, tanggal_booking, denda, status, berapa_lama_jam } = request.all()
    await request.validateUsing(createBookingValidator)
    const booking = await Booking.findBy('kode_booking', kode_booking)
    const slot = await SlotParkir.query().where('id', 1).preload('section_parkir').exec()
    //slot.map((s)=>s.section_parkir.harga_per_jam)
    //console.log(typeof(slot))
    if (booking) {
      return response.status(400).json({ message: {
        status: 'error',
        message: 'Booking already exists'
      }})
    }
    if(tanggal_booking < DateTime.now()) {
      return response.status(400).json({ message: {
        status: 'error',
        message: 'Tanggal booking tidak valid'
      }})
    }
    const newBooking = await Booking.create({ user_id: user_id, kode_booking: kode_booking, tanggal_booking: tanggal_booking, total_bayar: 0, denda: denda, total_bayar_denda: 0, total_bayar_semua: 0, status: status, berapa_lama_jam:berapa_lama_jam })
    SlotBooking.create({ booking_id: newBooking.id, slot_parkir_id: slot_parkir_id })
    return response.status(200).json({ message: {
      status: 'success',
      data: newBooking
    }})
  }

  public async checkIn({ response, request }: HttpContext) {
    const { booking_id, kode_booking } = request.all()
    await request.validateUsing(checBooingValidator)
    console.log(kode_booking, booking_id)
    const booking = await Booking.findBy('kode_booking', kode_booking)
    if (!booking) {
      return response.status(404).json({ message: {
        status: 'error',
        message: 'Kode Booking not found'
      }})
    }
    const slotBooking = await SlotBooking.findBy('booking_id', booking_id)
    if (!slotBooking) {
      return response.status(404).json({ message: {
        status: 'error',
        message: 'Booking not found'
      }})
    }
    //slotBooking.check_in = DateTime.now().setZone('Asia/Jakarta').toISO()
    slotBooking.check_in = DateTime.now().setZone('Asia/Jakarta').toSQL()
    slotBooking.save()

    return response.status(200).json({ message: {
      status: 'success',
      data: slotBooking
    }})
  }

  public async checkOut({ response, request }: HttpContext) {
    const { booking_id, kode_booking } = request.all()

    await request.validateUsing(checBooingValidator)

    const booking = await Booking.findBy('kode_booking', kode_booking)
    if (!booking) {
      return response.status(404).json({
        message: {
          status: 'error',
          message: 'Kode Booking not found',
        },
      })
    }

    // Find the slot booking using the booking_id
    const slotBooking = await SlotBooking.findBy('booking_id', booking.id)
    if (!slotBooking) {
      return response.status(404).json({
        message: {
          status: 'error',
          message: 'Booking not found',
        },
      })
    }

    const slot = await SlotParkir.query()
      .where('id', slotBooking.slot_parkir_id)
      .preload('section_parkir')
      .exec()

    if (!slot || slot.length === 0) {
      return response.status(404).json({
        message: {
          status: 'error',
          message: 'Slot Parkir not found',
        },
      })
    }

    // Calculate the total payment and possible penalty
    const harga_per_jam = slot[0].section_parkir.harga_per_jam
    const denda_per_jam = slot[0].section_parkir.denda_per_jam
    const promo = slot[0].section_parkir.promo
    console.log(typeof(slotBooking.check_in)) // datetime
    const checkInTime = DateTime.fromJSDate(slotBooking.check_in).setZone('Asia/Jakarta', { keepLocalTime: true })
    const now = DateTime.now().setZone('Asia/Jakarta')

    console.log(checkInTime)

    if (!checkInTime.isValid) {
      return response.status(400).json({
        message: {
          status: 'error',
          message: 'Invalid check-in time format',
        },
      })
    }

    const hourParked =  Math.floor(checkInTime.diff(now, 'minutes').hours) * -1
    console.log("now:" + now.hour)
    console.log("checkInTime:" + checkInTime.hour)
    console.log("hour:" +  hourParked)
    var total_bayar = 0
    var denda = 0
    if (hourParked > booking.berapa_lama_jam) {
      denda = (hourParked - booking.berapa_lama_jam) * denda_per_jam
      total_bayar = ((hourParked- (hourParked -booking.berapa_lama_jam)) * harga_per_jam) + denda
    }
    else {
      total_bayar = (hourParked < 1 ? 1 : hourParked) * harga_per_jam
    }

    if(promo > 0){
      total_bayar = total_bayar - (total_bayar * promo)
    }
    // const minutesParked = checkInTime.diff(now, 'minutes').minutes
    // const allowedTimeMinutes = booking.berapa_lama_jam * 60
    // console.log("allowedTimeMinutes:" + allowedTimeMinutes)
    // if (minutesParked > allowedTimeMinutes) {
    //   console.log("masuk")
    //   denda = (minutesParked - allowedTimeMinutes) * denda_per_jam
    //   total_bayar = ((minutesParked- (minutesParked -allowedTimeMinutes)) * harga_per_jam) + denda
    // }else {
    //   total_bayar = minutesParked * harga_per_jam
    // }
    // console.log("harga:" + harga_per_jam)
    // console.log("total_bayar:" + total_bayar)
    // console.log("denda:" + denda)

    // Update the booking details
    booking.denda = denda
    booking.total_bayar = total_bayar
    booking.total_bayar_denda = denda
    booking.total_bayar_semua = total_bayar
    slotBooking.check_out = now.toISO()
    await slotBooking.save()
    await booking.save()

    const invoice = HistoryBooking.create({
      slot_parkir_id: slotBooking.slot_parkir_id,
      user_id: booking.user_id,
      kode_booking: booking.kode_booking,
      kode_invoice: booking.kode_booking,
      judul_invoice: `Invoice for ${booking.kode_booking}`,
      tanggal_booking: booking.tanggal_booking,
      check_in: slotBooking.check_in,
      check_out: slotBooking.check_out,
      biaya: harga_per_jam,
      is_checked_out: slotBooking.is_checked_out,
      status: 'selesai',
      denda: denda,
      total_bayar_denda: denda,
      total_bayar_semua: total_bayar,
      berapa_lama_jam: booking.berapa_lama_jam,
      //payment_id: ,
    })
    console.log((await invoice).id)

    return response.status(200).json({
      message: {
        status: 'success',
        data: await HistoryBooking.query().where('id', (await invoice).id).preload('slot_parkir').preload('user').exec(),
      },
    })
  }

  async checkInList({ response }: HttpContext) {
    const slotBooking = await SlotBooking.query().where('check_out', 0).preload('booking').preload('slot_parkir').exec()
    if (!slotBooking) {
      return response.status(404).json({ message: {
        status: 'error',
        message: 'Check In Not Available'
      }})
    }
    return response.status(200).json({ message: {
      status: 'success',
      data: slotBooking
    }})
  }

  async checkOutList({ response }: HttpContext) {
    const slotBooking = await SlotBooking.query().where('check_out','!=', 0).preload('booking').preload('slot_parkir').exec()
    if (!slotBooking) {
      return response.status(404).json({ message: {
        status: 'error',
        message: 'Check Out Not Available'
      }})
    }
    return response.status(200).json({ message: {
      status: 'success',
      data: slotBooking
    }})
  }

  public async payment({ response, request }: HttpContext) {
    const { booking_id, total_bayar_semua, payment_via } = request.all()
    const slotBooking = await SlotBooking.findBy('booking_id', booking_id)
    if (!slotBooking) {
      return response.status(404).json({ message: {
        status: 'error',
        message: 'Booking not found'
      }})
    }
    const booking = await Booking.find('id',booking_id)
    if (!booking) {
      return response.status(404).json({ message: {
        status: 'error',
        message: 'Booking not found'
      }})
    }
    booking.total_bayar_semua = total_bayar_semua
    slotBooking.save()

    return response.status(200).json({ message: {
      status: 'success',
      data: slotBooking
    }})
  }
}


