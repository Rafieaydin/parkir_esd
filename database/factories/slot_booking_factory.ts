import factory from '@adonisjs/lucid/factories'
import SlotBooking from '#models/slot_booking'

export const SlotBookingFactory = factory
  .define(SlotBooking, async ({ faker }) => {
    return {
      slot_parkir_id: faker.helpers.arrayElement(['1','2','3','4','5']),
      booking_id: faker.helpers.arrayElement(['1','2','3','4','5']),
      check_in: faker.date.recent(),
      check_out: faker.date.future({days: 1}),
      is_checked_out: true
    }
  })
  .build()
