import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Booking from './booking.js'
import SlotParkir from './slot_parkir.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'


export default class SlotBooking extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare slot_parkir_id: number

  @column()
  declare booking_id: number

  @column()
  declare check_in: DateTime

  @column()
  declare check_out: DateTime

  @column()
  declare is_checked_out: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => SlotParkir,{
    foreignKey: 'slot_parkir_id'
  })
  declare slot_parkir: BelongsTo<typeof SlotParkir>

  @belongsTo(() => Booking,{
    foreignKey: 'booking_id'
  })
  declare booking: BelongsTo<typeof Booking>
}

