import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, hasOne, manyToMany } from '@adonisjs/lucid/orm'
import SlotBooking from './slot_booking.js'
import type { HasOne, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import PaymentBooking from './payment_booking.js'
import SlotParkir from './slot_parkir.js'

export default class Booking extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare kode_booking: string

  @column()
  declare user_id: number

  @column()
  declare tanggal_booking: DateTime

  @column()
  declare status: string

  @column()
  declare total_bayar: number

  @column()
  declare payment_id: number

  @column()
  declare denda: number

  @column()
  declare total_bayar_denda: number

  @column()
  declare total_bayar_semua: number

  @column()
  declare berapa_lama_jam: number

  @manyToMany(()=>SlotParkir,{
    localKey: 'id',
    pivotTable: 'slot_bookings',
    pivotForeignKey: 'booking_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'slot_parkir_id'
  })
  declare slot_booking: ManyToMany<typeof SlotParkir>

  @hasMany(()=>PaymentBooking,{
    localKey: 'id',
    foreignKey: 'payment_id'
  })
  declare payment: HasMany<typeof PaymentBooking>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
