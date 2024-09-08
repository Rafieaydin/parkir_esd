import factory from '@adonisjs/lucid/factories'
import PaymentBooking from '#models/payment_booking'

export const PaymentBookingFactory = factory
  .define(PaymentBooking, async ({ faker }) => {
    return {
      payment_method: faker.helpers.arrayElement(['cash', 'ovo', 'gopay', 'linkaja'] ),
      payment_status: faker.helpers.arrayElement(['pending', 'success', 'failed'] ),
      payment_time: faker.date.recent(),
      payment_amount: faker.number.int(100000),
      booking_id: faker.helpers.arrayElement(['1', '2']),
    }
  })
  .build()
