import factory from '@adonisjs/lucid/factories'
import Booking from '#models/booking'

export const BookingFactory = factory
  .define(Booking, async ({ faker }) => {
    return {
      //plat_nomor: faker.word.words(3),
      //payment_id: faker.helpers.arrayElement(['1', '2']),
      tanggal_booking: faker.date.recent(),
      status: faker.helpers.arrayElement(['pending', 'selesai', 'batal']),
      denda: faker.number.int(0),
      total_bayar: faker.number.int(100000),
      total_bayar_denda: faker.number.int(100000),
      total_bayar_semua: faker.number.int(100000),
      user_id: faker.helpers.arrayElement(['1', '2']),
      berapa_lama_jam: faker.number.int(10),
    }
  })
  .build()
