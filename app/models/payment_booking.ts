import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Booking from './booking.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class PaymentBooking extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare payment_method: string

  @column()
  declare payment_status: string

  @column()
  declare payment_time: DateTime

  @column()
  declare payment_amount: number

  @column()
  declare booking_id: number


  @belongsTo(() => Booking)
  declare booking: BelongsTo<typeof Booking>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
