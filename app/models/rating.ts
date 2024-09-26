import { DateTime } from 'luxon'
import { BaseModel,belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import SectionParkir from './section_parkir.js'
import User from './user.js'

export default class Rating extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare rating: number

  @column()
  declare review: string

  @column()
  declare section_parkir_id: number

  @belongsTo(() => SectionParkir,{
    foreignKey: 'section_parkir_id'
  })
  declare section_parkir: BelongsTo<typeof SectionParkir>

  @belongsTo(() => User,{
    foreignKey: 'user_id'
  })
  declare user: BelongsTo<typeof User>


  @column()
  declare user_id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
