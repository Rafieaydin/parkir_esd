import { DateTime } from 'luxon'
import { BaseModel, column, hasOne, manyToMany } from '@adonisjs/lucid/orm'
import HistorySlotBooking from './history_slot_booking.js'
import type {HasOne, HasMany,  ManyToMany } from '@adonisjs/lucid/types/relations'
import HistoryPaymentBooking from './history_payment_booking.js'
import SlotBooking from './slot_booking.js'

export default class HistoryBooking extends BaseModel {
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

  @manyToMany(()=>SlotBooking,{
    localKey: 'id',
    pivotTable: 'history_slot_bookings',
    pivotForeignKey: 'booking_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'slot_parkir_id'
  })
  declare slot_booking: ManyToMany<typeof SlotBooking>

  @hasOne(()=>HistoryPaymentBooking,{
    localKey: 'id',
    foreignKey: 'payment_id'
  })
  declare payment: HasOne<typeof HistoryPaymentBooking>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
