import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import SectionParkir from './section_parkir.js'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import SlotBooking from './slot_booking.js'
import Booking from './booking.js'
import HistoryBooking from './history_booking.js'

export default class SlotParkir extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare section_parkir_id: number

  @column()
  declare kode_slot: string

  @column()
  declare batas_waktu: number

  @column()
  declare lantai_slot : number

  @column()
  declare kapasitas : number

  @column()
  declare terisi : number

  @column()
  declare status: string

  @belongsTo(() => SectionParkir, {
    foreignKey: 'section_parkir_id'
  })
  declare section_parkir: BelongsTo<typeof SectionParkir>

  @manyToMany(()=> SlotParkir,{
    localKey: 'id',
    pivotTable: 'slot_bookings',
    pivotForeignKey: 'slot_parkir_id',
    relatedKey: 'id', // :3
    pivotRelatedForeignKey: 'booking_id'
  })
  declare booking: ManyToMany<typeof SlotParkir>

  @manyToMany(()=> HistoryBooking,{
    localKey: 'id',
    pivotTable: 'history_slot_bookings',
    pivotForeignKey: 'slot_parkir_id',
    relatedKey: 'id', // :3
    pivotRelatedForeignKey: 'booking_id'
  })
  declare HistoryBooking: ManyToMany<typeof HistoryBooking>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
