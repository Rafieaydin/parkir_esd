import factory from '@adonisjs/lucid/factories'
import HistoryPaymentBooking from '#models/history_payment_booking'

export const HistoryPaymentBookingFactory = factory
  .define(HistoryPaymentBooking, async ({ faker }) => {
    return {}
  })
  .build()