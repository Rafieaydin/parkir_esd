
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import { TodoFactory } from '#database/factories/todo_factory'
import { TempatParkirFactory } from '#database/factories/tempat_parkir_factory'
import { SlotParkirFactory } from '#database/factories/slot_parkir_factory'
import { SectionParkirFactory } from '#database/factories/section_parkir_factory'
import { BookingFactory } from '#database/factories/booking_factory'
import SlotBooking from '#models/slot_booking'
import { SlotBookingFactory } from '#database/factories/slot_booking_factory'
import { PaymentBookingFactory } from '#database/factories/payment_booking_factory'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    await User.createMany([
      {
        fullName: 'John Doe',
        email: 'john@gmail.com',
        phone: '08123456789',
        dateOfBirth: '1990-01-01',
        gender: 'L',
        password: 'password',
        role: 'admin',
        //photo: 'https://via.placeholder.com/150'
      },
      {
        fullName: 'Jane Doe',
        email: 'jane@gmail.com',
        phone: '08123456789',
        dateOfBirth: '1990-01-01',
        gender: 'P',
        password: 'password',
        role: 'user',
         //photo: 'https://via.placeholder.com/150'
      },
      {
        fullName: 'admin',
        email: 'admin@gmail.com',
        phone: '08123456789',
        dateOfBirth: '1990-01-01',
        gender: 'L',
        password: 'password',
        role: 'admin',
         //photo: 'https://via.placeholder.com/150'
      }
    ])
    await TodoFactory.createMany(10)
    await TempatParkirFactory.createMany(10)
    await SectionParkirFactory.createMany(10)
    await SlotParkirFactory.createMany(10)
    await BookingFactory.createMany(10)
    await SlotBookingFactory.createMany(10)
    await PaymentBookingFactory.createMany(10)
  }
}
