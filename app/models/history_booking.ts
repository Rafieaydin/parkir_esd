import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasOne, manyToMany } from '@adonisjs/lucid/orm'
import HistorySlotBooking from './history_slot_booking.js'
import type {HasOne, HasMany,  ManyToMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import HistoryPaymentBooking from './history_payment_booking.js'
import SlotBooking from './slot_booking.js'
import SlotParkir from './slot_parkir.js'
import User from './user.js'

export default class HistoryBooking extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare kode_booking: string

  @column()
  declare kode_invoice: string

  @column()
  declare judul_invoice: string

  @column()
  declare user_id: number

  @column()
  declare slot_parkir_id: number

  // @column()
  // declare booking_id: number

  @column()
  declare tanggal_booking: DateTime

  @column()
  declare check_in: DateTime

  @column()
  declare check_out: DateTime

  @column()
  declare biaya: number

  @column()
  declare is_checked_out: boolean

  @column()
  declare status: string

  @column()
  declare denda: number

  @column()
  declare total_bayar_denda: number

  @column()
  declare total_bayar_semua: number

  @column()
  declare berapa_lama_jam: number

  @column()
  declare payment_id: number

  @belongsTo(()=>SlotParkir,{
    foreignKey: 'slot_parkir_id'
  })
  declare slot_parkir: BelongsTo<typeof SlotParkir>

  @belongsTo(()=>User,{
    foreignKey: 'slot_parkir_id'
  })
  declare user: BelongsTo<typeof User>

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
