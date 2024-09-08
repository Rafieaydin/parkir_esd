import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

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
}
