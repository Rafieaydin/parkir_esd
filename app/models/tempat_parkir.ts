import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import SectionParkir from './section_parkir.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class TempatParkir extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nama: string

  @column()
  declare alamat: string

  @column()
  declare kapasitas: number

  @hasMany(() => SectionParkir, {
    foreignKey: 'tempat_parkir_id',
    localKey: 'id'
  })
  declare section_parkir: HasMany<typeof SectionParkir>


  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
