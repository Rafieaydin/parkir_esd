import { DateTime } from 'luxon'
import { BaseModel,belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import TempatParkir from './tempat_parkir.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import SlotParkir from './slot_parkir.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Rating from './rating.js'



export default class SectionParkir extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nama: string

  @column()
  declare jenis: string

  @column()
  declare tempat_parkir_id: number

  @column()
  declare harga_per_jam: number

  @column()
  declare denda_per_jam: number

  @column()
  declare promo : string

  @belongsTo(() => TempatParkir,{
    foreignKey: 'tempat_parkir_id'
  })
  declare tempat_parkir: BelongsTo<typeof TempatParkir>

  @hasMany(() => SlotParkir, {
    foreignKey: 'section_parkir_id',
    localKey: 'id'
  })
  declare slot_parkir: HasMany<typeof SlotParkir>

  @hasMany(() => Rating, {
    foreignKey: 'section_parkir_id',
    localKey: 'id'
  })
  declare rating: HasMany<typeof Rating>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
