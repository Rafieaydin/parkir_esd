import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Kendaraan extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nama_kendaraan: string

  @column()
  declare jenis_kendaraan: string

  @column()
  declare plat_nomor: string

  @column()
  declare user_id: number

  @belongsTo(() => User,{
    foreignKey: 'user_id'
  }) // relasi 3:1 jadi hasmany : belongsto
  declare user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
