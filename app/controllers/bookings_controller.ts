import type { HttpContext } from '@adonisjs/core/http'

import Booking from "#models/booking"
import SlotBooking from "#models/slot_booking"
import { DateTime } from 'luxon'
import SlotParkir from '#models/slot_parkir'
import { checBooingValidator, createBookingValidator } from '#validators/booking'

export default class BookingsController {

  public async list({ response }: HttpContext) {
    return response.status(200).json({ message: {
      status: 'success',
      data: await Booking.query().preload('slot_booking', (slot) => {slot.preload('section_parkir', (sec) => {sec.preload('tempat_parkir').exec}).exec}).exec()
    }})
  }

  public async Booking({ response, request }: HttpContext) {
    const { user_id, slot_parkir_id, kode_booking, tanggal_booking, denda, status, berapa_lama_jam } = request.all()
    await request.validateUsing(createBookingValidator)
    const booking = await Booking.findBy('kode_booking', kode_booking)
    const slot = await SlotParkir.query().where('id', 1).preload('section_parkir').exec()
    //slot.map((s)=>s.section_parkir.harga_per_menit)
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
    const harga_per_menit = slot[0].section_parkir.harga_per_menit
    const denda_per_menit = slot[0].section_parkir.denda_per_menit
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

    const minutesParked =  Math.floor(checkInTime.diff(now, 'minutes').minutes) * -1
    console.log("now:" + now.minute)
    console.log("checkInTime:" + checkInTime.minute)
    console.log("minutes:" +  minutesParked)
    var total_bayar = 0
    var denda = 0
    const allowedTimeMinutes = booking.berapa_lama_jam * 60
    console.log("allowedTimeMinutes:" + allowedTimeMinutes)
    if (minutesParked > allowedTimeMinutes) {
      console.log("masuk")
      denda = (minutesParked - allowedTimeMinutes) * denda_per_menit
      total_bayar = ((minutesParked- (minutesParked -allowedTimeMinutes)) * harga_per_menit) + denda
    }else {
      total_bayar = minutesParked * harga_per_menit
    }
    console.log("time:" + (minutesParked - allowedTimeMinutes))
    console.log("total_bayar:" + (minutesParked- (minutesParked -allowedTimeMinutes)) * harga_per_menit)
    console.log("denda:" + denda)

    // Update the booking details
    booking.denda = denda
    booking.total_bayar = total_bayar
    booking.total_bayar_denda = denda
    booking.total_bayar_semua = total_bayar
    slotBooking.check_out = now.toISO()
    await slotBooking.save()
    await booking.save()

    return response.status(200).json({
      message: {
        status: 'success',
        data: booking,
      },
    })
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


