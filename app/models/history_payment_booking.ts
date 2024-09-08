import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import HistoryBooking from './history_booking.js'

export default class HistoryPaymentBooking extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare booking_id: number

  @column()
  declare payment_method: string

  @column()
  declare payment_status: string

  @column()
  declare payment_date: DateTime

  @column()
  declare payment_amount: number

  @belongsTo(() => HistoryBooking)
  declare booking: BelongsTo<typeof HistoryBooking>


  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
