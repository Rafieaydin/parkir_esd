import vine from '@vinejs/vine'

/**
 * Validator to validate the payload when creating
 * a new booking.
 */

export const createBookingValidator = vine.compile(
  vine.object({
    user_id : vine.number(),
    kode_booking : vine.string(),
    tanggal_booking : vine.string(),
    status : vine.string(),
    //total_bayar : vine.number(),
    denda : vine.number(),
    //total_bayar_denda : vine.number(),
    //total_bayar_semua : vine.number(),
    berapa_lama_jam : vine.number()
  })
)

export const checBooingValidator = vine.compile(
  vine.object({
    booking_id : vine.number(),
    kode_booking : vine.string(),
  })
)
